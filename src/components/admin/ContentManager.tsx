'use client';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useContentStore } from '@/store/contentStore';
import { CoursesManager } from './CoursesManager';
import { RoadmapsManager } from './RoadmapsManager';

/**
 * The content studio — the CMS admins use to maintain the learning library.
 * Two surfaces over the shared contentStore: courses (topics → courses →
 * materials) and roadmaps. Everything here is read live by trace + course pages.
 */
export function ContentManager() {
  const resetContent = useContentStore((s) => s.resetContent);
  const topics = useContentStore((s) => s.topics);
  const courses = useContentStore((s) => s.courses);
  const roadmaps = useContentStore((s) => s.roadmaps);

  return (
    <div>
      <AdminHeader
        title="Content studio"
        description="Create and maintain topics, courses, materials, and roadmaps. Changes are live across the platform."
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            resetContent();
            toast('Content reset to defaults');
          }}
        >
          <RotateCcw className="size-4" />
          Reset to seed
        </Button>
      </AdminHeader>

      <Tabs defaultValue="courses">
        <TabsList>
          <TabsTrigger value="courses">
            Courses
            <span className="ml-1.5 text-xs text-muted-foreground">
              {topics.length}·{courses.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="roadmaps">
            Roadmaps
            <span className="ml-1.5 text-xs text-muted-foreground">{roadmaps.length}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-5">
          <CoursesManager />
        </TabsContent>
        <TabsContent value="roadmaps" className="mt-5">
          <RoadmapsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
