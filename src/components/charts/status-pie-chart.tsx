"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export interface PieDatum {
  name: string;
  value: number;
  color: string;
}

export function StatusPieChart({ data, height = 260 }: { data: PieDatum[]; height?: number }) {
  const hasData = data.some((d) => d.value > 0);

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={hasData ? data : [{ name: "No data", value: 1, color: "var(--color-muted)" }]}
            dataKey="value"
            nameKey="name"
            innerRadius="55%"
            outerRadius="90%"
            paddingAngle={hasData ? 2 : 0}
            stroke="none"
          >
            {(hasData ? data : [{ name: "No data", value: 1, color: "var(--color-muted)" }]).map(
              (entry) => (
                <Cell key={entry.name} fill={entry.color} />
              )
            )}
          </Pie>
          {hasData && (
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                borderColor: "var(--color-border)",
                fontSize: 12,
                background: "var(--color-card)",
              }}
            />
          )}
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, color: "var(--color-muted-foreground)" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
