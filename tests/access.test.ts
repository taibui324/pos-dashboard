import { describe, expect, it } from "vitest";
import { resolveDashboardAccess } from "@/lib/domain/access";

describe("resolveDashboardAccess", () => {
  it("allows an active Daspace admin without a brand assignment", () => {
    expect(
      resolveDashboardAccess({
        userId: "admin-1",
        email: "admin@daspace.vn",
        role: "daspace_admin",
        status: "active",
        brandId: null,
        createdByAdmin: true
      })
    ).toMatchObject({ allowed: true, scope: "admin" });
  });

  it("allows an active admin-created brand user scoped to exactly one brand", () => {
    expect(
      resolveDashboardAccess({
        userId: "brand-1",
        email: "ops@acme.vn",
        role: "brand_user",
        status: "active",
        brandId: "brand-acme",
        createdByAdmin: true
      })
    ).toMatchObject({ allowed: true, scope: "brand", brandId: "brand-acme" });
  });

  it("denies brand users without an admin-created account and brand assignment", () => {
    expect(
      resolveDashboardAccess({
        userId: "self-signup",
        email: "random@example.com",
        role: "brand_user",
        status: "active",
        brandId: null,
        createdByAdmin: false
      })
    ).toEqual({ allowed: false, reason: "missing_brand_assignment" });
  });

  it("denies disabled users even if they previously had access", () => {
    expect(
      resolveDashboardAccess({
        userId: "brand-disabled",
        email: "ops@old.vn",
        role: "brand_user",
        status: "disabled",
        brandId: "brand-old",
        createdByAdmin: true
      })
    ).toEqual({ allowed: false, reason: "inactive_account" });
  });
});
