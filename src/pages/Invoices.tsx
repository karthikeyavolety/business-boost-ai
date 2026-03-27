import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getInvoices, saveInvoices, type Invoice } from "@/lib/store";
import { toast } from "sonner";

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(getInvoices);
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState("");
  const [items, setItems] = useState([{ name: "", qty: "1", price: "" }]);

  const addItem = () => setItems([...items, { name: "", qty: "1", price: "" }]);
  const updateItem = (i: number, field: string, val: string) => {
    const updated = [...items];
    (updated[i] as any)[field] = val;
    setItems(updated);
  };

  const createInvoice = () => {
    if (!customer || items.some((it) => !it.name || !it.price)) return toast.error("Fill all fields");
    const parsedItems = items.map((it) => ({ name: it.name, qty: parseInt(it.qty) || 1, price: parseFloat(it.price) }));
    const total = parsedItems.reduce((s, it) => s + it.qty * it.price, 0);
    const inv: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-${String(invoices.length + 1).padStart(4, "0")}`,
      customer,
      items: parsedItems,
      total: +total.toFixed(2),
      date: new Date().toISOString().slice(0, 10),
      status: "pending",
    };
    const updated = [...invoices, inv];
    setInvoices(updated);
    saveInvoices(updated);
    setCustomer("");
    setItems([{ name: "", qty: "1", price: "" }]);
    setOpen(false);
    toast.success(`Invoice ${inv.invoiceNumber} created!`);
  };

  const deleteInvoice = (id: string) => {
    const updated = invoices.filter((i) => i.id !== id);
    setInvoices(updated);
    saveInvoices(updated);
  };

  const downloadInvoice = (inv: Invoice) => {
    const content = `
INVOICE: ${inv.invoiceNumber}
Date: ${inv.date}
Customer: ${inv.customer}
${"─".repeat(40)}
${inv.items.map((it) => `${it.name}  x${it.qty}  $${(it.qty * it.price).toFixed(2)}`).join("\n")}
${"─".repeat(40)}
TOTAL: $${inv.total.toFixed(2)}
Status: ${inv.status.toUpperCase()}
    `.trim();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${inv.invoiceNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusColor = (s: string) => {
    if (s === "paid") return "bg-primary/15 text-primary";
    if (s === "overdue") return "bg-destructive/15 text-destructive";
    return "bg-chart-3/15 text-chart-3";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-['Space_Grotesk']">Invoices</h1>
          <p className="text-muted-foreground text-sm mt-1">Generate and manage invoices</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground"><Plus size={16} className="mr-2" />New Invoice</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create Invoice</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div><Label>Customer Name</Label><Input value={customer} onChange={(e) => setCustomer(e.target.value)} /></div>
              <div className="space-y-3">
                <Label>Items</Label>
                {items.map((it, i) => (
                  <div key={i} className="grid grid-cols-5 gap-2">
                    <Input className="col-span-2" placeholder="Item name" value={it.name} onChange={(e) => updateItem(i, "name", e.target.value)} />
                    <Input type="number" placeholder="Qty" value={it.qty} onChange={(e) => updateItem(i, "qty", e.target.value)} />
                    <Input type="number" placeholder="Price" value={it.price} onChange={(e) => updateItem(i, "price", e.target.value)} />
                    {i > 0 && (
                      <button onClick={() => setItems(items.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive flex items-center justify-center">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addItem}>+ Add Item</Button>
              </div>
              <Button onClick={createInvoice} className="w-full gradient-primary text-primary-foreground">Create Invoice</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {invoices.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-xl p-12 text-center">
          <p className="text-muted-foreground">No invoices yet. Create your first invoice to get started.</p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Invoice</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Customer</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase">Amount</th>
                <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-medium text-sm font-mono">{inv.invoiceNumber}</td>
                  <td className="p-4 text-sm">{inv.customer}</td>
                  <td className="p-4 text-sm text-muted-foreground">{inv.date}</td>
                  <td className="p-4 text-sm text-right font-semibold">${inv.total.toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(inv.status)}`}>{inv.status}</span>
                  </td>
                  <td className="p-4 text-right flex gap-2 justify-end">
                    <button onClick={() => downloadInvoice(inv)} className="text-muted-foreground hover:text-primary transition-colors"><Download size={16} /></button>
                    <button onClick={() => deleteInvoice(inv.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}
