"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Droplets, PlusCircle } from "lucide-react";
import Link from "next/link";
import { packagePricing, WashPackage } from "@/lib/wash-data";
import { packageDetailedInfo } from "@/lib/package-details";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tiers: { key: WashPackage; popular?: boolean }[] = [
  { key: "basic" },
  { key: "standard", popular: true },
  { key: "premium" },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="section-padding bg-hero-gradient">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-primary font-body text-sm tracking-[0.2em] uppercase mb-2">Transparent Pricing</p>
          <h2 className="font-heading text-5xl md:text-6xl font-bold">
            CHOOSE YOUR <span className="text-gradient">PACKAGE</span>
          </h2>
        </motion.div>

        {/* Package Detail Showcase - Tabbed Interface */}
        <div className="max-w-6xl mx-auto mb-20 px-4">
          <Tabs defaultValue="standard" className="w-full">
            <div className="flex justify-center mb-10 overflow-x-auto pb-4 custom-scrollbar">
              <TabsList className="bg-secondary/50 p-1.5 rounded-full border border-white/5 h-auto self-center">
                <TabsTrigger 
                  value="basic" 
                  className="px-6 py-2.5 rounded-full font-heading text-xl tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all hover:bg-primary/20"
                >
                  Basic Care
                </TabsTrigger>
                <TabsTrigger 
                  value="standard" 
                  className="px-6 py-2.5 rounded-full font-heading text-xl tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all hover:bg-primary/20"
                >
                  Standard Professional
                </TabsTrigger>
                <TabsTrigger 
                  value="premium" 
                  className="px-6 py-2.5 rounded-full font-heading text-xl tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all hover:bg-primary/20"
                >
                  Premium Restoration
                </TabsTrigger>
              </TabsList>
            </div>

            {(['basic', 'standard', 'premium'] as WashPackage[]).map((pkgKey) => {
              const details = packageDetailedInfo[pkgKey];
              const pkgBase = packagePricing[pkgKey];
              
              return (
                <TabsContent key={pkgKey} value={pkgKey} className="mt-0 outline-none">
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                      className="grid lg:grid-cols-[280px,1fr] gap-10 bg-card/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
                    >
                      {/* Left Column: Visual & Header */}
                      <div className="flex flex-col justify-between space-y-8 border-b lg:border-b-0 lg:border-r border-white/5 pb-8 lg:pb-0 lg:pr-10">
                        <div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-body text-[10px] font-bold uppercase tracking-widest mb-4">
                             {pkgKey === 'premium' ? <Sparkles size={12} /> : <Droplets size={12} />} Detailed Reveal
                          </div>
                          <h3 className="font-heading text-4xl text-foreground mb-4">{pkgBase.name}</h3>
                          <p className="font-body text-muted-foreground leading-relaxed text-xs lg:text-sm">
                            {details.tagline}
                          </p>
                        </div>

                        <div className="pt-6">
                          <div className="flex items-end gap-2 mb-2">
                            <span className="font-heading text-4xl text-primary">Rs. {pkgBase.price}</span>
                            <span className="font-body text-[10px] text-muted-foreground mb-1.5 whitespace-nowrap">/ ONE TIME</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Detailed Categories */}
                      <div className={`grid gap-6 relative z-10 ${
                        details.categories.length === 3 
                          ? 'md:grid-cols-2 xl:grid-cols-3' 
                          : 'md:grid-cols-2'
                      }`}>
                        {details.categories.map((cat, i: number) => (
                          <motion.div 
                            key={i} 
                            whileHover={{ y: -5 }}
                            className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group/card cursor-default"
                          >
                            <div className="flex items-center gap-3 mb-5 text-primary">
                              <motion.div 
                                whileHover={{ rotate: 360, scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                className="p-2 rounded-lg bg-primary/10 transition-colors group-hover/card:bg-primary group-hover/card:text-primary-foreground"
                              >
                                <cat.icon size={18} strokeWidth={2.5} />
                              </motion.div>
                              <h4 className="font-heading text-lg tracking-wide uppercase">{cat.title}</h4>
                            </div>
                            <ul className="space-y-3">
                              {cat.items.map((item: string, j: number) => (
                                <li key={j} className="flex items-start gap-3 font-body text-[11px] text-muted-foreground/80 leading-relaxed group/item">
                                  <div className="w-1 h-1 rounded-full bg-primary/30 mt-1.5 flex-shrink-0 group-hover/item:bg-primary transition-colors" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        ))}
                      </div>

                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none -z-10" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 blur-[100px] pointer-events-none -z-10" />
                  </motion.div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>

        <div className="text-center mb-10">
          <p className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-medium border-t border-white/5 pt-8 inline-block px-10">Quick Pricing Overview</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {tiers.map((tier, i) => {
            const pkg = packagePricing[tier.key];
            return (
              <motion.div
                key={tier.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className={`relative p-8 rounded-2xl border transition-all duration-500 flex flex-col h-full ${
                  tier.popular
                    ? "bg-card/80 border-primary shadow-glow scale-105 z-10"
                    : "bg-card/40 border-white/5 shadow-card hover:border-primary/30"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-primary text-primary-foreground font-heading text-sm font-bold uppercase tracking-widest shadow-glow">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-8 pt-4">
                  <h3 className="font-heading text-3xl text-foreground mb-1 uppercase tracking-tight">{pkg.name}</h3>
                  <p className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-6 font-bold">{pkg.duration} MIN SESSION</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-body text-lg text-muted-foreground mt-1">Rs.</span>
                    <span className="font-heading text-6xl text-foreground">
                      {pkg.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 font-body text-sm text-muted-foreground leading-tight">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`block w-full text-center py-4 rounded-xl font-heading text-xl tracking-widest transition-all duration-300 ${
                      tier.popular
                        ? "bg-primary text-primary-foreground hover:opacity-90 shadow-glow"
                        : "bg-secondary/50 text-foreground hover:bg-primary hover:text-primary-foreground"
                    }`}
                  >
                    Book Now
                  </motion.button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
