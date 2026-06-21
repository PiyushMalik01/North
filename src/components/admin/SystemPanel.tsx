'use client';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  ToggleLeft,
  Database,
  ServerCog,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Wrench,
} from 'lucide-react';
import { usePlatformStore } from '@/store/platformStore';

const ZONE_FLAGS: { key: string; label: string; description: string }[] = [
  { key: 'trace', label: 'Trace', description: 'Skill-tree explorer and progress visualiser.' },
  { key: 'prove', label: 'Prove', description: 'Assessment engine — quizzes, challenges, rubrics.' },
  { key: 'spark', label: 'Spark', description: 'Daily micro-learning prompts and flash cards.' },
  { key: 'drift', label: 'Drift', description: 'Ambient discovery feed for new skills and topics.' },
  { key: 'huddle', label: 'Huddle', description: 'Peer study rooms and collaborative sessions.' },
  { key: 'flare', label: 'Flare', description: 'Leaderboards, streaks, and achievement badges.' },
  { key: 'perch', label: 'Perch', description: 'Recruiter-facing profile and resume export.' },
  { key: 'field', label: 'Field', description: 'Real-world project marketplace and internships.' },
  { key: 'chart', label: 'Chart', description: 'Analytics dashboard for instructors and admins.' },
];

interface HealthRow {
  icon: React.ReactNode;
  label: string;
  status: string;
  badge: React.ReactNode;
  subtext: string;
}

function HealthCard({ icon, label, status, badge, subtext }: HealthRow) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            {icon}
            <CardTitle className="text-sm font-medium">{label}</CardTitle>
          </div>
          {badge}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-lg font-semibold">{status}</p>
        <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>
      </CardContent>
    </Card>
  );
}

export default function SystemPanel() {
  const flags = usePlatformStore((s) => s.flags);
  const setFlag = usePlatformStore((s) => s.setFlag);
  const resetFlags = usePlatformStore((s) => s.resetFlags);

  function handleMaintenanceToggle(checked: boolean) {
    setFlag('maintenance', checked);
    toast(checked ? 'Maintenance mode ON' : 'Maintenance mode off');
  }

  function handleZoneToggle(key: string, checked: boolean) {
    setFlag(key, checked);
    const zone = ZONE_FLAGS.find((z) => z.key === key);
    toast(checked ? `${zone?.label ?? key} enabled` : `${zone?.label ?? key} disabled`);
  }

  function handleResetFlags() {
    resetFlags();
    toast('Flags reset to defaults');
  }

  return (
    <div className="space-y-8">
      <AdminHeader
        title="System"
        description="Feature flags and platform health."
      />

      {/* ── HEALTH ───────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Health
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <HealthCard
            icon={<Database className="h-4 w-4" />}
            label="Database"
            status="Offline"
            badge={<Badge variant="destructive">Offline</Badge>}
            subtext="Supabase project unreachable (ENOTFOUND). Huddle & auth fall back to the demo user."
          />
          <HealthCard
            icon={<ServerCog className="h-4 w-4" />}
            label="Web app"
            status="Healthy"
            badge={<Badge className="bg-emerald-600 text-white hover:bg-emerald-700">Healthy</Badge>}
            subtext="All routes responding normally."
          />
          <HealthCard
            icon={<ToggleLeft className="h-4 w-4" />}
            label="AI (nor)"
            status="Degraded"
            badge={<Badge variant="outline">Degraded</Badge>}
            subtext="Depends on DB credential store — reduced functionality while DB is offline."
          />
          <HealthCard
            icon={<Wrench className="h-4 w-4" />}
            label="Build"
            status="Next.js 16 · React 19"
            badge={<Badge variant="outline">development</Badge>}
            subtext="Running in development mode. Production build not verified."
          />
        </div>
      </section>

      {/* ── MAINTENANCE ──────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Maintenance
        </h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Maintenance mode
            </CardTitle>
            <CardDescription>
              When enabled, a banner is shown to all users and non-admin access is restricted.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch
                id="maintenance-switch"
                checked={!!flags.maintenance}
                onCheckedChange={handleMaintenanceToggle}
              />
              <Label htmlFor="maintenance-switch" className="cursor-pointer">
                {flags.maintenance ? 'ON — platform is in maintenance mode' : 'OFF'}
              </Label>
            </div>
            {flags.maintenance && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  The platform is currently in maintenance mode. Students and teachers cannot access
                  their dashboards until this is turned off.
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* ── FEATURE FLAGS ────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Feature flags — zones
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>Zone visibility</CardTitle>
            <CardDescription>
              Turning a zone off removes it from the platform&apos;s top navigation for all users.
              No data is deleted.
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {ZONE_FLAGS.map(({ key, label, description }, i) => (
              <div key={key} className={`flex items-center justify-between gap-4 py-3 ${i === 0 ? 'pt-0' : ''}`}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {flags[key] ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <p className="mt-0.5 pl-5 text-xs text-muted-foreground">{description}</p>
                </div>
                <Switch
                  id={`flag-${key}`}
                  checked={!!flags[key]}
                  onCheckedChange={(checked) => handleZoneToggle(key, checked)}
                />
              </div>
            ))}
          </CardContent>
          <Separator />
          <CardFooter className="pt-4">
            <Button variant="ghost" size="sm" onClick={handleResetFlags} className="gap-2">
              <RotateCcw className="h-3.5 w-3.5" />
              Reset all flags
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
