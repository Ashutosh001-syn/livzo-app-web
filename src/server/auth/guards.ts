import type { UserRole } from "@/types/user";
import type { SessionPrincipal } from "@/server/auth/sessions";

export function hasRole(principal: SessionPrincipal, allowedRoles: readonly UserRole[]) {
  return allowedRoles.includes(principal.role);
}

export function requireRole(principal: SessionPrincipal | null, allowedRoles: readonly UserRole[]) {
  if (!principal || !hasRole(principal, allowedRoles)) {
    throw new Error("FORBIDDEN");
  }
  return principal;
}
