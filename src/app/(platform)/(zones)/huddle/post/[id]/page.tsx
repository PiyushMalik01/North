import { PostView } from '@/components/huddle/rooms/PostView';

export const metadata = { title: 'huddle · post — North' };

export default async function HuddlePostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PostView id={id} />;
}
