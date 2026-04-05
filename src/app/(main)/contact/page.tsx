"use client";

import { PageHero } from "@/components/sections/PageHero";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully! We will get back to you soon.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const contactData = [
    { label: "Phone Us", value: "+977 9812345678", icon: Phone },
    { label: "Email Us", value: "hello@cleanride.com.np", icon: Mail },
    { label: "Visit Us", value: "Bansbari, Kathmandu", icon: MapPin },
    { label: "Working Hours", value: "Sun - Fri: 7 AM – 7 PM\nSat: 8 AM – 5 PM", icon: Clock }
  ];

  return (
    <main className="min-h-screen bg-background pb-20">
      <PageHero 
        title="Get In Touch" 
        subtitle="Have a question or ready to book? We are here to help. Reach out to us anytime."
      />

      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Left Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-3xl bg-card/60 backdrop-blur-xl border border-white/5 shadow-2xl space-y-10"
          >
            <div className="flex items-center gap-3 text-primary mb-2">
               <MessageSquare size={28} />
               <h2 className="font-heading text-4xl text-foreground uppercase tracking-tight">Send a Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="font-body text-xs text-muted-foreground uppercase tracking-[0.2em] px-2 font-bold">Your Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 rounded-xl bg-secondary/50 border border-white/10 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/20"
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-3">
                  <label className="font-body text-xs text-muted-foreground uppercase tracking-[0.2em] px-2 font-bold">Email Address</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-6 py-4 rounded-xl bg-secondary/50 border border-white/10 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/20"
                    placeholder="name@email.com"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="font-body text-xs text-muted-foreground uppercase tracking-[0.2em] px-2 font-bold">Phone Number</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-6 py-4 rounded-xl bg-secondary/50 border border-white/10 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/20"
                  placeholder="+977 98..."
                />
              </div>

              <div className="space-y-3">
                <label className="font-body text-xs text-muted-foreground uppercase tracking-[0.2em] px-2 font-bold">How can we help?</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-6 py-5 rounded-xl bg-secondary/50 border border-white/10 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none placeholder:text-muted-foreground/20"
                  placeholder="Tell us about your requirements..."
                />
              </div>

              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-5 rounded-xl bg-primary text-primary-foreground font-heading text-2xl tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-glow flex items-center justify-center gap-3 mt-4"
              >
                Send Message <Send size={20} />
              </motion.button>
            </form>
          </motion.div>

          {/* Right Column: Interaction Cards */}
          <div className="flex flex-col gap-6 h-full">
            <div className="grid sm:grid-cols-2 gap-4">
              {contactData.map((contact, i) => (
                <motion.div
                  key={contact.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-2xl bg-secondary/20 border border-white/5 flex flex-col justify-center items-center text-center group hover:bg-primary/5 transition-all cursor-default"
                >
                  <motion.div 
                    whileHover={{ rotate: 15, scale: 1.2 }}
                    className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3 transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    <contact.icon size={20} />
                  </motion.div>
                  <h3 className="font-heading text-lg text-foreground mb-1 uppercase tracking-tighter">{contact.label}</h3>
                  <p className="font-body text-[10px] text-muted-foreground leading-relaxed whitespace-pre-line group-hover:text-foreground">
                    {contact.value}
                  </p>
                </motion.div>
              ))}
            </div>
            
            {/* Embedded Google Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              viewport={{ once: true }}
              className="flex-1 min-h-[300px] rounded-3xl border border-white/5 overflow-hidden shadow-2xl transition-all hover:border-primary/20 cursor-pointer"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14127.340000000001!2d85.342!3d27.738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQ0JzE2LjgiTiA4NcKwMjAnMzEuMiJF!5e0!3m2!1sen!2snp!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(0.8)' }}
                allowFullScreen
                loading="lazy"
                title="CleanRide Bansbari Location"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
