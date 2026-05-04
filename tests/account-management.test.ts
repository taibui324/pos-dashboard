import { describe, expect, it } from "vitest";
import { normalizeBrandUserInviteInput } from "@/lib/services/account-management";

describe("brand user account management", () => {
  it("requires a valid email, display name, and exactly one brand", () => {
    expect(
      normalizeBrandUserInviteInput({
        email: " Ops@Brand.vn ",
        displayName: " Brand Ops ",
        brandId: "brand-acme"
      })
    ).toEqual({
      email: "ops@brand.vn",
      displayName: "Brand Ops",
      brandId: "brand-acme"
    });
  });

  it("rejects missing brand assignments", () => {
    expect(() =>
      normalizeBrandUserInviteInput({
        email: "ops@brand.vn",
        displayName: "Brand Ops",
        brandId: ""
      })
    ).toThrow("A Brand User Account must be assigned to exactly one brand.");
  });
});
