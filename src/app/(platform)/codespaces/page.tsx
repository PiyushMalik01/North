import { CodeEditor } from '@/components/codespaces/CodeEditor';
import { ProblemPanel } from '@/components/codespaces/ProblemPanel';

export const metadata = {
  title: 'CodeSpaces — North',
  description: 'Write, run, and test code in the browser.',
};

export default function CodeSpacesPage() {
  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col lg:flex-row">
      <ProblemPanel />
      <CodeEditor />
    </div>
  );
}
