import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "material-symbols/outlined.css";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResidentHub - Quản lý Căn hộ & Hộ dân Chung cư",
  description: "Hệ thống quản lý căn hộ, hộ dân, cư dân và vận hành chung cư hiện đại",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-on-surface selection:bg-primary-fixed selection:text-primary">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
