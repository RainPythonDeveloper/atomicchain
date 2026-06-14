import { chromium } from "playwright";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "screenshots");
const URL = "http://localhost:3000/editor";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Set the React Flow viewport transform to frame a world-space region, then settle.
async function frame(page, region) {
  await page.evaluate((region) => {
    const vp = document.querySelector(".react-flow__viewport");
    const pane = document.querySelector(".react-flow");
    if (!vp || !pane) return;
    const PW = pane.clientWidth, PH = pane.clientHeight;
    const { wx, wy, ww, wh, fill = 0.92 } = region;
    const zoom = Math.min(PW / ww, PH / wh) * fill;
    const tx = PW / 2 - (wx + ww / 2) * zoom;
    const ty = PH / 2 - (wy + wh / 2) * zoom;
    vp.style.transition = "none";
    vp.style.transform = `translate(${tx}px, ${ty}px) scale(${zoom})`;
  }, region);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await sleep(400);
}

async function shot(page, name) {
  const pane = await page.$(".react-flow");
  await pane.screenshot({ path: join(OUT, name) });
  console.log("  saved", name);
}

const run = async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
  });

  console.log("→ open editor");
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForSelector(".react-flow__viewport", { timeout: 30000 });
  await sleep(1000);

  console.log("→ load CHAIN preset");
  await page.getByRole("button", { name: "CHAIN" }).click();
  await sleep(1500);
  // Fit the whole chain in React Flow's own viewport (survives re-renders during run).
  await page.click(".react-flow__controls-fitview");
  await sleep(1200);

  // Fire each Generate stage in chain order via its own RUN button, waiting for
  // that stage's Output to hold a real image before moving to the next. More
  // reliable than one big runWorkflow (a single stalled fetch can't strand the rest).
  const clickGen = (i) =>
    page.click(`[data-id="ch-generate-${i}"] button:has-text("RUN")`, { timeout: 15000 });

  const waitOutput = (i, t = 180000) =>
    page.waitForFunction(
      (i) => {
        const o = document.querySelector(`[data-id="ch-output-${i}"]`);
        const img = o && o.querySelector("img");
        return !!(img && (img.getAttribute("src") || "").startsWith("data:image"));
      },
      i,
      { timeout: t, polling: 1000 }
    );

  console.log("→ RUN stage 1");
  await clickGen(1);
  // Catch stage 1 mid-flight (animated edges + executing glow).
  await sleep(2500);
  console.log("→ running snapshot");
  await shot(page, "08-chain-running.png");
  await waitOutput(1);
  console.log("  output-1 ready");
  await sleep(800);

  console.log("→ RUN stage 2");
  await clickGen(2);
  await waitOutput(2);
  console.log("  output-2 ready");
  await sleep(800);

  console.log("→ RUN stage 3 (batch x2)");
  await clickGen(3);
  await waitOutput(3);
  console.log("  output-3 ready");
  await sleep(1500);

  const regions = {
    "09-chain-overview.png": { wx: -120, wy: -120, ww: 6820, wh: 2420, fill: 0.96 },
    "10-chain-stage1.png":   { wx: -90,  wy: -90,  ww: 1620, wh: 2360 },
    "11-chain-stage2.png":   { wx: 1580, wy: -90,  ww: 2180, wh: 2160 },
    "12-chain-stage3.png":   { wx: 3820, wy: -90,  ww: 2820, wh: 1520 },
    "13-chain-hub.png":      { wx: 2080, wy: 480,  ww: 1720, wh: 940 },
  };

  for (const [name, region] of Object.entries(regions)) {
    console.log("→ frame", name);
    await frame(page, region);
    await shot(page, name);
  }

  await browser.close();
  console.log("✓ done");
};

run().catch((e) => { console.error(e); process.exit(1); });
