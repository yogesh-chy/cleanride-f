"use client";

import { motion } from "framer-motion";

import heroImage from "@/assets/hero-carwash.jpg";

interface PageHeroProps {
  title: string;
  subtitle?: string;
}

export const PageHero = ({ title, subtitle }: PageHeroProps) => {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden border-b border-white/5">
      {/* Background Image with Overlays */}
      <div className="absolute inset-0 -z-20 bg-black">
        <img
          src={heroImage.src}
          alt=""
          className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-primary/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-heading text-6xl md:text-8xl text-foreground mb-4 tracking-tighter">
            {title.split(' ').map((word, i) => (
              <span key={i} className={i === title.split(' ').length - 1 ? "text-gradient" : ""}>
                {word}{" "}
              </span>
            ))}
          </h1>
          {subtitle && (
            <p className="font-body text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>

      {/* Decorative Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[150px] -z-10 animate-pulse-glow" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 blur-[150px] -z-10" />
    </section>
  );
};
