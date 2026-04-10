"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package, Search, Filter, MoreVertical, 
  Calendar as CalendarIcon, Download, ChevronRight,
  Clock, CheckCircle, XCircle
} from "lucide-react";
import {
  WashBooking, WashStatus, packagePricing,
  vehicleTypeLabels, statusColors, statusLabels,
} from "@/lib/wash-data";
import { bookingService } from "@/lib/booking-service";
import { toast } from "sonner";
import { exportToCSV } from "@/lib/exportUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<WashBooking[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | WashStatus>("all");
  const [dateFilter, setDateFilter] = useState(""); 
  const [selectedBooking, setSelectedBooking] = useState<WashBooking | null>(null);

  useEffect(() => {
    loadAllBookings(currentPage);
  }, [currentPage]);

  const loadAllBookings = async (page: number) => {
    // Basic filter string construction
    let filters = "";
    if (statusFilter !== "all") filters += `status=${statusFilter}&`;
    if (dateFilter) filters += `date=${dateFilter}&`;
    if (searchTerm) filters += `search=${searchTerm}&`;

    const data = await bookingService.fetchAllBookings(page, filters);
    setBookings(data.results);
    setTotalCount(data.count);
  };

  // Re-fetch when filters change (reset to page 1)
  useEffect(() => {
    if (currentPage === 1) {
      loadAllBookings(1);
    } else {
      setCurrentPage(1);
    }
  }, [searchTerm, statusFilter, dateFilter]);

  // With server-side filtering, "filtered" is just "bookings"
  const filtered = bookings;

  const handleExport = () => {
    if (bookings.length === 0) {
      toast.error("No data to export.");
      return;
    }
    exportToCSV(
      bookings,
      [
        { key: "id", label: "Booking Ref" },
        { key: "customerName", label: "Customer Name" },
        { key: "customerPhone", label: "Phone" },
        { key: "vehicleNumber", label: "Vehicle Number" },
        { key: (b) => vehicleTypeLabels[b.vehicleType] || b.vehicleType, label: "Vehicle Type" },
        { key: (b) => packagePricing[b.washPackage]?.name || b.washPackage, label: "Wash Package" },
        { key: "date", label: "Date" },
        { key: "timeSlot", label: "Time Slot" },
        { key: (b) => statusLabels[b.status] || b.status, label: "Status" },
        { key: (b) => b.assignedStaff || "Unassigned", label: "Staff Assigned" },
      ],
      `cleanride-bookings-${new Date().toISOString().split('T')[0]}.csv`
    );
    toast.success("Bookings exported successfully!");
  };

  return (
    <div className="p-4 md:p-8 space-y-8 min-h-screen pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl text-foreground">Bookings Management</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Track and manage all car wash appointments</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => toast.success("Opening booking scheduler...")} className="flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-card text-foreground font-heading text-xs tracking-wider hover:bg-secondary transition-colors uppercase">
            <CalendarIcon size={16} /> Schedule New
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-heading text-xs tracking-wider hover:opacity-90 transition-opacity uppercase shadow-[0_0_15px_rgba(var(--primary),0.3)]">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-card p-4 rounded-lg border border-border shadow-card">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md bg-secondary border border-border text-foreground font-body text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full pl-10 pr-4 py-2 rounded-md bg-secondary border border-border text-foreground font-body text-xs focus:outline-none hover:border-primary/50 appearance-none"
          >
            <option value="all">All Statuses</option>
            {Object.entries(statusLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md bg-secondary border border-border text-foreground font-body text-xs focus:outline-none hover:border-primary/50 scheme-dark"
          />
        </div>

        <div className="flex items-center justify-end">
          <button 
            onClick={() => { setSearchTerm(""); setStatusFilter("all"); setDateFilter(""); }}
            className="font-body text-xs text-primary hover:underline"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                {["Booking ID", "Customer", "Vehicle", "Package", "Time Slot", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left font-body text-[10px] text-muted-foreground uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length > 0 ? (
                filtered.map((b, i) => (
                  <motion.tr 
                    key={b.id} 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-secondary/20 transition-colors group"
                  >
                    <td className="px-6 py-4 font-body text-xs font-medium text-primary">#{b.id.toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <div className="font-body text-sm font-medium text-foreground">{b.customerName}</div>
                      <div className="font-body text-xs text-muted-foreground">{b.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-body text-sm text-foreground">{b.vehicleNumber}</div>
                      <div className="font-body text-[10px] text-muted-foreground uppercase tracking-tighter">
                        {vehicleTypeLabels[b.vehicleType]}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-body text-sm text-foreground">{packagePricing[b.washPackage].name}</div>
                      <div className="font-body text-xs text-primary font-medium tracking-wide">Rs. {packagePricing[b.washPackage].price}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-body text-sm text-foreground">
                        <Clock size={14} className="text-muted-foreground" /> {b.timeSlot}
                      </div>
                      <div className="font-body text-[10px] text-muted-foreground">{b.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-body text-[10px] font-medium ${statusColors[b.status]}`}>
                        {statusLabels[b.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {b.status !== "completed" && b.status !== "cancelled" && (
                          <button 
                            onClick={async () => {
                               const success = await bookingService.updateStatus(b.id, "completed");
                               if (success) { loadAllBookings(currentPage); toast.success("Marked as completed"); }
                             }} 
                            className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        {b.status !== "cancelled" && b.status !== "completed" && (
                          <button 
                            onClick={async () => {
                               const success = await bookingService.updateStatus(b.id, "cancelled");
                               if (success) { loadAllBookings(currentPage); toast.error("Booking cancelled"); }
                             }} 
                            className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                        <button onClick={() => setSelectedBooking(b)} className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <Package size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                    <p className="font-heading text-xl text-muted-foreground">No bookings found</p>
                    <p className="font-body text-sm text-muted-foreground">Try adjusting your filters or search term</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <div className="font-body text-xs text-muted-foreground">
            Showing <span className="font-medium text-foreground">{bookings.length}</span> of <span className="font-medium text-foreground">{totalCount}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
              className="p-2 rounded border border-border text-muted-foreground disabled:opacity-50 hover:bg-secondary transition-colors"
            >
              <ChevronRight size={16} className="rotate-180" />
            </button>
            <div className="flex items-center gap-1">
              <span className="font-body text-xs text-muted-foreground px-2">
                Page <span className="text-foreground font-medium">{currentPage}</span> of {Math.ceil(totalCount / 10) || 1}
              </span>
            </div>
            <button 
              disabled={currentPage >= Math.ceil(totalCount / 10)} 
              onClick={() => setCurrentPage(prev => prev + 1)} 
              className="p-2 rounded border border-border text-muted-foreground disabled:opacity-50 hover:bg-secondary transition-colors"
            >
              <ChevronRight size={16} />
            </button>
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
