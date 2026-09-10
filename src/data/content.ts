import { ASSETS, asset, videoAsset } from "./site";

export const pageMeta: Record<
  string,
  { title: string; description: string; path: string }
> = {
  home: {
    title: "מיטל גוטמן שקד - מספרת נומרולוגיה | נומרולוגית",
    description:
      "אני מיטל גוטמן שקד ואני נומרולוגית.. אני יוצרת מפה נומרולוגית ועובדת גם בנומרולוגיה מערבית וגם נומרולוגיה קבלית. אני עוזרת לאנשים לקבל החלטות בצמתים של החיים. אשמח לשוחח אתכם",
    path: "/",
  },
  about: {
    title: "אודות | מספרת נומרולוגיה",
    description: "נעים מאוד, שמי מיטל ואני נשואה ליניב ואמא לשלושה ילדים מקסימים.",
    path: "/אודות",
  },
  workshops: {
    title: "סדנאות | מספרת נומרולוגיה",
    description:
      "לא משנה מה האירוע שלכם- ערב בנות מעצים, אירוע חברה מעשיר, מסיבת הפתעה לסבתא, מסיבת רווקות לחברה הכי טובה, ריטריט מואר או אפילו הרצאה מעוררת השראה לנוער",
    path: "/סדנאות",
  },
  consultation: {
    title: "ייעוץ וטיפול | מספרת נומרולוגיה",
    description:
      "בכל תהליך ייעוץ נומורולוגי אכיר לכם בין היתר, את שיעור הנשמה האישי שלכם, מהו הייעוד, מה משמעות יום הלידה שלכם, שמכם ועוד",
    path: "/ייעוץ",
  },
  gift: {
    title: "שובר מתנה | מספרת נומרולוגיה",
    description:
      "מוזמנים להעניק ליקירכם שובר מתנה למפגש של ייעוץ נומרולוגי מעצים ומרגש!",
    path: "/gift",
  },
  testimonials: {
    title: "המלצות | מספרת נומרולוגיה",
    description: "הדף מציג המלצות של לקוחות רבים שעבדתי איתם",
    path: "/המלצות",
  },
  contact: {
    title: "צור קשר | מספרת נומרולוגיה",
    description: "מעניין אותך לשמוע עוד? אני מזמינה אתכם ליצור קשר",
    path: "/צור-קשר",
  },
  accessibility: {
    title: "הצהרת נגישות | מספרת נומרולוגיה",
    description:
      "הנגשת האתר נועדה להפוך אותו לזמין, ידידותי ונוח יותר לשימוש עבור אנשים עם צרכים מיוחדים.",
    path: "/הצהרת-נגישות",
  },
  privacy: {
    title: "מדיניות פרטיות | מספרת נומרולוגיה",
    description:
      "מטרת מדיניות הפרטיות היא להסביר מהם נוהלי האתר של מיטל גוטמן שקד - מספרת נומרולוגיה",
    path: "/מדיניות-פרטיות",
  },
};

export const aboutParagraphs = [
  "נעים מאוד, שמי מיטל ואני נשואה ליניב ואמא לשלושה ילדים מקסימים.",
  "אם הייתם מספרים לי לפני כמה שנים שאעסוק אי פעם בנומורולוגיה, הייתי כנראה חושבת שהשתגעתם.",
  "אני? שכל כך סלדתי ממתמטיקה כל חיי?",
  "אני? שרק ראיתי מספרים וקיבלתי חום?",
  "אני? אני בכלל מחזאית...",
  "אבל רצה הגורל ומצאתי את עצמי סקרנית ומאושרת בלימודי הנומורולוגיה.",
  "וכך, גיליתי שהמספרים הם לא רק חיבור וחיסור, הם בעצם סיפור.",
  "עולם שלם מופלא ואינסופי שמדייק את מהותנו, מחזק את בחירותנו ומכוון תמיד להקשבה לרצון הלב.",
  "מזמינה אתכם לצאת איתי למסע מופלא בו תוכלו להכיר, לגלות ולאהוב את עצמכם מחדש, לדייק, לחזק ולקדם את בחירותיכם והחלטותיכם, נדבר על מה שהכי בוער בכם כעת, בנושאים שונים כמו: זוגיות, הורות, מערכות יחסים בכלל, קריירה, מעברים וכו.",
  "מחכה להתרגש ביחד אתכם, מיטל",
];

