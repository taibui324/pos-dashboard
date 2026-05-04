export type AccountRole = "daspace_admin" | "brand_user";
export type AccountStatus = "active" | "disabled" | "invited";

export type AccountProfile = {
  userId: string;
  email: string;
  role: AccountRole;
  status: AccountStatus;
  brandId: string | null;
  createdByAdmin: boolean;
};

export type DashboardAccess =
  | {
      allowed: true;
      scope: "admin";
      userId: string;
      email: string;
    }
  | {
      allowed: true;
      scope: "brand";
      userId: string;
      email: string;
      brandId: string;
    }
  | {
      allowed: false;
      reason: "missing_profile" | "inactive_account" | "missing_brand_assignment" | "unmanaged_account";
    };

export function resolveDashboardAccess(profile: AccountProfile | null): DashboardAccess {
  if (!profile) {
    return { allowed: false, reason: "missing_profile" };
  }

  if (profile.status !== "active") {
    return { allowed: false, reason: "inactive_account" };
  }

  if (profile.role === "daspace_admin") {
    return {
      allowed: true,
      scope: "admin",
      userId: profile.userId,
      email: profile.email
    };
  }

  if (!profile.brandId) {
    return { allowed: false, reason: "missing_brand_assignment" };
  }

  if (!profile.createdByAdmin) {
    return { allowed: false, reason: "unmanaged_account" };
  }

  return {
    allowed: true,
    scope: "brand",
    userId: profile.userId,
    email: profile.email,
    brandId: profile.brandId
  };
}

export function canManageUsers(access: DashboardAccess): boolean {
  return access.allowed && access.scope === "admin";
}

export function brandFilterForAccess(access: DashboardAccess): string | null {
  if (!access.allowed) {
    return null;
  }

  return access.scope === "brand" ? access.brandId : null;
}
