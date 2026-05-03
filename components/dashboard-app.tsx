"use client";

import { useState, type ReactNode } from "react";
import {
  Bell,
  Box,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleDollarSign,
  CircleHelp,
  Download,
  Filter,
  FilterX,
  Info,
  LayoutDashboard,
  LogOut,
  MoreVertical,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShoppingCart,
  SlidersHorizontal,
  TrendingUp,
  UserRound,
  Users
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  authenticateDemoUser,
  canAccessRoute,
  demoUsers,
  getDefaultRouteForRole,
  type DemoUser
} from "@/lib/auth";
import { inventoryRows, revenueChart, revenueRows, userRows, type UserRow } from "@/lib/mock-data";

type RouteKey = "/revenue" | "/inventory" | "/user-management" | "/settings";

const routeLabels: Record<RouteKey, string> = {
  "/revenue": "Revenue",
  "/inventory": "Inventory",
  "/user-management": "User Management",
  "/settings": "Settings"
};

function classNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StatusChip({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const tone =
    normalized.includes("cancel") || normalized.includes("inactive")
      ? "bg-rose-100 text-rose-700"
      : normalized.includes("pending") || normalized.includes("invited")
        ? "bg-amber-100 text-amber-700"
        : "bg-green-100 text-green-700";

  return (
    <span className={classNames("inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", tone)}>
      {status}
    </span>
  );
}

function Pagination({ totalLabel }: { totalLabel: string }) {
  return (
    <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-4">
      <p className="text-body-sm text-slate-500">{totalLabel}</p>
      <div className="flex items-center gap-2">
        <button className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-300">
          <ChevronLeft size={16} />
        </button>
        {[1, 2, 3].map((page) => (
          <button
            className={classNames(
              "flex h-8 w-8 items-center justify-center rounded border text-body-sm font-medium",
              page === 1
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            )}
            key={page}
          >
            {page}
          </button>
        ))}
        <span className="px-1 text-slate-400">...</span>
        <button className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-body-sm font-medium text-slate-600">
          15
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: (user: DemoUser) => void }) {
  const [email, setEmail] = useState("admin@daspace.vn");
  const [error, setError] = useState("");

  function submit(nextEmail = email) {
    const user = authenticateDemoUser(nextEmail);
    if (!user) {
      setError("This demo account is disabled or does not exist.");
      return;
    }
    setError("");
    onLogin(user);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-xl border border-slate-800 bg-white shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">
        <section className="bg-slate-900 p-10 text-white">
          <div className="mb-14 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded bg-blue-600">
              <LayoutDashboard size={22} />
            </div>
            <div>
              <h1 className="font-manrope text-xl font-black">Daspace</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">POS Terminal</p>
            </div>
          </div>
          <h2 className="font-manrope text-3xl font-bold leading-tight">Preview the brand-scoped POS dashboard.</h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
            This is a UI-only mock with local demo authentication. Sapo and Supabase APIs are intentionally not wired yet.
          </p>
        </section>
        <section className="p-10">
          <p className="text-label-caps uppercase text-slate-500">Demo sign in</p>
          <h3 className="mt-2 font-manrope text-2xl font-bold text-slate-950">Choose a role</h3>
          <div className="mt-8 space-y-3">
            {demoUsers.map((user) => (
              <button
                className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-left transition hover:border-blue-300 hover:bg-blue-50/50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={user.status !== "active"}
                key={user.id}
                onClick={() => submit(user.email)}
              >
                <span>
                  <span className="block font-semibold text-slate-950">{user.name}</span>
                  <span className="text-body-sm text-slate-500">
                    {user.email} · {user.role === "admin" ? "Daspace Admin" : user.brandName}
                  </span>
                </span>
                <StatusChip status={user.status === "active" ? "Active" : "Inactive"} />
              </button>
            ))}
          </div>
          <div className="mt-8">
            <label className="text-label-caps uppercase text-slate-500">Email</label>
            <div className="mt-2 flex gap-2">
              <input
                className="h-11 flex-1 rounded-lg border border-slate-200 px-3 text-body-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
              />
              <button className="rounded-lg bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700" onClick={() => submit()}>
                Sign in
              </button>
            </div>
            {error ? <p className="mt-3 text-body-sm text-rose-600">{error}</p> : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function Sidebar({
  route,
  user,
  onNavigate,
  onLogout
}: {
  route: RouteKey;
  user: DemoUser;
  onNavigate: (route: RouteKey) => void;
  onLogout: () => void;
}) {
  const navItems: Array<{ route: RouteKey; icon: ReactNode; label: string }> = [
    { route: "/revenue", icon: <CircleDollarSign size={20} />, label: "Revenue" },
    { route: "/inventory", icon: <Box size={20} />, label: "Inventory" },
    ...(user.role === "admin" ? [{ route: "/user-management" as RouteKey, icon: <Users size={20} />, label: "User Management" }] : []),
    { route: "/settings", icon: <Settings size={20} />, label: "Settings" }
  ];

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-full w-[240px] flex-col border-r border-slate-800 bg-slate-900 py-6 text-white shadow-xl">
      <div className="mb-10 flex items-center gap-3 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-600 shadow-lg shadow-blue-950/20">
          <LayoutDashboard size={20} />
        </div>
        <div>
          <h1 className="font-manrope text-lg font-black leading-none tracking-tight">Daspace</h1>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {user.role === "admin" ? "Admin Console" : "POS Terminal"}
          </p>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = item.route === route;
          return (
            <button
              className={classNames(
                "flex w-full items-center gap-3 px-4 py-3 text-left font-manrope text-sm transition-all",
                active
                  ? "border-l-4 border-blue-500 bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              )}
              key={item.route}
              onClick={() => onNavigate(item.route)}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="mt-auto space-y-1 border-t border-slate-800 pt-4">
        {user.role === "admin" ? (
          <button className="flex w-full items-center gap-3 px-4 py-3 text-left font-manrope text-sm text-slate-400 transition hover:bg-white/5 hover:text-slate-200">
            <CircleHelp size={20} />
            Help Center
          </button>
        ) : null}
        <button
          className="flex w-full items-center gap-3 px-4 py-3 text-left font-manrope text-sm text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
          onClick={onLogout}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}

function TopBar({ title, user, showSearch = false }: { title: string; user: DemoUser; showSearch?: boolean }) {
  return (
    <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
      <div className="flex items-center gap-4">
        <h2 className="font-manrope text-headline-md text-slate-900">{title}</h2>
        {title !== "User Management" ? (
          <>
            <div className="h-4 w-px bg-slate-200" />
            <p className="text-body-sm font-medium text-slate-500">Data updated: 24/05/2024 - 14:30</p>
          </>
        ) : (
          <span className="rounded border border-slate-300 bg-slate-100 px-3 py-1 text-label-caps text-slate-700">450 Total</span>
        )}
      </div>
      <div className="flex items-center gap-4">
        {showSearch ? (
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input className="h-10 w-72 rounded-full border-0 bg-slate-50 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Search..." />
          </div>
        ) : null}
        <button className="rounded-full p-2 text-slate-500 transition hover:bg-slate-50">
          <RefreshCw size={20} />
        </button>
        <button className="relative rounded-full p-2 text-slate-500 transition hover:bg-slate-50">
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-blue-600" />
        </button>
        <div className="h-8 w-px bg-slate-200" />
        <div className="flex items-center gap-3">
          <span className="hidden text-right sm:block">
            <p className="text-body-sm font-semibold text-slate-900">{user.name}</p>
            <p className="text-[11px] text-slate-500">{user.title}</p>
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
            {initials(user.name)}
          </div>
        </div>
      </div>
    </header>
  );
}

function MetricCard({
  icon,
  label,
  value,
  sub,
  tone = "blue",
  trend
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  tone?: "blue" | "green" | "red" | "amber";
  trend?: string;
}) {
  const toneMap = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600"
  };

  return (
    <div className={classNames("rounded-xl border border-slate-200 bg-white p-6 shadow-sm", tone === "red" && "border-l-4 border-l-red-600")}>
      <div className="mb-4 flex items-start justify-between">
        <div className={classNames("rounded-lg p-2", toneMap[tone])}>{icon}</div>
        {trend ? (
          <span className={classNames("flex items-center gap-1 text-body-sm font-semibold", tone === "red" ? "text-rose-600" : "text-green-600")}>
            <TrendingUp size={14} />
            {trend}
          </span>
        ) : null}
      </div>
      <p className="mb-1 text-label-caps uppercase text-slate-500">{label}</p>
      <h3 className={classNames("font-manrope text-display-lg text-slate-900", tone === "red" && "text-red-700")}>
        {value}
        {sub ? <span className="ml-2 text-headline-md font-normal text-slate-400">{sub}</span> : null}
      </h3>
    </div>
  );
}

function RevenuePage() {
  return (
    <div className="space-y-8 p-8">
      <section className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <FilterControl icon={<CalendarDays size={16} />} label="Range" value="May 1, 2024 - May 24, 2024" />
        <SelectControl label="Filter: State" value="All Statuses" />
        <SelectControl label="Filter: Chi Nhánh" value="Tất cả chi nhánh" />
        <div className="ml-auto flex gap-2">
          <GhostButton icon={<FilterX size={18} />} label="Clear Filter" />
          <PrimaryButton icon={<Download size={18} />} label="Export" />
        </div>
      </section>
      <section className="grid grid-cols-1 gap-gutter md:grid-cols-3">
        <MetricCard icon={<CircleDollarSign size={22} />} label="Total Revenue" trend="+12.5%" value="4,280,000,000 ₫" />
        <MetricCard icon={<ShoppingCart size={22} />} label="Total Product Sold" sub="Units" tone="green" trend="+8.2%" value="12,450" />
        <MetricCard icon={<CircleAlert size={22} />} label="Total Product Cancelled" sub="Orders" tone="red" trend="+2.1%" value="142" />
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h3 className="font-manrope text-headline-md text-slate-900">Revenue per Month/Day</h3>
            <p className="text-body-sm text-slate-500">Performance analysis across the selected timeframe</p>
          </div>
          <div className="flex rounded-lg bg-slate-100 p-1">
            <button className="rounded bg-white px-4 py-1.5 text-body-sm font-semibold text-slate-900 shadow-sm">Daily</button>
            <button className="px-4 py-1.5 text-body-sm font-medium text-slate-500">Monthly</button>
          </div>
        </div>
        <div className="h-[360px]">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={revenueChart}>
              <CartesianGrid stroke="#f1f5f9" vertical={false} />
              <XAxis axisLine={false} dataKey="label" tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(value) => [`${value}M ₫`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <TableHeader title="Revenue Detail Rows" placeholder="Search product or order..." />
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Order Code", "Date", "Status", "Branch", "SKU / Barcode", "Product Name", "Quantity", "Unit Price", "Discount (%)", "Total Line Revenue"].map((head) => (
                  <th className="whitespace-nowrap px-6 py-4 text-label-caps text-slate-500" key={head}>
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {revenueRows.map((row) => (
                <tr className="transition hover:bg-slate-50/70" key={row.orderCode}>
                  <td className="px-6 py-4 text-data-tabular font-semibold text-blue-600">{row.orderCode}</td>
                  <td className="px-6 py-4 text-data-tabular text-slate-600">{row.date}</td>
                  <td className="px-6 py-4"><StatusChip status={row.status} /></td>
                  <td className="px-6 py-4 text-data-tabular text-slate-600">{row.branch}</td>
                  <td className="px-6 py-4">
                    <p className="text-data-tabular text-slate-900">{row.sku}</p>
                    <p className="text-[10px] text-slate-400">{row.barcode}</p>
                  </td>
                  <td className="px-6 py-4 text-data-tabular font-semibold text-slate-900">{row.productName}</td>
                  <td className="px-6 py-4 text-data-tabular text-slate-900">{row.quantity}</td>
                  <td className="px-6 py-4 text-right text-data-tabular text-slate-600">{row.unitPrice}</td>
                  <td className="px-6 py-4 text-right text-data-tabular text-rose-600">{row.discount}</td>
                  <td className={classNames("px-6 py-4 text-right text-data-tabular font-bold", row.status === "Cancelled" ? "text-slate-400 line-through" : "text-slate-900")}>{row.lineRevenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination totalLabel="Showing 1 to 30 of 4,280 entries" />
      </section>
      <Footer />
    </div>
  );
}

function InventoryPage() {
  return (
    <div className="space-y-gutter p-margin-page">
      <section className="grid grid-cols-1 gap-gutter md:grid-cols-3">
        <MetricCard icon={<Package size={22} />} label="Total Product in Inventory" tone="green" trend="+12.5% from last month" value="1,284" />
        <MetricCard icon={<CircleAlert size={22} />} label="Low Stock Products" sub="Available Stock < 10" tone="amber" value="42" />
        <MetricCard icon={<CircleAlert size={22} />} label="Out-of-Stock Products" sub="Available Stock = 0" tone="red" value="18" />
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative min-w-[280px] flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" placeholder="Search by Product name, SKU..." />
          </div>
          <SelectBox label="Loại sản phẩm" />
          <FilterControl icon={<CalendarDays size={18} />} value="Ngày khởi tạo" />
          <SelectBox label="Newest first" icon={<SlidersHorizontal size={18} />} />
          <div className="ml-auto flex gap-2">
            <GhostButton icon={<FilterX size={18} />} label="Clear Filter" />
            <PrimaryButton icon={<Download size={18} />} label="Export" />
          </div>
        </div>
      </section>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                {["Mã SKU Sản Phẩm", "Mã Barcode", "Tên Sản Phẩm", "Loại Sản Phẩm", "Nhãn Hiệu", "Tồn Kho", "Ngày Khởi Tạo", ""].map((head) => (
                  <th className="px-6 py-4 text-label-caps uppercase text-slate-600" key={head}>
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-data-tabular">
              {inventoryRows.map((row) => (
                <tr className="transition hover:bg-slate-50" key={row.sku}>
                  <td className="px-6 py-4 font-semibold text-slate-900">{row.sku}</td>
                  <td className="px-6 py-4 text-slate-500">{row.barcode}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded bg-slate-100 text-xs font-bold text-slate-500">
                        {row.productName[0]}
                      </div>
                      <span className="font-medium text-slate-900">{row.productName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{row.category}</td>
                  <td className="px-6 py-4 text-slate-600">{row.brand}</td>
                  <td className="px-6 py-4">
                    <span
                      className={classNames(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold",
                        row.tone === "error" && "bg-red-100 text-red-700",
                        row.tone === "warning" && "bg-amber-100 text-amber-800",
                        row.tone === "normal" && "text-slate-900"
                      )}
                    >
                      {row.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{row.createdAt}</td>
                  <td className="px-6 py-4 text-right text-slate-400"><MoreVertical size={18} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination totalLabel="Showing 1 to 30 of 1,284 products" />
      </section>
      <section className="grid grid-cols-1 gap-gutter lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-card-padding shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h4 className="font-manrope text-headline-md text-slate-900">Top Categories by Stock</h4>
            <button className="text-body-sm font-medium text-blue-600">View Report</button>
          </div>
          {[
            ["Electronics", "452 items", "65%"],
            ["Footwear", "310 items", "45%"],
            ["Accessories", "215 items", "32%"]
          ].map(([label, count, width]) => (
            <div className="mb-4 space-y-1" key={label}>
              <div className="flex justify-between text-body-sm">
                <span className="text-slate-600">{label}</span>
                <span className="font-bold">{count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-blue-600" style={{ width }} />
              </div>
            </div>
          ))}
        </div>
        <div className="relative rounded-xl border border-slate-800 bg-slate-900 p-card-padding text-white shadow-lg">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
              <Info />
            </div>
            <div>
              <h4 className="font-manrope text-headline-md">Inventory Insights</h4>
              <p className="text-body-sm text-slate-400">Mock deterministic summary</p>
            </div>
          </div>
          <p className="mb-6 leading-7 text-slate-300">
            <strong className="text-white">Nike Air Max Pro</strong> is out of stock. Low-stock products are concentrated in Electronics and Footwear.
          </p>
          <button className="w-full rounded-lg bg-white py-3 font-bold text-slate-900">Generate Restock Order</button>
          <button className="absolute -right-1 -top-1 flex h-14 w-14 cursor-not-allowed items-center justify-center rounded-xl bg-blue-600 text-white opacity-80" title="Product creation is out of scope for v1">
            <Plus />
          </button>
        </div>
      </section>
    </div>
  );
}

function UserManagementPage() {
  const [rows, setRows] = useState(userRows);
  const [showCreate, setShowCreate] = useState(false);

  function createMockUser(user: UserRow) {
    setRows((current) => [user, ...current]);
    setShowCreate(false);
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <section className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-margin-page py-6">
        <div className="flex items-center gap-4">
          <h2 className="font-manrope text-headline-md text-slate-950">User Management</h2>
          <span className="rounded border border-slate-300 bg-slate-100 px-3 py-1 text-label-caps text-slate-700">450 Total</span>
        </div>
        <div className="flex gap-3">
          <GhostButton icon={<Download size={18} />} label="Export" />
          <PrimaryButton icon={<Plus size={18} />} label="Create User" onClick={() => setShowCreate(true)} />
        </div>
      </section>
      <section className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-margin-page py-4">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" placeholder="Search users, emails..." />
          </div>
          <SelectBox label="Filter by Brand" />
          <SelectBox label="Filter by Status" />
        </div>
        <div className="hidden items-center gap-2 text-body-sm text-slate-600 lg:flex">
          <Filter size={18} />
          Active Filters:
          <span className="rounded-full bg-blue-100 px-3 py-1 text-label-caps text-blue-900">Status: Active</span>
        </div>
      </section>
      <section className="flex-1 overflow-auto p-margin-page">
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="custom-scrollbar flex-1 overflow-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-100">
                <tr>
                  {["User Name", "Brand Name", "Role", "Last Active Date", "Status", "Actions"].map((head) => (
                    <th className={classNames("px-5 py-3 text-label-caps text-slate-600", head === "Actions" && "text-right")} key={head}>
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-data-tabular">
                {rows.map((row) => (
                  <tr className="group transition hover:bg-slate-50" key={`${row.email}-${row.lastActive}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-950">
                          {initials(row.name)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{row.name}</p>
                          <p className="text-body-sm text-slate-500">{row.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{row.brand}</td>
                    <td className="px-5 py-4 text-slate-600">{row.role}</td>
                    <td className="px-5 py-4 text-slate-600">{row.lastActive}</td>
                    <td className="px-5 py-4"><StatusChip status={row.status} /></td>
                    <td className="px-5 py-4 text-right text-slate-400"><MoreVertical className="ml-auto opacity-0 transition group-hover:opacity-100" size={20} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination totalLabel={`Showing 1 to 30 of ${Math.max(450, rows.length)} users`} />
        </div>
      </section>
      {showCreate ? <CreateUserModal onClose={() => setShowCreate(false)} onCreate={createMockUser} /> : null}
    </div>
  );
}

function CreateUserModal({ onClose, onCreate }: { onClose: () => void; onCreate: (user: UserRow) => void }) {
  const [name, setName] = useState("New Brand User");
  const [email, setEmail] = useState("new.brand@example.com");
  const [brand, setBrand] = useState("Acme Corp");

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
        <h3 className="font-manrope text-headline-md text-slate-950">Create Brand User</h3>
        <p className="mt-1 text-body-sm text-slate-500">Mock account creation. No Supabase API call is made in this UI preview.</p>
        <div className="mt-6 space-y-4">
          <TextField label="Display name" onChange={setName} value={name} />
          <TextField label="Email" onChange={setEmail} value={email} />
          <TextField label="Brand" onChange={setBrand} value={brand} />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <GhostButton label="Cancel" onClick={onClose} />
          <PrimaryButton
            icon={<Plus size={18} />}
            label="Create User"
            onClick={() =>
              onCreate({
                name,
                email,
                brand,
                role: "Brand User",
                lastActive: "Invited",
                status: "Invited"
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="p-margin-page">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="font-manrope text-headline-md text-slate-950">Settings</h2>
        <p className="mt-2 text-body-base text-slate-500">Settings are included in navigation for shell fidelity. No settings workflows are implemented in this UI preview.</p>
      </div>
    </div>
  );
}

function FilterControl({ label, value, icon }: { label?: string; value: string; icon?: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label ? <label className="text-label-caps uppercase text-slate-500">{label}</label> : null}
      <div className="flex min-w-[200px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-body-base">
        {icon ? <span className="text-slate-400">{icon}</span> : null}
        <span>{value}</span>
      </div>
    </div>
  );
}

function SelectControl({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-label-caps uppercase text-slate-500">{label}</label>
      <button className="flex min-w-[180px] items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-body-base">
        {value}
        <ChevronDown size={16} className="text-slate-400" />
      </button>
    </div>
  );
}

function SelectBox({ label, icon }: { label: string; icon?: ReactNode }) {
  return (
    <button className="flex h-10 min-w-[150px] items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 text-body-sm text-slate-700">
      {label}
      {icon ?? <ChevronDown size={16} className="text-slate-400" />}
    </button>
  );
}

function GhostButton({ label, icon, onClick }: { label: string; icon?: ReactNode; onClick?: () => void }) {
  return (
    <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600 transition hover:bg-slate-50" onClick={onClick}>
      {icon}
      {label}
    </button>
  );
}

function PrimaryButton({ label, icon, onClick }: { label: string; icon?: ReactNode; onClick?: () => void }) {
  return (
    <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white shadow-sm transition hover:bg-blue-700" onClick={onClick}>
      {icon}
      {label}
    </button>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-label-caps uppercase text-slate-500">{label}</span>
      <input
        className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

function TableHeader({ title, placeholder }: { title: string; placeholder: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 px-8 py-6">
      <h3 className="font-manrope text-headline-md text-slate-900">{title}</h3>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input className="min-w-[300px] rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-body-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" placeholder={placeholder} />
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white p-8">
      <div className="flex items-center justify-between text-[12px] text-slate-400">
        <p>© 2024 Daspace POS Ecosystem. All rights reserved.</p>
        <div className="flex gap-6">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Help Center</span>
        </div>
      </div>
    </footer>
  );
}

export default function DashboardApp() {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [route, setRoute] = useState<RouteKey>("/revenue");

  function login(nextUser: DemoUser) {
    setUser(nextUser);
    setRoute(getDefaultRouteForRole(nextUser.role) as RouteKey);
  }

  function navigate(nextRoute: RouteKey) {
    if (!user || !canAccessRoute(user.role, nextRoute)) {
      return;
    }

    setRoute(nextRoute);
  }

  if (!user) {
    return <LoginScreen onLogin={login} />;
  }

  const title = routeLabels[route];

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Sidebar onLogout={() => setUser(null)} onNavigate={navigate} route={route} user={user} />
      <main className="ml-[240px] min-h-screen">
        {route !== "/user-management" ? <TopBar showSearch={route === "/inventory"} title={title} user={user} /> : null}
        {route === "/revenue" ? <RevenuePage /> : null}
        {route === "/inventory" ? <InventoryPage /> : null}
        {route === "/user-management" && user.role === "admin" ? <UserManagementPage /> : null}
        {route === "/settings" ? <SettingsPage /> : null}
      </main>
    </div>
  );
}
