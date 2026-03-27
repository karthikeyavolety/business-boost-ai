import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, BarChart3, Bot, FileText } from "lucide-react";

const features = [
  { icon: BarChart3, title: "Smart Dashboard", desc: "Real-time analytics & charts" },
  { icon: Bot, title: "AI Assistant", desc: "Ask questions, get insights" },
  { icon: FileText, title: "Auto Invoicing", desc: "Generate invoices instantly" },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Brand */}
      <div className="hidden lg:flex lg:w-1/2 gradient-dark items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-primary"
              style={{
                width: Math.random() * 300 + 50,
                height: Math.random() * 300 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3,
              }}
            />
          ))}
        </div>
        <div className="relative z-10 max-w-md">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-8">
              <Zap size={36} className="text-primary" />
              <h1 className="text-4xl font-bold text-white font-['Space_Grotesk']">BizFlow</h1>
            </div>
            <p className="text-lg text-sidebar-foreground mb-10 leading-relaxed">
              The smart business automation platform that helps you track sales, generate invoices, 
              and get AI-powered insights — all in one place.
            </p>
            <div className="space-y-6">
              {features.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="flex items-center gap-4"
                >
                  <div className="p-2.5 rounded-lg bg-primary/15">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{title}</p>
                    <p className="text-sidebar-foreground text-xs">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Zap size={28} className="text-primary" />
            <h1 className="text-2xl font-bold font-['Space_Grotesk']">BizFlow</h1>
          </div>

          <h2 className="text-2xl font-bold font-['Space_Grotesk']">Welcome back</h2>
          <p className="text-muted-foreground text-sm mt-1 mb-8">Sign in to your business dashboard</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full h-11 gradient-primary text-primary-foreground font-semibold">
              Sign In
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Demo mode — enter any credentials to continue
          </p>
        </motion.div>
      </div>
    </div>
  );
}
