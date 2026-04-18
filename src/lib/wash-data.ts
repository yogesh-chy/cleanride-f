export type VehicleType = "car" | "suv" | "bike";
export type WashPackage = "basic" | "standard" | "premium";
export type WashStatus = "queued" | "in-progress" | "washing" | "drying" | "completed" | "cancelled";

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  occupancyReason?: string;
}

export interface WashBooking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  vehicleType: VehicleType;
  vehicleNumber: string;
  washPackage: WashPackage;
  timeSlot: string;
  date: string;
  status: WashStatus;
  assignedStaff?: string;
  assignedStaffId?: string;
  queuePosition?: number;
  createdAt: string;
  estimatedTime?: number; // minutes
  isPaid?: boolean;
  contactPhone?: string;
  address?: string;
}

export const packagePricing: Record<WashPackage, { name: string; price: number; duration: number; features: string[] }> = {
  basic: {
    name: "Basic Wash",
    price: 500,
    duration: 20,
    features: ["Exterior Wash", "Rinse & Dry", "Tire Cleaning"],
  },
  standard: {
    name: "Standard Wash",
    price: 1000,
    duration: 40,
    features: ["Exterior Wash", "Interior Vacuum", "Dashboard Wipe", "Tire Shine", "Air Freshener"],
  },
  premium: {
    name: "Premium Detail",
    price: 2000,
    duration: 75,
    features: ["Full Exterior Polish", "Interior Deep Clean", "Leather Conditioning", "Engine Bay Clean", "Ceramic Spray", "Tire Dressing"],
  },
};

export const vehicleTypeLabels: Record<VehicleType, string> = {
  car: "Car",
  suv: "SUV",
  bike: "Bike",
};

export const statusColors: Record<WashStatus, string> = {
  queued: "bg-yellow-500/20 text-yellow-400",
  "in-progress": "bg-blue-500/20 text-blue-400",
  washing: "bg-primary/20 text-primary",
  drying: "bg-purple-500/20 text-purple-400",
  completed: "bg-green-500/20 text-green-400",
  cancelled: "bg-destructive/20 text-destructive",
};

export const statusLabels: Record<WashStatus, string> = {
  queued: "In Queue",
  "in-progress": "In Progress",
  washing: "Washing",
  drying: "Drying",
  completed: "Completed",
  cancelled: "Cancelled",
};

