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
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (result.success) {
      // Middleware or the auth context already sets role cookie
      // Read role from cookie to redirect
      const role = document.cookie.split(";").find(c => c.trim().startsWith("user_role="))?.split("=")[1];
      switch (role) {
        case "admin": router.push("/admin"); break;
        case "staff": router.push("/staff"); break;
        default: router.push("/dashboard"); break;
      }
    } else {
      setError(result.error || "Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen bg-background overflow-hidden font-body relative">
      <Link href="/" className="absolute top-6 left-6 md:left-10 z-50 font-heading text-3xl md:text-5xl tracking-wider">
        <span className="text-gradient">CLEAN</span>
        <span className="text-foreground">RIDE</span>
      </Link>

      {/* Left Panel: Visual/Branding (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-secondary overflow-hidden group">
        <img
          src={heroImage.src}
          alt="Luxury car wash branding"
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 group-hover:scale-110 transition-transform duration-[20s] ease-linear"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/20 to-transparent" />
        <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full -top-32 -left-32 pointer-events-none" />
        
        <div className="relative z-10 w-full p-16 flex flex-col justify-end">
          
          <div className="space-y-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-7xl md:text-8xl leading-[1.1] text-foreground uppercase italic"
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
      <div className="w-full lg:w-1/2 flex items-start lg:items-center justify-center pt-4 pb-8 px-8 bg-background relative">
        {/* Subtle background glow for mobile */}
        <div className="lg:hidden absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-primary/20 blur-[100px] -z-10" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >

          <div className="mb-2 text-center lg:text-left">
            <h1 className="font-heading text-4xl text-foreground mb-1 uppercase tracking-tight leading-tight">Access Your Account</h1>
            <p className="font-body text-muted-foreground">Please enter your credentials to continue</p>
          </div>

          <div className="w-full space-y-4">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive font-body text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2">
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
                <div className="flex justify-end px-1 mt-1">
                  <Link href="/forgot-password" title="Request a password reset" className="font-body text-[10px] text-primary hover:underline transition-all font-bold uppercase tracking-wider">Forgot password?</Link>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                type="submit" 
                disabled={isLoading}
                className="w-full py-5 rounded-xl font-heading text-2xl tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-glow flex items-center justify-center gap-3 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    SIGNING IN...
                  </>
                ) : "SIGN IN"}
              </motion.button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground font-body font-bold tracking-[0.2em]">or</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="w-full py-4 rounded-xl font-body text-sm font-bold tracking-wider bg-secondary/50 border border-white/10 hover:bg-secondary/80 transition-all flex items-center justify-center gap-3 text-foreground"
              >
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.02.68-2.33 1.08-3.71 1.08-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.12c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.1H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.9l3.66-2.78z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.1l3.66 2.84c.87-2.6 3.3-4.56 6.16-4.56z" fill="#EA4335"/>
                </svg>
                CONTINUE WITH GOOGLE
              </motion.button>
            </form>

            <div className="mt-4 pt-2 border-t border-white/5 text-center">
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
