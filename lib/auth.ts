export type UserRole = "admin" | "brand";
export type UserStatus = "active" | "disabled" | "invited";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  brandName: string;
  status: UserStatus;
  title: string;
};

export const demoUsers: DemoUser[] = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@daspace.vn",
    role: "admin",
    brandName: "Daspace",
    status: "active",
    title: "Super Administrator"
  },
  {
    id: "brand-1",
    name: "Alice Smith",
    email: "brand@acme.vn",
    role: "brand",
    brandName: "Acme Corp",
    status: "active",
    title: "Brand User"
  },
  {
    id: "brand-disabled",
    name: "Disabled User",
    email: "disabled@brand.vn",
    role: "brand",
    brandName: "Initech",
    status: "disabled",
    title: "Brand User"
  }
];

export function authenticateDemoUser(email: string): DemoUser | null {
  const normalized = email.trim().toLowerCase();
  const user = demoUsers.find((candidate) => candidate.email.toLowerCase() === normalized);

  if (!user || user.status !== "active") {
    return null;
  }

  return user;
}

export function getDefaultRouteForRole(role: UserRole): string {
  return role === "admin" ? "/user-management" : "/revenue";
}

export function canAccessRoute(role: UserRole, route: string): boolean {
  if (route === "/user-management") {
    return role === "admin";
  }

  return ["/revenue", "/inventory", "/settings"].includes(route);
}
