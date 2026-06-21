'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Building2, TrendingUp, TrendingDown, Minus, MapPin } from 'lucide-react';

import { Card, CardLabel } from '@/components/nest/cards/Card';
import { Bar } from '@/components/nest/cards/Bar';
import { container, item } from '@/components/nest/cards/motion';
import { cn } from '@/lib/utils';
import { jobs, companies, skillDemand } from '@/data/platform/field';
import { useProgressStore } from '@/store/progressStore';
import { useContentStore } from '@/store/contentStore';

type Tab = 'jobs' | 'companies' | 'skills';

const TYPE_LABEL: Record<string, string> = {
  internship: 'internship',
  'full-time': 'full-time',
  contract: 'contract',
};

function useSkillMatch(jobSkills: string[]): number {
  const completedCourseIds = useProgressStore((s) => s.completedCourseIds);
  const courses = useContentStore((s) => s.courses);

  const userTags = new Set(
    courses
      .filter((c) => completedCourseIds.includes(c.id))
      .flatMap((c) => c.tags ?? [])
      .map((t) => t.toLowerCase()),
  );

  if (userTags.size === 0 || jobSkills.length === 0) return 0;

  const matched = jobSkills.filter((s) => userTags.has(s.toLowerCase())).length;
  return Math.round((matched / jobSkills.length) * 100);
}

function JobCard({ job }: { job: (typeof jobs)[number] }) {
  const match = useSkillMatch(job.skills);

  return (
    <motion.div variants={item}>
      <Card hover>
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <p
                className="font-[family-name:var(--font-oswald)] text-lg font-semibold leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                {job.title}
              </p>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <Building2 size={11} />
                <span>{job.company}</span>
                <span style={{ color: 'var(--text-muted)' }}>·</span>
                <MapPin size={11} />
                <span>{job.location}</span>
              </div>
            </div>

            <span
              className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
              style={{
                background: 'color-mix(in srgb, var(--text-primary) 8%, transparent)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--scene-card-border)',
              }}
            >
              {TYPE_LABEL[job.type]}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="rounded px-2 py-0.5 text-[10px] font-medium"
                style={{
                  background: 'color-mix(in srgb, var(--text-primary) 6%, transparent)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--scene-card-border)',
                }}
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-[10px]" style={{ color: 'var(--text-muted)' }}>
            <span>{job.postedAgo}</span>
            {match > 0 && (
              <span
                className="font-semibold"
                style={{ color: match >= 50 ? 'var(--text-primary)' : 'var(--text-muted)' }}
              >
                {match}% skill match
              </span>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function CompanyCard({ company }: { company: (typeof companies)[number] }) {
  return (
    <motion.div variants={item}>
      <Card hover>
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <p
              className="font-[family-name:var(--font-oswald)] text-lg font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              {company.name}
            </p>
            <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
              {company.openRoles} open roles
            </span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {company.blurb}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {company.stack.map((tech) => (
              <span
                key={tech}
                className="rounded px-2 py-0.5 text-[10px] font-medium"
                style={{
                  background: 'color-mix(in srgb, var(--text-primary) 6%, transparent)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--scene-card-border)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

const TrendIcon = {
  up: TrendingUp,
  flat: Minus,
  down: TrendingDown,
} as const;

export function FieldView() {
  const [tab, setTab] = useState<Tab>('jobs');

  const TABS: { key: Tab; label: string; Icon: React.ElementType }[] = [
    { key: 'jobs', label: 'jobs', Icon: Briefcase },
    { key: 'companies', label: 'companies', Icon: Building2 },
    { key: 'skills', label: 'skills', Icon: TrendingUp },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:py-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.2, 0.7, 0.3, 1] }}
        className="mb-8"
      >
        <h1
          className="font-[family-name:var(--font-oswald)] text-4xl font-bold lowercase tracking-tight sm:text-5xl"
          style={{ color: 'var(--text-primary)' }}
        >
          field
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          where your field is heading
        </p>
      </motion.div>

      {/* Tab pills */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0.7, 0.3, 1], delay: 0.08 }}
        className="mb-6 flex gap-2"
      >
        {TABS.map(({ key, label, Icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all duration-200',
                active ? 'shadow-sm' : 'opacity-60 hover:opacity-100',
              )}
              style={
                active
                  ? {
                      background: 'var(--text-primary)',
                      color: 'var(--scene-bg)',
                      border: '1.5px solid var(--text-primary)',
                    }
                  : {
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      border: '1.5px solid var(--scene-card-border)',
                    }
              }
            >
              <Icon size={11} />
              {label}
            </button>
          );
        })}
      </motion.div>

      {/* Jobs */}
      {tab === 'jobs' && (
        <div className="flex flex-col gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* Companies */}
      {tab === 'companies' && (
        <div className="flex flex-col gap-4">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}

      {/* Skill demand */}
      {tab === 'skills' && (
        <motion.div variants={item} className="flex flex-col gap-3">
          <CardLabel>skill demand index</CardLabel>
          <Card>
            <div className="flex flex-col gap-5">
              {skillDemand.map(({ skill, demand, trend }) => {
                const Icon = TrendIcon[trend];
                const trendColor =
                  trend === 'up'
                    ? 'var(--text-primary)'
                    : trend === 'down'
                      ? 'var(--text-muted)'
                      : 'var(--text-secondary)';

                return (
                  <div key={skill} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                        {skill}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold tabular-nums" style={{ color: 'var(--text-muted)' }}>
                          {demand}
                        </span>
                        <Icon size={12} style={{ color: trendColor }} />
                      </div>
                    </div>
                    <Bar value={demand} height={5} />
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
