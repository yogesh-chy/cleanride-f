"use client";

import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { motion } from "framer-motion";
import { ShieldCheck, Target, Heart, Award, Droplets, Leaf, Shield, ArrowRight } from "lucide-react";
import aboutTeam from "@/assets/about-team.jpg";

export default function AboutPage() {
  const values = [
    {
      title: "Integrity",
      icon: ShieldCheck,
      description: "We believe in honest work and transparent processes at every step."
    },
    {
      title: "Quality First",
      icon: Award,
      description: "No shortcuts. We use the highest-grade products to ensure lasting results."
    },
    {
      title: "Customer Centric",
      icon: Heart,
      description: "Your satisfaction is our ultimate goal. We treat every car like our own."
    },
    {
      title: "Precision",
      icon: Target,
      description: "Our detailing focuses on the finest points, ensuring a flawless finish."
    }
  ];

  const features = [
    {
      title: "Advanced Technology",
      icon: Droplets,
      description: "We utilize state-of-the-art washing machinery and high-pressure steam systems designed for maximum dirt removal without compromising your vehicle's paintwork."
    },
    {
      title: "Eco-Friendly Approach",
      icon: Leaf,
      description: "Our water reclamation systems and biodegradable cleaning solutions ensure that while your car gets pristine, our environmental footprint remains minimal."
    },
    {
      title: "Expert Verification",
      icon: Shield,
      description: "Every vehicle undergoes a rigorous multi-point inspection by our seasoned detailers before it is handed back, guaranteeing the CleanRide standard."
    }
  ];

  return (
    <main className="min-h-screen bg-background pb-20">
      <PageHero 
        title="Our Story & Vision" 
        subtitle="Crafting perfection for your passion. Discover the legacy of CleanRide."
      />

      {/* New Section 1: Origin Story */}
      <section className="container mx-auto px-4 py-24 border-b border-white/5">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="font-heading text-xl text-primary tracking-widest uppercase">The Genesis</h2>
            <h3 className="font-heading text-4xl md:text-5xl font-bold uppercase leading-tight">
              Redefining Car Care in the <br/><span className="text-gradient">Heart of Kathmandu</span>
            </h3>
            <div className="space-y-4 text-muted-foreground font-body leading-relaxed">
              <p>
                Founded on the belief that a premium vehicle deserves premium treatment, CleanRide was established by automotive enthusiasts who were dissatisfied with the standard wash options available in the valley. 
              </p>
              <p>
                What started as an exclusive detailing studio has grown into a premier automotive care center. We blended our passion for perfection with leading-edge ceramic and hand-wash techniques to create an experience that protects and enhances your investment.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-card border border-white/10 aspect-video lg:aspect-square">
              <img
                src={aboutTeam.src}
                alt="CleanRide Origin Story"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 blur-[50px] -z-10 rounded-full" />
            <div className="hidden md:block absolute top-12 -right-8 bg-card border border-white/10 p-6 rounded-2xl shadow-xl glassmorphism">
              <p className="font-heading text-4xl text-primary">Est. 2020</p>
              <p className="font-body text-xs text-muted-foreground tracking-widest uppercase mt-1">A Legacy of Excellence</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* New Section 2: The CleanRide Difference */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-xl text-primary tracking-widest uppercase mb-4">Why Choose Us</h2>
          <h3 className="font-heading text-4xl md:text-5xl uppercase mb-6">The CleanRide Difference</h3>
          <p className="font-body text-muted-foreground">It's not just a wash. It's a comprehensive rejuvenation process tailored natively to weather the demands of our active environment.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="p-8 rounded-3xl bg-secondary/30 border border-white/5 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] group-hover:bg-primary/20 transition-colors" />
              <div className="w-14 h-14 rounded-2xl bg-card border border-white/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon size={28} />
              </div>
              <h4 className="font-heading text-2xl uppercase mb-4">{feature.title}</h4>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Enhanced Core Values Section */}
      <section className="container mx-auto px-4 py-24 bg-card/50 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="text-center mb-20 relative z-10">
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4 uppercase">Our Core Values</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto relative z-10">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-background border border-white/10 hover:border-primary/50 transition-all hover:shadow-glow cursor-default relative group"
            >
              <motion.div 
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground"
              >
                <v.icon size={32} />
              </motion.div>
              <h3 className="font-heading text-xl text-foreground mb-3 uppercase tracking-wider">{v.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {v.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Vision/Mission Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="bg-hero-gradient rounded-[3rem] p-12 lg:p-20 border border-white/10 overflow-hidden relative shadow-2xl">
          <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div>
                <h2 className="font-heading text-4xl text-primary mb-4 uppercase tracking-wider">Our Mission</h2>
                <p className="font-body text-foreground/80 text-lg sm:text-xl font-light italic leading-relaxed border-l-4 border-primary/50 pl-6">
                  "To deliver the most premium detailing experience in Nepal, setting new standards for automotive care and protection through constant innovation and unwavering dedication."
                </p>
              </div>
              <div>
                <h2 className="font-heading text-4xl text-primary mb-4 uppercase tracking-wider">Our Vision</h2>
                <p className="font-body text-foreground/80 text-lg sm:text-xl font-light italic leading-relaxed border-l-4 border-primary/50 pl-6">
                  "To be the definitive name in automotive aesthetics, expanding our reach to every vehicle enthusiast who values uncompromised perfection and longevity."
                </p>
              </div>
            </motion.div>

            <div className="relative hidden md:flex h-full w-full bg-background/40 backdrop-blur-3xl rounded-3xl border border-white/10 items-center justify-center shadow-card p-12">
               <div className="font-heading text-8xl xl:text-9xl text-white/5 uppercase select-none rotate-90 lg:rotate-0 tracking-widest">
                  VISION
               </div>
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 rounded-3xl pointer-events-none" />
            </div>
          </div>
          
          {/* Background Blobs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[150px] pointer-events-none -z-0" />
          <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-accent/20 blur-[150px] pointer-events-none -z-0" />
        </div>
      </section>

      {/* Dynamic CTA */}
      <section className="container mx-auto px-4 pb-12">
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto rounded-3xl bg-secondary/80 border border-white/10 p-10 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-lg"
         >
            <div>
               <h3 className="font-heading text-3xl uppercase mb-2">Ready to Experience CleanRide?</h3>
               <p className="font-body text-muted-foreground">Join thousands of satisfied customers who trust us with their vehicles.</p>
            </div>
            <div className="flex gap-4">
               <Link href="/register" className="px-8 py-4 bg-primary text-primary-foreground font-heading uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center shadow-glow">
                  Book A Wash
               </Link>
               <Link href="/about#contact" className="px-8 py-4 bg-card border border-white/10 text-foreground font-heading uppercase tracking-widest rounded-xl hover:bg-white/5 transition-colors hidden sm:flex items-center justify-center">
                  Contact Us
               </Link>
            </div>
         </motion.div>
      </section>

    </main>
  );
}

