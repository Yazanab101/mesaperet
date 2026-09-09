export const WHATSAPP_URL = "https://wa.me/+972527500098";
export const WHATSAPP_DISPLAY = "052-7500098";
export const FACEBOOK_URL = "https://www.facebook.com/meytal.guttmanshaked";
export const EMAIL = "kitkatmm@gmail.com";
export const SEGEV_URL = "https://www.segevdigital.co.il";
export const SITE_NAME = "מיטל גוטמן שקד - מספרת נומרולוגיה";

export const ROUTES = {
  home: "/",
  about: "/אודות",
  workshops: "/סדנאות",
  consultation: "/ייעוץ",
  gift: "/gift",
  testimonials: "/המלצות",
  contact: "/צור-קשר",
  accessibility: "/הצהרת-נגישות",
  privacy: "/מדיניות-פרטיות",
} as const;

export const NAV_ITEMS = [
  { label: "בית", to: ROUTES.home },
  { label: "אודות", to: ROUTES.about },
  { label: "סדנאות", to: ROUTES.workshops },
  { label: "ייעוץ וטיפול", to: ROUTES.consultation },
  { label: "שובר מתנה", to: ROUTES.gift },
  { label: "המלצות", to: ROUTES.testimonials },
  { label: "צור קשר", to: ROUTES.contact },
] as const;

export const FOOTER_LEGAL = [
  { label: "הצהרת נגישות", to: ROUTES.accessibility },
  { label: "מדיניות פרטיות", to: ROUTES.privacy },
] as const;

export function asset(id: string): string {
  const base = import.meta.env.BASE_URL || "/";
  return `${base}assets/images/${id.replace(/~/g, "-")}`;
}

export function videoAsset(id: string): string {
  const base = import.meta.env.BASE_URL || "/";
  return `${base}assets/videos/${id}`;
}

export const ASSETS = {
  logo: asset("44c6b1_b2cda2c5e1a04c41b82f23798b40eb4c~mv2.png"),
  bannerMagic: asset("44c6b1_5bdd566bb84b4832937af1d4eb4e19e2~mv2.png"),
  salon: asset("44c6b1_10f1b5922ba145c394d3f34f70e4a820~mv2.png"),
  workshopsCircle: asset("44c6b1_0ddc95d3a86d4b05af6b3581283de31c~mv2.png"),
  chairLeft: asset("44c6b1_574579e277144f9a89863710fc70f3cc~mv2.png"),
  chairRight: asset("44c6b1_71326677b0434f4b9f10aff22a384c9d~mv2.png"),
  portraitHome: asset("44c6b1_03ac711762a844f28ac106bee24f6642~mv2.png"),
  contactOrb: asset("44c6b1_7a1fb78d838349dca980081907b95c30~mv2.png"),
  plant: asset("44c6b1_7fffbc4591f143baa4c1e7a74a1660b3~mv2.png"),
  bookRecs: asset("44c6b1_2bbede6699704c909a004d1c4e2387ae~mv2.png"),
  giftCardHome: asset("44c6b1_9616ba53425c449b8a76947d47141bcc~mv2.png"),
  aboutPortrait: asset("44c6b1_9d5178ba04264d69a3e2d7dd2401fc55~mv2.jpg"),
  giftVoucher: asset("44c6b1_5b6e5a78cb0a486c9cc2ac17d555f4f6~mv2.jpg"),
  consultationMain: asset("44c6b1_8862bb24c91048d79934a925b5e671a8~mv2.jpeg"),
  pastLife: asset("44c6b1_2e18af6245da4c5d9e96e60c8e20e55e~mv2.jpg"),
  socialFacebook: asset("social-facebook.png"),
  socialWhatsapp: asset("social-whatsapp.png"),
} as const;
