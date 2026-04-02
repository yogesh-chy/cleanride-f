"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Car, LogOut, User, DollarSign, Users, Package, TrendingUp,
  Search, Filter, Download, MoreVertical, CheckCircle, XCircle,
  Clock, AlertCircle
} from "lucide-react";
import {
  WashBooking, WashStatus, generateDemoBookings, packagePricing,
  vehicleTypeLabels, statusColors, statusLabels,
} from "@/lib/wash-data";

export default function AdminDashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<WashBooking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | WashStatus>("all");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (user && user.role !== "admin") {
      router.push("/");
      return;
    }
    setBookings(generateDemoBookings());
  }, [isAuthenticated, user, router]);

  const handleLogout = () => { logout(); router.push("/"); };

  if (!isAuthenticated || !user || user.role !== "admin") return null;

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sidebar - Desktop */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border p-6 space-y-8">
          <Link href="/" className="font-heading text-2xl tracking-wider">
            <span className="text-gradient">CLEAN</span><span className="text-foreground">RIDE</span>
          </Link>

          <nav className="space-y-1">
            {[
              { label: "Dashboard", icon: <TrendingUp size={18} />, active: true },
              { label: "Bookings", icon: <Package size={18} /> },
              { label: "Customers", icon: <Users size={18} /> },
              { label: "Staff", icon: <User size={18} /> },
              { label: "Finance", icon: <DollarSign size={18} /> },
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md font-body text-sm transition-colors ${
                  item.active ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-8 mt-auto border-t border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-heading font-medium">AD</div>
              <div className="overflow-hidden">
                <p className="font-body text-sm text-foreground truncate">{user?.name}</p>
                <p className="font-body text-[10px] text-muted-foreground uppercase tracking-widest">{user?.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-md font-body text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* Mobile header short display */}
          <div className="md:hidden flex items-center justify-between mb-8">
            <Link href="/" className="font-heading text-xl tracking-wider">
              <span className="text-gradient">CLEAN</span>RIDE
            </Link>
            <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut size={20} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl text-foreground">Admin Dash</h1>
              <p className="font-body text-sm text-muted-foreground mt-1">Overview of business performance and operations</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 rounded-md font-heading text-sm tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
              <Download size={18} /> EXPORT REPORT
            </button>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Revenue", value: `Rs. ${totalRevenue}`, icon: <DollarSign className="text-green-400" />, sub: "+12% from last wk" },
              { label: "Total Bookings", value: totalBookings, icon: <Package className="text-primary" />, sub: "+8% from last wk" },
              { label: "Active Now", value: activeBookings, icon: <AlertCircle className="text-yellow-400" />, sub: "5 currently washing" },
              { label: "New Customers", value: "24", icon: <Users className="text-blue-400" />, sub: "+4 today" },
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
                        <div className="font-body text-[10px] text-green-400 font-medium">PAID</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full font-body text-[10px] ${statusColors[b.status]}`}>{statusLabels[b.status]}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-muted-foreground hover:text-foreground"><MoreVertical size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-border flex items-center justify-between font-body text-xs text-muted-foreground">
              <span>Showing {filtered.length} of {bookings.length} entries</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded border border-border hover:bg-secondary">Prev</button>
                <button className="px-3 py-1 rounded border border-border hover:bg-secondary">Next</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
