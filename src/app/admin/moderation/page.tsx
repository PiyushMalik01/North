import ModerationQueue from '@/components/admin/ModerationQueue';

export const metadata = {
  title: 'Moderation — Admin — North',
  description: 'Review and action reported huddle content.',
};

export default function ModerationPage() {
  return <ModerationQueue />;
}
