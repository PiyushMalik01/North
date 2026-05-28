import { notFound } from 'next/navigation';
import { SkillHero } from '@/components/skill-detail/SkillHero';
import { LessonList } from '@/components/skill-detail/LessonList';
import { PrereqRail } from '@/components/skill-detail/PrereqRail';
import { ExerciseCta } from '@/components/skill-detail/ExerciseCta';
import { getAllSlugs, getSkill, getSkillStatus } from '@/data/curriculum';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) return { title: 'Skill — North' };
  return {
    title: `${skill.name} — North`,
    description: skill.description,
  };
}

export default async function SkillDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) notFound();

  const status = getSkillStatus(slug);
  const progress = status === 'in-progress' ? 45 : status === 'completed' ? 100 : 0;
  const hoursLeft = status === 'in-progress' ? Math.round(skill.estimatedHours * 0.55) : 0;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 lg:px-10 py-8 lg:py-12">
      <SkillHero
        skill={skill}
        status={status}
        progress={progress}
        hoursLeft={hoursLeft}
      />

      <div className="mt-10 lg:mt-14 grid gap-10 lg:gap-14 lg:grid-cols-[minmax(0,1fr)_240px]">
        {/* Main column */}
        <div className="space-y-10 min-w-0">
          <section>
            <div className="flex items-center gap-2 mb-5">
              <span className="h-px w-6 bg-[var(--text-muted)] opacity-60" />
              <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--text-muted)]">
                Lessons
              </span>
            </div>
            <LessonList lessons={skill.lessons} />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-5">
              <span className="h-px w-6 bg-[var(--text-muted)] opacity-60" />
              <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--text-muted)]">
                What you&apos;ll cover
              </span>
            </div>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {skill.topics.map((t) => (
                <li key={t} className="flex gap-3 text-sm text-[var(--text-primary)]">
                  <span className="shrink-0 mt-2 h-1 w-1 rounded-full bg-[var(--text-muted)]" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          <ExerciseCta skillSlug={skill.slug} exercise={skill.exercise} />
        </div>

        {/* Right rail */}
        <PrereqRail skill={skill} />
      </div>
    </div>
  );
}
