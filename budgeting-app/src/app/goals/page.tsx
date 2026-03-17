"use client";

import { goals } from "@/lib/demo-data";
import {
  Shield,
  Car,
  Plane,
  TrendingUp,
  Laptop,
  Rocket,
  Plus,
  Calendar,
  CheckCircle2,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Car,
  Plane,
  TrendingUp,
  Laptop,
  Rocket,
};

export default function GoalsPage() {
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const completedGoals = goals.filter((g) => g.saved >= g.target);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
          <p className="text-muted-foreground mt-1">
            Track your savings targets
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00D632] text-black font-semibold text-sm hover:bg-[#00D632]/90 transition-colors">
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Saved</p>
          <p className="text-2xl font-bold text-[#00D632]">${totalSaved.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">of ${totalTarget.toLocaleString()} target</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-sm text-muted-foreground mb-1">Active Goals</p>
          <p className="text-2xl font-bold">{goals.length - completedGoals.length}</p>
          <p className="text-xs text-muted-foreground mt-1">{completedGoals.length} completed</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-sm text-muted-foreground mb-1">Overall Progress</p>
          <p className="text-2xl font-bold">{Math.round((totalSaved / totalTarget) * 100)}%</p>
          <div className="mt-2 h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00D632] to-[#A8FF00]"
              style={{ width: `${Math.round((totalSaved / totalTarget) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Goal cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => {
          const Icon = iconMap[goal.icon] || Shield;
          const pct = Math.round((goal.saved / goal.target) * 100);
          const isComplete = goal.saved >= goal.target;
          const remaining = goal.target - goal.saved;
          const deadline = new Date(goal.deadline);
          const monthsLeft = Math.max(
            0,
            (deadline.getFullYear() - 2026) * 12 + deadline.getMonth() - 2
          );

          return (
            <div
              key={goal.id}
              className={`glass-card rounded-2xl p-5 transition-all duration-300 hover:border-white/[0.12] ${
                isComplete ? "border-[#00D632]/20" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${goal.color}15` }}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="w-5 h-5 text-[#00D632]" />
                    ) : (
                      <Icon className="w-5 h-5" style={{ color: goal.color }} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{goal.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {isComplete ? (
                        <span className="text-[#00D632]">Completed!</span>
                      ) : (
                        <span>{monthsLeft} months left</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-xl font-bold">${goal.saved.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">
                    ${goal.target.toLocaleString()}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(pct, 100)}%`,
                      backgroundColor: isComplete ? "#00D632" : goal.color,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {isComplete ? "Goal reached" : `$${remaining.toLocaleString()} to go`}
                </span>
                <span
                  className="font-semibold"
                  style={{ color: isComplete ? "#00D632" : goal.color }}
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
