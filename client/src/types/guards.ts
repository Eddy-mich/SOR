import { Poll } from "./interfaces.ts";

export function isPoll(obj: any): obj is Poll {
  return (
    obj &&
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    typeof obj.description === "string" &&
    typeof obj.createdAt === "string" &&
    typeof obj.expiresAt === "string" &&
    typeof obj.statut === "string" &&
    Array.isArray(obj.options) &&
    obj.options.every(
      (opt: any) =>
        typeof opt.id === "string" &&
        typeof opt.text === "string"
    )
  );
}

