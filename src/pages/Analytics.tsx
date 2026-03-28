import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { getProducts } from "@/lib/productStore";

const COLORS = [
  "hsl(145, 65%, 42%)",
  "hsl(262, 52%, 58%)",
  "hsl(38, 92%, 50%)",
  "hsl(200, 70%, 55%)",
  "hsl(340, 65%, 55%)",
];

export default function Analytics() {
  const products = getProducts();

  const demandVsStock = useMemo(() =>
    products.map((p) => ({ name: p.name.length > 12 ? p.name.slice(0, 12) + "…" : p.name, Demand: p.demand, Stock: Math.min(100, Math.round((p.stock / 500) * 100)) })),
    [products]
  );

  const categoryDemand = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    products.forEach((p) => {
      if (!map[p.category]) map[p.category] = { total: 0, count: 0 };
      map[p.category].total += p.demand;
      map[p.category].count += 1;
    });
    return Object.entries(map).map(([name, v]) => ({ name, value: Math.round(v.total / v.count) }));
  }, [products]);

  const radarData = useMemo(() =>
    products.slice(0, 6).map((p) => ({ name: p.name.length > 10 ? p.name.slice(0, 10) + "…" : p.name, demand: p.demand, stock: Math.min(100, Math.round((p.stock / 500) * 100)) })),
    [products]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Market Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Visualize demand, stock, and trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-xl p-6">
          <h3 className="font-semibold mb-4">Demand vs Stock (Normalized)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={demandVsStock}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "none" }} />
              <Bar dataKey="Demand" fill="hsl(145,65%,42%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Stock" fill="hsl(262,52%,58%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-xl p-6">
          <h3 className="font-semibold mb-4">Avg Demand by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryDemand} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {categoryDemand.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Radar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 glass-card rounded-xl p-6">
          <h3 className="font-semibold mb-4">Product Performance Radar</h3>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(220,13%,80%)" />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="Demand" dataKey="demand" stroke="hsl(145,65%,42%)" fill="hsl(145,65%,42%)" fillOpacity={0.25} />
              <Radar name="Stock" dataKey="stock" stroke="hsl(262,52%,58%)" fill="hsl(262,52%,58%)" fillOpacity={0.15} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
