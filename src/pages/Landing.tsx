import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Eye, Monitor, BarChart3, Scan, AlertTriangle, Activity, Zap, ChevronRight, Github, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Scan, title: "Face Detection", desc: "Real-time face recognition detects multiple people in frame instantly." },
  { icon: Eye, title: "Eye Tracking", desc: "AI monitors gaze direction to flag suspicious looking-away patterns." },
  { icon: Monitor, title: "Tab Monitoring", desc: "Detects tab switching, screen sharing, and unauthorized app usage." },
  { icon: BarChart3, title: "Risk Scoring", desc: "Dynamic cheating risk score from green to red with instant alerts." },
];

const stats = [
  { value: "99.2%", label: "Detection Accuracy" },
  { value: "< 0.3s", label: "Response Time" },
  { value: "50K+", label: "Exams Monitored" },
  { value: "98%", label: "Fraud Prevented" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-background/60 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary" />
            <span className="font-['Orbitron'] font-bold text-lg text-foreground">AI Exam Guardian</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#demo" className="hover:text-foreground transition-colors">Demo</a>
            <a href="#dashboard" className="hover:text-foreground transition-colors">Dashboard</a>
          </div>
          <Link to="/monitor">
            <Button className="gradient-neon text-primary-foreground font-semibold rounded-full px-6 shadow-neon-blue">
              Start Monitoring
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Animated BG elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/10 blur-[100px] animate-float" />
          <div className="absolute top-40 right-20 w-96 h-96 rounded-full bg-secondary/10 blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-10 left-1/3 w-64 h-64 rounded-full bg-neon-pink/10 blur-[100px] animate-float" style={{ animationDelay: "4s" }} />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-6">
              🛡️ AI-POWERED PROCTORING
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 font-['Orbitron']">
              <span className="bg-clip-text text-transparent gradient-hero">Stop Cheating.</span>
              <br />
              <span className="text-foreground">Start Smart Monitoring.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Intelligent AI invigilator that watches exams in real-time, detects suspicious behavior, and flags cheating automatically.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/monitor">
                <Button size="lg" className="gradient-neon text-primary-foreground font-bold rounded-full px-10 py-6 text-lg shadow-neon-blue hover:scale-105 transition-transform">
                  Start Monitoring <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="rounded-full px-10 py-6 text-lg border-border/50 hover:bg-muted/50">
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="glass-card rounded-2xl p-6">
                <div className="text-3xl font-bold font-['Orbitron'] bg-clip-text text-transparent gradient-neon">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-['Orbitron'] mb-4">Intelligent Monitoring</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Four layers of AI-powered detection working together to ensure exam integrity.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="glass-card-hover rounded-2xl p-6 h-full group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl gradient-neon flex items-center justify-center mb-4 group-hover:shadow-neon-blue transition-shadow">
                    <f.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 font-['Orbitron'] text-sm">{f.title}</h3>
                  <p className="text-muted-foreground text-sm">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo Preview */}
      <section id="demo" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-['Orbitron'] mb-4">Live Detection Preview</h2>
            <p className="text-muted-foreground">See how our AI monitors exam sessions in real-time.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="glass-card rounded-3xl p-2 neon-border">
            <div className="bg-background/80 rounded-2xl overflow-hidden">
              {/* Mock webcam view */}
              <div className="relative aspect-video bg-muted/30 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/60" />
                {/* Scan line */}
                <div className="absolute left-0 right-0 h-0.5 bg-accent/50 animate-scan" />
                {/* Face bounding box */}
                <div className="relative">
                  <div className="w-40 h-48 border-2 border-accent rounded-lg relative">
                    <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-accent" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-accent" />
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-accent" />
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-accent" />
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Scan className="w-10 h-10 text-accent mx-auto mb-2 animate-pulse-glow" />
                        <span className="text-xs text-accent font-semibold">SCANNING</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent/20 text-accent text-xs px-3 py-1 rounded-full font-mono">
                    Face Detected — 1 Person
                  </div>
                </div>
                {/* Alert popups */}
                <motion.div animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }} className="absolute top-4 right-4 glass-card rounded-lg px-4 py-2 flex items-center gap-2 border-accent/30">
                  <Activity className="w-4 h-4 text-accent" />
                  <span className="text-xs text-accent">Gaze: Forward ✓</span>
                </motion.div>
                <motion.div animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, delay: 2 }} className="absolute bottom-4 right-4 glass-card rounded-lg px-4 py-2 flex items-center gap-2 border-neon-pink/30">
                  <AlertTriangle className="w-4 h-4 text-neon-pink" />
                  <span className="text-xs text-neon-pink">Tab Switch Detected!</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="dashboard" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-['Orbitron'] mb-4">Monitoring Dashboard</h2>
            <p className="text-muted-foreground">Real-time insights and risk assessment at a glance.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid md:grid-cols-3 gap-6">
            {/* Risk Score */}
            <div className="glass-card-hover rounded-2xl p-6 text-center">
              <h4 className="text-sm font-semibold text-muted-foreground mb-4 font-['Orbitron']">RISK SCORE</h4>
              <div className="relative w-36 h-36 mx-auto">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="url(#riskGrad)" strokeWidth="8" strokeDasharray="264" strokeDashoffset="185" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="riskGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(142, 71%, 45%)" />
                      <stop offset="100%" stopColor="hsl(38, 92%, 50%)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold font-['Orbitron'] text-accent">30%</span>
                </div>
              </div>
              <p className="text-sm text-accent mt-3 font-semibold">Low Risk</p>
            </div>

            {/* Activity Log */}
            <div className="glass-card-hover rounded-2xl p-6">
              <h4 className="text-sm font-semibold text-muted-foreground mb-4 font-['Orbitron']">ACTIVITY LOG</h4>
              <div className="space-y-3">
                {[
                  { time: "10:02:15", text: "Face detected — 1 person", color: "text-accent" },
                  { time: "10:04:32", text: "Gaze shifted left for 3s", color: "text-chart-5" },
                  { time: "10:05:10", text: "Tab switch detected!", color: "text-neon-pink" },
                  { time: "10:06:45", text: "Face re-centered", color: "text-accent" },
                  { time: "10:08:20", text: "Multiple faces detected!", color: "text-destructive" },
                ].map((log, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-xs text-muted-foreground font-mono shrink-0">{log.time}</span>
                    <span className={log.color}>{log.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="glass-card-hover rounded-2xl p-6">
              <h4 className="text-sm font-semibold text-muted-foreground mb-4 font-['Orbitron']">SESSION STATS</h4>
              <div className="space-y-4">
                {[
                  { label: "Exam Duration", value: "01:23:45", icon: Activity },
                  { label: "Alerts Triggered", value: "3", icon: AlertTriangle },
                  { label: "Tab Switches", value: "1", icon: Monitor },
                  { label: "Gaze Deviations", value: "5", icon: Eye },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <stat.icon className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                    </div>
                    <span className="font-semibold font-mono text-foreground">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="text-center mt-10">
            <Link to="/monitor">
              <Button size="lg" className="gradient-neon text-primary-foreground font-bold rounded-full px-10 shadow-neon-blue hover:scale-105 transition-transform">
                <Zap className="mr-2 w-5 h-5" /> Launch Full Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10 px-6">
        <div className="h-px w-full gradient-neon mb-8 opacity-40" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-['Orbitron'] font-bold text-sm">AI Exam Guardian</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 AI Exam Guardian. Securing academic integrity.</p>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
