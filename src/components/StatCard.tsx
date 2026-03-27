import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon: LucideIcon;
  index?: number;
}

export default function StatCard({ title, value, change, positive, icon: Icon, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="glass-card rounded-xl p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1 font-['Space_Grotesk']">{value}</p>
          {change && (
            <p className={`text-xs mt-2 font-medium ${positive ? "text-primary" : "text-destructive"}`}>
              {change}
            </p>
          )}
        </div>
        <div className="p-3 rounded-lg gradient-primary">
          <Icon size={20} className="text-primary-foreground" />
        </div>
      </div>
    </motion.div>
  );
}
