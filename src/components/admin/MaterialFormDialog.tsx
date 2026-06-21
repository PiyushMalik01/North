'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useContentStore } from '@/store/contentStore';
import type { Material, MaterialType } from '@/data/platform/content';
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

interface MaterialFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  /** When provided, the dialog is in edit mode. */
  material?: Material;
}

const TYPES: MaterialType[] = ['video', 'article', 'doc', 'link', 'exercise'];

const EMPTY = {
  type: 'video' as MaterialType,
  title: '',
  url: '',
  minutes: 10,
};

export function MaterialFormDialog({
  open,
  onOpenChange,
  courseId,
  material,
}: MaterialFormDialogProps) {
  const addMaterial = useContentStore((s) => s.addMaterial);
  const updateMaterial = useContentStore((s) => s.updateMaterial);

  const [form, setForm] = useState(EMPTY);

  // Reset the form when the dialog transitions to open (render-time sync, no effect).
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setForm(
        material
          ? { type: material.type, title: material.title, url: material.url, minutes: material.minutes }
          : EMPTY,
      );
    }
  }

  function setField<K extends keyof typeof EMPTY>(field: K, value: (typeof EMPTY)[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;

    const data = {
      courseId,
      type: form.type,
      title: form.title.trim(),
      url: form.url.trim() || '#',
      minutes: form.minutes,
    };

    if (material) {
      updateMaterial(material.id, data);
      toast.success('Material updated');
    } else {
      addMaterial(data);
      toast.success('Material added');
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{material ? 'Edit Material' : 'New Material'}</DialogTitle>
          <DialogDescription>
            Materials are the individual resources inside a course.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Type */}
          <div className="space-y-1.5">
            <Label htmlFor="m-type">Type</Label>
            <Select
              value={form.type}
              onValueChange={(v) => {
                if (v !== null) setField('type', v as MaterialType);
              }}
            >
              <SelectTrigger id="m-type" className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="m-title">Title</Label>
            <Input
              id="m-title"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder="e.g. The box model & the cascade"
              required
            />
          </div>

          {/* URL */}
          <div className="space-y-1.5">
            <Label htmlFor="m-url">URL</Label>
            <Input
              id="m-url"
              type="url"
              value={form.url}
              onChange={(e) => setField('url', e.target.value)}
              placeholder="https://..."
            />
          </div>

          {/* Minutes */}
          <div className="space-y-1.5">
            <Label htmlFor="m-minutes">Duration (minutes)</Label>
            <Input
              id="m-minutes"
              type="number"
              min={1}
              value={form.minutes}
              onChange={(e) => setField('minutes', Number(e.target.value))}
            />
          </div>

          <DialogFooter>
            <Button type="submit">{material ? 'Save changes' : 'Add material'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
