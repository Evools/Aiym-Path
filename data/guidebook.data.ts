import { GuidebookItem, ChecklistItem, DifficultyLevelGuide } from "@/types/guidebook.types";

export const GUIDEBOOK_ITEMS: GuidebookItem[] = [
  // --- ТАБ: ДЛЯ ПУТЕШЕСТВЕННИЦ (TRAVELERS) ---
  {
    id: "g-travelers-safety",
    audience: "travelers",
    category: "safety",
    iconName: "ShieldCheck",
    title: {
      ru: "Безопасность на маршруте",
      kg: "Маршруттагы коопсуздук",
      en: "Safety on the Trail",
    },
    shortDescription: {
      ru: "Сообщайте маршрут доверенному человеку, проверяйте прогноз погоды и берите с собой аптечку. На сложных участках двигайтесь группой, а не поодиночке.",
      kg: "Маршрутту ишенимдүү адамыңызга кабарлаңыз, аба ырайын текшерип, аптечка ала жүрүңүз. Татаал жерлерде жалгыз эмес, топ менен жүрүңүз.",
      en: "Share your route with a trusted contact, check mountain weather forecasts, and pack a first-aid kit. Travel in groups on difficult sections.",
    },
    badgeText: {
      ru: "Приоритет №1",
      kg: "№1 Артыкчылык",
      en: "Priority #1",
    },
    details: {
      ru: [
        "Обязательно оставляйте нитку маршрута и расчетное время возвращения родным или доверенному лицу.",
        "Проверяйте прогноз погоды в высокогорье: в горах Тянь-Шаня погода может резко измениться за 20-30 минут.",
        "Всегда держите в рюкзаке базовую аптечку, заряженный пауэрбанк и налобный фонарик с запасными батарейками.",
        "На крутых перевалах, осыпях и бродах не отделяйтесь от группы и следуйте указаниям гида.",
      ],
      kg: [
        "Маршруттун багытын жана кайтып келүү убактысын жакындарыңызга же ишенимдүү адамыңызга алдын ала калтырыңыз.",
        "Бийик тоолуу аймактардагы аба ырайын текшериңиз: Тянь-Шань тоолорунда аба ырайы 20-30 мүнөттө кескин өзгөрүшү мүмкүн.",
        "Рюкзакта дайыма негизги аптечка, кубатталган пауэрбанк жана фонарик болсун.",
        "Татаал ашууларда жана суу кечүүлөрдө топтон бөлүнбөй, гиддин айткандарын аткарыңыз.",
      ],
      en: [
        "Always leave your detailed itinerary and expected return time with a trusted person.",
        "Check high-altitude mountain forecasts: Tian Shan weather can shift dramatically within 20–30 minutes.",
        "Keep a personal first-aid kit, fully charged powerbank, and headlamp in your backpack.",
        "Stay with your group on steep passes, scree slopes, and river crossings.",
      ],
    },
  },
  {
    id: "g-travelers-female-tips",
    audience: "travelers",
    category: "female_tips",
    iconName: "UserCheck",
    title: {
      ru: "Советы для женщин-путешественниц",
      kg: "Саякатчы аялдар үчүн кеңештер",
      en: "Tips for Solo & Group Female Travelers",
    },
    shortDescription: {
      ru: "Выбирайте гостевые дома и сервисы с отметкой female-friendly, уточняйте наличие женского персонала заранее и не стесняйтесь спрашивать гида о деталях маршрута.",
      kg: "Female-friendly белгиси бар конок үйлөрдү жана кызматтарды тандаңыз, аял кызматкерлердин бар-жогун алдын ала сурап, гидден маршрут тууралуу так маалымат алыңыз.",
      en: "Choose female-friendly certified guesthouses, verify female staff availability in advance, and freely ask your guide for any route specifics.",
    },
    badgeText: {
      ru: "Female-Friendly",
      kg: "Female-Friendly",
      en: "Female-Friendly",
    },
    details: {
      ru: [
        "Бронируйте проверенные гостевые дома со значком сертификации Aiym Path с гарантией безопасных условий.",
        "Уточняйте заранее условия проживания: наличие раздельных санузлов, горячего душа и запирающихся дверей.",
        "В традиционных сельских районах приветствуется уважительный стиль одежды (прикрытые плечи и колени).",
        "Для соло-походов выбирайте сертифицированных женщин-гидов из нашей базы верифицированных специалистов.",
      ],
      kg: [
        "Aiym Path тастыктамасы бар коопсуз шарттары кепилденген конок үйлөрдү тандаңыз.",
        "Жашоо шарттарын алдын ала билип алыңыз: өзүнчө санитардык түйүндөр, ысык суу жана бекитилүүчү эшиктер.",
        "Салттуу айыл жерлеринде сый-урмат көрсөтүүчү кийим үлгүсү (жабык ийин жана тизе) сунушталат.",
        "Жалгыз саякаттоодо биздин базадагы тастыкталган аял-гиддер менен байланышыңыз.",
      ],
      en: [
        "Book guesthouses verified with the Aiym Path female-friendly badge for assured safety standards.",
        "Confirm amenities in advance: lockable private rooms, hot water, and dedicated sanitary facilities.",
        "Dress respectfully in rural and traditional villages (modest coverage for shoulders and knees).",
        "When traveling solo, consider hiring certified female guides from our verified directory.",
      ],
    },
  },
  {
    id: "g-travelers-trekking",
    audience: "travelers",
    category: "trekking",
    iconName: "Compass",
    title: {
      ru: "Подготовка к треккингу",
      kg: "Треккингге даярдануу",
      en: "Trekking Preparation & Gear",
    },
    shortDescription: {
      ru: "Оцените свой уровень подготовки честно: сверьтесь с указанной сложностью и перепадом высот маршрута. Возьмите многослойную одежду и достаточный запас воды.",
      kg: "Даярдык деңгээлиңизди туура баалаңыз: маршруттун татаалдыгы жана бийиктик айырмасы менен таанышыңыз. Көп катмарлуу кийим жана жетиштүү суу алыңыз.",
      en: "Assess your fitness honestly: check trail difficulty and elevation gain. Bring layered clothing and adequate drinking water.",
    },
    badgeText: {
      ru: "Экипировка",
      kg: "Жабдуулар",
      en: "Gear & Prep",
    },
    details: {
      ru: [
        "Применяйте принцип трех слоев: термобелье (влагоотвод), флисовая кофта (тепло), мембранная куртка (ветро- и влагозащита).",
        "Используйте проверенную разношенную треккинговую обувь с поддержкой голеностопа и нескользким протектором.",
        "Берите минимум 1.5–2 литра питьевой воды на человека и компактный фильтр или обеззараживающие таблетки для горных ручьев.",
        "Соблюдайте правила горной акклиматизации: не поднимайтесь слишком резко выше 2500–3000 метров.",
      ],
      kg: [
        "Үч катмар эрежесин колдонуңуз: термоич кийим (тер чыгаруучу), флис жемпир (жылуулук), мембраналык куртка (шамал менен жамгырдан коргоо).",
        "Бутка ыңгайлуу, сыналган треккинг бут кийимин кийиңиз.",
        "Адам башына кеминде 1.5–2 литр суу жана тоо булактары үчүн тазалоочу каражаттарды алыңыз.",
        "Акклиматизация эрежелерин сактаңыз: 2500–3000 метр бийиктикке өтө тез көтөрүлбөңүз.",
      ],
      en: [
        "Use the 3-layer system: base layer (moisture-wicking), mid layer (fleece for warmth), outer shell (wind/waterproof membrane).",
        "Wear well-broken-in trekking boots with ankle support and reliable grip.",
        "Carry at least 1.5–2L of water per person and a compact water filter or purification tablets for streams.",
        "Acclimatize gradually: avoid rapid elevation gains over 2,500–3,000 meters in a single day.",
      ],
    },
  },
  {
    id: "g-travelers-eco-culture",
    audience: "travelers",
    category: "eco_culture",
    iconName: "Sprout",
    title: {
      ru: "Экология и культура",
      kg: "Экология жана маданият",
      en: "Eco & Cultural Etiquette",
    },
    shortDescription: {
      ru: "Уносите мусор с собой, уважайте местные традиции и спрашивайте разрешения перед фотографированием людей. Горы Кыргызстана — дом для местных сообществ.",
      kg: "Таштандыны өзүңүз менен алып кетиңиз, жергиликтүү каада-салттарды сыйлаңыз жана адамдарды сүрөткө тартуудан мурун уруксат сураңыз. Кыргызстандын тоолору — жергиликтүү элдин үйү.",
      en: "Pack out all trash, respect local traditions, and ask permission before taking photos of people. The mountains of Kyrgyzstan are home to local communities.",
    },
    badgeText: {
      ru: "Leave No Trace",
      kg: "Leave No Trace",
      en: "Leave No Trace",
    },
    details: {
      ru: [
        "Принцип Leave No Trace (Не оставляй следов): весь неорганический мусор, пластик и влажные салфетки забирайте с собой до ближайшего контейнера в населенном пункте.",
        "Уважение к священным местам (мазарам, святым источникам) — соблюдение тишины, чистоты и уважение местных обычаев.",
        "Всегда спрашивайте вежливое разрешение перед съемкой местных жителей, особенно женщин, пожилых людей и детей.",
        "Поддерживайте местных женщин-ремесленниц, покупая изделия из войлока и натуральные горные продукты напрямую у жительниц сел.",
      ],
      kg: [
        "«Эч кандай из калтырба» эрежеси: бардык таштандыны, пластикти жана нымдуу салфеткаларды өзүңүз менен алып кетиңиз.",
        "Ыйык жерлерге (мазарларга, булактарга) сый мамиле кылуу — тынчтыкты жана тазалыкты сактоо.",
        "Жергиликтүү тургундарды, өзгөчө аялдар менен балдарды сүрөткө тартардан мурун сөзсүз уруксат сураңыз.",
        "Жергиликтүү аял-кол өнөрчүлөрдү колдоп, кийиз буюмдарын жана табигый азыктарды түздөн-түз алардан сатып алыңыз.",
      ],
      en: [
        "Follow Leave No Trace principles: pack out all non-biodegradable trash, wrappers, and wipes back to town bins.",
        "Show respect at sacred sites (mazars, holy springs) — observe quietness and preserve site cleanliness.",
        "Always politely ask before photographing locals, particularly women, elders, and children.",
        "Support local female artisans and producers by buying handmade felt crafts and honey directly from villagers.",
      ],
    },
  },
  {
    id: "g-travelers-planning",
    audience: "travelers",
    category: "planning",
    iconName: "Route",
    title: {
      ru: "Планирование поездки",
      kg: "Сапарды пландаштыруу",
      en: "Trip Planning & Logistics",
    },
    shortDescription: {
      ru: "Бронируйте гидов и гостевые дома заранее в высокий сезон, закладывайте резервный день на смену погоды и сверяйтесь с уровнем связи на маршруте.",
      kg: "Жайкы сезондо гиддерди жана конок үйлөрдү алдын ала брондоңуз, аба ырайы өзгөргөн учурга кошумча күн караштырып, байланыш деңгээлин тактаңыз.",
      en: "Book guides and homestays early during peak season, schedule buffer days for weather shifts, and verify mobile coverage on your trail.",
    },
    badgeText: {
      ru: "Логистика",
      kg: "Логистика",
      en: "Logistics",
    },
    details: {
      ru: [
        "В пиковый сезон (июль–август) бронируйте юрточные лагеря, транспорт и гидов минимум за 2–3 недели.",
        "Обязательно скачивайте офлайн-карты (Maps.me, Organic Maps, OsmAnd) и треки маршрутов до выхода из зоны покрытия сети.",
        "Приобретайте местную SIM-карту (Mega, Beeline, O!) с подключенным пакетом мобильного интернета в аэропорту или городе.",
        "Закладывайте резервный день в график на случай резкого дождя, снегопада или тумана на высокогорных перевалах.",
      ],
      kg: [
        "Эң кызуу мезгилде (июль-август) боз үй лагерлерин, транспортту жана гиддерди 2-3 жума мурун брондоңуз.",
        "Интернет жок жерге чыгаардан мурун оффлайн карталарды (Maps.me, Organic Maps) жана маршрут тректерин көчүрүп алыңыз.",
        "Аэропорттон же шаардан жергиликтүү SIM-карта (Mega, Beeline, O!) сатып алыңыз.",
        "Аба ырайынын начарлашы же калың туман үчүн графикке кошумча 1 күн кошуп эсептеңиз.",
      ],
      en: [
        "During high season (July–August), reserve yurt camps, transport, and certified guides at least 2–3 weeks in advance.",
        "Download offline map apps (Maps.me, Organic Maps, OsmAnd) and GPX trail tracks before heading into mountain valleys.",
        "Get a local SIM card (Mega, Beeline, O!) with reliable mobile data packages upon arrival.",
        "Keep at least one buffer day in your itinerary for sudden weather changes or mountain pass delays.",
      ],
    },
  },
  {
    id: "g-travelers-emergency",
    audience: "travelers",
    category: "emergency",
    iconName: "PhoneCall",
    title: {
      ru: "Контакты экстренных служб",
      kg: "Өзгөчө кырдаалдар байланыштары",
      en: "Emergency Contacts & SOS",
    },
    shortDescription: {
      ru: "Единая служба спасения — 112. Сохраните также контакты выбранного гида и гостевого дома перед выходом на маршрут.",
      kg: "Бирдиктүү куткаруу кызматы — 112. Ошондой эле маршрутка чыгаардан мурун тандалган гиддин жана конок үйүнүн байланыштарын сактап алыңыз.",
      en: "Unified emergency service — 112. Also save direct contacts of your chosen guide and host prior to departing on any trail.",
    },
    badgeText: {
      ru: "SOS 112",
      kg: "SOS 112",
      en: "SOS 112",
    },
    actionType: "emergency_call",
    details: {
      ru: [
        "112 — Единая служба спасения МЧС КР (бесплатный звонок, доступен со всех мобильных операторов даже без SIM-карты).",
        "103 — Скорая медицинская помощь.",
        "Туристическая милиция (Бишкек и Иссык-Куль): +996 (312) 88-12-02.",
        "Запишите и держите на бумажном носителе GPS-координаты базового лагеря и контактный номер дежурного координатора группы.",
      ],
      kg: [
        "112 — КР ӨКМнин Бирдиктүү куткаруу кызматы (акысыз чалуу, SIM-картасыз да иштейт).",
        "103 — Тез медициналык жардам кызматы.",
        "Туристтик милиция: +996 (312) 88-12-02.",
        "Базалык лагердин координаттарын жана гиддин номерин кагазга жазып алып жүрүңүз.",
      ],
      en: [
        "112 — Unified Emergency Dispatch Service of the Kyrgyz Republic (free call, works without SIM card).",
        "103 — Ambulance / Medical emergency service.",
        "Tourist Police Hotline (Bishkek & Issyk-Kul): +996 (312) 88-12-02.",
        "Keep a printed paper copy of your base camp coordinates and emergency contact numbers in your dry bag.",
      ],
    },
  },

  // --- ТАБ: ДЛЯ ПОСТАВЩИКОВ УСЛУГ (PROVIDERS) ---
  {
    id: "g-providers-female-friendliness",
    audience: "providers",
    category: "hospitality",
    iconName: "Sparkles",
    title: {
      ru: "Повышение female-friendliness",
      kg: "Female-friendliness деңгээлин жогорулатуу",
      en: "Enhancing Female-Friendliness",
    },
    shortDescription: {
      ru: "Обеспечьте базовые условия комфорта: отдельные санузлы, понятную информацию о безопасности и вежливое отношение к вопросам гостей.",
      kg: "Ыңгайлуулуктун негизги шарттарын камсыздаңыз: өзүнчө санитардык түйүндөр, коопсуздук боюнча түшүнүктүү маалымат жана коноктордун суроолоруна сылык мамиле.",
      en: "Provide core comfort essentials: separated sanitary zones, clear safety briefings, and supportive communication for guest inquiries.",
    },
    badgeText: {
      ru: "Сертификация",
      kg: "Сертификаттоо",
      en: "Certification",
    },
    details: {
      ru: [
        "Оборудование чистых, безопасных и раздельных санитарных зон с исправными внутренними замками и достаточным освещением.",
        "Наличие базовых средств личной гигиены первой необходимости в номерах, юртах и санитарных комнатах.",
        "Освещенные и безопасные дорожки на территории базы или гостевого дома в вечернее и ночное время.",
        "Открытая, гостеприимная и уважительная атмосфера без нарушения личных границ путешественниц.",
      ],
      kg: [
        "Ичинен бекитилүүчү кулпулары жана жакшы жарыгы бар таза, коопсуз санитардык бөлмөлөрдү уюштуруу.",
        "Бөлмөлөрдө жана боз үйлөрдө биринчи кезектеги жеке гигиена каражаттарынын болушу.",
        "Түнкүсүн конок үйүнүн аймагындагы жолдорду жарыктандыруу.",
        "Саякатчылардын жеке чек араларын бузбастан, ачык жана сыйлуу мамиле түзүү.",
      ],
      en: [
        "Set up clean, safe, and private sanitary areas with secure internal locks and adequate night lighting.",
        "Provide essential personal hygiene supplies in guest rooms, yurts, and washrooms.",
        "Maintain well-lit pathways across the camp or guesthouse grounds after dark.",
        "Foster a welcoming, respectful environment that honors guest privacy and personal boundaries.",
      ],
    },
  },
  {
    id: "g-providers-safety",
    audience: "providers",
    category: "safety",
    iconName: "Lock",
    title: {
      ru: "Безопасность женщин-гостей",
      kg: "Саякатчы аялдардын коопсуздугу",
      en: "Safety of Female Guests",
    },
    shortDescription: {
      ru: "Обучите персонал реагировать на запросы о безопасности, предоставляйте чёткие инструкции по маршрутам и контакты на случай чрезвычайной ситуации.",
      kg: "Кызматкерлерди коопсуздук суроолоруна туура жооп берүүгө үйрөтүңүз, маршруттар боюнча так көрсөтмөлөрдү жана өзгөчө кырдаал байланыштарын бериңиз.",
      en: "Train staff to respond promptly to safety inquiries, provide clear trail instructions, and ensure access to emergency contacts.",
    },
    badgeText: {
      ru: "Стандарты",
      kg: "Стандарттар",
      en: "Standards",
    },
    details: {
      ru: [
        "Инструктаж персонала по деликатному, профессиональному и безопасному взаимодействию с соло-путешественницами.",
        "Размещение на видном месте памяток с номерами экстренных служб и локальных спасателей на русском, кыргызском и английском языках.",
        "Ведение журнала радиальных выходов гостей на пешие треки с обязательной фиксацией контрольного времени возвращения.",
        "Возможность предоставить гостю сертифицированного проводника или надежного сопровождающего из числа местных жителей.",
      ],
      kg: [
        "Кызматкерлерди жалгыз саякаттаган аялдар менен кесипкөй жана сылык мамиледе болууга үйрөтүү.",
        "Өзгөчө кырдаалдар жана куткаруучулардын байланыштарын көрүнүктүү жерге кыргыз, орус жана англис тилдеринде жайгаштыруу.",
        "Жөө жүрүшкө чыккан конокторду каттоо журналын жүргүзүп, кайтуу убактысын так жазып туруу.",
        "Конокко тастыкталган жергиликтүү гидди же коштоочуну сунуштоо мүмкүнчүлүгү.",
      ],
      en: [
        "Train team members on professional, respectful, and safe communication with solo female guests.",
        "Display emergency contact signs prominently in Russian, Kyrgyz, and English.",
        "Maintain a daily trail check-out/check-in log recording guest routes and estimated return times.",
        "Provide verified local guides or escorts upon request.",
      ],
    },
  },
  {
    id: "g-providers-service-quality",
    audience: "providers",
    category: "standards",
    iconName: "Award",
    title: {
      ru: "Стандарты качества сервиса",
      kg: "Тейлөө сапатынын стандарттары",
      en: "Service Quality Standards",
    },
    shortDescription: {
      ru: "Поддерживайте единые стандарты чистоты, коммуникации и прозрачного ценообразования — это формирует доверие у путешественниц.",
      kg: "Тазалыктын, байланыштын жана ачык баа түзүүнүн бирдиктүү стандарттарын сактаңыз — бул саякатчылардын ишенимин жаратат.",
      en: "Maintain consistent cleanliness standards, responsive communication, and transparent pricing to build traveler trust.",
    },
    badgeText: {
      ru: "Качество",
      kg: "Сапат",
      en: "Quality",
    },
    details: {
      ru: [
        "Прозрачные фиксированные тарифы без скрытых доплат за услуги трансфера, питания, аренды снаряжения и сопровождения.",
        "Строгое соблюдение гигиенических норм: свежее постельное белье, чистые спальные мешки и обработка посуды.",
        "Оперативная обратная связь в популярных мессенджерах (WhatsApp, Telegram) до прибытия гостей.",
        "Возможность безналичной оплаты (QR-коды ЭЛСОМ, MBANK, Visa/Mastercard) или понятный расчет в национальной валюте.",
      ],
      kg: [
        "Трансфер, тамак-аш жана гид кызматтары үчүн жашыруун төлөмдөрү жок ачык жана так баалар.",
        "Гигиена нормаларын так сактоо: таза төшөк-орун, таза уктоочу каптар жана идиш-аяктарды таза жууп туруу.",
        "Коноктор келгенге чейин WhatsApp же Telegram аркылуу тез арада жооп берүү.",
        "Накталай эмес төлөмдөрдү (QR, банктык карталар) кабыл алуу мүмкүнчүлүгү.",
      ],
      en: [
        "Transparent, fixed rates without hidden charges for transfers, meals, or guiding.",
        "Strict hygiene practices: fresh bedding, thoroughly sanitized sleeping bags, and clean tableware.",
        "Prompt communication via WhatsApp or Telegram prior to guest check-in.",
        "Support for cashless mobile payments (local QR codes, bank cards) and clear invoicing.",
      ],
    },
  },
  {
    id: "g-providers-gender-approach",
    audience: "providers",
    category: "gender",
    iconName: "Users",
    title: {
      ru: "Гендерно-чувствительный подход",
      kg: "Гендердик сезимтал мамиле",
      en: "Gender-Responsive Approach",
    },
    shortDescription: {
      ru: "Учитывайте разный опыт и потребности гостей независимо от пола, избегайте стереотипных предположений при обслуживании.",
      kg: "Коноктордун жынысына карабастан ар кандай муктаждыктарын эске алыңыз, тейлөөдө стереотиптик көз караштардан алыс болуңуз.",
      en: "Respect the diverse experiences and specific needs of guests regardless of gender, avoiding stereotypical assumptions.",
    },
    badgeText: {
      ru: "Инклюзивность",
      kg: "Инклюзивдүүлүк",
      en: "Inclusion",
    },
    details: {
      ru: [
        "Активное вовлечение местных женщин в управление гостевыми домами, приготовление национальной кухни и проведение экскурсий.",
        "Равное и уважительное отношение к самостоятельным путешественницам без неуместных расспросов и снисходительного тона.",
        "Понимание физиологических особенностей при планировании темпа треккинга, частоты привалов и доступности санитарных остановок.",
        "Создание уютных и безопасных общих зон для общения и спокойного отдыха гостей.",
      ],
      kg: [
        "Жергиликтүү аялдарды конок үйлөрүн башкарууга, тамак жасоого жана экскурсияларды өткөрүүгө тартуу.",
        "Жалгыз саякатчыларга сый мамиле кылуу жана ашыкча суроолордон алыс болуу.",
        "Жөө жүрүштөрдө эс алуу убактысын жана санитардык тыныгууларды туура пландаштыруу.",
        "Коноктордун эс алуусу жана баарлашуусу үчүн коопсуз жана жайлуу жалпы аймактарды түзүү.",
      ],
      en: [
        "Actively involve local women in guesthouse leadership, culinary hosting, and guided walks.",
        "Treat solo female travelers with equal respect without intrusive personal inquiries or condescension.",
        "Incorporate regular rest breaks and accessible sanitary stops along trekking routes.",
        "Design comfortable, safe common areas for socializing and quiet relaxation.",
      ],
    },
  },
  {
    id: "g-providers-infrastructure",
    audience: "providers",
    category: "infrastructure",
    iconName: "Radio",
    title: {
      ru: "Развитие инфраструктуры",
      kg: "Инфраструктураны өнүктүрүү",
      en: "Infrastructure & Amenities",
    },
    shortDescription: {
      ru: "Постепенно улучшайте освещение, сигнал связи и указатели на маршрутах — это особенно важно для одиночных путешественниц.",
      kg: "Жарыктандырууну, байланыш сигналын жана маршруттардагы белгилерди жакшыртыңыз — бул өзгөчө жалгыз саякаттагандарга маанилүү.",
      en: "Continuously enhance night lighting, mobile coverage points, and trail signage — vital for solo travelers.",
    },
    badgeText: {
      ru: "Инфраструктура",
      kg: "Инфраструктура",
      en: "Infrastructure",
    },
    details: {
      ru: [
        "Установка четких навигационных указателей на развилках троп с маркировкой расстояния, перепада высот и сложности.",
        "Оборудование точки доступа Wi-Fi или усилителя сотового сигнала в базовом лагере для экстренной связи.",
        "Оснащение мест для зарядки смартфонов, аккумуляторов и навигаторов от солнечных батарей или генераторов.",
        "Комплектация расширенной аптечки первой помощи и регулярное обучение сотрудников навыкам доврачебной помощи.",
      ],
      kg: [
        "Чыйырлардын ача жолдорунда аралыкты жана татаалдыкты көрсөткөн түшүнүктүү белгилерди орнотуу.",
        "Байланыш үчүн базалык лагерде Wi-Fi же уюлдук байланыш күчөткүчүн орнотуу.",
        "Күн батареялары же генераторлор аркылуу гаджеттерди кубаттоочу жайларды түзүү.",
        "Кеңейтилген аптечканы толуктап, кызматкерлерди биринчи медициналык жардам көрсөтүүгө окутуу.",
      ],
      en: [
        "Install clear navigational trail markers indicating distances, elevation changes, and route difficulty.",
        "Set up Wi-Fi or cellular booster hotspots at base camps for emergency communications.",
        "Provide solar-powered or generator charging stations for smartphones and navigation devices.",
        "Maintain a comprehensive first-aid kit and ensure staff is trained in wilderness first aid.",
      ],
    },
  },
  {
    id: "g-providers-emergency",
    audience: "providers",
    category: "emergency",
    iconName: "PhoneCall",
    title: {
      ru: "Контакты экстренных служб",
      kg: "Өзгөчө кырдаалдар байланыштары",
      en: "Emergency Contacts & Protocols",
    },
    shortDescription: {
      ru: "Единая служба спасения — 112. Сохраните также контакты выбранного гида и гостевого дома перед выходом на маршрут.",
      kg: "Бирдиктүү куткаруу кызматы — 112. Ошондой эле маршрутка чыгаардан мурун тандалган гиддин жана конок үйүнүн байланыштарын сактап алыңыз.",
      en: "Unified emergency service — 112. Also save direct contacts of your chosen guide and host prior to departing on any trail.",
    },
    badgeText: {
      ru: "SOS 112",
      kg: "SOS 112",
      en: "SOS 112",
    },
    actionType: "emergency_call",
    details: {
      ru: [
        "Прямой канал связи с районным подразделением МЧС КР и дежурной частью районного отдела милиции.",
        "Четкий пошаговый протокол эвакуации при травмах, горной болезни или резком ухудшении погодных условий.",
        "Наличие проверенной УКВ-рации или спутникового трекера для групп, выходящих в отдаленные ущелья.",
        "Контакты ближайшего фельдшерско-акушерского пункта (ФАП) и районной больницы с круглосуточным дежурством.",
      ],
      kg: [
        "Райондук ӨКМ бөлүмү жана милиция менен түз байланыш каналын түзүү.",
        "Жаракат алганда же аба ырайы бузулганда эвакуациялоонун так тартиби.",
        "Алыскы капчыгайларга чыккан топтор үчүн рация же спутниктик трекердин болушу.",
        "Жакынкы фельдшердик-акушердик пункттун (ФАП) жана оорукананын байланыштары.",
      ],
      en: [
        "Direct emergency line to the local Ministry of Emergency Situations (MES) district dispatch and local police.",
        "Standard evacuation protocol for injuries, acute mountain sickness, or severe weather conditions.",
        "VHF two-way radios or satellite SOS trackers for guided groups venturing into remote valleys.",
        "Updated contact numbers and location details for the nearest rural medical clinic and district hospital.",
      ],
    },
  },
];

