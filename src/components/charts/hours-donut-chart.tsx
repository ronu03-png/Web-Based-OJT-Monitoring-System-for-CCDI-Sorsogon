"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export function HoursDonutChart({
  completed,
  remaining,
}: {
  completed: number;
  remaining: number;
}) {
  const total = completed + remaining;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const data = [
    { name: "Completed", value: completed },
    { name: "Remaining", value: remaining > 0 ? remaining : 0.0001 },
  ];

  return (
    <div className="relative mx-auto h-56 w-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="72%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            <Cell fill="var(--color-chart-1)" />
            <Cell fill="var(--color-muted)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold text-foreground">{percentage}%</span>
        <span className="text-xs text-muted-foreground">Hours completed</span>
      </div>
    </div>
  );
}
