import { describe, it, expect } from 'vitest';
import {
  seedTopics,
  seedCourses,
  seedMaterials,
  seedRoadmaps,
} from './content';
import { assessments } from './prove';

describe('content seed — referential integrity', () => {
  const topicIds = new Set(seedTopics.map((t) => t.id));
  const courseIds = new Set(seedCourses.map((c) => c.id));
  const assessmentIds = new Set(assessments.map((a) => a.id));

  it('every course.topicId references a known topic', () => {
    for (const course of seedCourses) {
      expect(topicIds.has(course.topicId),
        `course "${course.id}" has unknown topicId "${course.topicId}"`
      ).toBe(true);
    }
  });

  it('every material.courseId references a known course', () => {
    for (const mat of seedMaterials) {
      expect(courseIds.has(mat.courseId),
        `material "${mat.id}" has unknown courseId "${mat.courseId}"`
      ).toBe(true);
    }
  });

  it('every roadmap step.courseId references a known course', () => {
    for (const roadmap of seedRoadmaps) {
      for (const step of roadmap.steps) {
        expect(courseIds.has(step.courseId),
          `roadmap "${roadmap.id}" step references unknown courseId "${step.courseId}"`
        ).toBe(true);
      }
    }
  });

  it('every course.proveId (when set) references a known assessment', () => {
    for (const course of seedCourses) {
      if (course.proveId !== undefined) {
        expect(assessmentIds.has(course.proveId),
          `course "${course.id}" has unknown proveId "${course.proveId}"`
        ).toBe(true);
      }
    }
  });

  it('all topic ids are unique', () => {
    const ids = seedTopics.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all course ids are unique', () => {
    const ids = seedCourses.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all material ids are unique', () => {
    const ids = seedMaterials.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all roadmap ids are unique', () => {
    const ids = seedRoadmaps.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every course has xp > 0', () => {
    for (const course of seedCourses) {
      expect(course.xp,
        `course "${course.id}" has xp=${course.xp}`
      ).toBeGreaterThan(0);
    }
  });

  it('every course has a non-empty title and summary', () => {
    for (const course of seedCourses) {
      expect(course.title.length).toBeGreaterThan(0);
      expect(course.summary.length).toBeGreaterThan(0);
    }
  });

  it('every topic has a non-empty name and slug', () => {
    for (const topic of seedTopics) {
      expect(topic.name.length).toBeGreaterThan(0);
      expect(topic.slug.length).toBeGreaterThan(0);
    }
  });

  it('every material has minutes > 0', () => {
    for (const mat of seedMaterials) {
      expect(mat.minutes,
        `material "${mat.id}" has minutes=${mat.minutes}`
      ).toBeGreaterThan(0);
    }
  });
});
