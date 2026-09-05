"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface TrendDatum {
  label: string;
  value: number;
}

export function TrendLineChart({ data, height = 260 }: { data: TrendDatum[]; height?: number }) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: -24, right: 8, top: 8 }}>
          <CartesianGrid vertical={false} stroke="var(--color-border)" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            stroke="var(--color-muted-foreground)"
          />
          <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-muted-foreground)" />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              borderColor: "var(--color-border)",
              fontSize: 12,
              background: "var(--color-card)",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-chart-1)"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "var(--color-chart-1)" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
