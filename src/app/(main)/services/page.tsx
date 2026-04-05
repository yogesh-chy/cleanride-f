"use client";

import { PageHero } from "@/components/sections/PageHero";
import ServicesSection from "@/components/sections/ServicesSection";
import PricingSection from "@/components/sections/PricingSection";
import ContactSection from "@/components/sections/ContactSection";
import { motion } from "framer-motion";
import { Droplets, Sparkles, ShieldCheck, Car, Wind, Zap } from "lucide-react";

export default function ServicesPage() {
  const serviceCategories = [
    {
      title: "Paint Correction",
      icon: Zap,
      description: "Our machine polishing services restore your vehicle's gloss by removing swirls, scratches, and oxidation.",
      features: ["Multi-stage polishing", "Swirl removal", "Oxidation treatment", "High gloss finish"]
    },
    {
      title: "Ceramic Coating",
      icon: ShieldCheck,
      description: "Advanced nanotechnology protection that creates a durable, hydrophobic shield over your paint.",
      features: ["9H Hardness", "Chemical resistance", "UV protection", "Easy maintenance"]
    },
    {
      title: "Interior Detailing",
      icon: Wind,
      description: "Deep steam cleaning and sanitization for a factory-fresh feel and healthy cabin environment.",
      features: ["Steam sterilization", "Odor removal", "Leather conditioning", "Stain extraction"]
    },
    {
      title: "Wheel & Tire Care",
      icon: Car,
      description: "Comprehensive detailing of wheels, tires, and wheel wells, including brake dust removal.",
      features: ["Iron decontamination", "Tire dressing", "Caliper cleaning", "Ceramic wheel spray"]
    }
  ];

  return (
    <main className="min-h-screen bg-background pb-20">
      <PageHero 
        title="Our Premium Services" 
        subtitle="Unmatched precision and detailing for every vehicle. Experience the CleanRide standard."
      />

      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {serviceCategories.map((service, i) => (
             <motion.div
             key={service.title}
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ delay: i * 0.1 }}
             className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-white/5 hover:border-primary/20 transition-all flex flex-col justify-between"
           >
             <div>
               <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                 <service.icon size={28} strokeWidth={2.5} />
               </div>
               <h2 className="font-heading text-3xl text-foreground mb-4">{service.title}</h2>
                 <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">
                   {service.description}
                 </p>
                 <ul className="grid grid-cols-2 gap-y-3 mb-8">
                   {service.features.map((f) => (
                     <li key={f} className="flex items-center gap-2 font-body text-xs text-muted-foreground/80">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                       {f}
                     </li>
                   ))}
                 </ul>
               </div>
             </motion.div>
          ))}
        </div>
      </section>

      {/* Integrate existing ServicesSection as a quick overview if needed, or skip to other sections */}
      <ServicesSection />
      
      <div className="mt-20">
        <PricingSection />
      </div>

      <ContactSection />
    </main>
  );
}
