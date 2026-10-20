import { Router } from "express";

export const supportRouter = Router();

const FAQ = [
  {
    id: "1",
    q: { en: "How do I sign in?", am: "እንዴት እገባለሁ?", om: "Akkamitti seena?" },
    a: {
      en: "Use your Fayda digital ID to sign in.",
      am: "በፋይዳ ዲጂታል መታወቂያዎ ይግቡ።",
      om: "Eenyummaa dijitaalaa Faydaan seeni.",
    },
  },
  {
    id: "2",
    q: { en: "How long does processing take?", am: "ሂደቱ ምን ያህል ጊዜ ይወስዳል?", om: "Adeemsi hangam fudhata?" },
    a: {
      en: "Depends on the service; it is shown on the service detail page.",
      am: "በአገልግሎቱ ይወሰናል፤ በአገልግሎት ገጹ ላይ ይታያል።",
      om: "Tajaajila irratti hundaa'a; fuula tajaajila irratti mul'ata.",
    },
  },
];

supportRouter.get("/faq", (_req, res) => {
  res.json(FAQ);
});
