"use client";

import { PageHero } from "@/components/sections/PageHero";
import GallerySection from "@/components/sections/GallerySection";
import ContactSection from "@/components/sections/ContactSection";
import { motion } from "framer-motion";
import { Camera, Layers, Image as ImageIcon, Instagram } from "lucide-react";

export default function GalleryPage() {
  const stats = [
    { label: "High-Res Photos", value: "250+", icon: ImageIcon },
    { label: "Completed Projects", value: "1,200+", icon: Layers },
    { label: "Happy Clients", value: "850+", icon: Camera },
    { label: "Instagram Fans", value: "15k+", icon: Instagram }
  ];

  return (
    <main className="min-h-screen bg-background pb-20">
      <PageHero 
        title="Visual Excellence" 
        subtitle="A collection of our finest transformations. Every car tells a story of care and precision."
      />

      {/* Main Gallery Component */}
      <GallerySection />

      {/* Gallery Stats / Banner */}
      <section className="container mx-auto px-4 py-24 border-t border-white/5 overflow-hidden">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-secondary/20 border border-white/5"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                <stat.icon size={24} />
              </div>
              <div className="font-heading text-4xl text-foreground mb-1 tracking-wider">{stat.value}</div>
              <div className="font-body text-[10px] text-muted-foreground uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Showcase Tagline Section */}
      <section className="container mx-auto px-4 py-24 bg-card rounded-3xl mb-24 overflow-hidden relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="font-heading text-4xl md:text-5xl text-foreground uppercase tracking-tighter italic">
            "Your Passion, <span className="text-gradient">Our Craft."</span>
          </h2>
          <p className="font-body text-muted-foreground text-sm max-w-2xl mx-auto">
            Experience the transformation for yourself. Every image in our gallery represents hours of meticulous work, 
            premium products, and an unwavering commitment to automotive perfection.
          </p>
          <div className="flex justify-center flex-wrap gap-4 pt-10">
              <span className="px-6 py-2 rounded-full border border-white/10 font-body text-xs text-muted-foreground bg-white/5 uppercase tracking-widest">Exterior Restoration</span>
              <span className="px-6 py-2 rounded-full border border-white/10 font-body text-xs text-muted-foreground bg-white/5 uppercase tracking-widest">Interior Detailing</span>
              <span className="px-6 py-2 rounded-full border border-white/10 font-body text-xs text-muted-foreground bg-white/5 uppercase tracking-widest">Ceramic Coating</span>
              <span className="px-6 py-2 rounded-full border border-white/10 font-body text-xs text-muted-foreground bg-white/5 uppercase tracking-widest">Paint Correction</span>
          </div>
        </div>
        
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 blur-[100px] pointer-events-none -z-10" />
      </section>

      <ContactSection />
    </main>
  );
}
