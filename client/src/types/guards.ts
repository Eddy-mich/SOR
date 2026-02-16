import { Poll } from "./interfaces.ts";

export function isPoll(obj: unknown): obj is Poll {
  if (typeof obj !== "object" || obj === null) return false;

  const p = obj as Record<string, unknown>;

  return (
    typeof p.id_sondage === "string" &&
    typeof p.titre === "string" &&
    typeof p.text_description === "string" &&
    typeof p.date_creation === "string" &&
    typeof p.date_expiration === "string" &&
    (p.statut === "actif" || p.statut === "inactif") &&
    (typeof p.id_mail === "string" || p.id_mail === null)
  );
}
