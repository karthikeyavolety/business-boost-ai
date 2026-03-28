import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Package, BarChart3, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/dashboard", label: "Stock Overview", icon: Package },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function DashboardLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-14">
          <h1 className="text-lg font-bold text-primary tracking-tight">TrendVault</h1>
          <nav className="flex items-center gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                <l.icon className="w-4 h-4" />
                {l.label}
              </NavLink>
            ))}
          </nav>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground">
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