export const EQUIPMENT_CHECKLIST: ChecklistItem[] = [
  // --- Базовое обязательное снаряжение ---
  {
    id: "chk-boots",
    category: "clothing",
    isEssential: true,
    difficulty: "all",
    label: {
      ru: "Треккинговые ботинки с поддержкой голеностопа",
      kg: "Бутту кармап турган треккинг бут кийими",
      en: "Trekking boots with ankle support",
    },
    note: {
      ru: "Обязательно разношенные, с цепким нескользящим протектором",
      kg: "Сыналган жана тайгаланбаган таманы менен",
      en: "Well broken-in with reliable grip tread",
    },
  },
  {
    id: "chk-membrane",
    category: "clothing",
    isEssential: true,
    difficulty: "all",
    label: {
      ru: "Ветро- и влагозащитная мембранная куртка",
      kg: "Шамал жана жамгыр өткөрбөс мембраналык куртка",
      en: "Waterproof & windproof membrane jacket",
    },
    note: {
      ru: "Погода в горах меняется мгновенно даже в солнечный день",
      kg: "Тоодо аба ырайы күн ачык болсо да тез өзгөрөт",
      en: "Mountain weather changes abruptly even on sunny days",
    },
  },
  {
    id: "chk-fleece",
    category: "clothing",
    isEssential: true,
    difficulty: "all",
    label: {
      ru: "Теплый флис или легкая пуховая жилетка",
      kg: "Жылуу флис же жеңил чыптама",
      en: "Warm fleece mid-layer or lightweight down vest",
    },
    note: {
      ru: "Для вечерней прохлады, привалов и перевалов",
      kg: "Кечки салкынга, эс алууга жана ашууларга",
      en: "For chilly evenings, rest breaks, and breezy passes",
    },
  },
  {
    id: "chk-poles",
    category: "clothing",
    isEssential: false,
    difficulty: "medium",
    locationIds: ["ala-archa", "jety-oguz", "barskoon", "alay", "kel-suu"],
    label: {
      ru: "Телескопические треккинговые палки",
      kg: "Телескопиялык треккинг таяктары",
      en: "Telescopic trekking poles",
    },
    note: {
      ru: "Снижают нагрузку на колени на 25% при спусках и подъемах",
      kg: "Түшүүдө жана чыгууда тизеге күч келтирүүнү 25% азайтат",
      en: "Reduces knee strain by 25% on steep descents and climbs",
    },
  },
  {
    id: "chk-thermal-underwear",
    category: "clothing",
    isEssential: true,
    difficulty: "hard",
    locationIds: ["ala-archa", "son-kul", "kel-suu", "alay"],
    label: {
      ru: "Комплект влагоотводящего термобелья",
      kg: "Термоич кийим топтому",
      en: "Thermal base layer set (top & bottoms)",
    },
    note: {
      ru: "Критично для ночевок на высотах выше 2500м (Сон-Куль, Кель-Суу, Рацека)",
      kg: "2500м бийиктиктеги конуп калуулар үчүн өтө маанилүү",
      en: "Essential for overnight stays above 2,500m (Son-Kul, Kel-Suu, Ratsek)",
    },
  },
  {
    id: "chk-powerbank",
    category: "navigation",
    isEssential: true,
    difficulty: "all",
    label: {
      ru: "Заряженный Powerbank (10000+ мАч)",
      kg: "Толук кубатталган Powerbank (10000+ мАч)",
      en: "Fully charged Powerbank (10,000+ mAh)",
    },
    note: {
      ru: "На холоде батарея телефона садится в 2 раза быстрее",
      kg: "Суукта телефон бат өчүп калат",
      en: "Cold temperatures drain smartphone batteries rapidly",
    },
  },
  {
    id: "chk-offline-maps",
    category: "navigation",
    isEssential: true,
    difficulty: "all",
    label: {
      ru: "Офлайн-карты (Organic Maps / OsmAnd) и GPX-трек",
      kg: "Оффлайн карталар жана GPX трек",
      en: "Downloaded offline maps & GPX track",
    },
    note: {
      ru: "Скачайте карту Кыргызстана и трек маршрута заранее в городе",
      kg: "Кыргызстандын картасын жана трегин алдын ала көчүрүңүз",
      en: "Download regional maps and trail tracks while in Wi-Fi coverage",
    },
  },
  {
    id: "chk-border-permit",
    category: "navigation",
    isEssential: true,
    difficulty: "hard",
    locationIds: ["kel-suu", "alay"],
    label: {
      ru: "Пограничный пропуск и оригинал паспорта",
      kg: "Чек ара уруксат кагазы жана паспорт",
      en: "Border zone permit & original passport",
    },
    note: {
      ru: "Обязательно для въезда в погранзону Кель-Суу (Нарын) и Алайской долины",
      kg: "Көл-Суу жана Алай чек ара аймактарына кирүү үчүн милдеттүү",
      en: "Mandatory for border zones at Kel-Suu and southern Alay valley",
    },
  },
  {
    id: "chk-first-aid",
    category: "safety",
    isEssential: true,
    difficulty: "all",
    label: {
      ru: "Индивидуальная аптечка и пластыри",
      kg: "Жеке аптечка жана жабыштыргычтар (пластырь)",
      en: "Personal first-aid kit & blister care",
    },
    note: {
      ru: "Обезболивающее, антигистаминное, бинт, эластичный бинт, антисептик",
      kg: "Ооруну басаңдатуучу, бинт, жабыштыргыч, антисептик",
      en: "Painkillers, antihistamines, bandage, antiseptic, blister plasters",
    },
  },
  {
    id: "chk-headlamp",
    category: "safety",
    isEssential: true,
    difficulty: "medium",
    locationIds: ["ala-archa", "jety-oguz", "barskoon", "son-kul", "kel-suu", "alay"],
    label: {
      ru: "Налобный фонарик с запасными батарейками",
      kg: "Башка тагылуучу фонарик жана кошумча батарея",
      en: "LED headlamp with spare batteries",
    },
    note: {
      ru: "В горах темнеет очень быстро, руки должны быть свободны",
      kg: "Тоодо бат караңгы кирет, колдор бош болушу керек",
      en: "Darkness falls quickly in mountain valleys, keep hands free",
    },
  },
  {
    id: "chk-sun-protection",
    category: "hygiene",
    isEssential: true,
    difficulty: "all",
    label: {
      ru: "Солнцезащитный крем SPF 50+ и очки UV400",
      kg: "Күндөн коргоочу крем SPF 50+ жана UV400 көз айнек",
      en: "Sunscreen SPF 50+ & UV400 sunglasses",
    },
    note: {
      ru: "В горах ультрафиолетовое излучение усиливается на 10-12% каждые 1000м",
      kg: "Тоодо күн нуру ар бир 1000 метрде күчөйт",
      en: "High-altitude UV radiation increases significantly with elevation",
    },
  },
  {
    id: "chk-water-flask",
    category: "hygiene",
    isEssential: true,
    difficulty: "all",
    label: {
      ru: "Многоразовая бутылка для воды (1.5 л) / термос",
      kg: "Суу үчүн бөтөлкө (1.5 л) же термос",
      en: "Reusable water bottle (1.5L) or vacuum flask",
    },
    note: {
      ru: "Пейте воду регулярно каждые 20–30 минут для профилактики горной болезни",
      kg: "Тоо оорусунун алдын алуу үчүн үзгүлтүксүз суу ичиңиз",
      en: "Hydrate steadily every 20–30 minutes to prevent altitude sickness",
    },
  },
  {
    id: "chk-water-filter",
    category: "hygiene",
    isEssential: false,
    difficulty: "hard",
    locationIds: ["jety-oguz", "barskoon", "kel-suu", "son-kul", "alay"],
    label: {
      ru: "Компактный фильтр для воды / обеззараживающие таблетки",
      kg: "Компакттуу суу фильтри же тазалоочу таблеткалар",
      en: "Compact water filter / purification tablets",
    },
    note: {
      ru: "Для безопасного набора воды из горных ручьев на многодневных треках",
      kg: "Көп күндүк жүрүштөрдө тоо сууларын коопсуз ичүү үчүн",
      en: "Essential for safely drinking from mountain streams on multi-day treks",
    },
  },
  {
    id: "chk-swimwear",
    category: "clothing",
    isEssential: false,
    difficulty: "easy",
    locationIds: ["alamedin", "chunkurchak", "jety-oguz", "sary-chelek"],
    label: {
      ru: "Купальник и быстросохнущее полотенце из микрофибры",
      kg: "Сууга түшүүчү кийим жана бат кургаган сүлгү",
      en: "Swimwear & quick-dry microfiber towel",
    },
    note: {
      ru: "Для термальных источников (Теплые Ключи, Джеты-Огуз) и горных озер",
      kg: "Ысык булактар жана көлдөр үчүн",
      en: "For thermal springs (Teplye Klyuchi, Jety-Oguz) and alpine lakes",
    },
  },
];

