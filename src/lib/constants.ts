export const APP_CONFIG = {
  name: "Trello Clone",
  description: "A modern Trello clone built with Next.js and Supabase",
  version: "0.1.0",
} as const;

export const ROUTES = {
  HOME: "/",
  BOARD: "/board",
  LOGIN: "/login",
  SIGNUP: "/signup",
  PROFILE: "/profile",
} as const;

export const COLORS = {
  primary: "#0066cc",
  secondary: "#f1f2f4",
  success: "#61bd4f",
  warning: "#f2d600",
  error: "#eb5a46",
  info: "#026aa7",
} as const;
