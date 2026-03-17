"use client";

import { achievements } from "@/lib/demo-data";
import {
  Footprints,
  Coins,
  Flame,
  Layers,
  Crown,
  Zap,
  Target,
  Brain,
  Medal,
  Trophy,
  Ban,
  Lock,
  Vault,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string; color?: string }>> = {
  Footprints,
  Coins,
  Flame,
  Layers,
  Crown,
  Zap,
  Target,
  Brain,
  Medal,
  Trophy,
  Ban,
  Vault,
};

const categoryLabels: Record<string, string> = {
  savings: "Savings",
  spending: "Spending",
  streak: "Streaks",
  milestone: "Milestones",
};

export default function AchievementsPage() {
  const earned = achievements.filter((a) => a.earned);
  const locked = achievements.filter((a) => !a.earned);

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
        <p className="text-muted-foreground mt-1">
          Your financial badges of honor
        </p>
      </div>

      {/* Progress summary */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Progress</p>
            <p className="text-2xl font-bold">
              {earned.length}
              <span className="text-muted-foreground text-lg font-normal">
                {" "}/ {achievements.length} earned
              </span>
            </p>
          </div>
          <div className="flex gap-3">
            {Object.entries(categoryLabels).map(([key, label]) => {
              const count = achievements.filter(
                (a) => a.category === key && a.earned
              ).length;
              const total = achievements.filter(
                (a) => a.category === key
              ).length;
              return (
                <div key={key} className="text-center">
                  <p className="text-lg font-bold">
                    {count}/{total}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="h-3 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#00D632] to-[#A8FF00] transition-all duration-700"
            style={{
              width: `${Math.round((earned.length / achievements.length) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Earned achievements */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Earned
          <span className="ml-2 text-sm text-muted-foreground font-normal">
            ({earned.length})
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {earned.map((ach) => {
            const Icon = iconMap[ach.icon] || Trophy;
            return (
              <div
                key={ach.id}
                className="glass-card rounded-2xl p-5 hover:border-white/[0.12] transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${ach.color}20` }}
                  >
                    <Icon className="w-6 h-6" color={ach.color} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold">{ach.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {ach.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-2 uppercase tracking-wider">
                      Earned{" "}
                      {new Date(ach.earnedDate!).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Locked achievements */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Locked
          <span className="ml-2 text-sm text-muted-foreground font-normal">
            ({locked.length})
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {locked.map((ach) => {
            const Icon = iconMap[ach.icon] || Trophy;
            return (
              <div
                key={ach.id}
                className="glass-card rounded-2xl p-5 opacity-50"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white/[0.04]">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold">{ach.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {ach.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-2 uppercase tracking-wider">
                      {categoryLabels[ach.category]}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