export const DIFFICULTY_LEVELS_GUIDE: DifficultyLevelGuide[] = [
  {
    id: "easy",
    badge: {
      ru: "Легкий уровень",
      kg: "Жеңил деңгээл",
      en: "Easy Trail",
    },
    title: {
      ru: "Прогулочные и однодневные маршруты",
      kg: "Сейилдөө жана 1 күндүк маршруттар",
      en: "Walking & Day Nature Trips",
    },
    duration: {
      ru: "1–4 часа (до 6 км)",
      kg: "1–4 саат (6 км чейин)",
      en: "1–4 hours (up to 6 km)",
    },
    elevation: {
      ru: "Перепад высот: до 300 м",
      kg: "Бийиктик айырмасы: 300 м чейин",
      en: "Elevation gain: up to 300 m",
    },
    description: {
      ru: "Оборудованные тропы с плавным набором высоты. Подходит новичкам, семьям с детьми и соло-путешественницам без специального горного опыта.",
      kg: "Жакшы чыйырлар, кескин эмес бийиктик. Жаңы баштагандарга жана үй-бүлөлөргө ылайыктуу.",
      en: "Well-marked gentle trails. Ideal for beginners, families, and travelers without previous mountain trekking experience.",
    },
    requiredGear: {
      ru: [
        "Удобные кроссовки с нескользкой подошвой",
        "Ветровка / легкая кофта",
        "Бутылка воды 1–1.5 л и перекус",
        "Крем SPF 50+, кепка и солнцезащитные очки",
      ],
      kg: [
        "Тайгаланбаган ыңгайлуу кроссовка",
        "Жеңил куртка же жемпир",
        "1–1.5 л суу жана жеңил тамак",
        "SPF 50+ крем, баш кийим жана көз айнек",
      ],
      en: [
        "Comfortable sneakers with traction soles",
        "Windbreaker or lightweight fleece",
        "1–1.5L drinking water & snacks",
        "SPF 50+ sunscreen, cap & sunglasses",
      ],
    },
    suitableFor: {
      ru: "Чункурчак, Теплые Ключи (Аламедин), каньон «Сказка», водопад Ак-Сай (базовый уровень)",
      kg: "Чүңкүрчак, Жылуу Булактар (Аламүдүн), «Жомок» каньону",
      en: "Chunkurchak, Teplye Klyuchi (Alamedin), Skazka Canyon",
    },
  },
  {
    id: "medium",
    badge: {
      ru: "Средний уровень",
      kg: "Орточо деңгээл",
      en: "Moderate Trek",
    },
    title: {
      ru: "Горный треккинг и панорамные подъемы",
      kg: "Тоо треккинги жана панорамалык чыгуулар",
      en: "Mountain Trekking & Viewpoint Climbs",
    },
    duration: {
      ru: "4–8 часов (7–16 км)",
      kg: "4–8 саат (7–16 км)",
      en: "4–8 hours (7–16 km)",
    },
    elevation: {
      ru: "Перепад высот: 350–850 м",
      kg: "Бийиктик айырмасы: 350–850 м",
      en: "Elevation gain: 350–850 m",
    },
    description: {
      ru: "Каменистые участки, крутые подъемы, возможны броды через неглубокие ручьи. Требуется уверенная физическая форма и треккинговая обувь.",
      kg: "Таштуу жерлер, бийик чыгуулар. Жакшы физикалык даярдык жана треккинг бут кийими талап кылынат.",
      en: "Rocky trails, moderate ascents, and occasional shallow stream crossings. Requires solid physical fitness and proper trekking footwear.",
    },
    requiredGear: {
      ru: [
        "Разношенные треккинговые ботинки с поддержкой голеностопа",
        "Телескопические треккинговые палки",
        "Мембранная штормовая куртка и теплый флис",
        "Заряженный пауэрбанк и налобный фонарь",
        "Индивидуальная аптечка с пластырями",
      ],
      kg: [
        "Бутту кармаган сыналган треккинг ботинкасы",
        "Треккинг таяктары",
        "Мембраналык куртка жана жылуу флис",
        "Кубатталган пауэрбанк жана фонарик",
        "Жеке аптечка",
      ],
      en: [
        "Broken-in trekking boots with ankle support",
        "Telescopic trekking poles",
        "Waterproof membrane shell & warm fleece",
        "Charged powerbank & LED headlamp",
        "Personal first-aid kit with blister tape",
      ],
    },
    suitableFor: {
      ru: "Хижина Рацека (Ала-Арча), водопад Джеты-Огуз «Девичьи Косы», водопад Барскоон, озеро Сары-Челек",
      kg: "Рацек үйү (Ала-Арча), Жети-Өгүз, Барскоон шаркыратмалары",
      en: "Ratsek Hut (Ala-Archa), Jety-Oguz Girl's Braids, Barskoon Waterfalls",
    },
  },
  {
    id: "hard",
    badge: {
      ru: "Сложный уровень",
      kg: "Татаал деңгээл",
      en: "Hard Expedition",
    },
    title: {
      ru: "Высокогорные переходы и многодневные маршруты",
      kg: "Бийик тоолуу жана көп күндүк каттамдар",
      en: "High-Altitude Passes & Multi-day Routes",
    },
    duration: {
      ru: "1–3 дня (высота 3000–3800м)",
      kg: "1–3 күн (3000–3800м бийиктик)",
      en: "1–3 days (altitude 3,000–3,800m)",
    },
    elevation: {
      ru: "Перепад высот: 900–1600 м",
      kg: "Бийиктик айырмасы: 900–1600 м",
      en: "Elevation gain: 900–1,600 m",
    },
    description: {
      ru: "Высокогорье, осыпные склоны, резкие перепады температур и отсутствие сотовой связи. Настоятельно рекомендуется сопровождение сертифицированного гида.",
      kg: "Бийик тоолор, байланыштын жоктугу, кескин аба ырайы. Сертификатталган гид менен баруу сунушталат.",
      en: "High altitude, scree terrain, rapid weather shifts, and no cellular reception. Certified female or local guide is strongly recommended.",
    },
    requiredGear: {
      ru: [
        "Комплект теплого термобелья и пуховка",
        "Спальный мешок с температурой комфорта от 0°C до -5°C",
        "Фильтр для воды / таблетки обеззараживания",
        "Пограничный пропуск и паспорт (для погранзон)",
        "Офлайн навигация + запасной бумажный трек",
      ],
      kg: [
        "Термоич кийим топтому жана жылуу пуховик",
        "0°C чейинки жылуу уктоочу кап (спальник)",
        "Суу фильтри же тазалоочу таблеткалар",
        "Чек ара кагазы жана паспорт",
        "Оффлайн навигация жана кагаз карта",
      ],
      en: [
        "Thermal underwear set & insulated down jacket",
        "Sleeping bag rated 0°C to -5°C comfort",
        "Water filtration device / purification tablets",
        "Border zone permit & ID passport",
        "Offline GPS & printed backup map",
      ],
    },
    suitableFor: {
      ru: "Озеро Кель-Суу (Нарын), перевал Ала-Кёль, озеро Сон-Куль (пеший переход), высотные тропы Алая",
      kg: "Көл-Суу (Нарын), Ала-Көл ашуусу, Соң-Көл жөө каттамы, Алай",
      en: "Lake Kel-Suu (Naryn), Ala-Kul Pass, Lake Son-Kul trek, Alay trails",
    },
  },
  {
    id: "expert",
    badge: {
      ru: "Альпинизм / Эксперт",
      kg: "Альпинизм / Эксперт",
      en: "Alpine / Expert",
    },
    title: {
      ru: "Ледниковые восхождения и категорийные перевалы",
      kg: "Мөңгүлөргө чыгуу жана татаал ашуулар",
      en: "Glacier Ascents & Technical Passes",
    },
    duration: {
      ru: "2–5 дней (высота 3800–4800м+)",
      kg: "2–5 күн (3800–4800м+ бийиктик)",
      en: "2–5 days (altitude 3,800–4,800m+)",
    },
    elevation: {
      ru: "Перепад высот: 1500+ м",
      kg: "Бийиктик айырмасы: 1500+ м",
      en: "Elevation gain: 1,500+ m",
    },
    description: {
      ru: "Ледники, трещины, движение в связках и использование специального альпинистского снаряжения. Только в сопровождении гида KMGA/IFMGA.",
      kg: "Мөңгүлөр, жаракалар, аркан менен байланып жүрүү. KMGA/IFMGA сертификаты бар гид менен гана мүмкүн.",
      en: "Glaciers, crevasses, roped team movement, and specialized alpine gear. Only accessible with certified KMGA/IFMGA mountain guides.",
    },
    requiredGear: {
      ru: [
        "Каска, страховочная система и ледоруб",
        "Кошки альпинистские и карабины",
        "Высотные жесткие ботинки под кошки",
        "Спутниковый SOS-трекер (Garmin inReach)",
        "Расширенная высотная аптечка",
      ],
      kg: [
        "Каска, коопсуздук куру жана муз чапкыч",
        "Альпинисттик мыктар (кошки) жана карабиндер",
        "Катуу атайын ботинкалар",
        "Спутниктик SOS-трекер",
        "Кеңейтилген бийик тоо аптечкасы",
      ],
      en: [
        "Climbing helmet, harness, and ice axe",
        "Mountaineering crampons & locking carabiners",
        "Rigid crampon-compatible alpine boots",
        "Satellite SOS communicator (Garmin inReach)",
        "Comprehensive high-altitude medical kit",
      ],
    },
    suitableFor: {
      ru: "Пик Учитель (4540м), Пик Корона, ледник Аксай, ледниковые перевалы Центрального Тянь-Шаня",
      kg: "Мугалим чокусу (4540м), Корона чокусу, Ак-Сай мөңгүсү",
      en: "Peak Uchitel (4,540m), Peak Korona, Ak-Sai Glacier",
    },
  },
];

