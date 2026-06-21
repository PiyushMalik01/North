/**
 * Seeds North's database with the learning content (topics → courses → materials,
 * roadmaps) and the demo accounts. Content ids match the TS seed so the frontend
 * stays consistent as it moves from local store to the database.
 *
 *   npm run db:seed:platform
 */
import 'dotenv/config';
import { PrismaClient, type CourseLevel, type MaterialType, type Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import { contentSeed } from '../src/data/platform/content';

const pool = new pg.Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const LEVEL: Record<string, CourseLevel> = {
  beginner: 'BEGINNER',
  intermediate: 'INTERMEDIATE',
  advanced: 'ADVANCED',
};
const MTYPE: Record<string, MaterialType> = {
  video: 'VIDEO',
  article: 'ARTICLE',
  doc: 'DOC',
  link: 'LINK',
  exercise: 'EXERCISE',
};

const DEMO_PASSWORD = 'north1234';

const USERS: { email: string; name: string; role: Role }[] = [
  { email: 'admin@north.dev', name: 'North Admin', role: 'ADMIN' },
  { email: 'piyush@north.dev', name: 'Piyush', role: 'STUDENT' },
  { email: 'aanya@north.dev', name: 'Aanya', role: 'STUDENT' },
  { email: 'rohan@north.dev', name: 'Rohan', role: 'STUDENT' },
  { email: 'meera@north.dev', name: 'Meera', role: 'STUDENT' },
  { email: 'kabir@north.dev', name: 'Kabir', role: 'STUDENT' },
];

async function main() {
  // ── accounts ──
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  for (const u of USERS) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role, password: passwordHash },
      create: { email: u.email, name: u.name, role: u.role, password: passwordHash },
    });
  }
  console.log(`✓ ${USERS.length} users (password: ${DEMO_PASSWORD})`);

  // ── content (wipe + reseed with explicit ids) ──
  await prisma.roadmapStep.deleteMany();
  await prisma.roadmap.deleteMany();
  await prisma.material.deleteMany();
  await prisma.course.deleteMany();
  await prisma.topic.deleteMany();

  await prisma.topic.createMany({
    data: contentSeed.topics.map((t, i) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      blurb: t.blurb,
      sortOrder: i,
    })),
  });

  await prisma.course.createMany({
    data: contentSeed.courses.map((c, i) => ({
      id: c.id,
      topicId: c.topicId,
      title: c.title,
      level: LEVEL[c.level],
      summary: c.summary,
      tags: c.tags,
      xp: c.xp,
      proveId: c.proveId ?? null,
      sortOrder: i,
    })),
  });

  await prisma.material.createMany({
    data: contentSeed.materials.map((m, i) => ({
      id: m.id,
      courseId: m.courseId,
      type: MTYPE[m.type],
      title: m.title,
      url: m.url,
      minutes: m.minutes,
      sortOrder: i,
    })),
  });

  for (const r of contentSeed.roadmaps) {
    await prisma.roadmap.create({
      data: {
        id: r.id,
        title: r.title,
        blurb: r.blurb,
        topicId: r.topicId ?? null,
        steps: {
          create: r.steps.map((s, i) => ({ courseId: s.courseId, note: s.note ?? null, order: i })),
        },
      },
    });
  }

  console.log(
    `✓ content: ${contentSeed.topics.length} topics, ${contentSeed.courses.length} courses, ${contentSeed.materials.length} materials, ${contentSeed.roadmaps.length} roadmaps`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
