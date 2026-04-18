"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import Link from "next/link";
import { LogOut, Menu, X, LayoutDashboard, CalendarRange, Users, Contact, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Auth & role checks are handled by proxy.ts
  }, [isAuthenticated, user, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <AdminSidebar />

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-50">
        <Link href="/" className="font-heading text-xl tracking-wider">
          <span className="text-gradient">CLEAN</span><span className="text-foreground">RIDE</span>
        </Link>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-foreground">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] bg-card border-r border-border md:hidden flex flex-col p-6 shadow-2xl"
            >
              <div className="mb-10 flex items-center justify-between">
                <Link href="/" className="font-heading text-2xl tracking-wider">
                  <span className="text-gradient">CLEAN</span><span className="text-foreground">RIDE</span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-muted-foreground p-1">
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-2 flex-1">
                {[
                  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
                  { label: "Bookings", href: "/admin/bookings", icon: <CalendarRange size={18} /> },
                  { label: "Customers", href: "/admin/customers", icon: <Users size={18} /> },
                  { label: "Staffs", href: "/admin/team", icon: <Contact size={18} /> },
                  { label: "Finances", href: "/admin/finances", icon: <DollarSign size={18} /> },
                ].map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-lg font-body text-sm transition-all ${
                        isActive 
                          ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20" 
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      {item.icon} {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto pt-6 border-t border-border space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-heading">
                    {user?.name?.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-body text-sm font-medium text-foreground">{user?.name}</p>
                    <p className="font-body text-[10px] text-muted-foreground uppercase tracking-widest">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
