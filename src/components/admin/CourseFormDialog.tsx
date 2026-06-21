'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useContentStore } from '@/store/contentStore';
import type { Course, CourseLevel } from '@/data/platform/content';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CourseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-selected topic id (can be overridden in the form). */
  defaultTopicId?: string;
  /** When provided, the dialog is in edit mode. */
  course?: Course;
}

const LEVELS: CourseLevel[] = ['beginner', 'intermediate', 'advanced'];

const EMPTY = {
  topicId: '',
  title: '',
  level: 'beginner' as CourseLevel,
  summary: '',
  tags: '',
  xp: 100,
  proveId: '',
};

export function CourseFormDialog({
  open,
  onOpenChange,
  defaultTopicId,
  course,
}: CourseFormDialogProps) {
  const topics = useContentStore((s) => s.topics);
  const addCourse = useContentStore((s) => s.addCourse);
  const updateCourse = useContentStore((s) => s.updateCourse);

  const [form, setForm] = useState({ ...EMPTY, topicId: defaultTopicId ?? '' });

  // Reset the form when the dialog transitions to open (render-time sync, no effect).
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setForm(
        course
          ? {
              topicId: course.topicId,
              title: course.title,
              level: course.level,
              summary: course.summary,
              tags: course.tags.join(', '),
              xp: course.xp,
              proveId: course.proveId ?? '',
            }
          : { ...EMPTY, topicId: defaultTopicId ?? '' },
      );
    }
  }

  function setField<K extends keyof typeof EMPTY>(field: K, value: (typeof EMPTY)[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.topicId || !form.title.trim()) return;

    const data = {
      topicId: form.topicId,
      title: form.title.trim(),
      level: form.level,
      summary: form.summary.trim(),
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      xp: form.xp,
      proveId: form.proveId.trim() || undefined,
    };

    if (course) {
      updateCourse(course.id, data);
      toast.success('Course updated');
    } else {
      addCourse(data);
      toast.success('Course added');
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{course ? 'Edit Course' : 'New Course'}</DialogTitle>
          <DialogDescription>
            Courses live under a topic and contain ordered materials.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Topic */}
          <div className="space-y-1.5">
            <Label htmlFor="c-topic">Topic</Label>
            <Select
              value={form.topicId}
              onValueChange={(v) => {
                if (v !== null) setField('topicId', v);
              }}
            >
              <SelectTrigger id="c-topic" className="w-full">
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="c-title">Title</Label>
            <Input
              id="c-title"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder="e.g. Semantic HTML"
              required
            />
          </div>

          {/* Level */}
          <div className="space-y-1.5">
            <Label htmlFor="c-level">Level</Label>
            <Select
              value={form.level}
              onValueChange={(v) => {
                if (v !== null) setField('level', v as CourseLevel);
              }}
            >
              <SelectTrigger id="c-level" className="w-full">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {LEVELS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l.charAt(0).toUpperCase() + l.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Summary */}
          <div className="space-y-1.5">
            <Label htmlFor="c-summary">Summary</Label>
            <textarea
              id="c-summary"
              value={form.summary}
              onChange={(e) => setField('summary', e.target.value)}
              placeholder="Short description of what learners will achieve."
              className="flex min-h-20 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          {/* XP + Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="c-xp">XP</Label>
              <Input
                id="c-xp"
                type="number"
                min={0}
                value={form.xp}
                onChange={(e) => setField('xp', Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-tags">Tags (comma-separated)</Label>
              <Input
                id="c-tags"
                value={form.tags}
                onChange={(e) => setField('tags', e.target.value)}
                placeholder="html, a11y"
              />
            </div>
          </div>

          {/* ProveId */}
          <div className="space-y-1.5">
            <Label htmlFor="c-prove">Assessment ID (optional)</Label>
            <Input
              id="c-prove"
              value={form.proveId}
              onChange={(e) => setField('proveId', e.target.value)}
              placeholder="e.g. quiz-html"
            />
          </div>

          <DialogFooter>
            <Button type="submit">{course ? 'Save changes' : 'Add course'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
