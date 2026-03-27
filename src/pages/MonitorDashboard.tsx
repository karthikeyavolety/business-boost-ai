import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Eye, Monitor, Scan, AlertTriangle, Activity, ArrowLeft, User, Clock, Camera, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockAlerts = [
  { time: "10:02:15", text: "Session started — Face detected", type: "info" },
  { time: "10:04:32", text: "Gaze shifted left for 3.2s", type: "warning" },
  { time: "10:05:10", text: "Tab switch detected!", type: "danger" },
  { time: "10:06:45", text: "Face re-centered — Normal", type: "info" },
  { time: "10:08:20", text: "Second person detected in frame!", type: "danger" },
  { time: "10:09:55", text: "Gaze returned to screen", type: "info" },
  { time: "10:11:30", text: "Rapid eye movement detected", type: "warning" },
  { time: "10:13:02", text: "Screen left for 2.1s", type: "warning" },
];

export default function MonitorDashboard() {
  const [riskScore, setRiskScore] = useState(18);
  const [timer, setTimer] = useState(0);
  const [alerts, setAlerts] = useState(mockAlerts.slice(0, 3));

  useEffect(() => {
    const t = setInterval(() => setTimer((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (alerts.length < mockAlerts.length) {
      const timeout = setTimeout(() => {
        const next = mockAlerts[alerts.length];
        setAlerts((p) => [...p, next]);
        if (next.type === "danger") setRiskScore((p) => Math.min(95, p + 20));
        else if (next.type === "warning") setRiskScore((p) => Math.min(95, p + 8));
      }, 4000 + Math.random() * 3000);
      return () => clearTimeout(timeout);
    }
  }, [alerts]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const riskColor = riskScore < 30 ? "text-accent" : riskScore < 60 ? "text-chart-5" : "text-destructive";
  const riskLabel = riskScore < 30 ? "Low Risk" : riskScore < 60 ? "Medium Risk" : "High Risk";
  const strokeOffset = 264 - (264 * riskScore) / 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border/50 backdrop-blur-xl bg-background/80 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-['Orbitron'] font-bold text-sm">Monitoring Dashboard</span>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4" /> Student: <span className="text-foreground font-medium">John Doe</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" /> <span className="font-mono text-foreground">{formatTime(timer)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-4 h-4 text-accent" />
            <span className="text-xs text-accent font-semibold animate-pulse-glow">LIVE</span>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main webcam feed */}
          <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">Live Camera Feed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                <span className="text-xs text-destructive font-semibold">REC</span>
              </div>
            </div>
            <div className="relative aspect-video bg-muted/20 flex items-center justify-center">
              <div className="absolute left-0 right-0 h-px bg-accent/30 animate-scan" />
              {/* Face box */}
              <div className="relative">
                <div className="w-44 h-52 border-2 border-accent rounded-lg relative">
                  <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-accent" />
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-accent" />
                  <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-accent" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-accent" />
                  <div className="flex items-center justify-center h-full flex-col gap-2">
                    <Scan className="w-12 h-12 text-accent animate-pulse-glow" />
                    <span className="text-xs text-accent font-mono">TRACKING</span>
                  </div>
                </div>
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-accent/20 text-accent text-xs px-3 py-1 rounded-full font-mono whitespace-nowrap">
                  ID: Student_001 — Confidence: 97.3%
                </div>
              </div>
              {/* Eye tracking overlay */}
              <motion.div animate={{ x: [0, 5, -3, 0], y: [0, -2, 3, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-4 left-4 glass-card rounded-lg px-3 py-2 text-xs">
                <div className="flex items-center gap-2 text-accent">
                  <Eye className="w-3.5 h-3.5" /> Gaze: Center ✓
                </div>
              </motion.div>
            </div>
          </div>

          {/* Risk Meter */}
          <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center">
            <h4 className="text-xs font-semibold text-muted-foreground font-['Orbitron'] tracking-wider mb-6">CHEATING RISK SCORE</h4>
            <div className="relative w-44 h-44">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                <motion.circle cx="50" cy="50" r="42" fill="none" stroke={riskScore < 30 ? "hsl(var(--accent))" : riskScore < 60 ? "hsl(38,92%,50%)" : "hsl(var(--destructive))"} strokeWidth="6" strokeDasharray="264" initial={{ strokeDashoffset: 264 }} animate={{ strokeDashoffset: strokeOffset }} transition={{ duration: 1, ease: "easeOut" }} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span key={riskScore} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className={`text-4xl font-bold font-['Orbitron'] ${riskColor}`}>
                  {riskScore}%
                </motion.span>
              </div>
            </div>
            <p className={`text-sm font-semibold mt-4 ${riskColor}`}>{riskLabel}</p>
            <div className="w-full mt-6 space-y-2">
              {[
                { label: "Tab Switches", value: alerts.filter(a => a.text.includes("Tab")).length },
                { label: "Gaze Flags", value: alerts.filter(a => a.text.includes("Gaze") || a.text.includes("eye")).length },
                { label: "Person Alerts", value: alerts.filter(a => a.text.includes("person")).length },
              ].map((s, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-mono font-semibold text-foreground">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Monitor */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Monitor className="w-4 h-4 text-primary" />
              <h4 className="text-xs font-semibold text-muted-foreground font-['Orbitron'] tracking-wider">TAB MONITOR</h4>
            </div>
            <div className="space-y-3 mb-6">
              <div className="rounded-lg bg-accent/10 border border-accent/20 px-4 py-3">
                <div className="text-xs text-muted-foreground">Current Tab</div>
                <div className="text-sm font-medium text-accent truncate">exam.university.edu/test</div>
              </div>
              <div className="rounded-lg bg-muted/30 border border-border/50 px-4 py-3">
                <div className="text-xs text-muted-foreground">Last Switch</div>
                <div className="text-sm font-medium text-neon-pink truncate">google.com/search?q=...</div>
              </div>
            </div>
            <div className="border-t border-border/50 pt-4">
              <h5 className="text-xs text-muted-foreground font-semibold mb-3">BROWSER STATUS</h5>
              <div className="space-y-2">
                {[
                  { label: "Fullscreen", ok: true },
                  { label: "DevTools", ok: true },
                  { label: "Copy/Paste", ok: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className={item.ok ? "text-accent text-xs" : "text-neon-pink text-xs font-semibold"}>
                      {item.ok ? "✓ Secure" : "⚠ Flagged"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="mt-6 glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-primary" />
            <h4 className="text-xs font-semibold text-muted-foreground font-['Orbitron'] tracking-wider">REAL-TIME ACTIVITY LOG</h4>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {alerts.map((alert, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={`flex items-start gap-3 text-sm px-3 py-2 rounded-lg ${
                alert.type === "danger" ? "bg-destructive/10 border border-destructive/20" :
                alert.type === "warning" ? "bg-chart-5/10 border border-chart-5/20" :
                "bg-muted/30 border border-border/30"
              }`}>
                {alert.type === "danger" ? <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" /> :
                 alert.type === "warning" ? <AlertTriangle className="w-4 h-4 text-chart-5 shrink-0 mt-0.5" /> :
                 <Activity className="w-4 h-4 text-accent shrink-0 mt-0.5" />}
                <span className="font-mono text-xs text-muted-foreground shrink-0">{alert.time}</span>
                <span className={
                  alert.type === "danger" ? "text-destructive" :
                  alert.type === "warning" ? "text-chart-5" :
                  "text-foreground"
                }>{alert.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
