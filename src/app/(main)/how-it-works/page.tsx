"use client";

import { PageHero } from "@/components/sections/PageHero";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import ContactSection from "@/components/sections/ContactSection";
import { motion } from "framer-motion";
import { Calendar, Car, CheckCircle, ShieldCheck } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      title: "Step 1: Consultation",
      icon: Calendar,
      description: "Book online or call us for a free consultation. We help you choose the best package for your vehicle's needs."
    },
    {
      title: "Step 2: Drop-off & Scan",
      icon: Car,
      description: "Drop off your vehicle at our premium facility. We perform a detailed pre-wash inspection and record every detail."
    },
    {
      title: "Step 3: Precision Detailing",
      icon: ShieldCheck,
      description: "Our certified detailers apply meticulous care using premium products and advanced techniques for the best results."
    },
    {
      title: "Step 4: Final Hand-over",
      icon: CheckCircle,
      description: "A final multi-point inspection is carried out. Once we're satisfied, you get your car back looking better than new."
    }
  ];

  return (
    <main className="min-h-screen bg-background pb-20">
      <PageHero 
        title="Our Process" 
        subtitle="Transparency at every turn. See how we transform your vehicle from dirty to dazzling."
      />

      {/* Main Process Vertical Breakdown */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-20 relative">
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -z-10" />
          
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center group"
            >
              <div className="w-16 h-16 rounded-full bg-secondary border border-white/5 flex items-center justify-center text-primary mx-auto mb-8 transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                <step.icon size={28} />
              </div>
              <h3 className="font-heading text-xl text-foreground mb-4 uppercase tracking-tighter transition-colors group-hover:text-primary">{step.title}</h3>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Informative Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-10 rounded-3xl bg-secondary/50 border border-white/5 text-center max-w-4xl mx-auto"
        >
          <div className="font-body text-primary text-[10px] uppercase tracking-[0.4em] mb-4 font-bold">Expect the Unmatched Perfection</div>
          <h2 className="font-heading text-3xl md:text-5xl text-foreground uppercase tracking-tighter mb-6">
            Everything is <span className="text-gradient">Detailed</span> with Precision.
          </h2>
          <p className="font-body text-sm text-muted-foreground max-w-2xl mx-auto">
            Our process is built on consistency and quality control. From the initial pre-wash inspection to the final ceramic-safe hand dry, 
            we follow a strict multi-point checklist to ensure every inch of your vehicle is perfect.
          </p>
        </motion.div>
      </section>

      {/* Main HowItWorks Horizontal Scroller/Banner (if exists) */}
      <HowItWorksSection />

      <ContactSection />
    </main>
  );
}
