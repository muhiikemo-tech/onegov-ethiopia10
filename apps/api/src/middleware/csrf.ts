import csurf from "csurf";

export const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    domain: process.env.COOKIE_DOMAIN,
  },
});

export function csrfToken(req: any, res: any) {
  res.json({ csrfToken: req.csrfToken() });
}
