"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Car, LogOut, User, ChevronRight, Play, CheckCircle, Clock,
  Droplets, Wind, MapPin, Phone
} from "lucide-react";
import {
  WashBooking, WashStatus, packagePricing,
  vehicleTypeLabels, statusColors, statusLabels,
} from "@/lib/wash-data";
import { bookingService } from "@/lib/booking-service";
import { toast } from "sonner";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";

const statusFlow: WashStatus[] = ["queued", "in-progress", "washing", "drying", "completed"];

export default function StaffDashboard() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<WashBooking[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | WashStatus>("all");
  const [mineOnly, setMineOnly] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadQueue();
      // Poll for new bookings every 30 seconds
      const interval = setInterval(loadQueue, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user, mineOnly]); // Reload when mineOnly changes

  const loadQueue = async () => {
    try {
      const data = await bookingService.fetchQueue(1, mineOnly);
      setBookings(data.results);
    } catch (err) {
      console.error("Failed to load queue", err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogout = async () => { await logout(); router.push("/login"); };

  const advanceStatus = async (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const currentIdx = statusFlow.indexOf(booking.status);
    if (currentIdx < statusFlow.length - 1) {
      const nextStatus = statusFlow[currentIdx + 1];
      const result = await bookingService.updateStatus(bookingId, nextStatus);
      if (result.success) {
        toast.success(`Updated to ${statusLabels[nextStatus]}`);
        loadQueue();
      } else {
        toast.error(result.error || "Failed to update status");
      }
    }
  };

  // Logic to separate "My Active Job" vs "Available Queue" (Memoized)
  const { myActiveJob, availableQueue, otherActivity } = useMemo(() => {
    const active = bookings.find(b => 
      b.assignedStaffId === user?.id?.toString() && 
      b.status !== "completed" && 
      b.status !== "cancelled"
    );
    
    const available = bookings.filter(b => 
      (!b.assignedStaffId || b.assignedStaffId === "null" || b.assignedStaffId === null) && 
      b.status === "queued"
    );

    const others = bookings.filter(b => 
      b.id !== active?.id && 
      !available.find(aq => aq.id === b.id)
    );

    return { myActiveJob: active, availableQueue: available, otherActivity: others };
  }, [bookings, user?.id]);

  const filteredOther = filter === "all" ? otherActivity : otherActivity.filter((b) => b.status === filter);

  const getStatusIcon = (status: WashStatus) => {
    switch (status) {
      case "queued": return <Clock size={16} />;
      case "in-progress": return <Play size={16} />;
      case "washing": return <Droplets size={16} />;
      case "drying": return <Wind size={16} />;
      case "completed": return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
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
              <span className="font-body text-xs text-muted-foreground ml-2">Staff Panel</span>
            </div>
          </div>
        </header>
        <DashboardSkeleton />
      </div>
    );
  }

  if (!isAuthenticated || !user || (user.role !== "staff" && user.role !== "admin")) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link href="/" className="font-heading text-2xl tracking-wider">
            <span className="text-gradient">CLEAN</span><span className="text-foreground">RIDE</span>
            <span className="font-body text-xs text-muted-foreground ml-2">Staff Panel</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <User size={16} /> <span className="font-body">{user?.name}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Active Task Section */}
        <section className="mb-10">
          <h2 className="font-heading text-[10px] uppercase tracking-[0.3em] text-primary mb-4 flex items-center gap-2">
            <Clock size={12} /> My Active Task
          </h2>
          {myActiveJob ? (
            <motion.div
              layoutId={myActiveJob.id}
              className="p-5 md:p-8 rounded-2xl bg-primary/[0.03] border border-primary/20 shadow-xl relative overflow-hidden group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4">
                  <div>
                    <span className="font-body text-[8px] font-bold text-primary/40 uppercase tracking-widest">Job #{myActiveJob.id}</span>
                    <h3 className="font-heading text-4xl md:text-5xl text-foreground mb-1 tracking-tighter italic">{myActiveJob.vehicleNumber}</h3>
                    <p className="font-body text-sm text-muted-foreground font-medium uppercase tracking-wider">
                       {myActiveJob.customerName} <span className="mx-2 opacity-20">|</span> <span className="text-primary/70">{packagePricing[myActiveJob.washPackage].name}</span>
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     <div className="p-3 rounded-xl bg-background/40 border border-white/5 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary"><MapPin size={14} /></div>
                        <span className="text-[11px] text-foreground font-medium truncate">{myActiveJob.address || "No address"}</span>
                     </div>
                     <div className="p-3 rounded-xl bg-background/40 border border-white/5 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary"><Phone size={14} /></div>
                        <span className="text-[11px] text-foreground font-medium">{myActiveJob.contactPhone || "No phone"}</span>
                     </div>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                   <div className={`px-4 py-1.5 rounded-full font-heading text-[10px] font-bold uppercase tracking-widest ${statusColors[myActiveJob.status]}`}>
                      {statusLabels[myActiveJob.status]}
                   </div>
                   <button
                    onClick={() => advanceStatus(myActiveJob.id)}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-primary text-primary-foreground font-heading text-sm tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-primary/20 group/btn"
                  >
                    NEXT STAGE <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              
              {/* Background accent */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
            </motion.div>
          ) : (
            <div className="py-12 px-6 rounded-2xl bg-secondary/20 border border-dashed border-border text-center group">
              <Car size={32} className="mx-auto text-muted-foreground/20 mb-3 group-hover:text-primary/20 transition-all" />
              <p className="font-body text-xs text-muted-foreground uppercase tracking-widest leading-relaxed">No active task. Select an available wash below to begin.</p>
            </div>
          )}
        </section>

        {/* Available Queue */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
             <h2 className="font-heading text-sm uppercase tracking-widest text-muted-foreground">Available to Claim</h2>
             <button 
                onClick={() => setMineOnly(!mineOnly)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-heading text-[10px] tracking-widest uppercase transition-all border ${
                  mineOnly 
                    ? "bg-primary/20 border-primary text-primary" 
                    : "bg-secondary border-border text-muted-foreground hover:border-primary/50"
                }`}
             >
                <User size={12} /> {mineOnly ? "Showing My Assigned" : "Show All Active"}
             </button>
          </div>
          <div className="grid gap-3">
            {availableQueue.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                    <Car size={20} />
                  </div>
                  <div>
                    <div className="font-heading text-lg text-foreground">{booking.vehicleNumber}</div>
                    <div className="font-body text-xs text-muted-foreground">{packagePricing[booking.washPackage].name} • {booking.timeSlot}</div>
                    <div className="font-body text-[10px] text-muted-foreground/60 mt-1 flex items-center gap-2">
                       <span>{booking.address?.split(',')[0]}</span>
                       <span>•</span>
                       <span className={booking.isPaid ? "text-green-400" : "text-destructive/50"}>{booking.isPaid ? "PAID" : "UNPAID"}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => !myActiveJob && advanceStatus(booking.id)}
                  disabled={!!myActiveJob}
                  className={`px-4 py-2 rounded-md font-body text-xs font-medium transition-all ${
                    myActiveJob 
                      ? "bg-muted text-muted-foreground/30 cursor-not-allowed border border-border" 
                      : "bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground"
                  }`}
                  title={myActiveJob ? "You already have an active job" : "Start this wash"}
                >
                  {myActiveJob ? "BÜSY" : "START WASH"}
                </button>
              </motion.div>
            ))}
            {availableQueue.length === 0 && (
              <p className="text-center py-6 text-muted-foreground font-body text-sm italic">No unassigned vehicles in queue</p>
            )}
          </div>
        </section>

        {/* Activity Logs / All others */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xs uppercase tracking-widest text-muted-foreground">Other Activity</h2>
            <div className="flex gap-2">
              {["all", "completed"].map((f) => (
                <button 
                  key={f} 
                  onClick={() => setFilter(f as any)}
                  className={`px-2 py-1 rounded text-[10px] font-heading uppercase tracking-tighter ${filter === f ? 'bg-secondary text-foreground' : 'text-muted-foreground'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2 opacity-60 hover:opacity-100 transition-opacity">
            {filteredOther.map((booking) => (
              <div key={booking.id} className="p-3 rounded-lg bg-card/50 border border-border flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] ${statusColors[booking.status]}`}>
                    {getStatusIcon(booking.status)}
                  </div>
                  <div className="font-body text-xs">
                    <span className="font-bold text-foreground">{booking.vehicleNumber}</span>
                    <span className="text-muted-foreground ml-2">by {booking.assignedStaff || 'Unassigned'}</span>
                  </div>
                </div>
                <span className="font-body text-[10px] text-muted-foreground uppercase">{statusLabels[booking.status]}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
