export const translations = {
  en: {
    "nav.services": "Services",
    "nav.track": "Track",
    "nav.support": "Support",
    "nav.signin": "Sign In",
    "home.title": "One Platform. All Government Services.",
    "home.subtitle": "Secure, fast, and unified access to Ethiopian government services via Fayda eKYC.",
    "home.signin": "Sign in with Fayda",
    "home.explore": "Explore Services",
    "services.title": "Government Services",
    "services.subtitle": "Browse and apply for MESOB services.",
    "services.search": "Search services...",
    "services.fee": "Fee",
    "services.days": "Days",
    "services.view": "View Details",
  },
  am: {
    "nav.services": "አገልግሎቶች",
    "nav.track": "መከታተያ",
    "nav.support": "ድጋፍ",
    "nav.signin": "ይግቡ",
    "home.title": "አንድ መድረክ። ሁሉም የመንግስት አገልግሎቶች።",
    "home.subtitle": "በፋይዳ ዲጂታል መታወቂያ አማካኝነት የመንግስት አገልግሎቶችን በደህንነት ያግኙ።",
    "home.signin": "በፋይዳ ይግቡ",
    "home.explore": "አገልግሎቶችን ያስሱ",
    "services.title": "የመንግስት አገልግሎቶች",
    "services.subtitle": "የMESOB አገልግሎቶችን ያስሱ እና ያመልክቱ።",
    "services.search": "አገልግሎቶችን ይፈልጉ...",
    "services.fee": "ክፍያ",
    "services.days": "ቀናት",
    "services.view": "ዝርዝር ይመልከቱ",
  },
  om: {
    "nav.services": "Tajaajila",
    "nav.track": "Hordoffii",
    "nav.support": "Deeggarsa",
    "nav.signin": "Seeni",
    "home.title": "Waltajjii Tokko. Tajaajila Mootummaa Hunda.",
    "home.subtitle": "Tajaajila mootummaa Itoophiyaa eenyummaa dijitaalaa Faydaan nageenyaan argadhu.",
    "home.signin": "Faydaan Seeni",
    "home.explore": "Tajaajila Ilaali",
    "services.title": "Tajaajila Mootummaa",
    "services.subtitle": "Tajaajila MESOB ilaaliitii iyyadhu.",
    "services.search": "Tajaajila barbaadi...",
    "services.fee": "Kaffaltii",
    "services.days": "Guyyaa",
    "services.view": "Bal'ina Ilaali",
  }
};

export type Locale = "en" | "am" | "om";

export function getLang(): Locale {
  return (localStorage.getItem("lang") as Locale) || "en";
}

export function t(key: string): string {
  const lang = getLang();
  return (translations[lang] as any)[key] || key;
}
