import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getProducts, saveProducts, getSales, saveSales, type Product, type Sale } from "@/lib/store";
import { toast } from "sonner";

export default function Products() {
  const [products, setProducts] = useState<Product[]>(getProducts);
  const [sales, setSales] = useState<Sale[]>(getSales);
  const [open, setOpen] = useState(false);
  const [saleOpen, setSaleOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", price: "", quantity: "" });
  const [saleForm, setSaleForm] = useState({ productId: "", quantity: "", customer: "" });

  const addProduct = () => {
    if (!form.name || !form.price) return toast.error("Name and price required");
    const p: Product = {
      id: Date.now().toString(),
      name: form.name,
      category: form.category,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity) || 0,
      sold: 0,
    };
    const updated = [...products, p];
    setProducts(updated);
    saveProducts(updated);
    setForm({ name: "", category: "", price: "", quantity: "" });
    setOpen(false);
    toast.success("Product added!");
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
    toast.success("Product removed");
  };

  const recordSale = () => {
    const prod = products.find((p) => p.id === saleForm.productId);
    if (!prod || !saleForm.quantity) return toast.error("Select a product and quantity");
    const qty = parseInt(saleForm.quantity);
    const sale: Sale = {
      id: Date.now().toString(),
      productId: prod.id,
      productName: prod.name,
      quantity: qty,
      total: +(prod.price * qty).toFixed(2),
      date: new Date().toISOString().slice(0, 10),
      customer: saleForm.customer || "Walk-in",
    };
    const updatedSales = [...sales, sale];
    setSales(updatedSales);
    saveSales(updatedSales);

    const updatedProducts = products.map((p) =>
      p.id === prod.id ? { ...p, sold: p.sold + qty, quantity: Math.max(0, p.quantity - qty) } : p
    );
    setProducts(updatedProducts);
    saveProducts(updatedProducts);

    setSaleForm({ productId: "", quantity: "", customer: "" });
    setSaleOpen(false);
    toast.success(`Sale recorded: $${sale.total}`);
  };

  const handleCSV = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        const lines = text.trim().split("\n").slice(1);
        const newProducts: Product[] = lines.map((line, i) => {
          const [name, category, price, quantity] = line.split(",").map((s) => s.trim());
          return { id: `csv-${Date.now()}-${i}`, name, category, price: parseFloat(price) || 0, quantity: parseInt(quantity) || 0, sold: 0 };
        });
        const updated = [...products, ...newProducts];
        setProducts(updated);
        saveProducts(updated);
        toast.success(`${newProducts.length} products imported!`);
      };
      reader.readAsText(file);
    },
    [products]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-['Space_Grotesk']">Products & Sales</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage inventory and record sales</p>
        </div>
        <div className="flex gap-3">
          <label className="cursor-pointer">
            <input type="file" accept=".csv" className="hidden" onChange={handleCSV} />
            <Button variant="outline" asChild>
              <span><Upload size={16} className="mr-2" />Import CSV</span>
            </Button>
          </label>

          <Dialog open={saleOpen} onOpenChange={setSaleOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Record Sale</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Record a Sale</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-2">
                <div>
                  <Label>Product</Label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={saleForm.productId}
                    onChange={(e) => setSaleForm({ ...saleForm, productId: e.target.value })}
                  >
                    <option value="">Select product...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} — ${p.price}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input type="number" value={saleForm.quantity} onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })} />
                </div>
                <div>
                  <Label>Customer</Label>
                  <Input placeholder="Walk-in" value={saleForm.customer} onChange={(e) => setSaleForm({ ...saleForm, customer: e.target.value })} />
                </div>
                <Button onClick={recordSale} className="w-full gradient-primary text-primary-foreground">Record Sale</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground"><Plus size={16} className="mr-2" />Add Product</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Product</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-2">
                <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Price ($)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
                  <div><Label>Quantity</Label><Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></div>
                </div>
                <Button onClick={addProduct} className="w-full gradient-primary text-primary-foreground">Add Product</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Products table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Product</th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Category</th>
              <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase">Price</th>
              <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase">Stock</th>
              <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase">Sold</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <td className="p-4 font-medium text-sm">{p.name}</td>
                <td className="p-4 text-sm text-muted-foreground">{p.category}</td>
                <td className="p-4 text-sm text-right">${p.price.toFixed(2)}</td>
                <td className="p-4 text-sm text-right">{p.quantity}</td>
                <td className="p-4 text-sm text-right font-medium text-primary">{p.sold}</td>
                <td className="p-4 text-right">
                  <button onClick={() => deleteProduct(p.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Recent sales */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card rounded-xl p-6">
        <h3 className="font-semibold mb-4 font-['Space_Grotesk']">Recent Sales</h3>
        <div className="space-y-3">
          {sales.slice(-5).reverse().map((s) => (
            <div key={s.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div>
                <p className="text-sm font-medium">{s.productName}</p>
                <p className="text-xs text-muted-foreground">{s.customer} · {s.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">${s.total.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">×{s.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
