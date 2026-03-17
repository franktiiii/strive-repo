import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Strive — Always Strive & Prosper",
  description: "Budgeting for the culture. Bold, visual, motivational.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <div className="min-h-screen bg-[#0A0A0F]">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
