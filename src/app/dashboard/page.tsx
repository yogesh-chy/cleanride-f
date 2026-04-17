"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Car, Calendar, Clock, Package, Plus, Eye, LogOut, User,
  ChevronRight, X, CreditCard, ShieldCheck
} from "lucide-react";
import {
  WashBooking, WashPackage, VehicleType, packagePricing, 
  vehicleTypeLabels, statusColors, statusLabels,
} from "@/lib/wash-data";
import { bookingService } from "@/lib/booking-service";
import { toast } from "sonner";

import { DashboardSkeleton } from "@/components/DashboardSkeleton";

export default function CustomerDashboard() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<WashBooking[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<WashBooking | null>(null);

  // Booking form state
  const [vehicleType, setVehicleType] = useState<VehicleType>("car");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [washPackage, setWashPackage] = useState<WashPackage>("standard");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [timeSlots, setTimeSlots] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadBookings();
      // Polling for live status updates every 30 seconds
      const interval = setInterval(loadBookings, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (selectedDate) {
      loadSlots();
    }
  }, [selectedDate, washPackage]); // Re-load when package changes too!

  const loadBookings = async () => {
    try {
      const data = await bookingService.fetchMyBookings();
      setBookings(data.results || []);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setDataLoading(false);
    }
  };

  const { totalSpent, completedCount, ongoingCount } = useMemo(() => {
    const completed = bookings.filter(b => b.status === "completed");
    return {
      totalSpent: completed.reduce((acc, b) => acc + (packagePricing[b.washPackage]?.price || 0), 0),
      completedCount: completed.length,
      ongoingCount: bookings.filter(b => !["completed", "cancelled"].includes(b.status)).length
    };
  }, [bookings]);

  // CATEGORIZE SLOTS (Memoized to prevent render jank)
  const categorizedSlots = useMemo(() => {
    const result: Record<string, any[]> = { Morning: [], Afternoon: [], Evening: [] };
    if (!timeSlots) return result;
    
    timeSlots.forEach(slot => {
      const timeParts = slot.time.split(':');
      const hour = parseInt(timeParts[0]);
      const isPM = slot.time.includes('PM');
      const hour24 = (isPM && hour !== 12) ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);
      
      let period = "Evening";
      if (hour24 < 12) period = "Morning";
      else if (hour24 < 16) period = "Afternoon";
      result[period].push(slot);
    });
    return result;
  }, [timeSlots]);

  const loadSlots = async () => {
    const data = await bookingService.fetchSlots(selectedDate, washPackage);
    setTimeSlots(data.slots || []);
  };

  const handleLogout = async () => { await logout(); router.push("/login"); };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !selectedDate) return;

    const result = await bookingService.createBooking({
      vehicleType,
      vehicleNumber,
      washPackage,
      date: selectedDate,
      timeSlot: selectedSlot,
    });

    if (result.success && result.data) {
      toast.success("Booking submitted! Proceeding to checkout...");
      router.push(`/dashboard/checkout/${result.data.id}`);
    } else {
      toast.error(result.error || "Failed to book");
    }
  };

  // Show skeleton during auth check OR data loading
  if (isLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="container mx-auto flex items-center justify-between h-16 px-4">
            <div className="font-heading text-2xl tracking-wider">
              <span className="text-gradient">CLEAN</span><span className="text-foreground">RIDE</span>
            </div>
          </div>
        </header>
        <DashboardSkeleton />
      </div>
    );
  }

  if (!isAuthenticated || !user || (user.role !== "customer" && user.role !== "admin")) return null;

  const myBookings = bookings;
  const activeBookings = myBookings.filter((b) => b.status !== "completed" && b.status !== "cancelled");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link href="/" className="font-heading text-2xl tracking-wider">
            <span className="text-gradient">CLEAN</span><span className="text-foreground">RIDE</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <User size={16} /> <span className="font-body">{user?.name}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors">
              <LogOut size={16} /> <span className="hidden sm:inline font-body">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome & Quick Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl text-foreground">
              Welcome, <span className="text-gradient">{user?.name?.split(" ")[0]}</span>
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-1 text-primary/80 font-medium">Tracking your CleanRide experience</p>
          </div>
          <button
            onClick={() => setShowBookingForm(!showBookingForm)}
            className="flex items-center gap-2 px-6 py-3 rounded-md font-heading text-sm tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            <Plus size={18} /> BOOK A WASH
          </button>
        </div>

        {/* Customer Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { label: "Bookings Scheduled", value: ongoingCount, icon: <Clock size={20} className="text-primary" />, sub: "Active in queue" },
            { label: "Total Spent", value: `Rs. ${totalSpent}`, icon: <Package size={20} className="text-green-400" />, sub: `${completedCount} Washes done` },
            { label: "Loyalty Tier", value: completedCount >= 10 ? "GOLD" : completedCount >= 5 ? "SILVER" : "BRONZE", icon: <User size={20} className="text-yellow-500" />, sub: "Member Status" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 md:p-6 rounded-lg bg-card/40 backdrop-blur-md border border-border shadow-card hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-3 text-muted-foreground">
                <span className="font-body text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
                {stat.icon}
              </div>
              <div className="font-heading text-2xl text-foreground mb-1 group-hover:text-primary transition-colors">{stat.value}</div>
              <div className="font-body text-xs text-muted-foreground uppercase tracking-tighter">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Booking Form Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto" onClick={() => setShowBookingForm(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card border border-border rounded-2xl p-6 md:p-8 w-full max-w-2xl shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-primary/50"
              onClick={(e) => e.stopPropagation()}
            >              <button 
                type="button"
                onClick={() => setShowBookingForm(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-secondary/50 transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>
              <h2 className="font-heading text-2xl text-foreground mb-6 flex items-center gap-2 border-b border-border pb-4">
                <Car className="text-primary" size={24} /> New Booking
              </h2>
              <form onSubmit={handleBook} className="space-y-6">
              {/* Vehicle Type */}
              <div>
                <label className="font-body text-sm text-muted-foreground mb-2 block">Vehicle Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["car", "suv", "bike"] as VehicleType[]).map((vt) => (
                    <button key={vt} type="button" onClick={() => setVehicleType(vt)}
                      className={`py-3 rounded-md font-body text-sm border transition-all ${
                        vehicleType === vt ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {vehicleTypeLabels[vt]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-body text-sm text-muted-foreground mb-1 block">Vehicle Number</label>
                <input type="text" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} required
                  placeholder="BA 1 KHA 2345"
                  className="w-full px-4 py-3 rounded-md bg-secondary border border-border text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                />
              </div>

              {/* Package */}
              <div>
                <label className="font-body text-sm text-muted-foreground mb-2 block">Wash Package</label>
                <div className="grid sm:grid-cols-3 gap-3">
                  {(["basic", "standard", "premium"] as WashPackage[]).map((pkg) => (
                    <button key={pkg} type="button" onClick={() => setWashPackage(pkg)}
                      className={`p-4 rounded-md border text-left transition-all ${
                        washPackage === pkg ? "border-primary bg-primary/10" : "border-border bg-secondary hover:border-primary/30"
                      }`}
                    >
                      <div className="font-heading text-lg text-foreground">{packagePricing[pkg].name}</div>
                      <div className="font-body text-xs text-muted-foreground">{packagePricing[pkg].duration} min</div>
                      <div className="font-heading text-xl text-primary mt-1">Rs. {packagePricing[pkg].price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="font-body text-sm text-primary/70 mb-3 flex items-center gap-2 uppercase tracking-widest font-bold">
                  <Calendar size={14} /> 1. Pick a Date
                </label>
                <div className="w-full sm:w-1/2 relative group">
                  <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} required
                    min={new Date().toLocaleDateString('en-CA')}
                    className="w-full px-4 py-4 rounded-xl bg-secondary border border-border text-foreground font-heading text-lg focus:outline-none hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all uppercase tracking-widest dark:[color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Time Slots - Categorized */}
              <div>
                <label className="font-body text-sm text-primary/70 mb-4 flex items-center gap-2 uppercase tracking-widest font-bold">
                  <Clock size={14} /> 2. Choose Time
                </label>
                {selectedDate ? (
                  <div className="space-y-6">
                    {["Morning", "Afternoon", "Evening"].map((period) => {
                      const periodSlots = categorizedSlots[period];
                      if (!periodSlots || periodSlots.length === 0) return null;

                      return (
                        <div key={period}>
                          <div className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                             <div className="h-px flex-1 bg-border" />
                             {period}
                             <div className="h-px flex-1 bg-border" />
                          </div>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                            {periodSlots.map((slot) => {
                              // isHistoricallyPast is pre-checked or simple
                              const isDisabled = !slot.available || slot.is_past;

                              return (
                                <button 
                                  key={slot.id} 
                                  type="button" 
                                  onClick={() => !isDisabled && setSelectedSlot(slot.time)}
                                  disabled={isDisabled}
                                  title={slot.occupancy_reason || (slot.is_past ? "This time has passed" : "Available")}
                                  className={`px-2 py-3 rounded-lg font-body text-xs border transition-all relative group ${
                                    selectedSlot === slot.time
                                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                                      : !isDisabled
                                      ? "bg-secondary border-border text-foreground hover:border-primary/50"
                                      : "bg-muted border-border text-muted-foreground/30 cursor-not-allowed"
                                  }`}
                                >
                                  {slot.time}
                                  {!slot.available && slot.occupancyReason && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-background border border-border rounded text-[8px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-foreground">
                                      {slot.occupancyReason}
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                    {(!timeSlots || timeSlots.length === 0) && (
                      <div className="py-8 text-center bg-secondary/50 rounded-lg border border-dashed border-border">
                        <p className="font-body text-sm text-muted-foreground italic tracking-widest uppercase">No slots available for this date</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center bg-secondary/30 rounded-xl border border-dashed border-border group border-spacing-4">
                    <Clock size={32} className="text-muted-foreground/20 mb-3 group-hover:text-primary/20 transition-colors" />
                    <p className="font-body text-sm text-muted-foreground uppercase tracking-widest font-bold opacity-50">Please select a date first</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={!selectedSlot}
                  className="flex-1 py-4 rounded-xl font-heading text-xl tracking-widest bg-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-primary/20 uppercase"
                >
                  {selectedSlot ? `CONFIRM AT ${selectedSlot}` : 'SELECT A TIME'}
                </button>
                <button type="button" onClick={() => setShowBookingForm(false)}
                  className="px-6 py-4 rounded-xl font-body text-sm border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors uppercase tracking-widest font-bold hidden sm:block"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
        )}

        {/* Active Bookings - Real-time tracking */}
        {activeBookings.length > 0 && (
          <div className="mb-12">
            <h2 className="font-heading text-2xl text-foreground mb-4 flex items-center gap-2">
              <Eye size={20} className="text-primary" /> Live Vehicle Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-xl bg-card border border-border shadow-card hover:border-primary/30 transition-all relative overflow-hidden group"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Car size={20} />
                      </div>
                      <div>
                        <span className="font-heading text-xl text-foreground block leading-none mb-1">{booking.vehicleNumber}</span>
                        <span className="font-body text-[10px] text-muted-foreground uppercase tracking-widest">{packagePricing[booking.washPackage].name}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full font-body text-[10px] uppercase font-bold tracking-widest ${statusColors[booking.status]}`}>
                        {statusLabels[booking.status]}
                      </span>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="space-y-2 mt-6">
                    <div className="flex justify-between font-body text-[10px] text-muted-foreground uppercase tracking-widest">
                      <span>Progress</span>
                      <span className="text-primary font-bold">
                        {booking.status === "queued" ? "15%" :
                         booking.status === "in-progress" ? "40%" :
                         booking.status === "washing" ? "65%" :
                         booking.status === "drying" ? "85%" : "100%"}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-secondary rounded-full overflow-hidden border border-border/50">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full relative"
                        initial={{ width: "0%" }}
                        animate={{
                          width: booking.status === "queued" ? "15%" :
                                 booking.status === "in-progress" ? "40%" :
                                 booking.status === "washing" ? "65%" :
                                 booking.status === "drying" ? "85%" : "100%"
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      >
                         {/* Animated Pulse */}
                         <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </motion.div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-1.5 font-body text-[10px] text-muted-foreground uppercase">
                          <Clock size={12} className="text-primary/60" />
                          {booking.timeSlot}
                       </div>
                       {booking.queuePosition && booking.status === "queued" && (
                         <div className="px-2 py-0.5 rounded-md bg-primary/20 text-primary font-body text-[10px] font-bold">
                           Pos: #{booking.queuePosition}
                         </div>
                       )}
                    </div>
                    <div className="flex items-center gap-2">
                       {booking.isPaid ? (
                         <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] font-bold uppercase tracking-widest">
                           <ShieldCheck size={12} /> Paid
                         </div>
                       ) : (
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             router.push(`/dashboard/checkout/${booking.id}`);
                           }}
                           className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-[9px] font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer shadow-sm shadow-primary/10"
                         >
                           <CreditCard size={12} /> Pay Now
                         </button>
                       )}
                       
                       <button className="font-body text-[10px] text-primary hover:underline uppercase tracking-widest font-bold ml-2">
                         View Details
                       </button>
                    </div>
                  </div>
                  
                  {/* Decorative background glass shape */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* All Bookings History */}
        <div>
          <h2 className="font-heading text-2xl text-foreground mb-4 flex items-center gap-2">
            <Package size={20} className="text-primary" /> Booking History
          </h2>
          <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              {myBookings.length > 0 ? (
                <table className="w-full text-left">
                    <thead>
                      <tr className="bg-secondary/50">
                        {["Vehicle", "Package", "Date", "Time", "Payment", "Status"].map((h) => (
                          <th key={h} className="px-6 py-3 text-left font-body text-[10px] text-muted-foreground uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                  <tbody className="divide-y divide-border">
                    {myBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-secondary/20 transition-colors cursor-pointer group" onClick={() => setSelectedBooking(b)}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Car size={16} className="text-primary/40 group-hover:text-primary transition-colors" />
                            <span className="font-body text-sm text-foreground font-medium">{b.vehicleNumber}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-body text-sm text-muted-foreground">{packagePricing[b.washPackage].name}</td>
                        <td className="px-6 py-4 font-body text-sm text-muted-foreground">{b.date}</td>
                        <td className="px-6 py-4 font-body text-sm text-muted-foreground">{b.timeSlot}</td>
                        <td className="px-6 py-4">
                          {b.isPaid ? (
                              <span className="text-green-500 font-bold uppercase text-[9px] tracking-widest flex items-center gap-1">
                                  <ShieldCheck size={12} /> Paid
                              </span>
                          ) : (
                              <button 
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(`/dashboard/checkout/${b.id}`);
                                  }}
                                  className="text-[#5C2D91] hover:text-primary font-bold uppercase text-[9px] tracking-widest underline decoration-dotted"
                              >
                                  Pay Now
                              </button>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full font-body text-[10px] uppercase font-bold tracking-widest ${statusColors[b.status]}`}>{statusLabels[b.status]}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center">
                   <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground/30">
                      <Package size={32} />
                   </div>
                   <p className="font-heading text-xl text-foreground mb-1">No Bookings Yet</p>
                   <p className="font-body text-sm text-muted-foreground mb-6">You haven't booked any washes with CleanRide yet.</p>
                   <button onClick={() => setShowBookingForm(true)} className="px-6 py-2 rounded-md bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all font-heading text-xs tracking-widest uppercase">
                      Make Your First Booking
                   </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Detail Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedBooking(null)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card border border-border rounded-lg p-6 w-full max-w-md shadow-card"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-heading text-2xl text-foreground mb-4">Booking Details</h3>
              <div className="space-y-3 font-body text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Vehicle</span><span className="text-foreground">{selectedBooking.vehicleNumber}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="text-foreground">{vehicleTypeLabels[selectedBooking.vehicleType]}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Package</span><span className="text-foreground">{packagePricing[selectedBooking.washPackage].name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Price</span><span className="text-primary font-semibold">Rs. {packagePricing[selectedBooking.washPackage].price}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="text-foreground">{selectedBooking.date}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="text-foreground">{selectedBooking.timeSlot}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className={`px-2 py-1 rounded-full text-xs ${statusColors[selectedBooking.status]}`}>{statusLabels[selectedBooking.status]}</span></div>
529:                 <div className="flex justify-between border-t border-border/10 pt-2"><span className="text-muted-foreground">Phone</span><span className="text-foreground">{selectedBooking.contactPhone || "Not provided"}</span></div>
530:                 <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span className="text-foreground text-right max-w-[200px] truncate" title={selectedBooking.address}>{selectedBooking.address || "Not provided"}</span></div>
                
                {selectedBooking.assignedStaff && <div className="flex justify-between"><span className="text-muted-foreground">Assigned Staff</span><span className="text-foreground">{selectedBooking.assignedStaff}</span></div>}
                {selectedBooking.estimatedTime && <div className="flex justify-between"><span className="text-muted-foreground">Est. Time</span><span className="text-foreground">{selectedBooking.estimatedTime} min</span></div>}
                
                {/* Payment Status - Last Item */}
                <div className="flex justify-between items-center py-2 border-t border-border/10 mt-1">
                    <span className="text-muted-foreground">Payment</span>
                    {selectedBooking.isPaid ? (
                        <div className="flex items-center gap-1 text-green-500 font-bold uppercase text-[10px] tracking-widest">
                            <ShieldCheck size={14} /> Paid
                        </div>
                    ) : (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/dashboard/checkout/${selectedBooking.id}`);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#5C2D91] text-white font-bold uppercase text-[10px] tracking-widest hover:opacity-90 transition-all flex items-center gap-2"
                        >
                            <CreditCard size={12} /> Pay Now
                        </button>
                    )}
                </div>
              </div>

              {/* Status timeline */}
              <div className="mt-6 pt-4 border-t border-border">
                <p className="font-body text-xs text-muted-foreground mb-3">Progress</p>
                <div className="flex items-center gap-1">
                  {(["queued", "in-progress", "washing", "drying", "completed"] as const).map((s, i) => {
                    const statuses = ["queued", "in-progress", "washing", "drying", "completed"];
                    const currentIdx = statuses.indexOf(selectedBooking.status);
                    const isActive = i <= currentIdx;
                    return (
                      <div key={s} className="flex-1 flex items-center gap-1">
                        <div className={`h-2 flex-1 rounded-full ${isActive ? "bg-primary" : "bg-muted"}`} />
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1">
                  <span className="font-body text-[10px] text-muted-foreground">Queue</span>
                  <span className="font-body text-[10px] text-muted-foreground">Done</span>
                </div>
              </div>

              <button onClick={() => setSelectedBooking(null)} className="w-full mt-6 py-2 rounded-md border border-border text-muted-foreground hover:text-foreground font-body text-sm transition-colors">
                Close
              </button>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
