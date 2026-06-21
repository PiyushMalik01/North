'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Route, GripVertical, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useContentStore } from '@/store/contentStore';
import type { RoadmapStep } from '@/data/platform/content';
import { RoadmapFormDialog } from '@/components/admin/RoadmapFormDialog';

// ─── Step Builder ─────────────────────────────────────────────────────────────

interface StepBuilderProps {
  roadmapId: string;
}

function StepBuilder({ roadmapId }: StepBuilderProps) {
  const { roadmaps, courses, updateRoadmap } = useContentStore();
  const roadmap = roadmaps.find((r) => r.id === roadmapId);
  const [addCourseId, setAddCourseId] = useState('');
  const [addNote, setAddNote] = useState('');

  if (!roadmap) return null;

  const steps = roadmap.steps;

  // Courses not yet present in this roadmap
  const usedCourseIds = new Set(steps.map((s) => s.courseId));
  const availableCourses = courses.filter((c) => !usedCourseIds.has(c.id));

  function courseTitle(courseId: string): string {
    return courses.find((c) => c.id === courseId)?.title ?? courseId;
  }

  function moveStep(index: number, direction: 'up' | 'down') {
    const next = [...steps];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= next.length) return;
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
    updateRoadmap(roadmapId, { steps: next });
  }

  function removeStep(index: number) {
    const next = steps.filter((_, i) => i !== index);
    updateRoadmap(roadmapId, { steps: next });
    toast.success('Step removed');
  }

  function addStep() {
    if (!addCourseId) return;
    const newStep: RoadmapStep = { courseId: addCourseId, note: addNote.trim() || undefined };
    updateRoadmap(roadmapId, { steps: [...steps, newStep] });
    setAddCourseId('');
    setAddNote('');
    toast.success(`Step added: ${courseTitle(addCourseId)}`);
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Route className="h-4 w-4 text-primary" />
          Step Builder — {roadmap.title}
          <Badge variant="secondary" className="ml-auto">
            {steps.length} step{steps.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Ordered step list */}
        {steps.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No steps yet. Add one below.
          </p>
        ) : (
          <ol className="space-y-2">
            {steps.map((step, index) => (
              <li
                key={`${step.courseId}-${index}`}
                className="flex items-center gap-3 rounded-md border border-border bg-muted/40 px-3 py-2"
              >
                {/* drag handle (visual only) */}
                <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />

                {/* index badge */}
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                  {index + 1}
                </span>

                {/* course title + note */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {courseTitle(step.courseId)}
                  </p>
                  {step.note && (
                    <p className="truncate text-xs text-muted-foreground">{step.note}</p>
                  )}
                </div>

                {/* controls */}
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={index === 0}
                    onClick={() => moveStep(index, 'up')}
                    aria-label="Move step up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={index === steps.length - 1}
                    onClick={() => moveStep(index, 'down')}
                    aria-label="Move step down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => removeStep(index)}
                    aria-label="Remove step"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ol>
        )}

        {/* Add step row */}
        <div className="rounded-md border border-dashed border-border p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Add step
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1">
              <Label htmlFor="step-course" className="text-xs">
                Course
              </Label>
              {availableCourses.length === 0 ? (
                <p className="text-xs text-muted-foreground">All courses already added.</p>
              ) : (
                <Select
                  value={addCourseId || '__placeholder__'}
                  onValueChange={(val) => {
                    if (val == null || val === '__placeholder__') return;
                    setAddCourseId(val);
                  }}
                >
                  <SelectTrigger id="step-course" className="h-8 text-sm">
                    <SelectValue placeholder="Pick a course…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__placeholder__" disabled>
                      Pick a course…
                    </SelectItem>
                    {availableCourses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="flex-1 space-y-1">
              <Label htmlFor="step-note" className="text-xs">
                Note (optional)
              </Label>
              <Input
                id="step-note"
                className="h-8 text-sm"
                placeholder="e.g. capstone"
                value={addNote}
                onChange={(e) => setAddNote(e.target.value)}
              />
            </div>

            <Button
              size="sm"
              className="shrink-0"
              disabled={!addCourseId || availableCourses.length === 0}
              onClick={addStep}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Roadmap Card ─────────────────────────────────────────────────────────────

interface RoadmapCardProps {
  roadmapId: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function RoadmapCard({ roadmapId, isSelected, onSelect }: RoadmapCardProps) {
  const { roadmaps, topics, updateRoadmap, deleteRoadmap } = useContentStore();
  const roadmap = roadmaps.find((r) => r.id === roadmapId);

  if (!roadmap) return null;

  const topicName = roadmap.topicId ? (topics.find((t) => t.id === roadmap.topicId)?.name ?? null) : null;

  function handleDelete() {
    deleteRoadmap(roadmapId);
    toast.success(`"${roadmap?.title ?? 'Roadmap'}" deleted`);
  }

  return (
    <Card
      onClick={() => onSelect(roadmapId)}
      className={`cursor-pointer transition-colors ${isSelected ? 'border-primary bg-primary/5' : 'hover:border-primary/40'}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-start justify-between gap-2 text-sm">
          <span className="flex items-center gap-2">
            <Route className="h-4 w-4 shrink-0 text-primary" />
            <span className="leading-tight">{roadmap.title}</span>
          </span>

          {/* action buttons — stop propagation so clicks don&apos;t also select */}
          <span className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <RoadmapFormDialog
              roadmap={roadmap}
              topics={topics}
              trigger={
                <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Edit roadmap">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              }
              onSave={(data) => {
                updateRoadmap(roadmapId, data);
                toast.success('Roadmap updated');
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              aria-label="Delete roadmap"
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 pt-0">
        <p className="line-clamp-2 text-xs text-muted-foreground">{roadmap.blurb}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {roadmap.steps.length} step{roadmap.steps.length !== 1 ? 's' : ''}
          </Badge>
          {topicName && (
            <Badge variant="outline" className="text-xs">
              {topicName}
            </Badge>
          )}
          {isSelected && (
            <Badge className="ml-auto text-xs">
              Editing
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export function RoadmapsManager() {
  const { roadmaps, topics, addRoadmap } = useContentStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function handleSelect(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Roadmaps</h2>
          <p className="text-sm text-muted-foreground">
            Ordered course sequences. Click a card to open the step builder.
          </p>
        </div>

        <RoadmapFormDialog
          topics={topics}
          trigger={
            <Button size="sm">
              <Plus className="mr-1.5 h-4 w-4" />
              Add roadmap
            </Button>
          }
          onSave={(data) => {
            const id = addRoadmap({ ...data, steps: [] });
            toast.success('Roadmap created');
            setSelectedId(id);
          }}
        />
      </div>

      {/* Roadmap grid */}
      {roadmaps.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Route className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No roadmaps yet. Create one above.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {roadmaps.map((r) => (
            <RoadmapCard
              key={r.id}
              roadmapId={r.id}
              isSelected={selectedId === r.id}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}

      {/* Step builder — shown below the grid when a roadmap is selected */}
      {selectedId != null && <StepBuilder roadmapId={selectedId} />}
    </div>
  );
}
