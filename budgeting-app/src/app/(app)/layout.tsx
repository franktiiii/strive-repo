"use client";

import { Sidebar } from "@/components/sidebar";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Sidebar />
      <main className="lg:ml-[260px] pt-20 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {children}
        </div>
      </main>
    </AuthGuard>
  );
}