export const certificates = [
  {
    src: asset("44c6b1_edb6f81c1ce94677b2e9e39f7ca0c750~mv2.jpg"),
    alt: "מוסמכת בנומרולוגיה טיפולית",
  },
  {
    src: asset("44c6b1_10185c17c2b14df58c0eacbd85e09bc0~mv2.jpg"),
    alt: "מומחה בנומרולוגיה טיפולית",
  },
  {
    src: asset("44c6b1_a79985248f354c20963eb0f21d52db20~mv2.jpg"),
    alt: "מאסטר חוזה הנשמה",
  },
  {
    src: asset("44c6b1_1a5ee1d95ff54f62b7705a8f377b67b2~mv2.jpg"),
    alt: "מסטר חוזה הנשמה",
  },
  {
    src: asset("44c6b1_f0afa944ff7e4829ac6f3dd803885415~mv2.jpg"),
    alt: "על טבעי",
  },
];

export const consultationCopy = {
  paragraphs: [
    "בכל תהליך ייעוץ נומורולוגי אכיר לכם בין היתר, את שיעור הנשמה האישי שלכם, מהו הייעוד, מה משמעות יום הלידה שלכם, שמכם ועוד..",
    "בנוסף, נדבר על השנה האישית שלכם- לצד עיתויים חשובים נוספים וכל זאת ע\"פ מפת הנומורולוגיה המערבית והנומורולוגיה הקבלית.",
    "אבל הכי חשוב- אדייק ואחזק את בחירותיכם והחלטותיכם, כך שתצאו מהמפגש באורות ובחוויה מעצימה ובלתי נשכחת.",
    "וגם-",
    "בעלי עסק? ידעתם שבתאריך הלידה שלכם נמצאים קהל הלקוחות שלכם? הדרך המדוייקת לפנות אליהם? וגם שם העסק, הצבע, הלוגו, ימי השיא המוצלחים שלכם לעבודה ואפילו תמחור המוצרים? כן, אני יודעת שזה נשמע מטורף - אבל ייעוץ עסקי לפי תאריך הלידה הוא פשוט מדוייק, ממוקד ופרקטי!",
  ],
  gallery: [
    {
      src: asset("44c6b1_f37c302a44d14d6d822b5c698d317b8d~mv2.jpg"),
      alt: "סדנאות נומרולוגיה",
    },
    {
      src: asset("44c6b1_22b20e7c53d04798ae9d8696bdf6cec8~mv2.jpg"),
      alt: "סדנאות נומרולוגיה",
    },
    {
      src: asset("44c6b1_aacb345c1b44450e9d76c4c6fd38b3ca~mv2.jpg"),
      alt: "סדנאות נומרולוגיה",
    },
  ],
  pastLife: {
    title: "טיפול בשחזור גלגולים",
    lead: "חדש! שיחרור חסמים ופחדים בשיחזור גלגולים דרך הנומרולוגיה!",
    paragraphs: [
      "במיוחד לכל מי שמרגיש קושי בשחרור: כאב, תקיעות, תסכול ודפוסים החוזרים שוב ושוב.",
      "מוזמנים למסע מרפא שישחרר ויפגיש אתכם מחדש עם הידיעה הפנימית.",
    ],
    image: {
      src: ASSETS.pastLife,
      alt: "שחרור חסמים ופחדים",
      objectPosition: "32% 26%",
    },
  },
};

export const giftCopy =
  "חוגגת למישהו/י יקר/ה? רוצה לפנק אותו/אותה במסאג' לנשמה? מוזמנים להעניק ליקירכם שובר מתנה למפגש של ייעוץ נומרולוגי מעצים ומרגש! כזה שיגרום להם להזכר במהותם, לדייק את דרכם ולהתאהב בעצמם מחדש ולצאת עם בהירות ושמחה להמשך מסע החיים.";

