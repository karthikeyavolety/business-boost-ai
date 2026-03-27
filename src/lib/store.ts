export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  sold: number;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  total: number;
  date: string;
  customer: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  date: string;
  status: "paid" | "pending" | "overdue";
}

const PRODUCTS_KEY = "bizflow_products";
const SALES_KEY = "bizflow_sales";
const INVOICES_KEY = "bizflow_invoices";

function load<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Seed data
const seedProducts: Product[] = [
  { id: "1", name: "Wireless Headphones", category: "Electronics", price: 59.99, quantity: 120, sold: 87 },
  { id: "2", name: "Organic Coffee Beans", category: "Food & Beverage", price: 14.99, quantity: 300, sold: 234 },
  { id: "3", name: "Desk Lamp LED", category: "Home Office", price: 34.99, quantity: 85, sold: 62 },
  { id: "4", name: "Notebook Set", category: "Stationery", price: 9.99, quantity: 500, sold: 412 },
  { id: "5", name: "Phone Case Premium", category: "Accessories", price: 24.99, quantity: 200, sold: 156 },
  { id: "6", name: "Yoga Mat", category: "Fitness", price: 29.99, quantity: 75, sold: 48 },
];

const seedSales: Sale[] = [
  { id: "s1", productId: "1", productName: "Wireless Headphones", quantity: 3, total: 179.97, date: "2026-03-25", customer: "Alice Chen" },
  { id: "s2", productId: "2", productName: "Organic Coffee Beans", quantity: 10, total: 149.90, date: "2026-03-25", customer: "Bob's Cafe" },
  { id: "s3", productId: "4", productName: "Notebook Set", quantity: 20, total: 199.80, date: "2026-03-24", customer: "Metro Supplies" },
  { id: "s4", productId: "5", productName: "Phone Case Premium", quantity: 5, total: 124.95, date: "2026-03-24", customer: "TechZone" },
  { id: "s5", productId: "3", productName: "Desk Lamp LED", quantity: 4, total: 139.96, date: "2026-03-23", customer: "WorkSpace Co" },
  { id: "s6", productId: "6", productName: "Yoga Mat", quantity: 2, total: 59.98, date: "2026-03-23", customer: "FitLife Studio" },
  { id: "s7", productId: "2", productName: "Organic Coffee Beans", quantity: 15, total: 224.85, date: "2026-03-22", customer: "Morning Brew" },
  { id: "s8", productId: "1", productName: "Wireless Headphones", quantity: 7, total: 419.93, date: "2026-03-21", customer: "SoundStore" },
];

export function getProducts(): Product[] {
  return load<Product>(PRODUCTS_KEY, seedProducts);
}
export function saveProducts(p: Product[]) { save(PRODUCTS_KEY, p); }

export function getSales(): Sale[] {
  return load<Sale>(SALES_KEY, seedSales);
}
export function saveSales(s: Sale[]) { save(SALES_KEY, s); }

export function getInvoices(): Invoice[] {
  return load<Invoice>(INVOICES_KEY, []);
}
export function saveInvoices(i: Invoice[]) { save(INVOICES_KEY, i); }
