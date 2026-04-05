"use client";

import { motion } from "framer-motion";
import { Droplets, SprayCan, Sparkles, Clock, Shield, Star } from "lucide-react";

const services = [
  {
    icon: Droplets,
    title: "Exterior Wash",
    desc: "High-pressure rinse, foam wash, hand dry and tire clean for a showroom shine.",
  },
  {
    icon: SprayCan,
    title: "Interior Deep Clean",
    desc: "Vacuum, dashboard wipe, seat cleaning, and air freshener for a brand-new feel.",
  },
  {
    icon: Sparkles,
    title: "Premium Detailing",
    desc: "Full polish, ceramic coating, leather conditioning, and engine bay cleaning.",
  },
  {
    icon: Clock,
    title: "Real-Time Tracking",
    desc: "Track your vehicle's wash status live — from queue to completion.",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    desc: "Not satisfied? We'll re-wash your vehicle free of charge.",
  },
  {
    icon: Star,
    title: "Loyalty Rewards",
    desc: "Every 5th wash free. Premium members get exclusive discounts.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="section-padding">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary font-body text-sm tracking-[0.2em] uppercase mb-2">Our Expertise</p>
          <h2 className="font-heading text-5xl md:text-6xl font-bold">
            ENGINEERED<br />
            <span className="text-gradient">PERFECTION.</span>
          </h2>
          <p className="font-body text-muted-foreground mt-4 max-w-xl mx-auto">
            We don't just wash vehicles — we scientifically restore them using premium products and advanced techniques.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 shadow-card hover:shadow-glow cursor-default"
            >
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
              >
                <item.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </motion.div>
              <h3 className="font-heading text-2xl font-semibold mb-3 text-foreground uppercase tracking-tight">{item.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
