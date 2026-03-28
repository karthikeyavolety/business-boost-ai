export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  demand: number; // 0-100
  price: number;
}

const PRODUCTS_KEY = "viability_products";

const seedProducts: Product[] = [
  { id: "1", name: "Wireless Earbuds", category: "Electronics", stock: 150, demand: 88, price: 49.99 },
  { id: "2", name: "Organic Face Cream", category: "Beauty", stock: 200, demand: 72, price: 24.99 },
  { id: "3", name: "Smart Water Bottle", category: "Fitness", stock: 80, demand: 45, price: 34.99 },
  { id: "4", name: "Portable Charger", category: "Electronics", stock: 300, demand: 91, price: 29.99 },
  { id: "5", name: "Bamboo Toothbrush Set", category: "Eco-Friendly", stock: 500, demand: 62, price: 12.99 },
  { id: "6", name: "Yoga Resistance Bands", category: "Fitness", stock: 120, demand: 35, price: 19.99 },
  { id: "7", name: "LED Desk Lamp", category: "Home", stock: 90, demand: 78, price: 39.99 },
  { id: "8", name: "Protein Bars (Box)", category: "Food", stock: 400, demand: 83, price: 22.99 },
];

export function getProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : seedProducts;
  } catch {
    return seedProducts;
  }
}

export function saveProducts(p: Product[]) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(p));
}

export function isWorthy(p: Product): boolean {
  return p.demand > p.stock * 0.4;
}

export function isTrending(p: Product): boolean {
  return p.demand >= 75;
}

export function getSuggestion(p: Product): string {
  if (p.demand > 80 && p.stock < 100) return "🔥 High demand — Increase stock immediately!";
  if (p.demand > 60) return "✅ Good demand — Maintain current stock levels.";
  if (p.demand > 40) return "⚠️ Moderate demand — Monitor before restocking.";
  return "📉 Low demand — Risky investment. Consider reducing stock.";
}
