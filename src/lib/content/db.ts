import { prisma } from '@/lib/prisma';
import { CourseLevel, MaterialType } from '@prisma/client';
import type {
  Topic,
  Course,
  Material,
  Roadmap,
  RoadmapStep,
} from '@/data/platform/content';

// ─── Enum mappers ────────────────────────────────────────────────────────────

function toDbLevel(level: string): CourseLevel {
  switch (level) {
    case 'beginner':
      return CourseLevel.BEGINNER;
    case 'intermediate':
      return CourseLevel.INTERMEDIATE;
    case 'advanced':
      return CourseLevel.ADVANCED;
    default:
      return CourseLevel.BEGINNER;
  }
}

function fromDbLevel(level: CourseLevel): Course['level'] {
  return level.toLowerCase() as Course['level'];
}

function toDbMaterialType(type: string): MaterialType {
  switch (type) {
    case 'video':
      return MaterialType.VIDEO;
    case 'article':
      return MaterialType.ARTICLE;
    case 'doc':
      return MaterialType.DOC;
    case 'link':
      return MaterialType.LINK;
    case 'exercise':
      return MaterialType.EXERCISE;
    default:
      return MaterialType.LINK;
  }
}

function fromDbMaterialType(type: MaterialType): Material['type'] {
  return type.toLowerCase() as Material['type'];
}

// ─── getAllContent ────────────────────────────────────────────────────────────

export async function getAllContent(): Promise<{
  topics: Topic[];
  courses: Course[];
  materials: Material[];
  roadmaps: Roadmap[];
}> {
  const [dbTopics, dbCourses, dbMaterials, dbRoadmaps] = await Promise.all([
    prisma.topic.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.course.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.material.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.roadmap.findMany({
      include: {
        steps: { orderBy: { order: 'asc' } },
      },
    }),
  ]);

  const topics: Topic[] = dbTopics.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    blurb: t.blurb,
  }));

  const courses: Course[] = dbCourses.map((c) => ({
    id: c.id,
    topicId: c.topicId,
    title: c.title,
    level: fromDbLevel(c.level),
    summary: c.summary,
    tags: c.tags,
    xp: c.xp,
    ...(c.proveId != null ? { proveId: c.proveId } : {}),
  }));

  const materials: Material[] = dbMaterials.map((m) => ({
    id: m.id,
    courseId: m.courseId,
    type: fromDbMaterialType(m.type),
    title: m.title,
    url: m.url,
    minutes: m.minutes,
  }));

  const roadmaps: Roadmap[] = dbRoadmaps.map((r) => ({
    id: r.id,
    title: r.title,
    blurb: r.blurb,
    ...(r.topicId != null ? { topicId: r.topicId } : {}),
    steps: r.steps.map(
      (s): RoadmapStep => ({
        courseId: s.courseId,
        ...(s.note != null ? { note: s.note } : {}),
      })
    ),
  }));

  return { topics, courses, materials, roadmaps };
}

// ─── mutateContent ───────────────────────────────────────────────────────────

type Entity = 'topic' | 'course' | 'material' | 'roadmap';
type Op = 'create' | 'update' | 'delete';
type Data = Record<string, unknown>;

export async function mutateContent(
  entity: Entity,
  op: Op,
  id: string,
  data: Data
): Promise<void> {
  if (entity === 'topic') {
    if (op === 'create') {
      await prisma.topic.create({
        data: {
          id,
          name: data.name as string,
          slug: data.slug as string,
          blurb: data.blurb as string,
        },
      });
    } else if (op === 'update') {
      await prisma.topic.update({
        where: { id },
        data: {
          ...(data.name != null ? { name: data.name as string } : {}),
          ...(data.slug != null ? { slug: data.slug as string } : {}),
          ...(data.blurb != null ? { blurb: data.blurb as string } : {}),
        },
      });
    } else {
      await prisma.topic.delete({ where: { id } });
    }
    return;
  }

  if (entity === 'course') {
    if (op === 'create') {
      await prisma.course.create({
        data: {
          id,
          topicId: data.topicId as string,
          title: data.title as string,
          level: toDbLevel(data.level as string),
          summary: data.summary as string,
          tags: data.tags as string[],
          xp: data.xp as number,
          ...(data.proveId != null ? { proveId: data.proveId as string } : {}),
        },
      });
    } else if (op === 'update') {
      await prisma.course.update({
        where: { id },
        data: {
          ...(data.topicId != null ? { topicId: data.topicId as string } : {}),
          ...(data.title != null ? { title: data.title as string } : {}),
          ...(data.level != null
            ? { level: toDbLevel(data.level as string) }
            : {}),
          ...(data.summary != null ? { summary: data.summary as string } : {}),
          ...(data.tags != null ? { tags: data.tags as string[] } : {}),
          ...(data.xp != null ? { xp: data.xp as number } : {}),
          ...(data.proveId !== undefined
            ? { proveId: data.proveId != null ? (data.proveId as string) : null }
            : {}),
        },
      });
    } else {
      await prisma.course.delete({ where: { id } });
    }
    return;
  }

  if (entity === 'material') {
    if (op === 'create') {
      await prisma.material.create({
        data: {
          id,
          courseId: data.courseId as string,
          type: toDbMaterialType(data.type as string),
          title: data.title as string,
          url: data.url as string,
          minutes: data.minutes as number,
        },
      });
    } else if (op === 'update') {
      await prisma.material.update({
        where: { id },
        data: {
          ...(data.courseId != null
            ? { courseId: data.courseId as string }
            : {}),
          ...(data.type != null
            ? { type: toDbMaterialType(data.type as string) }
            : {}),
          ...(data.title != null ? { title: data.title as string } : {}),
          ...(data.url != null ? { url: data.url as string } : {}),
          ...(data.minutes != null ? { minutes: data.minutes as number } : {}),
        },
      });
    } else {
      await prisma.material.delete({ where: { id } });
    }
    return;
  }

  // entity === 'roadmap'
  if (op === 'create') {
    const steps = (data.steps as Array<{ courseId: string; note?: string }>) ?? [];
    await prisma.roadmap.create({
      data: {
        id,
        title: data.title as string,
        blurb: data.blurb as string,
        ...(data.topicId != null ? { topicId: data.topicId as string } : {}),
        steps: {
          create: steps.map((s, i) => ({
            courseId: s.courseId,
            order: i,
            ...(s.note != null ? { note: s.note } : {}),
          })),
        },
      },
    });
  } else if (op === 'update') {
    const updateData: Record<string, unknown> = {};
    if (data.title != null) updateData.title = data.title as string;
    if (data.blurb != null) updateData.blurb = data.blurb as string;
    if (data.topicId !== undefined)
      updateData.topicId = data.topicId != null ? (data.topicId as string) : null;

    await prisma.roadmap.update({ where: { id }, data: updateData });

    if (data.steps != null) {
      const steps = data.steps as Array<{ courseId: string; note?: string }>;
      await prisma.roadmapStep.deleteMany({ where: { roadmapId: id } });
      await prisma.roadmapStep.createMany({
        data: steps.map((s, i) => ({
          roadmapId: id,
          courseId: s.courseId,
          order: i,
          ...(s.note != null ? { note: s.note } : {}),
        })),
      });
    }
  } else {
    await prisma.roadmap.delete({ where: { id } });
  }
}
