"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-heading text-9xl text-primary opacity-20">404</h1>
        <div className="mt-[-4rem]">
          <h2 className="font-heading text-4xl md:text-6xl text-foreground mb-4">PAGE NOT FOUND</h2>
          <p className="font-body text-muted-foreground max-w-md mx-auto mb-8">
            The vehicle you're looking for has already been washed and left the station. 
            Or maybe it never arrived at this address.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 px-8 py-3 rounded-md font-heading text-lg tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Home size={18} /> BACK TO HOME
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-8 py-3 rounded-md font-heading text-lg tracking-wider border border-border text-foreground hover:bg-secondary transition-colors"
            >
              <ArrowLeft size={18} /> GO BACK
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />
    </div>
  );
}
