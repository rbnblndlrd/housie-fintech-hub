
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Add cream color definition
        cream: {
          DEFAULT: "#f9f7e8", // Warm cream color matching the design
          50: "#fefcf7",
          100: "#fdf9f0",
          200: "#faf5e7",
          300: "#f6f0db",
          400: "#f1e8ca",
          500: "#f9f7e8", // Default cream
          600: "#e8d5a6",
          700: "#d4b574",
          800: "#b8954a",
          900: "#997a3d",
        },
        // Add Winchester green color definition
        winchester: {
          DEFAULT: "#0F4C3A", // Deep forest green
          50: "#f0f9f6",
          100: "#dcf2e8",
          200: "#bce5d4",
          300: "#8dd0b8",
          400: "#5bb396",
          500: "#389577",
          600: "#2a7862",
          700: "#236150",
          800: "#1f4f42",
          900: "#0F4C3A", // Default Winchester green
          950: "#0a2d23",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      // Mobile-first responsive breakpoints
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  // Safelist for dynamic overlay positioning classes
  safelist: [
    // Static positioning classes used in overlay system
    'top-20',
    'top-5',
    'bottom-4',
    'bottom-5',
    'left-4',
    'left-5',
    'right-4',
    'right-5',
    'left-1/2',
    'transform',
    '-translate-x-1/2',
    // Mobile responsive classes
    'md:top-20',
    'md:top-5',
    'md:bottom-5',
    'md:left-5',
    'md:right-5',
    'md:bottom-5',
    // Z-index classes
    'z-30',
    'z-40',
    'z-50',
    // Mobile-specific classes
    'min-h-[44px]',
    'min-w-[44px]',
    'w-full',
    'max-w-sm',
    // Cream color variations for safelist
    'bg-cream',
    'bg-cream/95',
    'bg-cream/90',
    'bg-cream/80',
    'text-cream',
    'border-cream',
    // Winchester green color variations for safelist
    'bg-winchester',
    'bg-winchester/95',
    'bg-winchester/90',
    'bg-winchester/80',
    'text-winchester',
    'border-winchester',
  ],
} satisfies Config;
