'use client';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { kpis, activityTrend, zoneUsage, activityLog } from '@/data/platform/admin';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileCheck2,
  MessageSquare,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const kpiIcons: Record<string, React.ReactNode> = {
  users: <Users className="size-4" />,
  active: <Activity className="size-4" />,
  assessments: <FileCheck2 className="size-4" />,
  posts: <MessageSquare className="size-4" />,
};

interface KpiCardProps {
  id: string;
  label: string;
  value: string;
  delta: number;
}

function KpiCard({ id, label, value, delta }: KpiCardProps) {
  const positive = delta >= 0;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            {label}
          </span>
          <span className="text-muted-foreground">{kpiIcons[id]}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-foreground">{value}</p>
        <div
          className={`mt-1 flex items-center gap-1 text-xs font-medium ${positive ? 'text-emerald-500' : 'text-red-500'}`}
        >
          {positive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
          <span>
            {delta > 0 ? '+' : ''}
            {delta}%
          </span>
          <span className="ml-1 font-normal text-muted-foreground">vs last period</span>
        </div>
      </CardContent>
    </Card>
  );
}

const tooltipStyle: React.CSSProperties = {
  background: 'var(--popover)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--popover-foreground)',
  fontSize: 12,
};

export default function Overview() {
  return (
    <div className="space-y-6">
      <AdminHeader title="Overview" description="Platform health at a glance." />

      {/* System-status banner */}
      <Card>
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center gap-3">
            <AlertTriangle className="size-4 shrink-0 text-amber-500" />
            <span className="text-sm text-foreground font-medium">System status:</span>
            <Badge variant="destructive">Database: degraded</Badge>
            <span className="text-sm text-muted-foreground">
              Supabase project unreachable. Huddle &amp; auth run on the demo fallback.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} id={kpi.id} label={kpi.label} value={kpi.value} delta={kpi.delta} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Activity area chart — spans 2 cols */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activity (14 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-foreground">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={activityTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="currentColor" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke="currentColor"
                    strokeOpacity={0.12}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: 'currentColor', fontSize: 11, opacity: 0.6 }}
                    axisLine={{ stroke: 'currentColor', opacity: 0.15 }}
                    tickLine={{ stroke: 'currentColor', opacity: 0.15 }}
                    interval={2}
                  />
                  <YAxis
                    tick={{ fill: 'currentColor', fontSize: 11, opacity: 0.6 }}
                    axisLine={{ stroke: 'currentColor', opacity: 0.15 }}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  {/* hero area: active users */}
                  <Area
                    type="monotone"
                    dataKey="active"
                    stroke="currentColor"
                    strokeOpacity={1}
                    strokeWidth={2}
                    fill="url(#activeGrad)"
                    name="Active users"
                  />
                  {/* thin line: signups */}
                  <Area
                    type="monotone"
                    dataKey="signups"
                    stroke="currentColor"
                    strokeOpacity={0.4}
                    strokeWidth={1.5}
                    fill="none"
                    name="Signups"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Zone engagement bar chart */}
        <Card>
          <CardHeader>
            <CardTitle>Zone engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-foreground">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={zoneUsage}
                  layout="vertical"
                  margin={{ top: 4, right: 8, left: 8, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke="currentColor"
                    strokeOpacity={0.12}
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: 'currentColor', fontSize: 11, opacity: 0.6 }}
                    axisLine={{ stroke: 'currentColor', opacity: 0.15 }}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="zone"
                    tick={{ fill: 'currentColor', fontSize: 11, opacity: 0.6 }}
                    axisLine={false}
                    tickLine={false}
                    width={46}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar
                    dataKey="sessions"
                    fill="currentColor"
                    fillOpacity={0.65}
                    radius={[0, 3, 3, 0]}
                    name="Sessions"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {activityLog.map((event) => (
              <li key={event.id} className="flex items-center justify-between gap-4 py-2.5">
                <div className="min-w-0">
                  <span className="font-medium text-foreground">{event.user}</span>{' '}
                  <span className="text-muted-foreground">{event.action}</span>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{event.ago}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
