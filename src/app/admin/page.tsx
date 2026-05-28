import { AIConnectionPanel } from '@/components/admin/AIConnectionPanel';

export const metadata = {
  title: 'Admin — North',
  description: 'Platform settings and AI configuration.',
};

export default function AdminPage() {
  return <AIConnectionPanel />;
}
