"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "admin": return "/admin";
      case "staff": return "/staff";
      case "customer": return "/dashboard";
      default: return "/login";
    }
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/" className="font-heading text-3xl tracking-wider">
          <span className="text-gradient">CLEAN</span>
          <span className="text-foreground">RIDE</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className={`font-body text-sm hover:text-primary transition-colors cursor-pointer ${
                    pathname === link.href ? "text-primary font-medium" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </motion.span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Link href={getDashboardPath()}>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 rounded-md font-body text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 shadow-glow"
              >
                Dashboard
              </motion.button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <motion.button
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 0 20px hsl(var(--primary) / 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-md font-body text-sm font-semibold border border-primary text-primary transition-all duration-300 active:scale-95"
                >
                  Login
                </motion.button>
              </Link>
              <Link href="/register">
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2 rounded-md font-body text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 shadow-glow"
                >
                  Book Now
                </motion.button>
              </Link>
            </>
          )}
        </div>

        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(!open)} 
          className="md:hidden text-foreground p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden bg-background border-b border-border"
        >
          <ul className="flex flex-col items-center gap-4 py-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href} 
                  onClick={() => setOpen(false)} 
                  className={`font-body hover:text-primary transition-colors ${
                    pathname === link.href ? "text-primary font-medium" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              {isAuthenticated ? (
                <Link href={getDashboardPath()} onClick={() => setOpen(false)} className="px-6 py-2 rounded-md font-body text-sm font-medium bg-primary text-primary-foreground">
                  Dashboard
                </Link>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)} className="px-6 py-2 rounded-md font-body text-sm font-medium bg-primary text-primary-foreground">
                  Login / Book
                </Link>
              )}
            </li>
          </ul>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
