"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-carwash.jpg";
import { BASE_URL } from "@/lib/api-config";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/password-reset/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Reset link sent to your email.");
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Unable to connect to the server.");
    } finally {
      setIsLoading(false);
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
              RESTORE <br />
              <span className="text-gradient">ACCESS.</span>
            </motion.h2>
            <p className="text-muted-foreground max-w-md font-body text-lg leading-relaxed">
              Enter your email address and we'll send you a secure link to reset your password.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-body tracking-[0.3em] text-muted-foreground uppercase">
             <span>Security</span>
             <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
             <span>Privacy</span>
             <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
             <span>Protection</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background relative">
        {/* Subtle background glow for mobile */}
        <div className="lg:hidden absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-primary/20 blur-[100px] -z-10" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >

          <div className="mb-10 text-center lg:text-left">
            <h1 className="font-heading text-4xl text-foreground mb-2 uppercase tracking-tight leading-tight">Forgot Password?</h1>
            <p className="font-body text-muted-foreground">We'll send you instructions to reset your password.</p>
          </div>

          <div className="w-full space-y-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive font-body text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            {message && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 font-body text-sm text-center"
              >
                {message}
              </motion.div>
            )}

            {!message && (
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
                      SENDING...
                    </>
                  ) : "SEND RESET LINK"}
                </motion.button>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="font-body text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link href="/login" className="text-primary font-bold hover:underline transition-all ml-1">Back to Login</Link>
              </p>
            </div>
            </div>
          </motion.div>
        </div>
      </div>
  );
}
