"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import {
  DollarSign, Users, ClipboardList, TrendingUp,
  Search, MoreVertical, ShieldCheck, Download
} from "lucide-react";
import {
  WashBooking, WashStatus, packagePricing,
  vehicleTypeLabels, statusColors, statusLabels,
} from "@/lib/wash-data";
import { toast } from "sonner";
import { exportToCSV } from "@/lib/exportUtils";
import { bookingService } from "@/lib/booking-service";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import {

  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<WashBooking[]>([]);
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_bookings: 0,
    total_customers: 0,
    total_staff_count: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | WashStatus>("all");
  const [selectedBooking, setSelectedBooking] = useState<WashBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchStats(),
      fetchRecentBookings()
    ]);
    setIsLoading(false);
  };

  const fetchStats = async () => {
    try {
      const token = document.cookie.split(";").find(c => c.trim().startsWith("access_token="))?.split("=")[1];
      const response = await fetch(`${API_BASE_URL}/bookings/admin/stats/`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        setStats(await response.json());
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const data = await bookingService.fetchAllBookings(1);
      setBookings(data.results);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch = b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         b.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    if (filtered.length === 0) {
      toast.error("No data to export.");
      return;
    }
    exportToCSV(
      filtered,
      [
        { key: "id", label: "Booking ID" },
        { key: "customerName", label: "Customer" },
        { key: "vehicleNumber", label: "Vehicle" },
        { key: (b) => packagePricing[b.washPackage]?.name || b.washPackage, label: "Package" },
        { key: "date", label: "Date" },
        { key: "timeSlot", label: "Time" },
        { key: (b) => statusLabels[b.status] || b.status, label: "Status" },
      ],
      `dashboard-recent-${new Date().toISOString().split('T')[0]}.csv`
    );
    toast.success("Report downloaded successfully.");
  };

  // Show skeleton during auth check OR data loading
  if (authLoading || isLoading) {
    return (
      <div className="p-4 md:p-8">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl text-foreground">Admin Dash</h1>
          <p className="font-body text-sm text-muted-foreground mt-1 text-primary/80 font-medium">Business Performance Overview</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 px-6 py-3 rounded-md font-heading text-sm tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-opacity uppercase shadow-lg shadow-primary/20">
          <Download size={18} /> Export Report
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `Rs. ${stats.total_revenue}`, icon: <DollarSign className="text-green-400" />, sub: "Cumulative Earnings" },
          { label: "Total Bookings", value: stats.total_bookings, icon: <ClipboardList className="text-primary" />, sub: "System Throughput" },
          { label: "Total Staff", value: stats.total_staff_count, icon: <ShieldCheck className="text-yellow-400" />, sub: "Active Team" },
          { label: "Total Customers", value: stats.total_customers, icon: <Users className="text-blue-400" />, sub: "Registered Base" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 md:p-6 rounded-lg bg-card border border-border shadow-card hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-3 text-muted-foreground">
              <span className="font-body text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
              {stat.icon}
            </div>
            <div className="font-heading text-2xl md:text-3xl text-foreground mb-1">{stat.value}</div>
            <div className="font-body text-[10px] text-muted-foreground uppercase tracking-tighter">{stat.sub}</div>
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
                    <div className="font-body text-xs text-muted-foreground uppercase">{vehicleTypeLabels[b.vehicleType]}</div>
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
                    <button onClick={() => setSelectedBooking(b)} className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                      <MoreVertical size={16} />
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

      {/* Details Modal */}
      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent className="sm:max-w-[500px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-foreground flex items-center justify-between">
              <span>Booking #{selectedBooking?.id.toUpperCase()}</span>
              {selectedBooking && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[selectedBooking.status]}`}>
                  {statusLabels[selectedBooking.status]}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6 pt-4">
              <div className="bg-secondary/30 p-4 rounded-xl border border-border space-y-3">
                <h4 className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">Customer Info</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-body text-xs text-muted-foreground">Name</p>
                    <p className="font-body text-sm text-foreground font-medium">{selectedBooking.customerName}</p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground">Contact</p>
                    <p className="font-body text-sm text-foreground">{selectedBooking.customerPhone}</p>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/30 p-4 rounded-xl border border-border space-y-3">
                <h4 className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">Service Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-body text-xs text-muted-foreground">Vehicle</p>
                    <p className="font-body text-sm text-foreground">{selectedBooking.vehicleNumber}</p>
                    <p className="font-body text-[10px] text-muted-foreground uppercase">{vehicleTypeLabels[selectedBooking.vehicleType]}</p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground">Package</p>
                    <p className="font-body text-sm text-primary font-medium">{packagePricing[selectedBooking.washPackage].name}</p>
                    <p className="font-body text-xs text-muted-foreground">Rs. {packagePricing[selectedBooking.washPackage].price}</p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground">Schedule</p>
                    <p className="font-body text-sm text-foreground">{selectedBooking.date}</p>
                    <p className="font-body text-xs text-muted-foreground">{selectedBooking.timeSlot}</p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground">Staff Assigned</p>
                    <p className="font-body text-sm text-foreground">{selectedBooking.assignedStaff || "Unassigned"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
