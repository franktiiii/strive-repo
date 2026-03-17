"use client";

import { categories, stats } from "@/lib/demo-data";
import {
  Home,
  UtensilsCrossed,
  Car,
  Gamepad2,
  ShoppingBag,
  Repeat,
  Heart,
  PiggyBank,
  Plus,
  Pencil,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string; color?: string }>> = {
  Home,
  UtensilsCrossed,
  Car,
  Gamepad2,
  ShoppingBag,
  Repeat,
  Heart,
  PiggyBank,
};

export default function BudgetsPage() {
  const totalBudgeted = categories.reduce((s, c) => s + c.budgeted, 0);
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0);
  const remaining = totalBudgeted - totalSpent;
  const overallPct = Math.round((totalSpent / totalBudgeted) * 100);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground mt-1">
            Manage your monthly spending limits
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00D632] text-black font-semibold text-sm hover:bg-[#00D632]/90 transition-colors">
          <Plus className="w-4 h-4" />
          New Budget
        </button>
      </div>

      {/* Overview card */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold">March 2026 Overview</h3>
            <p className="text-sm text-muted-foreground">
              ${totalSpent.toLocaleString()} of ${totalBudgeted.toLocaleString()} spent
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div>
              <p className="text-muted-foreground">Remaining</p>
              <p className="text-lg font-bold text-[#00D632]">${remaining.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Used</p>
              <p className="text-lg font-bold">{overallPct}%</p>
            </div>
          </div>
        </div>
        <div className="h-3 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#00D632] to-[#A8FF00] transition-all duration-700"
            style={{ width: `${Math.min(overallPct, 100)}%` }}
          />
        </div>
      </div>

      {/* Category budget cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || PiggyBank;
          const pct = Math.round((cat.spent / cat.budgeted) * 100);
          const remaining = cat.budgeted - cat.spent;
          const isOver = cat.spent > cat.budgeted;
          const isClose = pct >= 90 && !isOver;

          return (
            <div
              key={cat.name}
              className="glass-card rounded-2xl p-5 hover:border-white/[0.12] transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${cat.color}15` }}
                  >
                    <Icon className="w-5 h-5" color={cat.color} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      ${cat.spent.toLocaleString()} of ${cat.budgeted.toLocaleString()}
                    </p>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-white/[0.06]">
                  <Pencil className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(pct, 100)}%`,
                    backgroundColor: isOver ? "#FF4757" : isClose ? "#FF9F43" : cat.color,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span
                  className={`font-medium ${
                    isOver ? "text-[#FF4757]" : "text-muted-foreground"
                  }`}
                >
                  {isOver
                    ? `$${Math.abs(remaining).toLocaleString()} over`
                    : `$${remaining.toLocaleString()} left`}
                </span>
                <span
                  className={`font-semibold ${
                    isOver ? "text-[#FF4757]" : isClose ? "text-[#FF9F43]" : ""
                  }`}
                >
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