export const DEFAULT_PDF_RESOURCES: import("@/types/guidebook.types").PdfResourceItem[] = [
  {
    id: "pdf-travelers",
    title: {
      ru: "Путеводитель для женщин-путешественниц",
      kg: "Саякатчы аялдар үчүн жол көрсөткүч",
      en: "Guidebook for Solo & Female Travelers",
    },
    description: {
      ru: "Полный справочник по безопасности, проверенным местам отдыха, подготовке к горам и культурным особенностям Кыргызстана.",
      kg: "Кыргызстандагы коопсуздук, текшерилген эс алуу жайлары, тоого даярдык жана маданий өзгөчөлүктөр боюнча толук колдонмо.",
      en: "Comprehensive manual covering safety, verified stays, mountain prep, and cultural insights across Kyrgyzstan.",
    },
    fileSize: "PDF • 2.4 MB",
    badge: {
      ru: "Для путешественниц",
      kg: "Саякатчылар үчүн",
      en: "For Travelers",
    },
    fileUrl: "https://drive.google.com/file/d/1DemoAiymPathTravelersGuide2026/view?usp=sharing",
  },
  {
    id: "pdf-guides",
    title: {
      ru: "Пособие для женщин-гидов",
      kg: "Аял-гиддер үчүн колдонмо",
      en: "Handbook for Female Mountain Guides",
    },
    description: {
      ru: "Стандарты ведения групп, протоколы первой помощи в высокогорье, этика общения и управление рисками на сложных треках.",
      kg: "Топторду жетектөө стандарттары, бийик тоодогу алгачкы медициналык жардам протоколдору жана тобокелдиктерди башкаруу.",
      en: "Group leadership standards, high-altitude first aid protocols, communication ethics, and mountain risk management.",
    },
    fileSize: "PDF • 3.1 MB",
    badge: {
      ru: "Для гидов",
      kg: "Гиддер үчүн",
      en: "For Mountain Guides",
    },
    fileUrl: "https://drive.google.com/file/d/1DemoAiymPathGuidesHandbook2026/view?usp=sharing",
  },
  {
    id: "pdf-providers",
    title: {
      ru: "Пособие для поставщиков услуг",
      kg: "Кызмат көрсөтүүчүлөр үчүн колдонмо",
      en: "Manual for Tourism Service Providers",
    },
    description: {
      ru: "Руководство для гостевых домов, отелей, CBT и водителей по внедрению стандартов гендерной инклюзивности и безопасности Aiym Path.",
      kg: "Aiym Path гендердик инклюзивдүүлүк жана коопсуздук стандарттарын киргизүү боюнча конок үйлөр, мейманканалар жана айдоочулар үчүн колдонмо.",
      en: "Guidelines for guesthouses, CBT hosts, and drivers on adopting Aiym Path gender-inclusive safety standards.",
    },
    fileSize: "PDF • 1.9 MB",
    badge: {
      ru: "Для бизнеса и CBT",
      kg: "Бизнес жана CBT үчүн",
      en: "For Guesthouses & CBT",
    },
    fileUrl: "https://drive.google.com/file/d/1DemoAiymPathProvidersManual2026/view?usp=sharing",
  },
];

