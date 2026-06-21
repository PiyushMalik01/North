import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// The "current user" the API falls back to until login is wired into huddle.
const DEMO_EMAIL = 'piyush@north.dev';

const USERS = [
  { email: DEMO_EMAIL, name: 'Piyush' },
  { email: 'aanya@north.dev', name: 'Aanya' },
  { email: 'rohan@north.dev', name: 'Rohan' },
  { email: 'meera@north.dev', name: 'Meera' },
  { email: 'kabir@north.dev', name: 'Kabir' },
];

const COMMUNITIES = [
  { slug: 'web-dev', name: 'Web Dev', description: 'Everything frontend, backend, and the stack in between.' },
  { slug: 'placement-prep', name: 'Placement Prep', description: 'DSA, OAs, interviews, and landing the offer.' },
  { slug: 'react', name: 'React', description: 'Hooks, server components, and the React ecosystem.' },
];

const minsAgo = (m: number) => new Date(Date.now() - m * 60_000);

async function main() {
  console.log('Seeding huddle...');

  const users: Record<string, string> = {};
  for (const u of USERS) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name },
      create: { email: u.email, name: u.name },
    });
    users[u.email] = user.id;
  }
  const me = users[DEMO_EMAIL];
  // Resolve a short name ("aanya") or a full email to a user id.
  const uid = (n: string) => users[n.includes('@') ? n : `${n}@north.dev`];

  // Wipe + recreate huddle demo content (does not touch users / skill data)
  await prisma.message.deleteMany();
  await prisma.threadParticipant.deleteMany();
  await prisma.thread.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.community.deleteMany();

  // Communities + memberships
  const comm: Record<string, string> = {};
  for (const c of COMMUNITIES) {
    const created = await prisma.community.create({ data: c });
    comm[c.slug] = created.id;
    for (const email of Object.keys(users)) {
      await prisma.membership.create({
        data: { user: { connect: { id: uid(email) } }, community: { connect: { id: created.id } } },
      });
    }
  }

  // Posts + comments
  const seedPost = async (
    slug: string,
    authorEmail: string,
    title: string,
    body: string,
    score: number,
    ageMin: number,
    comments: { authorEmail: string; body: string; score: number; replies?: { authorEmail: string; body: string }[] }[],
  ) => {
    const post = await prisma.post.create({
      data: {
        community: { connect: { id: comm[slug] } },
        author: { connect: { id: uid(authorEmail) } },
        title,
        body,
        score,
        createdAt: minsAgo(ageMin),
      },
    });
    for (const c of comments) {
      const parent = await prisma.comment.create({
        data: {
          post: { connect: { id: post.id } },
          author: { connect: { id: uid(c.authorEmail) } },
          body: c.body,
          score: c.score,
          createdAt: minsAgo(ageMin - 5),
        },
      });
      for (const r of c.replies ?? []) {
        await prisma.comment.create({
          data: {
            post: { connect: { id: post.id } },
            parent: { connect: { id: parent.id } },
            author: { connect: { id: uid(r.authorEmail) } },
            body: r.body,
            createdAt: minsAgo(ageMin - 10),
          },
        });
      }
    }
    return post;
  };

  const p1 = await seedPost(
    'web-dev', 'aanya',
    'Server Components finally clicked for me',
    "Spent a week confused, then realized: they run on the server, never ship JS, and you compose client islands inside them. Here's the mental model that fixed it.",
    42, 180,
    [
      { authorEmail: 'rohan', body: 'The "islands inside server trees" framing is exactly it. Saved me too.', score: 12,
        replies: [{ authorEmail: 'aanya', body: 'Right? Wish the docs led with that.' }] },
      { authorEmail: 'kabir', body: 'Does this mean useEffect is basically dead for data fetching?', score: 5 },
    ],
  );
  await seedPost(
    'placement-prep', 'rohan',
    'Cleared the Google OA — here is what actually mattered',
    'Two medium DP problems and one graph. Speed > cleverness. Practice the patterns, not 500 random problems.',
    88, 320,
    [
      { authorEmail: 'meera', body: 'Which DP patterns specifically? Knapsack family?', score: 8 },
      { authorEmail: 'kabir', body: 'Congrats! How long did you grind?', score: 3 },
    ],
  );
  await seedPost(
    'react', 'meera',
    'useOptimistic is underrated',
    'Built a like button that feels instant with zero spinner code. Rollback on error is automatic. Try it.',
    27, 90,
    [{ authorEmail: 'aanya', body: 'Pairs beautifully with server actions.', score: 6 }],
  );

  // A couple of "my" votes so the UI shows voted state
  await prisma.vote.create({ data: { user: { connect: { id: me } }, post: { connect: { id: p1.id } }, value: 1 } });

  // Chat threads
  const dm = async (otherEmail: string, msgs: { from: string; body: string; ago: number }[]) => {
    const thread = await prisma.thread.create({
      data: { type: 'DM', lastMessageAt: minsAgo(msgs[msgs.length - 1].ago) },
    });
    await prisma.threadParticipant.create({ data: { thread: { connect: { id: thread.id } }, user: { connect: { id: me } } } });
    await prisma.threadParticipant.create({
      data: { thread: { connect: { id: thread.id } }, user: { connect: { id: uid(otherEmail) } } },
    });
    let last = '';
    for (const m of msgs) {
      const msg = await prisma.message.create({
        data: { thread: { connect: { id: thread.id } }, sender: { connect: { id: uid(m.from) } }, body: m.body, createdAt: minsAgo(m.ago) },
      });
      last = msg.id;
    }
    return { thread, last };
  };

  const d1 = await dm('aanya', [
    { from: 'aanya@north.dev', body: 'hey! did you finish the app router node?', ago: 90 },
    { from: DEMO_EMAIL, body: 'almost — stuck on server actions tbh', ago: 88 },
    { from: 'aanya@north.dev', body: 'oh those are easy once it clicks. revalidatePath is the trick', ago: 86 },
    { from: DEMO_EMAIL, body: 'sending you my code in a sec', ago: 60 },
    { from: 'aanya@north.dev', body: 'go for it', ago: 58 },
  ]);
  await prisma.threadParticipant.updateMany({
    where: { threadId: d1.thread.id, userId: me },
    data: { lastReadMessageId: d1.last },
  });

  await dm('rohan', [
    { from: 'rohan@north.dev', body: 'you in for the hackathon this weekend?', ago: 200 },
    { from: DEMO_EMAIL, body: 'depends — what track?', ago: 198 },
    { from: 'rohan@north.dev', body: 'ai tools. we need a frontend person', ago: 30 },
  ]);

  // Group
  const group = await prisma.thread.create({
    data: { type: 'GROUP', name: 'frontend crew', lastMessageAt: minsAgo(12) },
  });
  for (const email of [DEMO_EMAIL, 'aanya@north.dev', 'rohan@north.dev', 'meera@north.dev']) {
    await prisma.threadParticipant.create({
      data: { thread: { connect: { id: group.id } }, user: { connect: { id: uid(email) } } },
    });
  }
  const groupMsgs = [
    { from: 'meera@north.dev', body: 'who is reviewing the PR?', ago: 40 },
    { from: 'aanya@north.dev', body: 'on it', ago: 38 },
    { from: DEMO_EMAIL, body: 'i can take the css fixes', ago: 20 },
    { from: 'rohan@north.dev', body: 'shipped it', ago: 12 },
  ];
  for (const m of groupMsgs) {
    await prisma.message.create({
      data: { thread: { connect: { id: group.id } }, sender: { connect: { id: uid(m.from) } }, body: m.body, createdAt: minsAgo(m.ago) },
    });
  }

  console.log(`  ✓ ${USERS.length} users, ${COMMUNITIES.length} communities, 3 posts, 3 threads`);
  console.log('Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
