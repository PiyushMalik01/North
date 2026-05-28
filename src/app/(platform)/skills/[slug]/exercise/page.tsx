import { notFound } from 'next/navigation';
import { ExerciseRunner } from '@/components/exercise/ExerciseRunner';
import { getAllSlugs, getSkill } from '@/data/curriculum';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const skill = getSkill(slug);
  return {
    title: skill ? `Exercise — ${skill.name}` : 'Exercise — North',
  };
}

export default async function ExercisePage({ params }: PageProps) {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) notFound();

  return <ExerciseRunner skill={skill} />;
}
