'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import type { Roadmap, Topic } from '@/data/platform/content';

interface RoadmapFormDialogProps {
  /** When provided, the dialog is in edit mode. */
  roadmap?: Roadmap;
  topics: Topic[];
  trigger: React.ReactNode;
  onSave: (data: { title: string; blurb: string; topicId?: string }) => void;
}

export function RoadmapFormDialog({ roadmap, topics, trigger, onSave }: RoadmapFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [blurb, setBlurb] = useState('');
  const [topicId, setTopicId] = useState<string>('');

  // Sync form state whenever the dialog opens (render-time sync, no effect).
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setTitle(roadmap?.title ?? '');
      setBlurb(roadmap?.blurb ?? '');
      setTopicId(roadmap?.topicId ?? '');
    }
  }

  function handleSave() {
    const trimmedTitle = title.trim();
    const trimmedBlurb = blurb.trim();
    if (!trimmedTitle || !trimmedBlurb) return;
    onSave({ title: trimmedTitle, blurb: trimmedBlurb, topicId: topicId || undefined });
    setOpen(false);
  }

  const isEdit = Boolean(roadmap);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Roadmap' : 'New Roadmap'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="rm-title">Title</Label>
            <Input
              id="rm-title"
              placeholder="e.g. Frontend Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rm-blurb">Blurb</Label>
            <textarea
              id="rm-blurb"
              placeholder="A short description of this roadmap…"
              value={blurb}
              onChange={(e) => setBlurb(e.target.value)}
              className="flex min-h-20 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rm-topic">Topic (optional)</Label>
            <Select
              value={topicId || '__none__'}
              onValueChange={(val) => {
                if (val == null) return;
                setTopicId(val === '__none__' ? '' : val);
              }}
            >
              <SelectTrigger id="rm-topic">
                <SelectValue placeholder="No topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">No topic</SelectItem>
                {topics.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button onClick={handleSave} disabled={!title.trim() || !blurb.trim()}>
            {isEdit ? 'Save changes' : 'Create roadmap'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
