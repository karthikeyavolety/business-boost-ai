import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProducts, getSales } from "@/lib/store";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "How are my sales this week?",
  "Which product is selling best?",
  "Give me a business summary",
  "What category generates the most revenue?",
];

function generateInsight(question: string): string {
  const products = getProducts();
  const sales = getSales();
  const totalRevenue = sales.reduce((s, x) => s + x.total, 0);
  const topProduct = [...products].sort((a, b) => b.sold - a.sold)[0];
  const q = question.toLowerCase();

  const categoryMap: Record<string, number> = {};
  sales.forEach((s) => {
    const prod = products.find((p) => p.id === s.productId);
    const cat = prod?.category || "Other";
    categoryMap[cat] = (categoryMap[cat] || 0) + s.total;
  });
  const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];

  if (q.includes("sales") || q.includes("revenue")) {
    return `📊 **Sales Overview**\n\nYour total revenue is **$${totalRevenue.toFixed(2)}** across **${sales.length} orders**.\n\nAverage order value: **$${(totalRevenue / (sales.length || 1)).toFixed(2)}**\n\nTop performing product: **${topProduct?.name}** with ${topProduct?.sold} units sold.\n\n💡 *Tip: Consider running a promotion on lower-performing items to balance your sales mix.*`;
  }
  if (q.includes("best") || q.includes("top") || q.includes("product")) {
    return `🏆 **Top Product: ${topProduct?.name}**\n\n- Units Sold: **${topProduct?.sold}**\n- Price: **$${topProduct?.price}**\n- Revenue: **$${((topProduct?.sold || 0) * (topProduct?.price || 0)).toFixed(2)}**\n- Category: ${topProduct?.category}\n\nThis product accounts for a significant portion of your sales. Consider stocking more!`;
  }
  if (q.includes("category")) {
    return `📁 **Revenue by Category**\n\n${Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, rev]) => `- **${cat}**: $${rev.toFixed(2)}`)
      .join("\n")}\n\nTop category: **${topCategory?.[0]}** with $${topCategory?.[1]?.toFixed(2)} in revenue.`;
  }
  if (q.includes("summary") || q.includes("overview")) {
    return `📋 **Business Summary**\n\n- Total Products: **${products.length}**\n- Total Revenue: **$${totalRevenue.toFixed(2)}**\n- Total Orders: **${sales.length}**\n- Top Product: **${topProduct?.name}** (${topProduct?.sold} sold)\n- Top Category: **${topCategory?.[0]}**\n\n🚀 Your business is looking healthy! Focus on inventory management and keep an eye on stock levels for your top sellers.`;
  }
  return `Based on your data:\n\n- **${products.length}** products in inventory\n- **$${totalRevenue.toFixed(2)}** total revenue\n- **${topProduct?.name}** is your bestseller\n\nTry asking me about specific areas like sales trends, top products, or category breakdowns!`;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const response = generateInsight(text);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setTyping(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold font-['Space_Grotesk']">AI Assistant</h1>
        <p className="text-muted-foreground text-sm mt-1">Ask questions about your business data</p>
      </div>

      <div className="flex-1 glass-card rounded-xl flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-4 rounded-full gradient-primary mb-4">
                <Sparkles size={32} className="text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold font-['Space_Grotesk'] mb-2">Ask me anything about your business</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md">
                I analyze your sales data, products, and trends to give you actionable insights.
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="px-4 py-2 rounded-full border border-border text-sm hover:bg-primary/10 hover:border-primary transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={16} className="text-primary-foreground" />
                </div>
              )}
              <div className={`max-w-[70%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "gradient-primary text-primary-foreground"
                  : "bg-muted"
              }`}>
                {msg.content.split("\n").map((line, j) => (
                  <p key={j} className={j > 0 ? "mt-1" : ""}>
                    {line.split(/(\*\*.*?\*\*)/).map((part, k) =>
                      part.startsWith("**") && part.endsWith("**") ? (
                        <strong key={k}>{part.slice(2, -2)}</strong>
                      ) : (
                        <span key={k}>{part}</span>
                      )
                    )}
                  </p>
                ))}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                  <User size={16} />
                </div>
              )}
            </motion.div>
          ))}

          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-primary-foreground" />
              </div>
              <div className="bg-muted rounded-xl px-4 py-3 text-sm">
                <span className="inline-flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-border">
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your sales, products, or trends..."
              className="h-11"
            />
            <Button type="submit" disabled={!input.trim() || typing} className="h-11 px-5 gradient-primary text-primary-foreground">
              <Send size={18} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
