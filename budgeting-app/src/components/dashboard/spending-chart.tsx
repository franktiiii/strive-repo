"use client";

import { monthlySpending } from "@/lib/demo-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export function SpendingChart() {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Spending vs Budget</h3>
          <p className="text-sm text-muted-foreground">Last 6 months</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00D632]" />
            <span className="text-muted-foreground">Under budget</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF4757]" />
            <span className="text-muted-foreground">Over budget</span>
          </div>
        </div>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlySpending} barCategoryGap="20%">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8B8BA3", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8B8BA3", fontSize: 12 }}
              tickFormatter={(val) => `$${val / 1000}k`}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.02)" }}
              contentStyle={{
                backgroundColor: "#1A1A2E",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#F8F8F2",
                fontSize: "13px",
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`$${Number(value).toLocaleString()}`, ""]}
            />
            <Bar dataKey="spent" radius={[8, 8, 0, 0]} maxBarSize={40}>
              {monthlySpending.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.spent > entry.budget ? "#FF4757" : "#00D632"}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
