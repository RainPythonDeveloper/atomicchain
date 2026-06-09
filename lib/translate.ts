export function detectLangCode(text: string): string | null {
  if (/[Ѐ-ӿ]/.test(text)) return "ru";
  if (/[؀-ۿ]/.test(text)) return "ar";
  if (/[一-鿿]/.test(text)) return "zh";
  if (/[぀-ヿ]/.test(text)) return "ja";
  if (/[가-힯]/.test(text)) return "ko";
  if (/[Ͱ-Ͽ]/.test(text)) return "el";
  return null;
}

export async function translateToEnglish(text: string, srcLang: string): Promise<string> {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${srcLang}|en`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return text;
    const data = await res.json();
    const translated: string = data?.responseData?.translatedText;
    if (!translated || translated.toUpperCase() === text.toUpperCase()) return text;
    return translated;
  } catch {
    return text;
  }
}

export async function autoTranslate(text: string): Promise<string> {
  if (!text?.trim()) return text;
  const lang = detectLangCode(text);
  if (!lang) return text;
  return translateToEnglish(text, lang);
}
