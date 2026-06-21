import type { Metadata } from 'next';
import { ChartView } from '@/components/chart/ChartView';

export const metadata: Metadata = {
  title: 'chart — North',
};

export default function ChartPage() {
  return <ChartView />;
}