export const workshopsIntro = [
  "לא משנה מה האירוע שלכם- ערב בנות מעצים, אירוע חברה מעשיר, מסיבת הפתעה לסבתא, מסיבת רווקות לחברה הכי טובה, ריטריט מואר או אפילו הרצאה מעוררת השראה לנוער, אני מגיעה לכולכם עם שלל הרצאות מותאמות, מרתקות, מעשירות וייחודיות אשר נשארות כחוויה בלתי נשכחת גם הרבה אחרי.",
  "דברו איתי וביחד נרקח לכבודכם את המפגש שיהיה עבורכם הכי הכי!",
];

export const clientLogos = [
  { src: asset("44c6b1_fc494b3665994ae68baec77fa53c31fe~mv2.jpeg"), alt: "לוגו תנובה" },
  { src: asset("44c6b1_63c7d695f1bd4a8ebc5da01d6dcf33f9~mv2.jpeg"), alt: "לוגו  MEDASSIST" },
  { src: asset("44c6b1_e3908b7af5904b77ac689d773f965bfb~mv2.jpeg"), alt: "לוגו מנורה" },
  { src: asset("44c6b1_60be8d5dcec244f6901e046c516d5fbd~mv2.jpeg"), alt: "לוגו ענבי ציון" },
  { src: asset("44c6b1_830047cea8634f53ac657dd8ed85e306~mv2.jpeg"), alt: "לוגו מכבי טבעי" },
  { src: asset("44c6b1_9dc1dd5140aa413da88708d553154097~mv2.jpeg"), alt: "אמן" },
];

/** Category jump cards — kept for assets/reference; UI removed per client */
export const workshopNavCards = [
  { id: "mothers", title: "בוקר אמהות", icon: `${asset("workshop-cats/mothers.svg")}?v=2` },
  { id: "bachelorette", title: "מסיבת רווקות", icon: `${asset("workshop-cats/bachelorette.svg")}?v=2` },
  { id: "home-circles", title: "חוגי בית, ימי הולדת ומפגשי גיבוש", icon: `${asset("workshop-cats/home-circles.svg")}?v=2` },
  { id: "retreats", title: "ריטריטים", icon: `${asset("workshop-cats/retreats.svg")}?v=2` },
  { id: "company", title: "ארועי חברה וסדנאות", icon: `${asset("workshop-cats/company.svg")}?v=2` },
] as const;

