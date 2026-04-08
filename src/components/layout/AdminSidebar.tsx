"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, CalendarRange, Users, Contact, DollarSign, LogOut 
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Bookings", icon: CalendarRange, href: "/admin/bookings" },
  { label: "Customers", icon: Users, href: "/admin/customers" },
  { label: "Staffs", icon: Contact, href: "/admin/team" },
  { label: "Finances", icon: DollarSign, href: "/admin/finances" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border p-6 space-y-8 h-screen sticky top-0">
      <Link href="/" className="font-heading text-2xl tracking-wider">
        <span className="text-gradient">CLEAN</span><span className="text-foreground">RIDE</span>
      </Link>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md font-body text-sm transition-colors ${
                isActive 
                  ? "bg-primary text-primary-foreground font-medium shadow-sm" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon size={18} /> {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="pt-8 mt-auto border-t border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-heading font-medium">
            {user?.name?.substring(0, 2).toUpperCase() || "AD"}
          </div>
          <div className="overflow-hidden">
            <p className="font-body text-sm text-foreground truncate">{user?.name}</p>
            <p className="font-body text-[10px] text-muted-foreground uppercase tracking-widest">{user?.role}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-3 px-4 py-3 rounded-md font-body text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
