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

const CHART_GREEN = "#22C55E";
const CHART_GREEN_DIM = "#27272A";
const GRID_COLOR = "rgba(255,255,255,0.06)";

const tooltipStyle = {
  background: "#1a1a1a",
  border: "1px solid rgba(34, 197, 94, 0.35)",
  borderRadius: "10px",
  color: "#fafafa",
  boxShadow: "0 0 16px rgba(34, 197, 94, 0.15)",
};

interface AnalyticsChartsProps {
  data: AnalyticsData;
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  return (
    <div className="mt-8 space-y-2">
      {/* Line chart — full width */}
      <div className="dash-grid-gap">
        <div className="!p-5 lg:col-span-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
            Señales por día
          </h3>
          <p className="mt-0.5 text-sm font-bold text-foreground">Últimos 30 días</p>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.signalsByDay}>
                <defs>
                  <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_GREEN} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={CHART_GREEN} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#71717A", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: GRID_COLOR }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#71717A", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: GRID_COLOR }}
                />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#A1A1AA" }} />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Señales"
                  stroke={CHART_GREEN}
                  strokeWidth={2}
                  dot={{ fill: CHART_GREEN, r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: CHART_GREEN, stroke: "#0d0d0d", strokeWidth: 2 }}
                  fill="url(#lineFill)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bento 2x2 */}
      <div className="dash-grid-gap grid lg:grid-cols-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
            Distribución de scores
          </h3>
          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.scoreDistribution}>
                <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="range"
                  tick={{ fill: "#71717A", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: GRID_COLOR }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#71717A", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: GRID_COLOR }}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar
                  dataKey="count"
                  name="Señales"
                  fill={CHART_GREEN}
                  radius={[6, 6, 0, 0]}
                  activeBar={{ fill: "#4ADE80" }}
                  background={{ fill: CHART_GREEN_DIM, radius: 6 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
            Top keywords
          </h3>
          {data.topKeywords.length === 0 ? (
            <p className="mt-6 text-sm text-foreground-muted">Sin datos todavía.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {data.topKeywords.map((kw, i) => (
                <li
                  key={kw.term}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground-muted">#{i + 1}</span>
                    <span className="dash-neon-tag">{kw.term}</span>
                  </span>
                  <span className="text-sm font-black text-primary">{kw.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {data.conversions && (
        <div className="dash-grid-gap grid sm:grid-cols-3">
          <div className="text-center">
            <p className="text-2xl font-black text-foreground">{data.conversions.clicks}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-foreground-muted">Clicks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-primary">{data.conversions.signups}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-foreground-muted">Signups</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-foreground">{data.conversions.paid}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-foreground-muted">Pagos</p>
          </div>
        </div>
      )}
    </div>
  );
}
