import { describe, expect, it } from "vitest";
import {
  authenticateDemoUser,
  canAccessRoute,
  getDefaultRouteForRole
} from "@/lib/auth";

describe("demo auth and role helpers", () => {
  it("authenticates active demo users by email", () => {
    const user = authenticateDemoUser("admin@daspace.vn");

    expect(user?.role).toBe("admin");
    expect(user?.status).toBe("active");
  });

  it("rejects disabled brand users", () => {
    const user = authenticateDemoUser("disabled@brand.vn");

    expect(user).toBeNull();
  });

  it("routes admins to user management and brand users to revenue", () => {
    expect(getDefaultRouteForRole("admin")).toBe("/user-management");
    expect(getDefaultRouteForRole("brand")).toBe("/revenue");
  });

  it("blocks brand users from admin-only user management", () => {
    expect(canAccessRoute("brand", "/user-management")).toBe(false);
    expect(canAccessRoute("admin", "/user-management")).toBe(true);
  });
});
