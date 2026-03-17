"use client";

import { stats } from "@/lib/demo-data";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Flame,
  DollarSign,
} from "lucide-react";

const statCards = [
  {
    label: "Total Budget",
    value: `$${stats.totalBudget.toLocaleString()}`,
    sub: `$${(stats.totalBudget - stats.totalSpent).toLocaleString()} left`,
    icon: Wallet,
    color: "#7B61FF",
    trend: null,
  },
  {
    label: "Total Spent",
    value: `$${stats.totalSpent.toLocaleString()}`,
    sub: `${Math.round((stats.totalSpent / stats.totalBudget) * 100)}% of budget`,
    icon: DollarSign,
    color: "#FF6B9D",
    trend: "down" as const,
  },
  {
    label: "Net Worth",
    value: `$${stats.netWorth.toLocaleString()}`,
    sub: `+${stats.netWorthChange}% this month`,
    icon: TrendingUp,
    color: "#00D632",
    trend: "up" as const,
  },
  {
    label: "Savings Rate",
    value: `${stats.savingsRate}%`,
    sub: `$${(stats.totalIncome * stats.savingsRate / 100).toLocaleString()} saved`,
    icon: PiggyBank,
    color: "#00B4D8",
    trend: "up" as const,
  },
];

export function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="glass-card rounded-2xl p-5 hover:border-white/[0.12] transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${stat.color}15` }}
            >
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            {stat.trend && (
              <div
                className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                  stat.trend === "up"
                    ? "bg-[#00D632]/10 text-[#00D632]"
                    : "bg-[#FF4757]/10 text-[#FF4757]"
                }`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
              </div>
            )}
          </div>
          <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
          <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          <p className="text-xs text-muted-foreground/70 mt-0.5">{stat.sub}</p>
        </div>
      ))}
    </div>
  );
}
