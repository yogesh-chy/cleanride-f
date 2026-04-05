import { WashPackage } from "./wash-data";
import { Droplets, Sparkles, ShieldCheck, Car as CarIcon, Wind, Zap } from "lucide-react";

export interface ServiceCategory {
  title: string;
  icon: any;
  items: string[];
}

export const packageDetailedInfo: Record<WashPackage, { 
  tagline: string; 
  categories: ServiceCategory[] 
}> = {
  basic: {
    tagline: "The essential exterior refresh for daily drivers.",
    categories: [
      {
        title: "Exterior Care",
        icon: Droplets,
        items: [
          "High-Pressure Pre-Rinse",
          "Snow Foam Application",
          "2-Bucket Scratch-Free Hand Wash",
          "Microfiber Hand Dry",
          "Exterior Glass Cleaning"
        ]
      },
      {
        title: "Wheels & Tires",
        icon: CarIcon,
        items: [
          "Wheel Surface Cleaning",
          "Tire Degreasing",
          "Standard Tire Dressing"
        ]
      }
    ]
  },
  standard: {
    tagline: "Comprehensive care for both interior and exterior.",
    categories: [
      {
        title: "Exterior Excellence",
        icon: Sparkles,
        items: [
          "All Basic Exterior Services",
          "Hydrophobic Polymer Rinse",
          "Bug & Tar Removal",
          "Fuel Door Cleaning"
        ]
      },
      {
        title: "Interior Refresh",
        icon: Wind,
        items: [
          "Full Interior Vacuum (Carpets & Seats)",
          "Dashboard & Console Dusting",
          "UV Protection Wipe-down",
          "Window Cleaning (Interior & Exterior)",
          "Door Jambs Detailed Cleaning",
          "Signature Scent Spray"
        ]
      }
    ]
  },
  premium: {
    tagline: "The ultimate showroom-quality restoration and protection.",
    categories: [
      {
        title: "Deep Restoration",
        icon: Zap,
        items: [
          "All Standard Exterior Services",
          "Iron & Fallout Decontamination",
          "Clay Bar Surface Smoothing",
          "Engine Bay Detailed Cleaning",
          "Exhaust Tip Polishing"
        ]
      },
      {
        title: "Luxury Interior",
        icon: ShieldCheck,
        items: [
          "Deep Carpet & Mat Shampooing",
          "Steam Cleaning for Sanitization",
          "Leather Cleaning & Conditioning",
          "Headliner Spot Cleaning",
          "Anti-Bacterial Interior Fogging"
        ]
      },
      {
        title: "Advanced Shield",
        icon: ShieldCheck,
        items: [
          "High-Gloss Carnauba Wax",
          "1-Step Machine Polish",
          "Ceramic Sealant (3-Month protection)",
          "Rain-Repellent Windshield Treatment",
          "Premium Wheel Ceramic Spray"
        ]
      }
    ]
  }
};
