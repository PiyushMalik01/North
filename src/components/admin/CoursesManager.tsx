'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useContentStore } from '@/store/contentStore';
import type { Topic, Course, Material } from '@/data/platform/content';
import { cn } from '@/lib/utils';
import { TopicFormDialog } from '@/components/admin/TopicFormDialog';
import { CourseFormDialog } from '@/components/admin/CourseFormDialog';
import { MaterialFormDialog } from '@/components/admin/MaterialFormDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Plus,
  Pencil,
  Trash2,
  FolderTree,
  BookOpen,
  Link2,
  Clock,
  GraduationCap,
} from 'lucide-react';

// ─── level badge colours ──────────────────────────────────────────────────────

const LEVEL_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  beginner: 'secondary',
  intermediate: 'default',
  advanced: 'destructive',
};

const TYPE_COLOURS: Record<string, string> = {
  video: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  article: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  doc: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
  link: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  exercise: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
};

// ─── delete confirm dialog ────────────────────────────────────────────────────

interface ConfirmDeleteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: string;
  warning?: string;
  onConfirm: () => void;
}

function ConfirmDelete({ open, onOpenChange, label, warning, onConfirm }: ConfirmDeleteProps) {
  function handleConfirm() {
    onConfirm();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete {label}?</DialogTitle>
        </DialogHeader>
        {warning && <p className="text-sm text-muted-foreground">{warning}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export function CoursesManager() {
  const topics = useContentStore((s) => s.topics);
  const courses = useContentStore((s) => s.courses);
  const materials = useContentStore((s) => s.materials);
  const deleteTopic = useContentStore((s) => s.deleteTopic);
  const deleteCourse = useContentStore((s) => s.deleteCourse);
  const deleteMaterial = useContentStore((s) => s.deleteMaterial);

  // selection state
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // topic dialog state
  const [topicDialogOpen, setTopicDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | undefined>();

  // course dialog state
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>();

  // material dialog state
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | undefined>();

  // delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<{
    kind: 'topic' | 'course' | 'material';
    id: string;
    label: string;
  } | null>(null);

  // derived
  const visibleCourses =
    selectedTopicId === null ? courses : courses.filter((c) => c.topicId === selectedTopicId);

  const selectedCourse = selectedCourseId
    ? courses.find((c) => c.id === selectedCourseId) ?? null
    : null;

  const visibleMaterials = selectedCourseId
    ? materials.filter((m) => m.courseId === selectedCourseId)
    : [];

  // handlers — topics
  function openAddTopic() {
    setEditingTopic(undefined);
    setTopicDialogOpen(true);
  }

  function openEditTopic(topic: Topic) {
    setEditingTopic(topic);
    setTopicDialogOpen(true);
  }

  function requestDeleteTopic(topic: Topic) {
    setDeleteTarget({ kind: 'topic', id: topic.id, label: topic.name });
  }

  function handleSelectTopic(id: string | null) {
    setSelectedTopicId(id);
    setSelectedCourseId(null);
  }

  // handlers — courses
  function openAddCourse() {
    setEditingCourse(undefined);
    setCourseDialogOpen(true);
  }

  function openEditCourse(course: Course) {
    setEditingCourse(course);
    setCourseDialogOpen(true);
  }

  function requestDeleteCourse(course: Course) {
    setDeleteTarget({ kind: 'course', id: course.id, label: course.title });
  }

  // handlers — materials
  function openAddMaterial() {
    setEditingMaterial(undefined);
    setMaterialDialogOpen(true);
  }

  function openEditMaterial(material: Material) {
    setEditingMaterial(material);
    setMaterialDialogOpen(true);
  }

  function requestDeleteMaterial(material: Material) {
    setDeleteTarget({ kind: 'material', id: material.id, label: material.title });
  }

  // confirm delete dispatcher
  function handleConfirmDelete() {
    if (!deleteTarget) return;
    const { kind, id } = deleteTarget;
    if (kind === 'topic') {
      deleteTopic(id);
      if (selectedTopicId === id) setSelectedTopicId(null);
      toast.success('Topic deleted');
    } else if (kind === 'course') {
      deleteCourse(id);
      if (selectedCourseId === id) setSelectedCourseId(null);
      toast.success('Course deleted');
    } else {
      deleteMaterial(id);
      toast.success('Material deleted');
    }
    setDeleteTarget(null);
  }

  const courseCountFor = (topicId: string) =>
    courses.filter((c) => c.topicId === topicId).length;

  const materialCountFor = (courseId: string) =>
    materials.filter((m) => m.courseId === courseId).length;

  return (
    <div className="flex flex-col gap-6">
      {/* ── header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <GraduationCap className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold text-foreground">Courses Manager</h2>
        <span className="text-sm text-muted-foreground">
          — Topics &rarr; Courses &rarr; Materials
        </span>
      </div>

      {/* ── two-column layout ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">

        {/* ── LEFT: Topics ─────────────────────────────────────────────────── */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <FolderTree className="h-4 w-4 text-muted-foreground" />
                Topics
              </CardTitle>
              <Button size="sm" variant="ghost" onClick={openAddTopic} className="h-7 gap-1 px-2">
                <Plus className="h-3.5 w-3.5" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 pb-4">
            {/* "All" option */}
            <button
              onClick={() => handleSelectTopic(null)}
              className={cn(
                'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors',
                selectedTopicId === null
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground',
              )}
            >
              <span>All topics</span>
              <span className="tabular-nums text-xs opacity-70">{courses.length}</span>
            </button>

            {topics.map((topic) => (
              <div
                key={topic.id}
                className={cn(
                  'group flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors cursor-pointer',
                  selectedTopicId === topic.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted',
                )}
                onClick={() => handleSelectTopic(topic.id)}
              >
                <span className="truncate">{topic.name}</span>
                <div className="flex shrink-0 items-center gap-1">
                  <span className="tabular-nums text-xs opacity-70">{courseCountFor(topic.id)}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); openEditTopic(topic); }}
                    className="hidden group-hover:inline-flex items-center justify-center h-5 w-5 rounded hover:bg-background/30"
                    aria-label={`Edit ${topic.name}`}
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); requestDeleteTopic(topic); }}
                    className="hidden group-hover:inline-flex items-center justify-center h-5 w-5 rounded hover:bg-destructive/20 text-destructive"
                    aria-label={`Delete ${topic.name}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}

            {topics.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">No topics yet.</p>
            )}
          </CardContent>
        </Card>

        {/* ── RIGHT column ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">

          {/* ── MIDDLE: Courses ─────────────────────────────────────────────── */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  Courses
                  {selectedTopicId && (
                    <span className="text-muted-foreground font-normal text-sm">
                      — {topics.find((t) => t.id === selectedTopicId)?.name}
                    </span>
                  )}
                </CardTitle>
                <Button size="sm" variant="ghost" onClick={openAddCourse} className="h-7 gap-1 px-2">
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              {visibleCourses.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No courses{selectedTopicId ? ' in this topic' : ''} yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead className="text-right">XP</TableHead>
                      <TableHead className="text-right">Materials</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead className="w-16" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleCourses.map((course) => (
                      <TableRow
                        key={course.id}
                        className={cn(
                          'cursor-pointer',
                          selectedCourseId === course.id && 'bg-muted/60',
                        )}
                        onClick={() => setSelectedCourseId(course.id)}
                      >
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell>
                          <Badge variant={LEVEL_VARIANT[course.level] ?? 'outline'}>
                            {course.level}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {course.xp}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {materialCountFor(course.id)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {course.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={(e) => { e.stopPropagation(); openEditCourse(course); }}
                              aria-label={`Edit ${course.title}`}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={(e) => { e.stopPropagation(); requestDeleteCourse(course); }}
                              aria-label={`Delete ${course.title}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* ── BOTTOM: Materials ───────────────────────────────────────────── */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  Materials
                  {selectedCourse && (
                    <span className="text-muted-foreground font-normal text-sm">
                      — {selectedCourse.title}
                    </span>
                  )}
                </CardTitle>
                {selectedCourseId && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={openAddMaterial}
                    className="h-7 gap-1 px-2"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              {!selectedCourseId ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Select a course above to view and manage its materials.
                </p>
              ) : visibleMaterials.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No materials in this course yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="text-right">
                        <span className="flex items-center justify-end gap-1">
                          <Clock className="h-3.5 w-3.5" /> Min
                        </span>
                      </TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead className="w-16" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleMaterials.map((mat) => (
                      <TableRow key={mat.id}>
                        <TableCell>
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                              TYPE_COLOURS[mat.type] ?? '',
                            )}
                          >
                            {mat.type}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">{mat.title}</TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {mat.minutes}
                        </TableCell>
                        <TableCell>
                          {mat.url && mat.url !== '#' ? (
                            <a
                              href={mat.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-blue-500 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Link2 className="h-3 w-3" />
                              Link
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => openEditMaterial(mat)}
                              aria-label={`Edit ${mat.title}`}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => requestDeleteMaterial(mat)}
                              aria-label={`Delete ${mat.title}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── dialogs ─────────────────────────────────────────────────────────── */}

      <TopicFormDialog
        open={topicDialogOpen}
        onOpenChange={setTopicDialogOpen}
        topic={editingTopic}
      />

      <CourseFormDialog
        open={courseDialogOpen}
        onOpenChange={setCourseDialogOpen}
        defaultTopicId={selectedTopicId ?? undefined}
        course={editingCourse}
      />

      {selectedCourseId && (
        <MaterialFormDialog
          open={materialDialogOpen}
          onOpenChange={setMaterialDialogOpen}
          courseId={selectedCourseId}
          material={editingMaterial}
        />
      )}

      <ConfirmDelete
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        label={deleteTarget?.label ?? ''}
        warning={
          deleteTarget?.kind === 'topic'
            ? 'This will also delete all courses and materials under this topic.'
            : deleteTarget?.kind === 'course'
              ? 'This will also delete all materials in this course.'
              : undefined
        }
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
