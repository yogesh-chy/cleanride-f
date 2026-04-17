import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const getAuthHeader = (): Record<string, string> => {
  const token = Cookies.get("access_token");
  return token ? { "Authorization": `Bearer ${token}` } : {};
};

export const paymentService = {
  /**
   * Initiates payment with Khalti
   */
  async initiatePayment(bookingId: string | number, returnUrl: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/initiate/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          booking_id: bookingId,
          return_url: returnUrl,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate payment");
      }
      return { success: true, data };
    } catch (error: any) {
      console.error("initiatePayment error:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Verifies payment status with Khalti pidx
   */
  async verifyPayment(pidx: string) {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      const authHeader = getAuthHeader();
      if (authHeader.Authorization) {
        headers.Authorization = authHeader.Authorization;
      }

      const response = await fetch(`${API_BASE_URL}/payments/verify/`, {
        method: "POST",
        headers,
        body: JSON.stringify({ pidx }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to verify payment");
      }
      return { success: true, data };
    } catch (error: any) {
      console.error("verifyPayment error:", error);
      return { success: false, error: error.message };
    }
  },
};