export const workshopCategories = [
  {
    id: "company",
    title: "ארועי חברה וסדנאות",
    band: "section" as const,
    images: [
      { src: asset("44c6b1_ebff3898554d431f9cbde45127becdfd~mv2.jpeg"), alt: "סדנת נומרולוגיה באירוע חברה", objectPosition: "41% 53%" },
      { src: asset("44c6b1_a7a7905f01e24825b5284934d408a917~mv2.jpeg"), alt: "סדנת נומרולוגיה באירוע חברה", objectPosition: "56% 54%" },
      { src: asset("44c6b1_7554df53ff9747aa8c73059915031497~mv2.jpg"), alt: "סדנת נומרולוגיה בחברת הייטק", objectPosition: "40% 49%" },
      { src: asset("44c6b1_f434e7acf4f0490fbf9f064a53ba7aea~mv2.jpg"), alt: "סדנת נומרולוגיה ארועי חברה", objectPosition: "66% 42%" },
      { src: asset("44c6b1_9e9bf8648e1848598894441565c3c123~mv2.jpg"), alt: "סדנת נומרולוגיה במכבי טבעי מודיעין", objectPosition: "23% 8%" },
      { src: asset("44c6b1_311ac871458e4061b3f6773737caf372~mv2.jpeg"), alt: "סדנת נומרולוגיה ארועי חברה", objectPosition: "45% 49%" },
      { src: asset("44c6b1_29bbc28e2f6f430199cf6600a3fdecb6~mv2.jpeg"), alt: "סדנת נומרולוגיה ארועי חברה", objectPosition: "49% 47%" },
      { src: asset("44c6b1_bdbac2ebda434df9a741508a613c22b7~mv2.jpeg"), alt: "סדנת נומרולוגיה ארועי חברה", objectPosition: "18% 44%" },
      { src: asset("44c6b1_d9ec7520ba814273a4012b866fab34bf~mv2.jpeg"), alt: "סדנת נומרולוגיה ארועי חברה", objectPosition: "86% 55%" },
      { src: asset("44c6b1_8ffb9f49eb804c009c873b5c4d951a89~mv2.jpeg"), alt: "סדנת נומרולוגיה ארועי חברה", objectPosition: "29% 58%" },
      { src: asset("5acc8b_775da926a41f409d942c592b18ddc3d2~mv2.jpeg"), alt: "סדנת נומרולוגיה ארועי חברה", objectPosition: "46% 21%" },
      { src: asset("44c6b1_e61792920b054c4a8fb0ae4950e28c46~mv2.jpg"), alt: "ארועי חברה וסדנאות נומרולוגיה" },
      { src: asset("44c6b1_bd3619eeda174dbebbd37fd458155c94~mv2.jpg"), alt: "ארועי חברה וסדנאות נומרולוגיה" },
    ],
  },
  {
    id: "retreats",
    title: "ריטריטים",
    band: "section" as const,
    images: [
      { src: asset("44c6b1_30a35a2d66e2496b8c8e18197c3a2c01~mv2.jpg"), alt: "הדרכת נומרולוגיה" },
      { src: asset("44c6b1_022d3a4733114e9dbd0394a7a0af7d78~mv2.jpg"), alt: "הדרכת נומרולוגיה מספרים" },
      { src: asset("44c6b1_f20d5aa9174a4b398d998dada3da6b3c~mv2.jpg"), alt: "הדרכת נומרולוגיה" },
    ],
  },
  {
    id: "home-circles",
    title: "חוגי בית, ימי הולדת ומפגשי גיבוש",
    band: "section-short" as const,
    images: [
      { src: asset("44c6b1_88a240aae49343d8916a4511c7d91698~mv2.jpeg"), alt: "סדנת נומרולוגיה ביום הולדת", objectPosition: "51% 37%" },
      { src: asset("44c6b1_cf56cda3b6624636afc8090f07a3c6e3~mv2.jpeg"), alt: "חוגי בית נומרולוגיה", objectPosition: "28% 21%" },
      { src: asset("44c6b1_0466121c97324c58ab38dbaee8610f7a~mv2.jpeg"), alt: "חוגי בית נומרולוגיה", objectPosition: "52% 46%" },
      { src: asset("44c6b1_49497ffd40d9454b97f01e4485279621~mv2.jpeg"), alt: "חוג בית נומרולוגיה", objectPosition: "49% 28%" },
      { src: asset("44c6b1_9eb25c5e240d432e8a6a198bf67dedd3~mv2.jpeg"), alt: "חוג בית נומרולוגיה", objectPosition: "44% 28%" },
      { src: asset("44c6b1_6cc5119701dc45b7b8f2d6ca6aa696c4~mv2.jpeg"), alt: "סדנת נומרולוגיה" },
      { src: asset("44c6b1_cd0be8b7f093415381bc11c0d68af0c4~mv2.jpeg"), alt: "חגיגות יום הולדת עם הרצאת נומרולוגיה", objectPosition: "51% 65%" },
      { src: asset("44c6b1_c37979a2d5254601bc2346593e04e2ce~mv2.jpeg"), alt: "סדנת נומרולוגיה", objectPosition: "50% 44%" },
      { src: asset("44c6b1_a6aae4a3246f49909002d880c09a440a~mv2.jpeg"), alt: "סדנת נומרולוגיה", objectPosition: "39% 21%" },
      {
        src: asset("44c6b1_141ac5afeb3a4d3d92207865cf6891d0f003.jpg"),
        alt: "חגיגות יום הולדת",
        video: videoAsset("workshop-home-circles.mp4"),
      },
      { src: asset("44c6b1_ed285f6f166b423db80dcd8b56327bcf~mv2.jpg"), alt: "חגיגות יום הולדת", objectPosition: "44% 43%" },
      { src: asset("44c6b1_9a0613bd85a84c049db946c0745aab61~mv2.jpg"), alt: "חגיגות יום הולדת" },
      { src: asset("5acc8b_7f97f7fb8be44fec9275f932b1804cea~mv2.jpeg"), alt: "חגיגות יום הולדת עם הרצאת נומרולוגיה", objectPosition: "38% 65%" },
      { src: asset("44c6b1_7aab1fbbf89f417ab40dfd5e471afd2b~mv2.jpg"), alt: "נומרולוגיה ביום הולדת" },
      { src: asset("5acc8b_4077f476ca3e485594787284e1816ffa~mv2.jpg"), alt: "נומרולוגיה ביום הולדת" },
      { src: asset("5acc8b_6a01d9c1673c460d8f3794bb888fea38~mv2.jpeg"), alt: "נומרולוגיה הרצאה באירוע בתי" },
      { src: asset("5acc8b_d1af2827431a482996b67c9838f545e4~mv2.jpeg"), alt: "נומרולוגיה הרצאה באירוע בתי" },
      { src: asset("44c6b1_f2c9a910853f4f1c98650ee8c1dee2a7~mv2.jpg"), alt: "חגיגות יום הולדת עם הרצאת נומרולוגיה" },
      { src: asset("5acc8b_7816f6c358a64fe994ed67b98689c696~mv2.jpeg"), alt: "חגיגות יום הולדת עם הרצאת נומרולוגיה" },
      { src: asset("44c6b1_f6faa1cf50e540ba85f8db7c3c869824~mv2.jpeg"), alt: "חגיגות יום הולדת עם הרצאת נומרולוגיה", objectPosition: "56% 40%" },
      { src: asset("44c6b1_17083551923d4c389a903bc5a3333150~mv2.jpeg"), alt: "ארועי חברה וסדנאות נמורולוגיה" },
      { src: asset("44c6b1_0246bd6dcd404e70a80371a2961e3692~mv2.jpeg"), alt: "נמורולוגיה סדנא כפית בחגיגת יום הולדת", objectPosition: "59% 30%" },
      { src: asset("44c6b1_942442b85ef642b4add7e70a558eeb3a~mv2.jpeg"), alt: "שיעור בנמורולוגיה ביום הולדת", objectPosition: "44% 35%" },
      { src: asset("44c6b1_cf5652aba526422b94bea6811a286d88~mv2.jpeg"), alt: "ארועי חברה וסדנאות נמורולוגיה", objectPosition: "29% 28%" },
      { src: asset("44c6b1_c6039431f8bc4dd4a41f025d1e3c777d~mv2.jpeg"), alt: "ארועי חברה וסדנאות נומרולוגיה" },
    ],
  },
  {
    id: "bachelorette",
    title: "מסיבת רווקות",
    band: "section-short" as const,
    gallery: "compact" as const,
    images: [
      { src: asset("44c6b1_6f103c96015245528ae4ba6b1c30fc47~mv2.jpg"), alt: "ערב של מסיבת רווקות" },
      { src: asset("44c6b1_b9b85fb1499149949c14bf6eb4952a8d~mv2.jpeg"), alt: "סדנת נומרולוגיה" },
      { src: asset("44c6b1_91f609312af34222999f4933296b9e49~mv2.png"), alt: "סדנת נומרולוגיה במסיבת רווקות", objectPosition: "81% 55%" },
    ],
  },
  {
    id: "mothers",
    title: "בוקר אמהות",
    band: "section-short" as const,
    gallery: "compact" as const,
    images: [
      { src: asset("5acc8b_522d118f2a134705ae0bf108f14bfad7~mv2.jpeg"), alt: "ערב של מסיבת רווקות עם מיטל גוטמן שקד" },
      { src: asset("5acc8b_84406c4745e14d1ca474e39692b48f57~mv2.jpeg"), alt: "ערב של מסיבת רווקות עם מיטל גוטמן שקד" },
      { src: asset("5acc8b_4d244493761448c4b4987d75165a7a15~mv2.jpeg"), alt: "ערב של מסיבת רווקות נומרולוגיה מספרים" },
    ],
  },
] as const;
