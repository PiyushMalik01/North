'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useContentStore } from '@/store/contentStore';
import type { Topic } from '@/data/platform/content';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TopicFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided, the dialog is in edit mode. */
  topic?: Topic;
}

const EMPTY = { name: '', slug: '', blurb: '' };

export function TopicFormDialog({ open, onOpenChange, topic }: TopicFormDialogProps) {
  const addTopic = useContentStore((s) => s.addTopic);
  const updateTopic = useContentStore((s) => s.updateTopic);

  const [form, setForm] = useState(EMPTY);

  // Reset the form when the dialog transitions to open (render-time sync, no effect).
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setForm(topic ? { name: topic.name, slug: topic.slug, blurb: topic.blurb } : EMPTY);
  }

  function set(field: keyof typeof EMPTY, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = { name: form.name.trim(), slug: form.slug.trim(), blurb: form.blurb.trim() };
    if (!trimmed.name || !trimmed.slug) return;

    if (topic) {
      updateTopic(topic.id, trimmed);
      toast.success('Topic updated');
    } else {
      addTopic(trimmed);
      toast.success('Topic added');
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{topic ? 'Edit Topic' : 'New Topic'}</DialogTitle>
          <DialogDescription>
            Topics are the top-level categories that group related courses.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="t-name">Name</Label>
            <Input
              id="t-name"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Frontend"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="t-slug">Slug</Label>
            <Input
              id="t-slug"
              value={form.slug}
              onChange={(e) => set('slug', e.target.value)}
              placeholder="e.g. frontend"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="t-blurb">Blurb</Label>
            <Input
              id="t-blurb"
              value={form.blurb}
              onChange={(e) => set('blurb', e.target.value)}
              placeholder="One-line description"
            />
          </div>

          <DialogFooter>
            <Button type="submit">{topic ? 'Save changes' : 'Add topic'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
