export type UserRole = "ADMIN" | "BISPADO" | "CONSELHEIRO";

export const UserRole = {
  ADMIN: "ADMIN",
  BISPADO: "BISPADO",
  CONSELHEIRO: "CONSELHEIRO",
} as const satisfies Record<string, UserRole>;

export function roleLabel(role: UserRole) {
  if (role === UserRole.BISPADO) return "Bispado";
  if (role === UserRole.CONSELHEIRO) return "Conselheiro";
  return "Administrador";
}
