"use client";

import { Bar, BarChart, Cell, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface StatusBarDatum {
  label: string;
  value: number;
  color: string;
}

export function StatusBarChart({ data, height = 224 }: { data: StatusBarDatum[]; height?: number }) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -24, right: 8, top: 8 }}>
          <CartesianGrid vertical={false} stroke="var(--color-border)" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            stroke="var(--color-muted-foreground)"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            fontSize={12}
            allowDecimals={false}
            stroke="var(--color-muted-foreground)"
          />
          <Tooltip
            cursor={{ fill: "var(--color-muted)" }}
            contentStyle={{
              borderRadius: 8,
              borderColor: "var(--color-border)",
              fontSize: 12,
              background: "var(--color-card)",
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {data.map((entry) => (
              <Cell key={entry.label} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
