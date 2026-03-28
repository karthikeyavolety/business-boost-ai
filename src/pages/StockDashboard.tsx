import { useState } from "react";
import { motion } from "framer-motion";
import { Package, TrendingUp, AlertTriangle, Plus, Trash2, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getProducts, saveProducts, isWorthy, isTrending, getSuggestion, Product } from "@/lib/productStore";

export default function StockDashboard() {
  const [products, setProducts] = useState<Product[]>(getProducts);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", stock: "", demand: "", price: "" });

  const handleAdd = () => {
    if (!form.name) return;
    const newP: Product = {
      id: Date.now().toString(),
      name: form.name,
      category: form.category || "General",
      stock: Number(form.stock) || 0,
      demand: Math.min(100, Math.max(0, Number(form.demand) || Math.floor(Math.random() * 100))),
      price: Number(form.price) || 0,
    };
    const updated = [...products, newP];
    saveProducts(updated);
    setProducts(updated);
    setForm({ name: "", category: "", stock: "", demand: "", price: "" });
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
    setProducts(updated);
  };

  const worthy = products.filter(isWorthy).length;
  const trending = products.filter(isTrending).length;
  const risky = products.length - worthy;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stock Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">Check product viability at a glance</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Product</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <div className="space-y-1"><Label>Product Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Wireless Mouse" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Electronics" /></div>
                <div className="space-y-1"><Label>Price ($)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="29.99" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Stock Quantity</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="100" /></div>
                <div className="space-y-1"><Label>Demand Score (0-100)</Label><Input type="number" value={form.demand} onChange={(e) => setForm({ ...form, demand: e.target.value })} placeholder="Auto if empty" /></div>
              </div>
              <Button className="w-full" onClick={handleAdd}>Add Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Worthy Products", value: worthy, icon: Package, color: "text-primary" },
          { label: "Trending Now", value: trending, icon: TrendingUp, color: "text-accent" },
          { label: "Risky / Low Demand", value: risky, icon: AlertTriangle, color: "text-destructive" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card rounded-xl p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-lg bg-muted flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-muted-foreground text-xs">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Product Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-left">
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium text-center">Stock</th>
                <th className="px-5 py-3 font-medium text-center">Demand</th>
                <th className="px-5 py-3 font-medium text-center">Status</th>
                <th className="px-5 py-3 font-medium">Suggestion</th>
                <th className="px-5 py-3 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-medium flex items-center gap-2">
                    {p.name}
                    {isTrending(p) && <Flame className="w-4 h-4 text-[hsl(var(--trending))]" />}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-5 py-3 text-center">{p.stock}</td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${p.demand}%`, background: p.demand >= 70 ? 'hsl(var(--primary))' : p.demand >= 40 ? 'hsl(var(--trending))' : 'hsl(var(--destructive))' }} />
                      </div>
                      <span className="text-xs">{p.demand}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={isWorthy(p) ? "worthy-badge" : "not-worthy-badge"}>
                      {isWorthy(p) ? "Worthy ✅" : "Not Worthy ❌"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground max-w-[200px]">{getSuggestion(p)}</td>
                  <td className="px-5 py-3 text-center">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
