import { autoTranslate } from "@/lib/translate";

export async function POST(request: Request) {
  const { imageBase64, originalPrompt, improvement } = await request.json();

  const visionKey = process.env.VISION_API_KEY;
  const visionUrl = process.env.VISION_API_URL ?? "https://api.openai.com/v1/chat/completions";
  const visionModel = process.env.VISION_MODEL ?? "gpt-4o-mini";

  // Always translate improvement text to English
  const translatedImprovement = await autoTranslate(improvement ?? "");

  if (!visionKey) {
    return Response.json({
      refinedPrompt: buildRefinedPrompt(originalPrompt, translatedImprovement),
      usedVision: false,
    });
  }

  try {
    const improvementClause = translatedImprovement?.trim()
      ? `The user wants: ${translatedImprovement.trim()}.`
      : "Make it more detailed and higher quality.";

    const userPrompt = `Look at this image carefully. ${improvementClause}

Write a concise image generation prompt (2-4 sentences max) that captures exactly what's in the image but improved. Include: subject details, art style, lighting, colors, mood.

OUTPUT FORMAT: Just the prompt text. No labels, no explanations, no "Prompt:" prefix. Start directly with the subject.`;

    const res = await fetch(visionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${visionKey}`,
      },
      body: JSON.stringify({
        model: visionModel,
        messages: [{
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            { type: "image_url", image_url: { url: `data:image/png;base64,${imageBase64}` } },
          ],
        }],
        max_tokens: 200,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) throw new Error(`Vision API ${res.status}: ${await res.text()}`);

    const data = await res.json();
    let refined: string = data?.choices?.[0]?.message?.content ?? "";

    if (!refined) throw new Error("Empty response from vision model");

    refined = refined
      .replace(/^\*{0,2}(improved\s+)?(image\s+)?prompt:?\*{0,2}\s*/i, "")
      .replace(/^"(.+)"$/, "$1")
      .trim();

    return Response.json({ refinedPrompt: refined, usedVision: true });
  } catch (err) {
    return Response.json({
      refinedPrompt: buildRefinedPrompt(originalPrompt, translatedImprovement),
      usedVision: false,
      warning: String(err),
    });
  }
}

function buildRefinedPrompt(original: string, improvement: string): string {
  if (!improvement) return original;
  if (!original) return improvement;
  return `${original}, ${improvement}`;
}
