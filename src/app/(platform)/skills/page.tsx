import SkillTreeCanvas from '@/components/skill-tree/SkillTreeCanvas';
import {
  webDevelopmentTree,
  mockProgress,
} from '@/data/skill-trees/web-development';

export const metadata = {
  title: 'Skill Trees — North',
  description:
    'Explore your learning path through interactive skill trees. Track progress and unlock new skills.',
};

export default function SkillsPage() {
  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <SkillTreeCanvas tree={webDevelopmentTree} progress={mockProgress} />
    </div>
  );
}
