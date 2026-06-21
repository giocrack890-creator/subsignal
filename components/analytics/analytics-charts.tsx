"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AnalyticsData } from "@/lib/analytics/queries";

const CHART_GREEN = "#34D399";
const GRID_COLOR = "#232323";

interface AnalyticsChartsProps {
  data: AnalyticsData;
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  return (
    <div className="mt-8 space-y-8">
      <div className="landing-card rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground">
          Señales por día (últimos 30 días)
        </h3>
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.signalsByDay}>
              <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: "#6B6B6B", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: GRID_COLOR }}
                interval="preserveStartEnd"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#6B6B6B", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: GRID_COLOR }}
              />
              <Tooltip
                contentStyle={{
                  background: "#111714",
                  border: "1px solid #232323",
                  borderRadius: "12px",
                  color: "#fff",
                }}
                labelStyle={{ color: "#B4B4B4" }}
              />
              <Line
                type="monotone"
                dataKey="count"
                name="Señales"
                stroke={CHART_GREEN}
                strokeWidth={2}
                dot={{ fill: CHART_GREEN, r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="landing-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground">
            Distribución de scores
          </h3>
          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.scoreDistribution}>
                <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="range"
                  tick={{ fill: "#6B6B6B", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: GRID_COLOR }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#6B6B6B", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: GRID_COLOR }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#111714",
                    border: "1px solid #232323",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" name="Señales" fill={CHART_GREEN} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="landing-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground">
            Top keywords por señales
          </h3>
          {data.topKeywords.length === 0 ? (
            <p className="mt-6 text-sm text-foreground-muted">
              Sin datos de keywords todavía.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {data.topKeywords.map((kw) => (
                <li
                  key={kw.term}
                  className="flex items-center justify-between rounded-xl border border-border bg-background-card-hover px-4 py-3"
                >
                  <span className="font-medium text-foreground">{kw.term}</span>
                  <span className="text-sm font-semibold text-primary">{kw.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {data.conversions && (
        <div className="landing-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground">Conversiones</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-background-card-hover px-4 py-3 text-center">
              <p className="text-2xl font-bold text-foreground">
                {data.conversions.clicks}
              </p>
              <p className="text-xs text-foreground-muted">Clicks</p>
            </div>
            <div className="rounded-xl border border-border bg-background-card-hover px-4 py-3 text-center">
              <p className="text-2xl font-bold text-primary">
                {data.conversions.signups}
              </p>
              <p className="text-xs text-foreground-muted">Signups</p>
            </div>
            <div className="rounded-xl border border-border bg-background-card-hover px-4 py-3 text-center">
              <p className="text-2xl font-bold text-foreground">
                {data.conversions.paid}
              </p>
              <p className="text-xs text-foreground-muted">Pagos</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
