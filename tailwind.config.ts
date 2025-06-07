import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: '#e6f3ff',
          100: '#b3d9ff',
          500: '#0079bf',
          600: '#026aa7',
          700: '#01548a',
        },
        secondary: {
          50: '#f8f9fa',
          100: '#f4f5f7',
          200: '#dfe1e6',
          500: '#5e6c84',
          600: '#42526e',
        },
        success: {
          500: '#61bd4f',
          600: '#4a9e3d',
        },
        warning: {
          500: '#f2d600',
        },
        error: {
          500: '#eb5a46',
        },
        accent: {
          500: '#ff9f1c',
        }
      },      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 4px rgba(9, 30, 66, 0.08), 0 0 1px rgba(9, 30, 66, 0.31)',
        'medium': '0 8px 16px rgba(9, 30, 66, 0.15), 0 0 1px rgba(9, 30, 66, 0.31)',
        'strong': '0 12px 24px rgba(9, 30, 66, 0.15), 0 0 1px rgba(9, 30, 66, 0.31)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
} satisfies Config;
