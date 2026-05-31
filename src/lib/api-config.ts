/**
 * Centralized API Configuration
 * 
 * NEXT_PUBLIC_API_URL should be set in the deployment dashboard (Netlify/Vercel).
 * In production, fall back to the deployed Render API so the browser never calls localhost.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://cleanride-b.onrender.com/api"
    : "http://localhost:8000/api");

// Ensure there is no trailing slash in the base URL except for what we add in services
export const BASE_URL = API_BASE_URL.endsWith('/') 
    ? API_BASE_URL.slice(0, -1) 
    : API_BASE_URL;

console.log("Initializing API with Base URL:", BASE_URL);
