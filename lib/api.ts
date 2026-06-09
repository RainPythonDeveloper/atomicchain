export async function generateImage(params: {
  prompt: string;
  negative_prompt?: string;
  size?: string;
}): Promise<{ imageBase64: string; size: string }> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Generation failed");
  return data;
}
