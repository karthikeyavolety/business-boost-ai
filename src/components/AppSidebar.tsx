import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, FileText, Bot, TrendingUp, LogOut } from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/products", icon: Package, label: "Products & Sales" },
  { to: "/invoices", icon: FileText, label: "Invoices" },
  { to: "/insights", icon: TrendingUp, label: "Analytics" },
  { to: "/assistant", icon: Bot, label: "AI Assistant" },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 gradient-dark flex flex-col z-50">
      <div className="p-6 border-b border-sidebar-hover">
        <h1 className="text-xl font-bold text-sidebar-active tracking-tight font-['Space_Grotesk']">
          ⚡ BizFlow
        </h1>
        <p className="text-xs text-sidebar-foreground mt-1">Smart Business Platform</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-sidebar-active/15 text-sidebar-active"
                  : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-active/80"
              }`}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-hover">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-hover transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </NavLink>
      </div>
    </aside>
  );
}
