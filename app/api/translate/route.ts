import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, from = "ru" } = await req.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ kg: "", en: "" });
    }

    const trimmed = text.trim();

    // 1. Translate RU -> EN
    const translateTo = async (targetLang: string) => {
      try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
          trimmed
        )}`;
        const res = await fetch(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          },
        });
        if (!res.ok) throw new Error("Translation request failed");
        const data = await res.json();
        // Google Translate single endpoint returns array of parts in data[0]
        if (Array.isArray(data) && Array.isArray(data[0])) {
          return (data[0] as Array<[string, ...unknown[]]>)
            .map((part) => part[0])
            .join("");
        }
        return "";
      } catch (err) {
        console.warn(`Translation error for ${targetLang}:`, err);
        return "";
      }
    };

    const [enText, kgText] = await Promise.all([
      translateTo("en"),
      translateTo("ky"), // ISO-639-1 code for Kyrgyz is 'ky'
    ]);

    return NextResponse.json({
      success: true,
      en: enText || trimmed,
      kg: kgText || trimmed,
    });
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json(
      { error: "Не удалось выполнить перевод" },
      { status: 500 }
    );
  }
}
