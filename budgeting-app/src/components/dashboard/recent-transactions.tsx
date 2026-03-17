"use client";

import { recentTransactions } from "@/lib/demo-data";
import {
  Home,
  UtensilsCrossed,
  Car,
  Gamepad2,
  ShoppingBag,
  Repeat,
  Heart,
  PiggyBank,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
} from "lucide-react";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Housing: Home,
  "Food & Dining": UtensilsCrossed,
  Transportation: Car,
  Entertainment: Gamepad2,
  Shopping: ShoppingBag,
  Subscriptions: Repeat,
  Health: Heart,
  Savings: PiggyBank,
  Income: DollarSign,
};

const categoryColors: Record<string, string> = {
  Housing: "#7B61FF",
  "Food & Dining": "#FF6B9D",
  Transportation: "#00B4D8",
  Entertainment: "#FF9F43",
  Shopping: "#A8FF00",
  Subscriptions: "#00D632",
  Health: "#FF4757",
  Savings: "#00D632",
  Income: "#00D632",
};

export function RecentTransactions() {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <p className="text-sm text-muted-foreground">Your latest activity</p>
        </div>
        <button className="text-sm text-[#00D632] hover:text-[#00D632]/80 font-medium transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-1">
        {recentTransactions.map((txn) => {
          const Icon = categoryIcons[txn.category] || DollarSign;
          const color = categoryColors[txn.category] || "#8B8BA3";
          const isIncome = txn.type === "income";

          return (
            <div
              key={txn.id}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors cursor-pointer"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{txn.description}</p>
                <p className="text-xs text-muted-foreground">{txn.category}</p>
              </div>
              <div className="text-right shrink-0">
                <p
                  className={`text-sm font-semibold ${
                    isIncome ? "text-[#00D632]" : "text-foreground"
                  }`}
                >
                  {isIncome ? "+" : ""}${Math.abs(txn.amount).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(txn.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
