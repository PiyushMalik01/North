import { Suspense } from 'react';
import ProveView from '@/components/prove/ProveView';

export const metadata = {
  title: 'prove — North',
  description: 'Run assessments to validate your skills and unlock trace nodes.',
};

export default function ProvePage() {
  return (
    <Suspense fallback={null}>
      <ProveView />
    </Suspense>
  );
}
