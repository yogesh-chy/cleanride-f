"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { Eye, EyeOff } from "lucide-react";
import heroImage from "@/assets/hero-carwash.jpg";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = login(email, password);
    if (success) {
      const savedStr = localStorage.getItem("carwash_user");
      const saved = savedStr ? JSON.parse(savedStr) : {};
      switch (saved.role) {
        case "admin": router.push("/admin"); break;
        case "staff": router.push("/staff"); break;
        default: router.push("/dashboard"); break;
      }
    } else {
      setError("Invalid email or password");
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
        <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full -top-32 -left-32 pointer-events-none" />
        
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
              DRIVE <br />
              <span className="text-gradient">TRANSFORMED.</span>
            </motion.h2>
            <p className="text-muted-foreground max-w-md font-body text-lg leading-relaxed">
              Log in to access your vehicle status, real-time tracking, and premium detailing history. Nepal's premier car wash center.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-body tracking-[0.3em] text-muted-foreground uppercase">
             <span>Kathmandu</span>
             <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
             <span>Lalitpur</span>
             <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
             <span>Bhaktapur</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background relative">
        {/* Subtle background glow for mobile */}
        <div className="lg:hidden absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-primary/20 blur-[100px] -z-10" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden text-center mb-10">
            <Link href="/" className="font-heading text-4xl tracking-wider">
              <span className="text-gradient">CLEAN</span>
              <span className="text-foreground">RIDE</span>
            </Link>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h1 className="font-heading text-4xl text-foreground mb-2 uppercase tracking-tight">Access Your Account</h1>
            <p className="font-body text-muted-foreground">Please enter your credentials to continue</p>
          </div>

          <div className="w-full space-y-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive font-body text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="font-body text-xs text-muted-foreground uppercase tracking-[0.2em] px-1 font-bold">Email Address</label>
                <input
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                  placeholder="name@example.com"
                  className="w-full px-6 py-4 rounded-xl bg-secondary/50 border border-white/10 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/30"
                />
              </div>

              <div className="space-y-2">
                <label className="font-body text-xs text-muted-foreground uppercase tracking-[0.2em] px-1 font-bold">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                    placeholder="••••••••"
                    className="w-full px-6 py-4 rounded-xl bg-secondary/50 border border-white/10 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/30 pr-12"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="rounded border-white/10 bg-secondary" />
                  <label htmlFor="remember" className="font-body text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Remember me</label>
                </div>
                <Link href="#" className="font-body text-xs text-primary hover:underline transition-all font-bold">Forgot password?</Link>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="w-full py-5 rounded-xl font-heading text-2xl tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-glow flex items-center justify-center gap-3 mt-4"
              >
                SIGN IN
              </motion.button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="font-body text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary font-bold hover:underline transition-all ml-1">Create an Account</Link>
              </p>
            </div>
            </div>
          </motion.div>
        </div>
      </div>
  );
}
