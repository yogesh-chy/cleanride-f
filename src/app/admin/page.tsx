"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import {
  DollarSign, Users, ClipboardList, TrendingUp,
  Search, MoreVertical, ShieldCheck, Download
} from "lucide-react";
import {
  WashBooking, WashStatus, generateDemoBookings, packagePricing,
  vehicleTypeLabels, statusColors, statusLabels,
} from "@/lib/wash-data";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<WashBooking[]>([]);
  const [staffCount, setStaffCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | WashStatus>("all");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    setBookings(generateDemoBookings());
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = document.cookie.split(";").find(c => c.trim().startsWith("access_token="))?.split("=")[1];
      const headers = { "Authorization": `Bearer ${token}` };

      // Fetch Staff Count
      const staffRes = await fetch(`${API_BASE_URL}/users/?role=staff`, { headers });
      if (staffRes.ok) {
        const staffData = await staffRes.json();
        const count = staffData.count !== undefined ? staffData.count : (Array.isArray(staffData) ? staffData.length : 0);
        setStaffCount(count);
      }

      // Fetch Customer Count
      const customerRes = await fetch(`${API_BASE_URL}/users/?role=customer`, { headers });
      if (customerRes.ok) {
        const customerData = await customerRes.json();
        const count = customerData.count !== undefined ? customerData.count : (Array.isArray(customerData) ? customerData.length : 0);
        setCustomerCount(count);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch = b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         b.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = bookings.filter((b) => b.status === "completed").reduce((acc, b) => acc + packagePricing[b.washPackage].price, 0);
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter((b) => !["completed", "cancelled"].includes(b.status)).length;

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl text-foreground">Admin Dash</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Overview of business performance and operations</p>
        </div>
        <button onClick={() => toast.success("Exporting report data...")} className="flex items-center gap-2 px-6 py-3 rounded-md font-heading text-sm tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-opacity uppercase">
          <Download size={18} /> Export Report
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `Rs. ${totalRevenue}`, icon: <DollarSign className="text-green-400" />, sub: "Demo Data" },
          { label: "Total Bookings", value: totalBookings, icon: <ClipboardList className="text-primary" />, sub: "Demo Data" },
          { label: "Total Staff", value: staffCount, icon: <ShieldCheck className="text-yellow-400" />, sub: "Live Team Count" },
          { label: "Total Customers", value: customerCount, icon: <Users className="text-blue-400" />, sub: "Registered Users" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 md:p-6 rounded-lg bg-card border border-border shadow-card"
          >
            <div className="flex items-center justify-between mb-3 text-muted-foreground">
              <span className="font-body text-xs font-medium uppercase tracking-wider">{stat.label}</span>
              {stat.icon}
            </div>
            <div className="font-heading text-2xl md:text-3xl text-foreground mb-1">{stat.value}</div>
            <div className="font-body text-[10px] text-muted-foreground">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Table management */}
      <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
        <div className="p-4 md:p-6 border-b border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="font-heading text-2xl text-foreground">Recent Bookings</h2>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or plate..."
                className="w-full pl-10 pr-4 py-2 rounded-md bg-secondary border border-border text-foreground font-body text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <select
              value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-md bg-secondary border border-border text-foreground font-body text-xs focus:outline-none hover:border-primary/50"
            >
              <option value="all">All</option>
              {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                {["Customer", "Vehicle", "Package", "Payment", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left font-body text-[10px] text-muted-foreground uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-body text-sm text-foreground">{b.customerName}</div>
                    <div className="font-body text-xs text-muted-foreground">{b.customerPhone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-body text-sm text-foreground">{b.vehicleNumber}</div>
                    <div className="font-body text-xs text-muted-foreground uppercase">{vehicleTypeLabels[b.vehicleType]} • {b.vehicleColor}</div>
                  </td>
                  <td className="px-6 py-4 font-body text-sm text-muted-foreground">
                    {packagePricing[b.washPackage].name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-body text-sm text-foreground">Rs. {packagePricing[b.washPackage].price}</div>
                    <div className="font-body text-[10px] text-green-400 font-medium uppercase">Paid</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full font-body text-[10px] ${statusColors[b.status]}`}>{statusLabels[b.status]}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => toast.info("Listing booking options...")} className="text-muted-foreground hover:text-foreground">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between font-body text-xs text-muted-foreground">
          <span>Showing {filtered.length} of {bookings.length} entries</span>
          <div className="flex gap-2">
            <button onClick={() => toast.info("No previous page available")} className="px-3 py-1 rounded border border-border hover:bg-secondary">Prev</button>
            <button onClick={() => toast.info("No next page available")} className="px-3 py-1 rounded border border-border hover:bg-secondary">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
