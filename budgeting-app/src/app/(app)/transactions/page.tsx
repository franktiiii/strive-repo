"use client";

import { useState } from "react";
import { allTransactions } from "@/lib/demo-data";
import {
  Home,
  UtensilsCrossed,
  Car,
  Gamepad2,
  ShoppingBag,
  Repeat,
  Heart,
  PiggyBank,
  DollarSign,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
} from "lucide-react";

const categoryIcons: Record<string, React.ComponentType<{ className?: string; color?: string }>> = {
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

type FilterType = "all" | "expense" | "income";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = allTransactions
    .filter((txn) => {
      if (filter !== "all" && txn.type !== filter) return false;
      if (search && !txn.description.toLowerCase().includes(search.toLowerCase()) && !txn.category.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalIncome = allTransactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = allTransactions.filter(t => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground mt-1">
          Track every dollar in and out
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#00D632]/10 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4 text-[#00D632]" />
            </div>
            <span className="text-sm text-muted-foreground">Income</span>
          </div>
          <p className="text-2xl font-bold text-[#00D632]">+${totalIncome.toLocaleString()}</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF4757]/10 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-[#FF4757]" />
            </div>
            <span className="text-sm text-muted-foreground">Expenses</span>
          </div>
          <p className="text-2xl font-bold text-[#FF4757]">-${totalExpenses.toLocaleString()}</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#7B61FF]/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[#7B61FF]" />
            </div>
            <span className="text-sm text-muted-foreground">Net</span>
          </div>
          <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? "text-[#00D632]" : "text-[#FF4757]"}`}>
            {totalIncome - totalExpenses >= 0 ? "+" : ""}${(totalIncome - totalExpenses).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search & filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#00D632]/50 focus:border-[#00D632]/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {(["all", "expense", "income"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-[#00D632]/10 text-[#00D632]"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
              }`}
            >
              {f === "all" ? "All" : f === "expense" ? "Expenses" : "Income"}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions list */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[2fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-white/[0.06] text-xs text-muted-foreground font-medium">
          <span>Description</span>
          <span className="hidden sm:block">Category</span>
          <span>Date</span>
          <span className="text-right">Amount</span>
        </div>

        {filtered.map((txn) => {
          const Icon = categoryIcons[txn.category] || DollarSign;
          const color = categoryColors[txn.category] || "#8B8BA3";
          const isIncome = txn.type === "income";

          return (
            <div
              key={txn.id}
              className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[2fr_1fr_1fr_auto] gap-4 px-5 py-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors items-center"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon className="w-4 h-4" color={color} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{txn.description}</p>
                  <p className="text-xs text-muted-foreground sm:hidden">{txn.category}</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-sm text-muted-foreground">{txn.category}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {new Date(txn.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
              <p className={`text-sm font-semibold text-right ${isIncome ? "text-[#00D632]" : ""}`}>
                {isIncome ? "+" : ""}${Math.abs(txn.amount).toFixed(2)}
              </p>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <p className="text-sm">No transactions found</p>
          </div>
        )}
      </div>
    </>
  );
}
