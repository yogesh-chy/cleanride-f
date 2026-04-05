"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth, UserRole } from "@/lib/auth-context";
import heroImage from "@/assets/hero-carwash.jpg";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(name, email, password, role, phone);
    switch (role) {
      case "admin": router.push("/admin"); break;
      case "staff": router.push("/staff"); break;
      default: router.push("/dashboard"); break;
    }
  };

  return (
    <div className="flex min-h-screen bg-background overflow-hidden font-body">
      {/* Left Panel: Visual/Branding (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-secondary overflow-hidden group">
        <img
          src={heroImage.src}
          alt="Luxury car wash branding"
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 group-hover:scale-110 transition-transform duration-[20s] ease-linear"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/20 to-transparent" />
        <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full -bottom-32 -left-32 pointer-events-none" />
        
        <div className="relative z-10 w-full p-16 flex flex-col justify-between">
          <Link href="/" className="font-heading text-5xl tracking-[0.1em] flex items-center gap-3">
             <span className="text-gradient">CLEAN</span>
             <span className="text-foreground">RIDE</span>
          </Link>
          
          <div className="space-y-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-7xl md:text-8xl leading-none text-foreground uppercase italic"
            >
              JOIN THE <br />
              <span className="text-gradient">REVOLUTION.</span>
            </motion.h2>
            <p className="text-muted-foreground max-w-md font-body text-lg leading-relaxed">
              Create an account to book premium washes, track your vehicle live, and earn exclusive loyalty rewards.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-body tracking-[0.3em] text-muted-foreground uppercase">
             <span>Premium Care</span>
             <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
             <span>Real-time Tracking</span>
             <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
             <span>Expert Service</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background relative">
        <div className="lg:hidden absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-primary/20 blur-[100px] -z-10" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden text-center mb-6">
            <Link href="/" className="font-heading text-4xl tracking-wider">
              <span className="text-gradient">CLEAN</span>
              <span className="text-foreground">RIDE</span>
            </Link>
          </div>

          <div className="mb-6 text-center lg:text-left">
            <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-2 uppercase tracking-tight">Create Account</h1>
            <p className="font-body text-muted-foreground text-sm">Start your journey to a cleaner ride today</p>
          </div>

          <div className="w-full space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="font-body text-xs text-muted-foreground uppercase tracking-[0.2em] px-1 font-bold">Full Name</label>
                <input
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required
                  placeholder="Your full name"
                  className="w-full px-5 py-3 rounded-xl bg-secondary/50 border border-white/10 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/30"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-body text-xs text-muted-foreground uppercase tracking-[0.2em] px-1 font-bold">Email</label>
                  <input
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                    placeholder="you@email.com"
                    className="w-full px-5 py-3 rounded-xl bg-secondary/50 border border-white/10 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-body text-xs text-muted-foreground uppercase tracking-[0.2em] px-1 font-bold">Phone</label>
                  <input
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required
                    placeholder="+977 98..."
                    className="w-full px-5 py-3 rounded-xl bg-secondary/50 border border-white/10 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/30"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-body text-xs text-muted-foreground uppercase tracking-[0.2em] px-1 font-bold">Password</label>
                <input
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                  placeholder="••••••••"
                  className="w-full px-5 py-3 rounded-xl bg-secondary/50 border border-white/10 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/30"
                />
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="w-full py-4 rounded-xl font-heading text-xl tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-glow flex items-center justify-center gap-3 mt-2"
              >
                CREATE ACCOUNT
              </motion.button>
            </form>

            <div className="mt-4 pt-4 border-t border-white/5 text-center">
              <p className="font-body text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-bold hover:underline transition-all ml-1">Sign In</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
