"use client";

import { PageHero } from "@/components/sections/PageHero";
import PricingSection from "@/components/sections/PricingSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import ContactSection from "@/components/sections/ContactSection";
import { motion } from "framer-motion";
import { DollarSign, ShieldCheck, Heart, Zap } from "lucide-react";

export default function PricingPage() {
  const valueProps = [
    {
      title: "No Hidden Costs",
      icon: DollarSign,
      description: "Transparent pricing with no unexpected fees. What you see is exactly what you pay."
    },
    {
      title: "Satisfaction Guaranteed",
      icon: Heart,
      description: "We are committed to delivering results that exceed your expectations every single time."
    },
    {
      title: "Eco-Friendly Products",
      icon: Zap,
      description: "We use only premium, pH-neutral, and eco-safe chemicals to protect your car and our environment."
    },
    {
      title: "Secure Payments",
      icon: ShieldCheck,
      description: "Convenient and secure online booking and point-of-sale payment options."
    }
  ];

  return (
    <main className="min-h-screen bg-background pb-20">
      <PageHero 
        title="Experience the Best Pricing" 
        subtitle="Investment in your vehicle's longevity and style. Choose the package that fits your lifestyle."
      />

      {/* Main Pricing Section */}
      <PricingSection />

      {/* Why Choose Section for Pricing context */}
      <section className="container mx-auto px-4 py-24 border-t border-white/5">
        <div className="grid md:grid-cols-4 gap-8">
          {valueProps.map((prop, i) => (
            <motion.div
              key={prop.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="w-16 h-16 rounded-full bg-secondary border border-white/5 flex items-center justify-center text-primary mx-auto mb-6 transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                <prop.icon size={28} />
              </div>
              <h3 className="font-heading text-xl text-foreground mb-3">{prop.title}</h3>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">
                {prop.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <HowItWorksSection />
      <ContactSection />
    </main>
  );
}
