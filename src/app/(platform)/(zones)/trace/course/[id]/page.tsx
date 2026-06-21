import type { Metadata } from 'next';
import { CourseDetail } from '@/components/trace/CourseDetail';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `course ${id} — North` };
}

export default async function CourseDetailPage({ params }: Props) {
  const { id } = await params;
  return <CourseDetail id={id} />;
}
