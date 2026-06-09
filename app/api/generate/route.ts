import { autoTranslate, detectLangCode } from "@/lib/translate";

export async function POST(request: Request) {
  const { prompt, negative_prompt, size = "1024x1024" } = await request.json();

  if (!prompt?.trim()) {
    return Response.json({ error: "Prompt is required" }, { status: 400 });
  }

  const apiKey = process.env.ATOMICCHAIN_API_KEY;
  const apiUrl = process.env.ATOMICCHAIN_API_URL;

  if (!apiKey || !apiUrl) {
    return Response.json({ error: "API not configured" }, { status: 500 });
  }

  let finalPrompt = prompt.trim();
  let translatedFrom: string | null = null;

  if (detectLangCode(finalPrompt)) {
    const translated = await autoTranslate(finalPrompt);
    if (translated !== finalPrompt) {
      translatedFrom = finalPrompt;
      finalPrompt = translated;
    }
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: "text-to-image", prompt: finalPrompt, size }),
  });

  if (!response.ok) {
    const err = await response.text();
    return Response.json({ error: `Generation failed: ${err}` }, { status: response.status });
  }

  const data = await response.json();
  const imageBase64: string = data?.data?.[0]?.b64_json;

  if (!imageBase64) {
    return Response.json({ error: "No image returned" }, { status: 500 });
  }

  return Response.json({ imageBase64, size, translatedPrompt: finalPrompt, originalPrompt: translatedFrom });
}
