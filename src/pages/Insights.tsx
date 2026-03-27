import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { getProducts, getSales } from "@/lib/store";

export default function Insights() {
  const products = getProducts();
  const sales = getSales();

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    sales.forEach((s) => {
      const prod = products.find((p) => p.id === s.productId);
      const cat = prod?.category || "Other";
      map[cat] = (map[cat] || 0) + s.total;
    });
    return Object.entries(map).map(([category, revenue]) => ({ category, revenue: +revenue.toFixed(2) }));
  }, [products, sales]);

  const dailyOrders = useMemo(() => {
    const map: Record<string, number> = {};
    sales.forEach((s) => {
      const d = s.date.slice(5);
      map[d] = (map[d] || 0) + 1;
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([date, orders]) => ({ date, orders }));
  }, [sales]);

  const productMetrics = useMemo(() => {
    return products.slice(0, 6).map((p) => ({
      name: p.name.length > 12 ? p.name.slice(0, 12) + "…" : p.name,
      sold: p.sold,
      stock: p.quantity,
      revenue: +(p.sold * p.price).toFixed(0),
    }));
  }, [products]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-['Space_Grotesk']">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Deep dive into your business data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-6">
          <h3 className="font-semibold mb-4 font-['Space_Grotesk']">Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryData}>
              <XAxis dataKey="category" tick={{ fontSize: 11, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v: number) => [`$${v}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="hsl(174, 62%, 47%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-xl p-6">
          <h3 className="font-semibold mb-4 font-['Space_Grotesk']">Daily Orders</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyOrders}>
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="hsl(262, 52%, 58%)" strokeWidth={2.5} dot={{ fill: "hsl(262, 52%, 58%)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 glass-card rounded-xl p-6">
          <h3 className="font-semibold mb-4 font-['Space_Grotesk']">Product Performance Radar</h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={productMetrics}>
              <PolarGrid stroke="hsl(220, 13%, 88%)" />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(220, 10%, 46%)" }} />
              <PolarRadiusAxis tick={{ fontSize: 10 }} />
              <Radar name="Sold" dataKey="sold" stroke="hsl(174, 62%, 47%)" fill="hsl(174, 62%, 47%)" fillOpacity={0.2} />
              <Radar name="Stock" dataKey="stock" stroke="hsl(38, 92%, 60%)" fill="hsl(38, 92%, 60%)" fillOpacity={0.15} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
