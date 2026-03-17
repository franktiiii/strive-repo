"use client";

import { QuoteBanner } from "@/components/dashboard/quote-banner";
import { StatCards } from "@/components/dashboard/stat-cards";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";

export default function Dashboard() {
  return (
    <>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Good evening <span className="gradient-text">✦</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s your financial snapshot for March 2026
        </p>
      </div>

      {/* Daily quote */}
      <QuoteBanner />

      {/* Stats */}
      <StatCards />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <SpendingChart />
        </div>
        <div className="lg:col-span-2">
          <CategoryBreakdown />
        </div>
      </div>

      {/* Recent transactions */}
      <RecentTransactions />
    </>
  );
}
