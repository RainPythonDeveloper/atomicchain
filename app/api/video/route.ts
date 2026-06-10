import { autoTranslate, detectLangCode } from "@/lib/translate";

// NVIDIA Cosmos video generation can run asynchronously: the invoke call may
// return 202 with an NVCF-REQID header that must be polled until the job is done.
const MAX_POLLS = 60;       // up to ~3 min at 3s interval
const POLL_INTERVAL = 3000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function extractVideo(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  // Common shapes returned by NVIDIA video endpoints
  if (typeof d.b64_video === "string") return d.b64_video;
  if (typeof d.video === "string") return d.video;
  const arr = d.data as Array<Record<string, unknown>> | undefined;
  if (Array.isArray(arr) && arr[0]) {
    const first = arr[0];
    if (typeof first.b64_video === "string") return first.b64_video as string;
    if (typeof first.video === "string") return first.video as string;
  }
  return null;
}

export async function POST(request: Request) {
  const {
    prompt = "",
    image,
    resolution = "720_16_9",
    num_output_frames = 57,
    fps = 24,
    seed = 42,
  } = await request.json();

  if (!image) {
    return Response.json({ error: "An input image is required" }, { status: 400 });
  }

  const apiKey = process.env.VIDEO_API_KEY;
  const apiUrl = process.env.VIDEO_API_URL;
  const statusUrl = process.env.VIDEO_STATUS_URL;

  if (!apiKey || !apiUrl) {
    return Response.json({ error: "Video API not configured" }, { status: 500 });
  }

  // Auto-translate the motion prompt (Russian → English) like the image route
  let finalPrompt = (prompt as string).trim();
  let translatedFrom: string | null = null;
  if (finalPrompt && detectLangCode(finalPrompt)) {
    const translated = await autoTranslate(finalPrompt);
    if (translated !== finalPrompt) {
      translatedFrom = finalPrompt;
      finalPrompt = translated;
    }
  }

  // Normalize the image into a data URI the API expects
  const imageDataUri = (image as string).startsWith("data:")
    ? (image as string)
    : `data:image/png;base64,${image}`;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    Accept: "application/json",
  };

  const payload = {
    prompt: finalPrompt || "The scene comes to life with gentle, natural motion",
    image: imageDataUri,
    mode: "image-to-world",
    resolution,
    num_output_frames,
    fps,
    seed,
  };

  try {
    let response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    // Async path: poll the status endpoint until the job finishes
    if (response.status === 202 && statusUrl) {
      const reqId = response.headers.get("NVCF-REQID");
      if (!reqId) {
        return Response.json({ error: "Async job started but no request ID returned" }, { status: 502 });
      }
      let polls = 0;
      while (polls < MAX_POLLS) {
        await sleep(POLL_INTERVAL);
        polls++;
        response = await fetch(`${statusUrl}/${reqId}`, { method: "GET", headers });
        if (response.status === 202) continue; // still processing
        break;
      }
      if (response.status === 202) {
        return Response.json({ error: "Video generation timed out" }, { status: 504 });
      }
    }

    if (!response.ok) {
      const err = await response.text();
      return Response.json({ error: `Video generation failed: ${err}` }, { status: response.status });
    }

    const data = await response.json();
    const videoBase64 = extractVideo(data);

    if (!videoBase64) {
      return Response.json({ error: "No video returned by the API" }, { status: 502 });
    }

    return Response.json({
      videoBase64,
      translatedPrompt: finalPrompt,
      originalPrompt: translatedFrom,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: `Video request error: ${message}` }, { status: 500 });
  }
}
