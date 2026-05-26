import {
  FiCheckCircle,
  FiPlay,
  FiClock,
  FiTrendingUp,
  FiArrowRight,
  FiMap,
  FiZap,
} from 'react-icons/fi';
import Link from 'next/link';
import { webDevelopmentTree, mockProgress } from '@/data/skill-trees/web-development';

export const metadata = {
  title: 'Dashboard — North',
  description: 'Your learning overview and progress.',
};

export default function DashboardPage() {
  const completed = Object.values(mockProgress).filter((s) => s === 'completed').length;
  const inProgress = Object.values(mockProgress).filter((s) => s === 'in-progress').length;
  const totalHours = webDevelopmentTree.nodes
    .filter((n) => mockProgress[n.id] === 'completed')
    .reduce((sum, n) => sum + n.estimatedHours, 0);

  const inProgressSkills = webDevelopmentTree.nodes.filter(
    (n) => mockProgress[n.id] === 'in-progress'
  );

  const recommendedSkills = webDevelopmentTree.nodes
    .filter((n) => mockProgress[n.id] === 'unlocked')
    .slice(0, 3);

  return (
    <div className="p-6 lg:p-8 max-w-6xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
          Welcome back
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Here&apos;s where you left off on your learning journey.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: FiCheckCircle,
            label: 'Completed',
            value: completed,
            sub: `of ${webDevelopmentTree.nodes.length} skills`,
            color: 'var(--skill-completed)',
          },
          {
            icon: FiPlay,
            label: 'In Progress',
            value: inProgress,
            sub: 'skills active',
            color: 'var(--brand-yellow)',
          },
          {
            icon: FiClock,
            label: 'Hours Invested',
            value: totalHours,
            sub: 'total learning time',
            color: 'var(--skill-unlocked)',
          },
          {
            icon: FiTrendingUp,
            label: 'Day Streak',
            value: 3,
            sub: 'keep it going!',
            color: 'var(--brand-blue)',
          },
        ].map(({ icon: Icon, label, value, sub, color }) => (
          <div
            key={label}
            className="p-4 rounded-lg bg-[var(--background-secondary)] border border-[var(--border-color)] transition-colors hover:border-[var(--border-hover)]"
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center"
                style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` }}
              >
                <Icon size={16} style={{ color }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {value}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {inProgressSkills.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Continue Learning
            </h3>
            <Link
              href="/skills"
              className="text-xs text-[var(--brand-yellow)] hover:underline flex items-center gap-1"
            >
              View Skill Tree <FiArrowRight size={12} />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {inProgressSkills.map((skill) => {
              const prereqsDone = skill.prerequisites.filter(
                (p) => mockProgress[p] === 'completed'
              ).length;
              const prereqsTotal = skill.prerequisites.length;
              const progressPct =
                prereqsTotal > 0
                  ? Math.round((prereqsDone / prereqsTotal) * 50) + 50
                  : 50;

              return (
                <div
                  key={skill.id}
                  className="p-4 rounded-lg bg-[var(--background-secondary)] border border-[var(--border-color)] hover:border-[var(--brand-yellow)]/40 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                        {skill.name}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        {skill.estimatedHours}h · {skill.difficulty}
                      </p>
                    </div>
                    <FiPlay
                      size={14}
                      className="text-[var(--brand-yellow)] mt-0.5"
                    />
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[var(--border-color)]">
                    <div
                      className="h-full rounded-full bg-[var(--brand-yellow)] transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1.5">
                    {progressPct}% complete
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {recommendedSkills.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Recommended Next
            </h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {recommendedSkills.map((skill) => (
              <div
                key={skill.id}
                className="p-4 rounded-lg bg-[var(--background-secondary)] border border-[var(--border-color)] hover:border-[var(--skill-unlocked)]/40 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FiZap size={14} className="text-[var(--skill-unlocked)]" />
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                    {skill.name}
                  </h4>
                </div>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                  {skill.description}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {skill.estimatedHours}h
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {skill.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">
          Your Learning Path
        </h3>
        <Link
          href="/skills"
          className="flex items-center gap-4 p-4 rounded-lg bg-[var(--background-secondary)] border border-[var(--border-color)] hover:border-[var(--brand-yellow)]/40 transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-yellow)] flex items-center justify-center text-[var(--accent-fg)]">
            <FiMap size={18} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">
              {webDevelopmentTree.name}
            </h4>
            <p className="text-xs text-[var(--text-muted)]">
              {completed} of {webDevelopmentTree.nodes.length} skills completed
            </p>
          </div>
          <div className="w-20 h-1.5 rounded-full bg-[var(--border-color)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-yellow)] transition-all"
              style={{
                width: `${(completed / webDevelopmentTree.nodes.length) * 100}%`,
              }}
            />
          </div>
          <FiArrowRight
            size={16}
            className="text-[var(--text-muted)] group-hover:text-[var(--brand-yellow)] transition-colors"
          />
        </Link>
      </section>
    </div>
  );
}
