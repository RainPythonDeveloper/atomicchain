import { chromium } from "playwright";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { writeFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "remotion", "public");
const URL = "http://localhost:3000/editor";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const run = async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });

  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForSelector(".react-flow__viewport", { timeout: 30000 });
  await sleep(1000);
  await page.getByRole("button", { name: "CHAIN" }).click();
  await sleep(1500);
  await page.click(".react-flow__controls-fitview");
  await sleep(1000);

  const clickGen = (i) => page.click(`[data-id="ch-generate-${i}"] button:has-text("RUN")`, { timeout: 15000 });
  const waitOutput = (i, t = 180000) =>
    page.waitForFunction((i) => {
      const o = document.querySelector(`[data-id="ch-output-${i}"]`);
      const img = o && o.querySelector("img");
      return !!(img && (img.getAttribute("src") || "").startsWith("data:image"));
    }, i, { timeout: t, polling: 1000 });

  for (const i of [1, 2, 3]) {
    console.log(`RUN stage ${i}`);
    await clickGen(i);
    await waitOutput(i);
    // Pull the FULL-RES generated image straight from the data URL (native 1024px),
    // not a scaled-down element screenshot.
    const src = await page.getAttribute(`[data-id="ch-output-${i}"] img`, "src");
    const b64 = (src || "").split(",")[1];
    if (b64) {
      writeFileSync(join(PUBLIC, `result-${i}.png`), Buffer.from(b64, "base64"));
      console.log(`  saved result-${i}.png (${Math.round(b64.length * 0.75 / 1024)} KB)`);
    } else {
      console.log(`  !! no image data for output-${i}`);
    }
    await sleep(400);
  }

  await browser.close();
  console.log("✓ done");
};

run().catch((e) => { console.error(e); process.exit(1); });
