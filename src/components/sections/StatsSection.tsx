"use client";

import { motion } from "framer-motion";
import { User, Award, Droplets, Clock } from "lucide-react";

const stats = [
  { label: "Happy Clients", value: "2,500+", icon: User },
  { label: "Service Awards", value: "15+", icon: Award },
  { label: "Gallons Saved", value: "50k+", icon: Droplets },
  { label: "Expert Detailers", value: "25+", icon: Clock },
];

export default function StatsSection() {
  return (
    <section className="section-padding overflow-hidden relative">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, scale: 1.05 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group cursor-default"
            >
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-16 h-16 rounded-2xl bg-secondary border border-white/5 flex items-center justify-center text-primary mx-auto mb-6 transition-all group-hover:bg-primary group-hover:text-primary-foreground shadow-card group-hover:shadow-glow"
              >
                <stat.icon size={32} />
              </motion.div>
              <div className="font-heading text-5xl md:text-6xl text-foreground mb-2 tracking-tighter transition-colors group-hover:text-primary">
                {stat.value}
              </div>
              <p className="font-body text-xs text-muted-foreground uppercase tracking-widest font-bold group-hover:text-foreground transition-colors">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Decorative Accents */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-accent/5 blur-[120px] rounded-full pointer-events-none -z-10" />
    </section>
  );
}
