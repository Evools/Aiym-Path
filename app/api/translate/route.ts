import { NextRequest, NextResponse } from "next/server";

async function translateWithGoogleClient(text: string, targetLang: string, from = "ru"): Promise<string> {
  const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${from}&tl=${targetLang}&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(4500),
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) throw new Error(`Google translate returned ${res.status}`);
  const data = await res.json();
  if (Array.isArray(data)) {
    if (typeof data[0] === "string") return data.join(" ");
    if (Array.isArray(data[0])) return (data[0] as string[]).join(" ");
  }
  if (typeof data === "string") return data;
  return "";
}

async function translateWithMyMemory(text: string, targetLang: string, from = "ru"): Promise<string> {
  const langPair = `${from}|${targetLang}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(4500),
  });
  if (!res.ok) throw new Error(`MyMemory returned ${res.status}`);
  const data = await res.json();
  if (data && data.responseData && typeof data.responseData.translatedText === "string") {
    const txt = data.responseData.translatedText.trim();
    if (txt && !txt.startsWith("MYMEMORY WARNING")) {
      return txt;
    }
  }
  return "";
}

async function translateText(text: string, targetLang: string): Promise<string> {
  // 1. Try Google clients5 API first (fastest and highest quality for EN and KY)
  try {
    const result = await translateWithGoogleClient(text, targetLang);
    if (result && result.trim()) return result.trim();
  } catch {
    // Continue to fallback
  }

  // 2. Try MyMemory API as secondary provider
  try {
    const result = await translateWithMyMemory(text, targetLang);
    if (result && result.trim()) return result.trim();
  } catch {
    // Fallback exhausted
  }

  return "";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = body.text;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ success: true, kg: "", en: "" });
    }

    const trimmed = text.trim();

    // Run EN and KY in parallel
    const [enResult, kgResult] = await Promise.allSettled([
      translateText(trimmed, "en"),
      translateText(trimmed, "ky"),
    ]);

    const enText = enResult.status === "fulfilled" ? enResult.value : "";
    const kgText = kgResult.status === "fulfilled" ? kgResult.value : "";

    return NextResponse.json({
      success: true,
      en: enText || trimmed,
      kg: kgText || trimmed,
      isEnTranslated: Boolean(enText && enText !== trimmed),
      isKgTranslated: Boolean(kgText && kgText !== trimmed),
    });
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json(
      { error: "Не удалось выполнить перевод" },
      { status: 500 }
    );
  }
}
