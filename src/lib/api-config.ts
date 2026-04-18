/**
 * Centralized API Configuration
 * 
 * NEXT_PUBLIC_API_URL should be set in the deployment dashboard (Netlify/Vercel).
 * Locally, it falls back to localhost for development.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Ensure there is no trailing slash in the base URL except for what we add in services
export const BASE_URL = API_BASE_URL.endsWith('/') 
    ? API_BASE_URL.slice(0, -1) 
    : API_BASE_URL;

console.log("Initializing API with Base URL:", BASE_URL);
