"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, 
  Wallet, PieChart, BarChart3, Download,
  Calendar, CreditCard, Receipt
} from "lucide-react";
import { 
  Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { toast } from "sonner";

const dataSets = {
  Packages: [
    { name: "Basic", value: 35000, color: "hsl(var(--primary) / 0.6)" },
    { name: "Standard", value: 65000, color: "hsl(var(--primary) / 0.8)" },
    { name: "Premium", value: 45200, color: "hsl(var(--primary))" },
  ],
  "Vehicle Type": [
    { name: "Car", value: 85400, color: "hsl(var(--primary) / 0.7)" },
    { name: "SUV", value: 42300, color: "hsl(var(--primary) / 0.9)" },
    { name: "Bike", value: 17500, color: "hsl(var(--primary))" },
  ]
};


const recentTransactions = [
  { id: "TX-901", customer: "Hari Bahadur", amount: 2000, method: "Digital Wallet", date: "2024-04-04 10:30 AM", status: "success" },
  { id: "TX-902", customer: "Sita Sharma", amount: 1000, method: "Cash", date: "2024-04-04 11:15 AM", status: "success" },
  { id: "TX-903", customer: "Bikash Thapa", amount: 500, method: "Digital Wallet", date: "2024-04-04 12:00 PM", status: "pending" },
  { id: "TX-904", customer: "Anita KC", amount: 2000, method: "Card", date: "2024-04-03 04:45 PM", status: "success" },
  { id: "TX-905", customer: "Deepak Gurung", amount: 1000, method: "Cash", date: "2024-04-03 02:30 PM", status: "failed" },
];

export default function FinancePage() {
  const [isMounted, setIsMounted] = React.useState(false);
  const [activeFilter, setActiveFilter] = React.useState<"Packages" | "Vehicle Type">("Packages");

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="p-4 md:p-8 space-y-8 min-h-screen" />;
  }

  return (
    <div className="p-4 md:p-8 space-y-8 min-h-screen pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl text-foreground">Financial Overview</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Real-time revenue tracking and expense management</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => toast.info("Generating reports...")} className="flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-card text-foreground font-heading text-xs tracking-wider hover:bg-secondary transition-colors uppercase">
            <Receipt size={16} /> Reports
          </button>
          <button onClick={() => toast.success("Exporting financial data to CSV...")} className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-heading text-xs tracking-wider hover:opacity-90 transition-opacity uppercase">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "Rs. 1,45,200", sub: "this month", icon: <DollarSign size={18} />, trend: "+12.5%", trendUp: true },
          { label: "Avg. Ticket", value: "Rs. 1,150", sub: "per booking", icon: <TrendingUp size={18} />, trend: "+4.2%", trendUp: true },
          { label: "Pending Payout", value: "Rs. 12,400", sub: "escrowed", icon: <Wallet size={18} />, trend: "-2.1%", trendUp: false },
          { label: "Net Profit", value: "Rs. 84,300", sub: "after ops", icon: <PieChart size={18} />, trend: "+8.9%", trendUp: true },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-xl bg-card border border-border shadow-card relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-secondary text-primary">{stat.icon}</div>
              <div className={`flex items-center gap-1 font-body text-[10px] font-bold ${stat.trendUp ? 'text-green-400' : 'text-destructive'}`}>
                {stat.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.trend}
              </div>
            </div>
            <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
            <h2 className="font-heading text-3xl text-foreground mb-1">{stat.value}</h2>
            <p className="font-body text-[10px] text-muted-foreground">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Simplified Revenue Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-card border border-border shadow-card"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-heading text-2xl text-foreground flex items-center gap-2">
              <PieChart size={20} className="text-primary" /> Service Mix Breakdown
            </h3>
            <p className="font-body text-xs text-muted-foreground mt-1">Revenue distribution by service package (this month)</p>
          </div>
          <div className="flex items-center p-1 rounded-md bg-secondary border border-border">
            {['Packages', 'Vehicle Type'].map((t) => (
              <button 
                key={t} 
                onClick={() => setActiveFilter(t as any)} 
                className={`px-3 py-1 rounded text-[10px] font-heading tracking-widest transition-colors ${activeFilter === t ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-[350px] w-full min-h-[350px]">
          <ChartContainer config={{ 
            value: { label: "Revenue", color: "hsl(var(--primary))" }
          }} className="aspect-auto h-full w-full">
            <BarChart 
              data={dataSets[activeFilter]} 
              margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
              layout="vertical"
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
              <XAxis 
                type="number"
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, fontFamily: "var(--font-body)" }} 
                tickFormatter={(value) => `Rs.${value}`}
              />
              <YAxis 
                dataKey="name" 
                type="category"
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "hsl(var(--foreground))", fontSize: 12, fontFamily: "var(--font-heading)", fontWeight: 500 }}
                width={100}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="value" 
                fill="var(--color-value)"
                radius={[0, 4, 4, 0]}
                barSize={50}
                animationDuration={1500}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </motion.div>

      {/* Transactions Table */}
      <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-heading text-2xl text-foreground">Recent Transactions</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <button onClick={() => toast.info("Opening month filter...")} className="pl-9 pr-4 py-2 rounded-md bg-secondary border border-border text-[10px] font-heading tracking-widest text-foreground uppercase">April 2024</button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                {["Transaction ID", "Customer", "Amount", "Method", "Date & Time", "Status"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left font-body text-[10px] text-muted-foreground uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 font-body text-xs text-primary font-medium">{tx.id}</td>
                  <td className="px-6 py-4 font-body text-sm font-medium text-foreground">{tx.customer}</td>
                  <td className="px-6 py-4 font-heading text-lg text-foreground">Rs. {tx.amount}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-body text-xs text-muted-foreground uppercase tracking-tighter">
                      <CreditCard size={12} /> {tx.method}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-body text-xs text-muted-foreground">{tx.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-body text-[9px] font-bold uppercase tracking-wider ${
                      tx.status === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                      tx.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                      'bg-destructive/10 text-destructive border border-destructive/20'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
