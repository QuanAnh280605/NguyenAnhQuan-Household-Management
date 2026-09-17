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
  title: "Hệ thống Quản lý Vận hành Chung cư Parkview | BQL Tòa Nhà",
  description: "Cổng thông tin quản lý căn hộ, cư dân, dịch vụ và thu phí vận hành chung cư chuyên nghiệp",
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
      <body className="min-h-full flex flex-col bg-surface text-on-surface selection:bg-blue-100 selection:text-blue-900">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
