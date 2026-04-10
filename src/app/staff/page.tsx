"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Car, LogOut, User, ChevronRight, Play, CheckCircle, Clock,
  Droplets, Wind
} from "lucide-react";
import {
  WashBooking, WashStatus, packagePricing,
  vehicleTypeLabels, statusColors, statusLabels,
} from "@/lib/wash-data";
import { bookingService } from "@/lib/booking-service";
import { toast } from "sonner";

const statusFlow: WashStatus[] = ["queued", "in-progress", "washing", "drying", "completed"];

export default function StaffDashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<WashBooking[]>([]);
  const [filter, setFilter] = useState<"all" | WashStatus>("all");

  useEffect(() => {
    if (isAuthenticated && user) {
      loadQueue();
    }
  }, [isAuthenticated, user]);

  const loadQueue = async () => {
    const data = await bookingService.fetchQueue();
    setBookings(data.results);
  };

  const handleLogout = async () => { await logout(); router.push("/login"); };

  const advanceStatus = async (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const currentIdx = statusFlow.indexOf(booking.status);
    if (currentIdx < statusFlow.length - 1) {
      const nextStatus = statusFlow[currentIdx + 1];
      const success = await bookingService.updateStatus(bookingId, nextStatus);
      if (success) {
        toast.success(`Updated to ${statusLabels[nextStatus]}`);
        loadQueue();
      } else {
        toast.error("Failed to update status");
      }
    }
  };

  // Logic to separate "My Active Job" vs "Available Queue"
  // Note: user.id is string from authContext, assignedStaffId is also string
  const myActiveJob = bookings.find(b => 
    b.assignedStaffId === user?.id?.toString() && 
    b.status !== "completed" && 
    b.status !== "cancelled"
  );
  
  const availableQueue = bookings.filter(b => 
    (!b.assignedStaffId || b.assignedStaffId === "null") && 
    b.status === "queued"
  );

  const otherActivity = bookings.filter(b => 
    b.id !== myActiveJob?.id && 
    !availableQueue.find(aq => aq.id === b.id)
  );

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
        <section className="mb-12">
          <h2 className="font-heading text-sm uppercase tracking-widest text-primary mb-4">My Active Task</h2>
          {myActiveJob ? (
            <motion.div
              layoutId={myActiveJob.id}
              className="p-6 rounded-xl bg-primary/5 border-2 border-primary/20 shadow-lg relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-body text-xs text-muted-foreground">Booking #{myActiveJob.id}</span>
                  </div>
                  <h3 className="font-heading text-4xl text-foreground mb-1 tracking-tight">{myActiveJob.vehicleNumber}</h3>
                  <p className="font-body text-lg text-muted-foreground">{myActiveJob.customerName} • {packagePricing[myActiveJob.washPackage].name}</p>
                </div>

                <div className="flex flex-col items-end gap-3">
                   <div className={`px-4 py-1.5 rounded-lg font-heading text-sm font-bold uppercase tracking-widest ${statusColors[myActiveJob.status]}`}>
                      {statusLabels[myActiveJob.status]}
                   </div>
                   <button
                    onClick={() => advanceStatus(myActiveJob.id)}
                    className="flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-heading text-sm tracking-widest hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                  >
                    NEXT STAGE <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-8 rounded-xl bg-card border border-dashed border-border text-center">
              <p className="font-body text-muted-foreground">You don't have an active wash. Claim one from the queue below!</p>
            </div>
          )}
        </section>

        {/* Available Queue */}
        <section className="mb-12">
          <h2 className="font-heading text-sm uppercase tracking-widest text-muted-foreground mb-4">Available to Claim</h2>
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
                  </div>
                </div>
                <button
                  onClick={() => advanceStatus(booking.id)}
                  className="px-4 py-2 rounded-md bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground font-body text-xs font-medium transition-all"
                >
                  START WASH
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
