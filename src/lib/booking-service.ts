import Cookies from "js-cookie";
import { WashBooking, WashStatus, VehicleType, WashPackage } from "./wash-data";
 
 export type PaginatedBookings = {
   results: WashBooking[];
   count: number;
   next?: string | null;
   previous?: string | null;
 };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const getAuthHeader = (): Record<string, string> => {
  const token = Cookies.get("access_token");
  return token ? { "Authorization": `Bearer ${token}` } : {};
};

// Helper to map backend snake_case to frontend camelCase
const mapBookingToFrontend = (data: any): WashBooking => ({
  id: data.id.toString(),
  customerId: data.customer?.toString() || "",
  customerName: data.customer_name || "",
  customerPhone: data.customer_phone || "",
  vehicleType: data.vehicle_type as VehicleType,
  vehicleNumber: data.vehicle_number,
  washPackage: data.wash_package as WashPackage,
  timeSlot: data.time_slot,
  date: data.date,
  status: data.status as WashStatus,
  assignedStaff: data.assigned_staff_name || undefined,
  assignedStaffId: data.assigned_staff?.toString() || undefined,
  queuePosition: data.queue_position,
  createdAt: data.created_at,
  estimatedTime: data.estimated_time,
  contactPhone: data.contact_phone || "",
  address: data.address || "",
  isPaid: data.is_paid || false,
});

export const bookingService = {
  // Customer: Get my bookings
  async fetchMyBookings(page = 1): Promise<PaginatedBookings> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/my/?page=${page}`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) throw new Error("Failed to fetch bookings");
      const data = await response.json();
      
      // Handle potential non-paginated fallbacks just in case
      if (Array.isArray(data)) {
        return { results: data.map(mapBookingToFrontend), count: data.length };
      }

      return {
        results: data.results.map(mapBookingToFrontend),
        count: data.count,
        next: data.next,
        previous: data.previous
      };
    } catch (error) {
      console.error("fetchMyBookings error:", error);
      return { results: [], count: 0 };
    }
  },

  // Get single booking by ID
  async fetchBookingById(id: string | number): Promise<WashBooking | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/my/${id}/`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) throw new Error("Failed to fetch booking");
      const data = await response.json();
      return mapBookingToFrontend(data);
    } catch (error) {
      console.error("fetchBookingById error:", error);
      return null;
    }
  },

  // Customer: Create booking
  async createBooking(bookingData: {
    vehicleType: VehicleType;
    vehicleNumber: string;
    washPackage: WashPackage;
    date: string;
    timeSlot: string;
    contactPhone?: string;
    address?: string;
  }): Promise<{ success: boolean; data?: WashBooking; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/my/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          vehicle_type: bookingData.vehicleType,
          vehicle_number: bookingData.vehicleNumber,
          wash_package: bookingData.washPackage,
          date: bookingData.date,
          time_slot: bookingData.timeSlot,
          contact_phone: bookingData.contactPhone,
          address: bookingData.address,
        }),
      });

      const data = await response.json();
      if (!response.ok) return { success: false, error: data.detail || "Failed to create booking" };
      
      return { success: true, data: mapBookingToFrontend(data) };
    } catch (error) {
      return { success: false, error: "Network error. Please try again." };
    }
  },

  // Staff/Admin: Get all active queue
  async fetchQueue(page = 1, mine = false): Promise<PaginatedBookings> {
    try {
      let url = `${API_BASE_URL}/bookings/queue/?page=${page}`;
      if (mine) url += `&mine=true`;

      const response = await fetch(url, {
        headers: getAuthHeader(),
      });
      if (!response.ok) throw new Error("Failed to fetch queue");
      const data = await response.json();
      
      if (Array.isArray(data)) {
        return { results: data.map(mapBookingToFrontend), count: data.length };
      }

      return {
        results: (data.results || []).map(mapBookingToFrontend),
        count: data.count || 0,
        next: data.next,
        previous: data.previous
      };
    } catch (error) {
      console.error("fetchQueue error:", error);
      return { results: [], count: 0 };
    }
  },

  // Admin: Get all bookings
  async fetchAllBookings(page = 1, filters?: string): Promise<PaginatedBookings> {
    try {
      let url = `${API_BASE_URL}/bookings/admin/?page=${page}`;
      if (filters) url += `&${filters}`;

      const response = await fetch(url, {
        headers: getAuthHeader(),
      });
      if (!response.ok) throw new Error("Failed to fetch all bookings");
      const data = await response.json();
      
      if (Array.isArray(data)) {
        return { results: data.map(mapBookingToFrontend), count: data.length };
      }

      return {
        results: data.results.map(mapBookingToFrontend),
        count: data.count,
        next: data.next,
        previous: data.previous
      };
    } catch (error) {
      console.error("fetchAllBookings error:", error);
      return { results: [], count: 0 };
    }
  },

  // Update booking (e.g., adding contact info at checkout)
  async updateBooking(id: string | number, data: any): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/my/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      });
      
      const responseData = await response.json();
      if (!response.ok) {
        return { success: false, error: responseData.detail || "Failed to update booking" };
      }
      return { success: true };
    } catch (error) {
      console.error("updateBooking error:", error);
      return { success: false, error: "Network error" };
    }
  },

  // Update status (for staff/admin)
  async updateStatus(id: string, status: WashStatus): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/queue/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ status }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        // Return the specific error from DRF (often in 'detail' or a specific field)
        const errorMsg = data.detail || (data.status ? data.status[0] : "Failed to update status");
        return { success: false, error: errorMsg };
      }
      return { success: true };
    } catch (error) {
      console.error("updateStatus error:", error);
      return { success: false, error: "Network error" };
    }
  },

  // Get available slots
  async fetchSlots(date: string, packageType?: string): Promise<{ date: string; slots: any[] }> {
    try {
      let url = `${API_BASE_URL}/bookings/slots/?date=${date}`;
      if (packageType) url += `&package=${packageType}`;
      
      const response = await fetch(url, {
        headers: getAuthHeader(),
      });
      if (!response.ok) return { date, slots: [] };
      return await response.json();
    } catch (error) {
      console.error("fetchSlots error:", error);
      return { date, slots: [] };
    }
  },
  
  // Admin: Get statistics
  async fetchStats(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/admin/stats/`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) throw new Error("Failed to fetch statistics");
      return await response.json();
    } catch (error) {
      console.error("fetchStats error:", error);
      return null;
    }
  }
};
