"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Car, Calendar, Clock, Package, MapPin, Phone, 
  ChevronLeft, CheckCircle2, Loader2, ShieldCheck, 
  Sparkles, Info
} from "lucide-react";
import { bookingService } from "@/lib/booking-service";
import { paymentService } from "@/lib/payment-service";
import { WashBooking, packagePricing, vehicleTypeLabels } from "@/lib/wash-data";
import { toast } from "sonner";
import Link from "next/link";

export default function CheckoutPage() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<WashBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (id) { loadBooking(); }
  }, [id]);

  const loadBooking = async () => {
    try {
      const data = await bookingService.fetchBookingById(id as string);
      if (data) {
        setBooking(data);
        setPhone(data.contactPhone || "");
        setAddress(data.address || "");
      } else {
        toast.error("Booking not found");
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    if (!phone || !address) {
      toast.error("Please provide both phone and address");
      return;
    }

    setPaying(true);
    try {
        const updateResult = await bookingService.updateBooking(booking.id, {
            contact_phone: phone,
            address: address
        });
        
        if (!updateResult.success) {
            throw new Error(updateResult.error || "Failed to update contact info");
        }

        const returnUrl = `${window.location.origin}/dashboard/payment-verify`;
        const result = await paymentService.initiatePayment(booking.id, returnUrl);

        if (result.success && result.data.payment_url) {
            toast.success("Redirecting to Khalti...");
            window.location.href = result.data.payment_url;
        } else {
            throw new Error(result.error || "Payment initiation failed");
        }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="font-body text-[10px] text-muted-foreground uppercase tracking-widest opacity-50">Encrypting Connection...</p>
      </div>
    );
  }

  if (!booking) return null;
  const pkg = packagePricing[booking.washPackage];

  return (
    <div className="h-screen bg-[#050505] text-foreground font-body overflow-hidden flex flex-col p-4 md:p-6 lg:p-8 items-center justify-center">
      {/* Subtle Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl w-full flex flex-col gap-3 relative z-10 h-[92vh] max-h-[680px]">
        {/* Simplified Header */}
        <div className="flex items-center justify-between px-1">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-primary transition-all group"
            >
              <ChevronLeft size={10} className="group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
        </div>
        
        {/* Compact Checkout Container */}
        <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="flex flex-col md:flex-row h-full bg-[#0c0c0e] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl"
        >
            {/* Form Section (60%) */}
            <div className="flex-1 flex flex-col p-6 md:p-10 relative">
                <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none">
                    <Sparkles size={140} />
                </div>

                <div className="mb-6">
                    <h2 className="font-heading text-3xl text-white mb-1.5 tracking-tighter italic">Confirm & Pay.</h2>
                    <p className="text-[11px] text-muted-foreground/60 leading-relaxed max-w-[280px]">
                        Complete the final step to secure your car's transformation.
                    </p>
                </div>

                <form onSubmit={handlePayment} className="flex-1 flex flex-col space-y-5">
                    <div className="space-y-4">
                       <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary/70 flex items-center gap-1.5">
                                <Phone size={10} /> Mobile Number
                            </label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 font-mono text-sm border-r border-white/5 pr-3">+977</span>
                                <input 
                                    type="tel" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="98XXXXXXXX"
                                    required
                                    className="w-full pl-16 pr-4 py-4 rounded-md bg-white/[0.03] border border-white/5 focus:border-primary/30 focus:bg-white/[0.05] transition-all outline-none font-mono text-lg text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary/70 flex items-center gap-1.5">
                                <MapPin size={10} /> Address
                            </label>
                            <textarea 
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Your exact pickup or service address..."
                                required
                                rows={2}
                                className="w-full px-4 py-4 rounded-md bg-white/[0.03] border border-white/5 focus:border-primary/30 focus:bg-white/[0.05] transition-all outline-none resize-none text-white text-base leading-snug"
                            />
                        </div>
                    </div>

                    <div className="pt-4 mt-auto">
                        <button 
                            type="submit"
                            disabled={paying}
                            className="w-full relative group overflow-hidden active:scale-[0.98] transition-transform"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#5C2D91] to-[#7c37c2] transition-all group-hover:scale-110 duration-500" />
                            <div className="relative py-4 rounded-md flex items-center justify-center gap-3 shadow-[0_8px_30px_rgba(92,45,145,0.2)] hover:shadow-[0_12px_40px_rgba(92,45,145,0.4)] transition-all">
                                {paying ? (
                                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                                ) : (
                                    <>
                                        <img src="https://khalti-web.s3.ap-south-1.amazonaws.com/home/public/khalti-logo.png" alt="Khalti" className="h-5 brightness-0 invert" />
                                        <span className="font-heading text-base tracking-[0.1em] text-white">PAY Rs. {pkg.price}</span>
                                    </>
                                )}
                            </div>
                        </button>
                        <p className="text-[7px] text-center mt-3 text-muted-foreground/30 uppercase tracking-[0.2em] font-medium italic">
                            Secure 256-bit encrypted checkout
                        </p>
                    </div>
                </form>
            </div>

            {/* Receipt Section (40%) */}
            <div className="w-full md:w-[320px] bg-secondary/10 p-6 md:p-8 flex flex-col relative">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
                
                <div className="mb-6">
                    <div className="flex items-center gap-1.5 text-primary/50 font-bold uppercase tracking-[0.2em] text-[8px] mb-2">
                        <Package size={12} /> Summary
                    </div>
                    <h3 className="font-heading text-2xl text-white mb-0.5">{pkg.name}</h3>
                    <p className="text-[9px] text-muted-foreground/50 uppercase tracking-widest font-medium">{vehicleTypeLabels[booking.vehicleType]} Wash</p>
                </div>

                <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-primary/40">
                            <Calendar size={14} />
                        </div>
                        <div>
                            <p className="text-[7px] uppercase font-bold text-muted-foreground/30 mb-0">Date</p>
                            <p className="text-xs font-medium text-foreground">{booking.date}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-primary/40">
                            <Clock size={14} />
                        </div>
                        <div>
                            <p className="text-[7px] uppercase font-bold text-muted-foreground/30 mb-0">Time</p>
                            <p className="text-xs font-medium text-foreground">{booking.timeSlot}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-primary/40">
                            <Car size={14} />
                        </div>
                        <div>
                            <p className="text-[7px] uppercase font-bold text-muted-foreground/30 mb-0">Vehicle</p>
                            <p className="text-xs font-medium text-foreground uppercase tracking-wider">{booking.vehicleNumber}</p>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                             <span className="text-[8px] text-muted-foreground/30 uppercase font-bold tracking-widest block">Net Payable</span>
                             <span className="font-heading text-3xl text-primary leading-none tracking-tighter">Rs.{pkg.price}</span>
                        </div>
                        <div className="flex flex-col items-end pb-1 opacity-40">
                            <span className="text-[7px] text-primary font-bold uppercase tracking-widest">Digital</span>
                            <CheckCircle2 size={10} className="text-primary mt-0.5" />
                        </div>
                    </div>
                    
                    <div className="p-3 rounded-xl bg-primary/[0.03] border border-primary/5 flex gap-2 items-start">
                         <Info size={12} className="text-primary/30 shrink-0" />
                         <p className="text-[7px] text-primary/40 leading-relaxed font-medium uppercase tracking-tighter">
                            Bookings are finalized instantly after payment verification.
                         </p>
                    </div>
                </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
}
