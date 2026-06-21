export type UserRole = "ADMIN" | "BISPADO";

export const UserRole = {
  ADMIN: "ADMIN",
  BISPADO: "BISPADO",
} as const satisfies Record<string, UserRole>;
