import { useMemo } from "react";
import { motion } from "framer-motion";
import { DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import StatCard from "@/components/StatCard";
import { getProducts, getSales } from "@/lib/store";

const CHART_COLORS = [
  "hsl(174, 62%, 47%)",
  "hsl(262, 52%, 58%)",
  "hsl(38, 92%, 60%)",
  "hsl(340, 65%, 55%)",
  "hsl(200, 70%, 55%)",
];

export default function Dashboard() {
  const products = getProducts();
  const sales = getSales();

  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((s, x) => s + x.total, 0);
    const totalOrders = sales.length;
    const totalProducts = products.length;
    const avgOrder = totalRevenue / (totalOrders || 1);
    return { totalRevenue, totalOrders, totalProducts, avgOrder };
  }, [products, sales]);

  const salesByDate = useMemo(() => {
    const map: Record<string, number> = {};
    sales.forEach((s) => {
      const d = s.date.slice(5);
      map[d] = (map[d] || 0) + s.total;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, revenue]) => ({ date, revenue: +revenue.toFixed(2) }));
  }, [sales]);

  const salesByProduct = useMemo(() => {
    const map: Record<string, number> = {};
    sales.forEach((s) => {
      map[s.productName] = (map[s.productName] || 0) + s.total;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value: +value.toFixed(2) }));
  }, [sales]);

  const topProducts = useMemo(
    () => [...products].sort((a, b) => b.sold - a.sold).slice(0, 5),
    [products]
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-['Space_Grotesk']">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your business performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} change="+12.5% from last week" positive icon={DollarSign} index={0} />
        <StatCard title="Total Orders" value={stats.totalOrders.toString()} change="+8 new orders" positive icon={ShoppingCart} index={1} />
        <StatCard title="Products" value={stats.totalProducts.toString()} icon={Package} index={2} />
        <StatCard title="Avg. Order" value={`$${stats.avgOrder.toFixed(2)}`} change="+3.2%" positive icon={TrendingUp} index={3} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 glass-card rounded-xl p-6">
          <h3 className="font-semibold mb-4 font-['Space_Grotesk']">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={salesByDate}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(174, 62%, 47%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(174, 62%, 47%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "var(--shadow-card)" }} formatter={(v: number) => [`$${v.toFixed(2)}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(174, 62%, 47%)" strokeWidth={2.5} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-xl p-6">
          <h3 className="font-semibold mb-4 font-['Space_Grotesk']">Sales by Product</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={salesByProduct} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value">
                {salesByProduct.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [`$${v.toFixed(2)}`, "Sales"]} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Products */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-xl p-6">
        <h3 className="font-semibold mb-4 font-['Space_Grotesk']">Top Selling Products</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topProducts} layout="vertical">
            <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v: number) => [v, "Units Sold"]} />
            <Bar dataKey="sold" fill="hsl(174, 62%, 47%)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
