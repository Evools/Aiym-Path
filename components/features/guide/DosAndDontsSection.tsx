"use client";

import React from "react";
import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const DosAndDontsSection: React.FC = () => {
  const { language } = useLanguage();

  const dos = [
    {
      ru: "Доверяйте своей интуиции — немедленно прекращайте контакт, если что-то кажется не так или вызывает подозрение.",
      kg: "Өз туюмуңузга ишениңиз — эгерде бир нерсе шектүү көрүнсө же кооптонуу жаратса, байланышты токтоосуз үзүңүз.",
      en: "Trust your intuition — terminate contact immediately if something feels wrong or suspicious.",
    },
    {
      ru: "Если кто-то переходит личные границы — поднимите шум и сразу направляйтесь к скоплению людей.",
      kg: "Эгерде кимдир бирөө жеке чек араңызды бузса — үнүңүздү көтөрүп, дароо адамдар көп жерге карай басыңыз.",
      en: "If someone crosses boundaries — raise your voice, cause a scene, and head directly toward crowds.",
    },
    {
      ru: "Чувствуете тревогу? Ищите поблизости других женщин — они всегда придут на помощь и вступятся.",
      kg: "Кооптонуу сезилсе, жакынкы аялдардан жардам сураңыз — алар дайыма жардам берип, колдоп чыгышат.",
      en: "Feeling anxious? Look for other women nearby — local women will almost always step in and help.",
    },
    {
      ru: "Перед тем как отправиться куда-то в одиночку — сообщите доверенному лицу свой маршрут и точное время возвращения.",
      kg: "Жалгыз сапарга чыгуудан мурун — ишенимдүү адамыңызга маршрутуңузду жана кайтып келүү убактыңызды кабарлаңыз.",
      en: "Before heading out solo — inform a trusted contact of your planned route and expected return time.",
    },
    {
      ru: "Освойте базовые навыки самообороны — они пригодятся там, где поблизости нет людей, способных помочь.",
      kg: "Өзүн-өзү коргоонун негизги ыкмаларын үйрөнүңүз — алар жакын арада жардам берер адам жок болгондо пайдалуу.",
      en: "Learn basic self-defense skills — essential in remote areas where immediate help may not be around.",
    },
  ];

  const donts = [
    {
      ru: "Не останавливайте немаркированные такси ночью — пользуйтесь официальными приложениями или проверяйте водителя.",
      kg: "Түнкүсүн белгиси жок таксилерге отурбаңыз — расмий тиркемелерди колдонуп, айдоочунун өздүгүн тактаңыз.",
      en: "Never hail unmarked taxis at night — always verify the driver's identity or use verified rideshare apps.",
    },
    {
      ru: "Не садитесь в машину и не следуйте за тем, кому интуиция говорит «нет».",
      kg: "Ички туюмуңуз «жок» деген адамдардын унаасына отурбаңыз жана алардын артынан ээрчибеңиз.",
      en: "Do not get into a car or follow anyone if your gut feeling says 'no'.",
    },
    {
      ru: "Не сообщайте незнакомцам, что вы одна, и учитывайте, что нормы в сельской местности отличаются от городских.",
      kg: "Бөтөн адамдарга жалгыз жүргөнүңүздү айтпаңыз жана айыл жергесиндеги нормалар шаардык нормалардан айырмаланарын эске алыңыз.",
      en: "Do not tell strangers that you are traveling alone, and respect cultural norms in rural areas.",
    },
    {
      ru: "Не отправляйтесь на многодневные или ледниковые высокогорные маршруты без сопровождения гида.",
      kg: "Гиддин коштоосу жок көп күндүк же мөңгүлүү бийик тоолуу маршруттарга чыкпаңыз.",
      en: "Never embark on multi-day or glacial mountain trails without an accredited guide.",
    },
    {
      ru: "Не доверяйте времени маршруток в Google Maps — они отправляются строго по заполнении.",
      kg: "Google Maps'теги маршруттук таксилердин убактысына ишенбеңиз — алар эл толгондо гана жөнөйт.",
      en: "Do not rely on marshrutka (minibus) schedules on Google Maps — they depart only when full.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#FAFBFB] border-t border-[#E1E1E1]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="max-w-2xl mb-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[#07626A] text-xs font-semibold uppercase mb-3"
            style={{ backgroundColor: "rgba(7, 98, 106, 0.10)" }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {language === "kg"
                ? "Коопсуздук эрежелери"
                : language === "en"
                ? "Safety Standards"
                : "Правила безопасности"}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D] tracking-tight">
            {language === "kg"
              ? "Эмне кылса болот жана эмнеге болбойт"
              : language === "en"
              ? "Do's and Don'ts for Female Travelers"
              : "Что можно и чего нельзя делать"}
          </h2>

          <p className="text-sm text-[#0D0D0D]/70 mt-2">
            {language === "kg"
              ? "Кыргызстан боюнча саякаттоону коопсуз жана жагымдуу кылуу үчүн негизги эрежелер"
              : language === "en"
              ? "Essential behavioral guidelines to make your trip in Kyrgyzstan safe, respectful, and empowering."
              : "Главные практические правила для безопасного, комфортного и вдохновляющего путешествия по Кыргызстану."}
          </p>
        </div>

        {/* Two-Column Grid: DOs vs DONTs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* DOs Column */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E1E1E1] shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E1E1E1]">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0D0D0D]">
                  {language === "kg"
                    ? "Сунушталат (Кылса болот)"
                    : language === "en"
                    ? "Recommended (Do's)"
                    : "Рекомендуется (Можно)"}
                </h3>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  {language === "kg"
                    ? "Сиздин коопсуздугуңуз үчүн"
                    : language === "en"
                    ? "For your safety & confidence"
                    : "Для вашей безопасности и уверенности"}
                </span>
              </div>
            </div>

            <ul className="flex flex-col gap-3.5 pt-1">
              {dos.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-[13px] text-[#0D0D0D]/85 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-emerald-100/80 text-emerald-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{item[language] || item.ru}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* DONTs Column */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E1E1E1] shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E1E1E1]">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0D0D0D]">
                  {language === "kg"
                    ? "Сунушталбайт (Болбойт)"
                    : language === "en"
                    ? "Avoid (Don'ts)"
                    : "Не рекомендуется (Нельзя)"}
                </h3>
                <span className="text-[11px] text-rose-600 font-semibold">
                  {language === "kg"
                    ? "Тобокелдиктерди алдын алуу"
                    : language === "en"
                    ? "Risk prevention"
                    : "Предотвращение рисков"}
                </span>
              </div>
            </div>

            <ul className="flex flex-col gap-3.5 pt-1">
              {donts.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-[13px] text-[#0D0D0D]/85 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-rose-100/80 text-rose-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{item[language] || item.ru}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
