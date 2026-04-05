"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, UserPlus, Phone, Mail, Award, 
  CheckCircle2, Clock, MoreVertical, Trash2,
  AlertCircle, ShieldCheck, MapPin
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "available" | "busy" | "off-duty";
  rating: number;
  tasksCompleted: number;
  joinDate: string;
}

const initialStaff: StaffMember[] = [
  { id: "s1", name: "Ram Bahadur", email: "ram@cleanride.com", phone: "+977 9801234568", role: "Senior Detailer", status: "available", rating: 4.8, tasksCompleted: 142, joinDate: "2023-10-12" },
  { id: "s2", name: "Shyam Thapa", email: "shyam@cleanride.com", phone: "+977 9801234569", role: "Wash Technician", status: "busy", rating: 4.5, tasksCompleted: 98, joinDate: "2023-11-20" },
  { id: "s3", name: "Gopal Magar", email: "gopal@cleanride.com", phone: "+977 9801234570", role: "Interior Specialist", status: "off-duty", rating: 4.7, tasksCompleted: 115, joinDate: "2023-09-05" },
  { id: "s4", name: "Sita Kumari", email: "sita@cleanride.com", phone: "+977 9801234571", role: "Junior Technician", status: "available", rating: 4.2, tasksCompleted: 45, joinDate: "2024-01-15" },
];

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Form state
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Wash Technician",
  });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const staffToAdd: StaffMember = {
      id: `s${Date.now()}`,
      ...newStaff,
      status: "available",
      rating: 0,
      tasksCompleted: 0,
      joinDate: new Date().toISOString().split("T")[0],
    };
    setStaff([...staff, staffToAdd]);
    setIsAddModalOpen(false);
    setNewStaff({ name: "", email: "", phone: "", role: "Wash Technician" });
    toast.success(`Successfully added staff member: ${newStaff.name}`);
  };

  const statusColors = {
    available: "text-green-400 bg-green-500/10 border-green-500/20",
    busy: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    "off-duty": "text-muted-foreground bg-secondary border-border",
  };

  return (
    <div className="p-4 md:p-8 space-y-8 min-h-screen pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl text-foreground">Staff Management</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Manage your team of professional detailers and technicians</p>
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-heading text-sm tracking-wider hover:opacity-90 transition-opacity uppercase shadow-[0_0_15px_rgba(var(--primary),0.3)]">
              <UserPlus size={18} /> Add New Staff
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl tracking-wide text-foreground uppercase">Register Staff</DialogTitle>
              <DialogDescription className="font-body text-sm text-muted-foreground">
                Enter the details for the new staff member. They will be assigned "Available" status by default.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddStaff} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase tracking-widest text-muted-foreground">Full Name</Label>
                <Input 
                  id="name" 
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                  placeholder="e.g. Ram Bahadur" 
                  className="bg-secondary border-border focus:ring-primary h-10 font-body text-sm" 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground">Email Address</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                  placeholder="ram@cleanride.com" 
                  className="bg-secondary border-border focus:ring-primary h-10 font-body text-sm" 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs uppercase tracking-widest text-muted-foreground">Phone Number</Label>
                <Input 
                  id="phone" 
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                  placeholder="+977 98XXXXXXXX" 
                  className="bg-secondary border-border focus:ring-primary h-10 font-body text-sm" 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-xs uppercase tracking-widest text-muted-foreground">Designation</Label>
                <select 
                  id="role"
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                  className="w-full h-10 px-3 rounded-md bg-secondary border border-border font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option>Wash Technician</option>
                  <option>Senior Detailer</option>
                  <option>Interior Specialist</option>
                  <option>Quality Inspector</option>
                </select>
              </div>
              <DialogFooter className="pt-4">
                <button 
                  type="submit" 
                  className="w-full py-3 bg-primary text-primary-foreground font-heading tracking-widest rounded-md hover:opacity-90 transition-opacity uppercase"
                >
                  Confirm Registration
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-6 rounded-xl bg-card border border-border shadow-card flex items-center gap-4">
          <div className="p-3 rounded-lg bg-green-500/10 text-green-400"><ShieldCheck size={24} /></div>
          <div>
            <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">On-Duty Today</p>
            <p className="font-heading text-3xl text-foreground">12 / 15</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-6 rounded-xl bg-card border border-border shadow-card flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary"><Award size={24} /></div>
          <div>
            <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">Team Rating</p>
            <p className="font-heading text-3xl text-foreground">4.85 ★</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-6 rounded-xl bg-card border border-border shadow-card flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400"><CheckCircle2 size={24} /></div>
          <div>
            <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">Avg Tasks / Day</p>
            <p className="font-heading text-3xl text-foreground">24 Washes</p>
          </div>
        </motion.div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {staff.map((s, i) => (
            <motion.div
              key={s.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="p-1 rounded-2xl bg-gradient-to-tr from-border/50 to-border/10 group"
            >
              <div className="bg-card p-6 rounded-[14px] border border-border/50 flex flex-col md:flex-row gap-6 relative overflow-hidden group-hover:border-primary/30 transition-colors">
                {/* Status Indicator */}
                <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl font-body text-[9px] font-bold uppercase tracking-widest border-l border-b ${statusColors[s.status]}`}>
                  {s.status}
                </div>

                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center text-primary border border-border relative group">
                    <User size={40} strokeWidth={1.5} />
                    <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-[10px] font-heading px-2 py-0.5 rounded border border-card">
                      {s.rating} ★
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl text-foreground mb-0.5">{s.name}</h3>
                    <p className="font-body text-xs text-primary font-medium tracking-wide">{s.role}</p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="font-body text-[9px] uppercase tracking-widest text-muted-foreground">Contacts</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-foreground/80">
                          <Phone size={12} className="text-primary/60" />
                          <span className="font-body text-xs">{s.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground/80">
                          <Mail size={12} className="text-primary/60" />
                          <span className="font-body text-xs truncate max-w-[120px]">{s.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="font-body text-[9px] uppercase tracking-widest text-muted-foreground">Performance</p>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-green-400" />
                        <span className="font-body text-xs text-foreground">{s.tasksCompleted} Tasks Done</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-blue-400" />
                        <span className="font-body text-xs text-foreground">Joined {s.joinDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <MapPin size={12} className="text-muted-foreground" />
                       <span className="font-body text-[10px] text-muted-foreground">Kathmandu, Nepal</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => toast.info("Opening staff context menu...")} className="text-muted-foreground hover:text-foreground transition-colors"><MoreVertical size={18} /></button>
                      <button 
                        onClick={() => {
                          setStaff(staff.filter(st => st.id !== s.id));
                          toast.success(`Removed staff member ${s.name}`);
                        }}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
