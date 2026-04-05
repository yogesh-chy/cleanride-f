"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users, Search, Filter, MoreVertical, 
  Mail, Phone, Calendar, ArrowUpRight,
  UserCheck, Heart, UserPlus
} from "lucide-react";
import { toast } from "sonner";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  lastVisit: string;
  status: "active" | "inactive" | "vip";
}

const demoCustomers: Customer[] = [
  { id: "c1", name: "Hari Bahadur", email: "hari@example.com", phone: "+977 9812345678", totalBookings: 12, totalSpent: 12500, lastVisit: "2024-03-28", status: "vip" },
  { id: "c2", name: "Sita Sharma", email: "sita@example.com", phone: "+977 9823456789", totalBookings: 5, totalSpent: 4500, lastVisit: "2024-04-01", status: "active" },
  { id: "c3", name: "Bikash Thapa", email: "bikash@example.com", phone: "+977 9834567890", totalBookings: 8, totalSpent: 7200, lastVisit: "2024-03-15", status: "active" },
  { id: "c4", name: "Anita KC", email: "anita@example.com", phone: "+977 9845678901", totalBookings: 15, totalSpent: 18000, lastVisit: "2024-04-03", status: "vip" },
  { id: "c5", name: "Deepak Gurung", email: "deepak@example.com", phone: "+977 9856789012", totalBookings: 2, totalSpent: 1500, lastVisit: "2024-02-20", status: "inactive" },
  { id: "c6", name: "Sunil Magar", email: "sunil@example.com", phone: "+977 9867890123", totalBookings: 1, totalSpent: 500, lastVisit: "2024-04-04", status: "active" },
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "vip">("all");

  const filtered = demoCustomers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.phone.includes(searchTerm) || 
                         c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusStyles = {
    active: "bg-green-500/20 text-green-400 border-green-500/30",
    vip: "bg-primary/20 text-primary border-primary/30 shadow-[0_0_10px_rgba(var(--primary),0.2)]",
    inactive: "bg-muted-foreground/20 text-muted-foreground border-muted-foreground/30",
  };

  return (
    <div className="p-4 md:p-8 space-y-8 min-h-screen pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl text-foreground">Customer Base</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Directory of all registered customers and their loyalty status</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: "1,248", sub: "+12 this month", icon: <Users size={18} className="text-primary" /> },
          { label: "Active Users", value: "842", sub: "68% of total", icon: <UserCheck size={18} className="text-green-400" /> },
          { label: "VIP Members", value: "156", sub: "Tier-based loyalty", icon: <Heart size={18} className="text-red-400" /> },
          { label: "Avg. Customer LV", value: "Rs. 2,450", sub: "Per visitor spend", icon: <ArrowUpRight size={18} className="text-blue-400" /> },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-lg bg-card border border-border shadow-card"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">{stat.label}</span>
              {stat.icon}
            </div>
            <div className="font-heading text-2xl text-foreground mb-1">{stat.value}</div>
            <div className="font-body text-[10px] text-muted-foreground">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, phone or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-md bg-secondary border border-border text-foreground font-body text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {["all", "active", "vip", "inactive"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s as any)}
              className={`px-4 py-2 rounded-md font-body text-xs capitalize transition-all border ${
                statusFilter === s 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all shadow-card relative overflow-hidden"
          >
            {/* Status Ribbon */}
            <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-lg font-body text-[8px] uppercase tracking-[0.2em] font-bold border-l border-b ${statusStyles[c.status]}`}>
              {c.status}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-primary font-heading text-xl border border-border group-hover:scale-110 transition-transform">
                {c.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-heading text-xl text-foreground leading-none mb-1">{c.name}</h3>
                <p className="font-body text-xs text-muted-foreground flex items-center gap-1 uppercase tracking-tighter">
                   Customer ID: {c.id.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
                <Mail size={14} className="text-primary/50" />
                <span className="font-body text-xs">{c.email}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
                <Phone size={14} className="text-primary/50" />
                <span className="font-body text-xs">{c.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
                <Calendar size={14} className="text-primary/50" />
                <span className="font-body text-xs">Last Visit: {c.lastVisit}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-secondary/50 border border-border">
              <div>
                <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Total Bookings</p>
                <p className="font-heading text-xl text-foreground">{c.totalBookings}</p>
              </div>
              <div>
                <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Lifetime Value</p>
                <p className="font-heading text-xl text-primary font-medium">Rs. {c.totalSpent}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button onClick={() => toast.info("Opening transaction history...")} className="font-body text-xs text-primary hover:underline flex items-center gap-1 group/link">
                View Transaction History <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => toast.info("Opening customer options...")} className="text-muted-foreground hover:text-foreground transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Internal helper icons for this file
function ChevronRight({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
