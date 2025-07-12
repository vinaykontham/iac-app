import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/glassmorphism.css";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Enterprise Infrastructure Provisioning",
  description: "Premium-grade enterprise application for cloud infrastructure provisioning using Terraform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <AuthProvider>
          <div className="gradient-bg cyber-grid min-h-screen">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
