export type RevenueRow = {
  orderCode: string;
  date: string;
  status: "Completed" | "Pending" | "Cancelled";
  branch: string;
  sku: string;
  barcode: string;
  productName: string;
  quantity: number;
  unitPrice: string;
  discount: string;
  lineRevenue: string;
};

export type InventoryRow = {
  sku: string;
  barcode: string;
  productName: string;
  category: string;
  brand: string;
  stock: number;
  createdAt: string;
  tone: "error" | "warning" | "normal";
};

export type UserRow = {
  name: string;
  email: string;
  brand: string;
  role: "Daspace Admin" | "Brand User";
  lastActive: string;
  status: "Active" | "Inactive" | "Invited";
};

export const revenueRows: RevenueRow[] = [
  {
    orderCode: "SO482931",
    date: "24/05/2024",
    status: "Completed",
    branch: "Hà Nội Main",
    sku: "SKU-2931",
    barcode: "893012345678",
    productName: "Premium Arabica Blend 500g",
    quantity: 2,
    unitPrice: "450,000 ₫",
    discount: "5%",
    lineRevenue: "855,000 ₫"
  },
  {
    orderCode: "SO482932",
    date: "24/05/2024",
    status: "Pending",
    branch: "HCM Flagship",
    sku: "SKU-1120",
    barcode: "893011223344",
    productName: "Cold Brew Bottled 250ml",
    quantity: 5,
    unitPrice: "65,000 ₫",
    discount: "0%",
    lineRevenue: "325,000 ₫"
  },
  {
    orderCode: "SO482933",
    date: "24/05/2024",
    status: "Completed",
    branch: "Đà Nẵng Hub",
    sku: "SKU-4450",
    barcode: "893099887766",
    productName: "Signature Espresso Roast 1kg",
    quantity: 1,
    unitPrice: "1,200,000 ₫",
    discount: "10%",
    lineRevenue: "1,080,000 ₫"
  },
  {
    orderCode: "SO482934",
    date: "24/05/2024",
    status: "Cancelled",
    branch: "Hà Nội Main",
    sku: "SKU-0092",
    barcode: "893044556677",
    productName: "Manual Drip Set (V60)",
    quantity: 1,
    unitPrice: "1,850,000 ₫",
    discount: "0%",
    lineRevenue: "1,850,000 ₫"
  }
];

export const revenueChart = [
  { label: "May 01", revenue: 520 },
  { label: "May 03", revenue: 790 },
  { label: "May 05", revenue: 570 },
  { label: "May 08", revenue: 960 },
  { label: "May 10", revenue: 1120 },
  { label: "May 12", revenue: 740 },
  { label: "May 15", revenue: 310 },
  { label: "May 18", revenue: 690 },
  { label: "May 20", revenue: 1020 },
  { label: "Today", revenue: 1200 }
];

export const inventoryRows: InventoryRow[] = [
  {
    sku: "SKU-9021-X",
    barcode: "893012345678",
    productName: "Nike Air Max Pro",
    category: "Footwear",
    brand: "Nike",
    stock: 0,
    createdAt: "12/04/2024",
    tone: "error"
  },
  {
    sku: "SKU-4412-M",
    barcode: "893012341122",
    productName: "SmartWatch Series 5",
    category: "Electronics",
    brand: "Apple",
    stock: 8,
    createdAt: "15/05/2024",
    tone: "warning"
  },
  {
    sku: "SKU-8821-B",
    barcode: "893012349933",
    productName: "Wireless Headphones Pro",
    category: "Audio",
    brand: "Sony",
    stock: 142,
    createdAt: "20/05/2024",
    tone: "normal"
  },
  {
    sku: "SKU-1029-A",
    barcode: "893012340011",
    productName: "Classic Leather Sneakers",
    category: "Footwear",
    brand: "Adidas",
    stock: 45,
    createdAt: "22/05/2024",
    tone: "normal"
  }
];

export const userRows: UserRow[] = [
  {
    name: "John Doe",
    email: "john@daspace.vn",
    brand: "Daspace",
    role: "Daspace Admin",
    lastActive: "Oct 24, 2023",
    status: "Active"
  },
  {
    name: "Alice Smith",
    email: "alice@globex.com",
    brand: "Globex Inc",
    role: "Brand User",
    lastActive: "Oct 23, 2023",
    status: "Active"
  },
  {
    name: "Robert Jones",
    email: "robert@initech.com",
    brand: "Initech",
    role: "Brand User",
    lastActive: "Oct 20, 2023",
    status: "Inactive"
  },
  {
    name: "Maria Garcia",
    email: "maria@soy.com",
    brand: "Soy Corp",
    role: "Brand User",
    lastActive: "Oct 19, 2023",
    status: "Active"
  },
  {
    name: "Peter Lee",
    email: "peter@acme.com",
    brand: "Acme Corp",
    role: "Brand User",
    lastActive: "Oct 18, 2023",
    status: "Active"
  }
];
