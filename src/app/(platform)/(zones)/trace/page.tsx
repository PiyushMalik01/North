import type { Metadata } from 'next';
import { TraceView } from '@/components/trace/TraceView';

export const metadata: Metadata = {
  title: 'trace — North',
};

export default function TracePage() {
  return <TraceView />;
}
