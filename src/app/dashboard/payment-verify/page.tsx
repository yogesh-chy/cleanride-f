"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { paymentService } from "@/lib/payment-service";
import { 
  CheckCircle2, XCircle, Loader2, 
  ArrowRight, ExternalLink, Calendar,
  CreditCard, Package
} from "lucide-react";
import Link from "next/link";

export default function PaymentVerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("Verifying your payment, please wait...");
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [countdown, setCountdown] = useState(5);

  // Handle automatic redirect when countdown reaches zero
  useEffect(() => {
    if (status === "success" && countdown === 0) {
      router.push("/dashboard");
    }
  }, [status, countdown, router]);

  // Handle the countdown timer
  useEffect(() => {
    if (status === "success" && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, countdown]);

  useEffect(() => {
    const pidx = searchParams.get("pidx");
    const khaltiStatus = searchParams.get("status");

    if (pidx) {
      verifyPayment(pidx);
    } else if (khaltiStatus === "User canceled") {
      setStatus("error");
      setMessage("Payment was canceled by the user.");
    } else {
      setStatus("error");
      setMessage("Invalid payment parameters. No PIDX found.");
    }
  }, [searchParams]);

  const verifyPayment = async (pidx: string) => {
    try {
      const result = await paymentService.verifyPayment(pidx);
      if (result.success) {
        setStatus("success");
        setMessage("Payment successful! Your wash is now in the queue.");
        setOrderDetails(result.data.details);
      } else {
        setStatus("error");
        setMessage(result.error || "Payment verification failed.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("An unexpected error occurred during verification.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <AnimatePresence mode="wait">
          {status === "verifying" && (
            <motion.div 
              key="verifying"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-4 p-8 rounded-2xl bg-card border border-border/50 backdrop-blur-xl shadow-2xl"
            >
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin" />
                <CreditCard className="absolute inset-0 m-auto text-primary/50" size={32} />
              </div>
              <h2 className="font-heading text-2xl text-foreground">Verifying Payment</h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Communicating with Khalti gateway to confirm your transaction status safely.
              </p>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-8 rounded-2xl bg-card border border-green-500/20 shadow-2xl space-y-6"
            >
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="text-green-500" size={48} />
              </div>
              <div>
                <h2 className="font-heading text-3xl text-foreground mb-2">Payment Confirmed!</h2>
                <p className="font-body text-sm text-muted-foreground">
                  Your ride is about to get the sparkling treatment it deserves.
                </p>
                <p className="text-xs text-primary/60 font-medium mt-2 uppercase tracking-widest animate-pulse">
                  Redirecting to dashboard in {countdown}s...
                </p>
              </div>

              {orderDetails && (
                <div className="bg-secondary/30 rounded-xl p-4 text-left border border-border space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1">
                       <Package size={12} /> Transaction ID
                    </span>
                    <span className="text-foreground font-mono">{orderDetails.transaction_id.substring(0, 12)}...</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-border/50">
                    <span className="text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1">
                       <CreditCard size={12} /> Amount Paid
                    </span>
                    <span className="text-primary font-bold">Rs. {orderDetails.total_amount / 100}</span>
                  </div>
                </div>
              )}

              <Link 
                href="/dashboard"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-primary text-primary-foreground font-heading tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20"
              >
                GO TO DASHBOARD <ArrowRight size={18} />
              </Link>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-8 rounded-2xl bg-card border border-destructive/20 shadow-2xl space-y-6"
            >
              <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="text-destructive" size={48} />
              </div>
              <div>
                <h2 className="font-heading text-2xl text-foreground mb-2">Payment Issues</h2>
                <p className="font-body text-sm text-muted-foreground">
                  {message}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link 
                  href="/dashboard"
                  className="py-3 rounded-lg border border-border text-muted-foreground font-body text-sm hover:text-foreground hover:bg-secondary/50 transition-all uppercase tracking-widest font-bold"
                >
                  Skip
                </Link>
                <button 
                  onClick={() => router.back()}
                  className="py-3 rounded-lg bg-primary text-primary-foreground font-body text-sm hover:opacity-90 transition-all uppercase tracking-widest font-bold"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
