import { NestHome } from '@/components/nest/NestHome';

export const metadata = {
  title: 'nest — North',
  description: 'Your home in the cold. Find your north.',
};

export default function NestPage() {
  return <NestHome />;
}
