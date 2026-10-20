export type Locale = "en" | "am" | "om";
export type Role = "citizen" | "officer" | "reviewer" | "admin";

export interface User {
  id: string;
  faydaId?: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: Role;
  locale: Locale;
  verified: boolean;
}

export type ApplicationStatus =
  | "submitted"
  | "in_review"
  | "needs_info"
  | "approved"
  | "rejected"
  | "completed";
