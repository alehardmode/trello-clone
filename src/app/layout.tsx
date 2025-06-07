import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "TaskFlow - Visual Project Management",
  description: "Transform your workflow with beautiful boards, intuitive lists, and powerful collaboration tools. Built with Next.js and Supabase.",
  keywords: ["project management", "kanban", "boards", "collaboration", "productivity"],
  authors: [{ name: "TaskFlow Team" }],
  creator: "TaskFlow",
  publisher: "TaskFlow",
  robots: "index, follow",
  openGraph: {
    title: "TaskFlow - Visual Project Management",
    description: "Transform your workflow with beautiful boards and powerful collaboration tools",
    type: "website",
    siteName: "TaskFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskFlow - Visual Project Management",
    description: "Transform your workflow with beautiful boards and powerful collaboration tools",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0079bf",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
