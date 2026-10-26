// lib/roles.ts
// Centralized Role and Authorization Management for RoomFinder

export const SUPER_ADMIN_EMAIL = "lenkariteshkumar2005@gmail.com";

export type UserRole = "student" | "owner" | "maushi" | "admin";

/**
 * Checks if the given email corresponds to the hardcoded Super Admin.
 */
export function isSuperAdmin(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}

/**
 * Determines the normalized role of a user from Supabase auth object.
 * Priority:
 * 1. Super Admin email match -> 'admin'
 * 2. user_metadata.role ('owner' | 'maushi' | 'student')
 * 3. Default fallback -> 'student' (Tenant / Renter)
 */
export function getUserRole(user: any): UserRole {
  if (!user) return "student";
  if (isSuperAdmin(user.email)) {
    return "admin";
  }
  const role = (user.user_metadata?.role || "").toString().toLowerCase().trim();
  if (role === "owner" || role === "property_owner") return "owner";
  if (role === "maushi" || role === "helper" || role === "domestic_helper") return "maushi";
  return "student"; // Default normal user / tenant
}

/**
 * Returns human-readable role title
 */
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case "admin":
      return "Super Admin";
    case "owner":
      return "Property Owner";
    case "maushi":
      return "Domestic Helper";
    case "student":
    default:
      return "Tenant / User";
  }
}

/**
 * Returns the target dashboard URL for a given user or role.
 */
export function getDashboardUrl(userOrRole: any): string {
  const role: UserRole = typeof userOrRole === "string" 
    ? (userOrRole as UserRole)
    : getUserRole(userOrRole);

  switch (role) {
    case "admin":
      return "/dashboard/admin";
    case "owner":
      return "/owner/dashboard";
    case "maushi":
      return "/dashboard/helper";
    case "student":
    default:
      return "/dashboard/tenant";
  }
}
