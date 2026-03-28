import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Plus, Minus, Trash2, Star, Search, CreditCard, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface ShopProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
}

interface CartItem extends ShopProduct {
  qty: number;
}

const catalog: ShopProduct[] = [
  { id: "p1", name: "Wireless Noise-Cancelling Headphones", category: "Electronics", price: 79.99, rating: 4.5, reviews: 2341, image: "🎧", badge: "Best Seller" },
  { id: "p2", name: "Organic Matcha Powder 200g", category: "Food & Beverage", price: 18.49, rating: 4.7, reviews: 876, image: "🍵" },
  { id: "p3", name: "Ergonomic Office Chair", category: "Furniture", price: 249.99, rating: 4.3, reviews: 1502, image: "🪑", badge: "Top Rated" },
  { id: "p4", name: "Smart Fitness Watch Pro", category: "Electronics", price: 129.99, rating: 4.6, reviews: 3210, image: "⌚", badge: "Trending" },
  { id: "p5", name: "Bamboo Cutting Board Set", category: "Kitchen", price: 24.99, rating: 4.4, reviews: 654, image: "🪵" },
  { id: "p6", name: "LED Ring Light 12-inch", category: "Electronics", price: 34.99, rating: 4.2, reviews: 1120, image: "💡" },
  { id: "p7", name: "Yoga Mat Premium 6mm", category: "Fitness", price: 29.99, rating: 4.8, reviews: 2045, image: "🧘", badge: "Best Seller" },
  { id: "p8", name: "Stainless Steel Water Bottle", category: "Lifestyle", price: 19.99, rating: 4.5, reviews: 980, image: "🫗" },
  { id: "p9", name: "Portable Bluetooth Speaker", category: "Electronics", price: 44.99, rating: 4.3, reviews: 1890, image: "🔊" },
  { id: "p10", name: "Scented Candle Gift Set", category: "Home", price: 22.99, rating: 4.6, reviews: 732, image: "🕯️" },
  { id: "p11", name: "Mechanical Gaming Keyboard", category: "Electronics", price: 89.99, rating: 4.4, reviews: 1567, image: "⌨️", badge: "Trending" },
  { id: "p12", name: "Plant-Based Protein Bars (12pk)", category: "Food & Beverage", price: 26.99, rating: 4.1, reviews: 443, image: "🍫" },
];

export default function Shop() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const filtered = catalog.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: ShopProduct) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === product.id);
      if (existing) return prev.map((c) => c.id === product.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => prev.map((c) => c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c));
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleOrder = () => {
    setOrdered(true);
    setTimeout(() => {
      setCart([]);
      setCheckoutOpen(false);
      setOrdered(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shop</h1>
          <p className="text-muted-foreground text-sm mt-1">Browse products and add to cart</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Button variant="outline" className="relative" onClick={() => setCartOpen(true)}>
            <ShoppingCart className="w-4 h-4 mr-2" /> Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">{totalItems}</span>
            )}
          </Button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card rounded-xl p-4 flex flex-col justify-between hover:shadow-xl transition-shadow">
            <div>
              <div className="text-5xl text-center py-6">{p.image}</div>
              {p.badge && (
                <Badge variant="secondary" className="mb-2 text-[10px]">{p.badge}</Badge>
              )}
              <h3 className="font-semibold text-sm leading-snug line-clamp-2">{p.name}</h3>
              <p className="text-muted-foreground text-xs mt-1">{p.category}</p>
              <div className="flex items-center gap-1 mt-2">
                <Star className="w-3.5 h-3.5 fill-[hsl(var(--trending))] text-[hsl(var(--trending))]" />
                <span className="text-xs font-medium">{p.rating}</span>
                <span className="text-xs text-muted-foreground">({p.reviews.toLocaleString()})</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-lg font-bold">${p.price.toFixed(2)}</span>
              <Button size="sm" onClick={() => addToCart(p)}>
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cart Drawer */}
      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> Your Cart ({totalItems})</DialogTitle></DialogHeader>
          {cart.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">Your cart is empty</p>
          ) : (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                  <span className="text-2xl">{item.image}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => updateQty(item.id, -1)}><Minus className="w-3 h-3" /></Button>
                    <span className="text-sm font-semibold w-6 text-center">{item.qty}</span>
                    <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => updateQty(item.id, 1)}><Plus className="w-3 h-3" /></Button>
                  </div>
                  <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => removeItem(item.id)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                </div>
              ))}
            </div>
          )}
          {cart.length > 0 && (
            <div className="pt-3 space-y-2">
              <Separator />
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">${subtotal.toFixed(2)}</span></div>
              <Button className="w-full" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>
                <CreditCard className="w-4 h-4 mr-2" /> Proceed to Checkout
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Checkout</DialogTitle></DialogHeader>
          <AnimatePresence mode="wait">
            {ordered ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-10 gap-3">
                <CheckCircle2 className="w-16 h-16 text-primary" />
                <h3 className="text-xl font-bold">Order Placed!</h3>
                <p className="text-muted-foreground text-sm">Thank you for your purchase.</p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} × {item.qty}</span>
                      <span className="font-medium">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
                  <Separator />
                  <div className="flex justify-between font-bold text-base"><span>Total</span><span>${total.toFixed(2)}</span></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><Label className="text-xs">Full Name</Label><Input placeholder="John Doe" /></div>
                  <div className="space-y-1"><Label className="text-xs">Email</Label><Input placeholder="john@email.com" /></div>
                </div>
                <div className="space-y-1"><Label className="text-xs">Shipping Address</Label><Input placeholder="123 Main St, City, State" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><Label className="text-xs">Card Number</Label><Input placeholder="4242 4242 4242 4242" /></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1"><Label className="text-xs">Expiry</Label><Input placeholder="MM/YY" /></div>
                    <div className="space-y-1"><Label className="text-xs">CVV</Label><Input placeholder="123" /></div>
                  </div>
                </div>
                <Button className="w-full" onClick={handleOrder}>Place Order — ${total.toFixed(2)}</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}
