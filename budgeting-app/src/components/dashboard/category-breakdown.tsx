"use client";

import { categories } from "@/lib/demo-data";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export function CategoryBreakdown() {
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Category Breakdown</h3>
        <p className="text-sm text-muted-foreground">Where your money goes</p>
      </div>

      {/* Donut chart */}
      <div className="h-[200px] relative mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categories}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              dataKey="spent"
              strokeWidth={2}
              stroke="#0A0A0F"
            >
              {categories.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">total spent</p>
        </div>
      </div>

      {/* Category list */}
      <div className="space-y-3">
        {categories.map((cat) => {
          const pct = Math.round((cat.spent / cat.budgeted) * 100);
          return (
            <div key={cat.name} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate">{cat.name}</span>
                  <span className="text-muted-foreground ml-2">
                    ${cat.spent}
                    <span className="text-muted-foreground/50">
                      /${cat.budgeted}
                    </span>
                  </span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(pct, 100)}%`,
                      backgroundColor: pct > 90 ? "#FF4757" : cat.color,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
