import type { BlogArticle, ResearchInsight } from '@/types';

export const blogArticles: BlogArticle[] = [
  {
    id: 'academic-industry-gap',
    title: 'The Structural Gap Between Academic Curriculum and Industry Skill Expectations',
    category: 'Industry Analysis',
    readTime: '8 min read',
    summary:
      'Higher education was built around structured semesters and standardized exams. But the pace of industry change has accelerated — curriculum revision cycles still operate on 3–5 year timelines while technology adoption compresses into months.',
    sections: [
      {
        heading: 'Direction Scarcity, Not Education Failure',
        content:
          'Students absorb concepts, pass exams, and complete coursework. What they lack is not knowledge itself, but a map of how that knowledge connects to professional application.',
        bullets: [
          'A CS student learns data structures and SQL independently — but doesn\'t see how they combine in production software.',
          'Knowledge exists in isolated modules. The connective tissue between them is missing.',
          'Students have access to instruction, but not structured pathways connecting learning to career outcomes.',
        ],
      },
      {
        heading: 'The Fragmentation Problem',
        content:
          'Abundant resources — online courses, bootcamps, certifications — paradoxically deepen confusion. Without structure, students learn reactively:',
        bullets: [
          'Studying what peers recommend instead of what their career path requires.',
          'Pursuing certifications based on social media trends, not skill gaps.',
          'Completing an intro Python course, an ML overview, a web dev bootcamp, and a cloud cert in one semester — breadth without depth.',
        ],
      },
      {
        heading: 'Structured Skill Navigation',
        content:
          'Students don\'t need more content. They need navigation — systems that answer:',
        bullets: [
          'Where do I currently stand in my skill development?',
          'What sequence of skills will move me toward my target role?',
          'How do I measure meaningful progress — beyond certificates?',
        ],
      },
      {
        heading: 'Conclusion',
        content:
          'The gap between academic preparation and industry expectation is real, but it\'s not a failure of intent. The missing layer is structured navigation that helps students bridge this gap with clarity, measurement, and purpose.',
      },
    ],
  },
  {
    id: 'student-psychology',
    title: 'Feeling Lost in College? It\'s Not Just You.',
    category: 'Student Psychology',
    readTime: '4 min read',
    summary:
      'Between the second and third year, a quiet confusion settles in. You\'re doing everything right — attending classes, clearing exams — and still not feeling like you\'re moving toward anything specific.',
    sections: [
      {
        heading: 'The Comparison Trap',
        content:
          'Social media amplifies the narrative that your peers have clarity of purpose that you lack.',
        bullets: [
          'The student posting about a Coursera certificate may be just as unsure as you. The difference is visibility, not clarity.',
          'Measuring your internal state against someone else\'s external presentation will always make the gap look wider.',
        ],
      },
      {
        heading: 'The Real Question',
        content:
          '"Do I have the right skills?" is the wrong question. There is no universal "right skills" — it depends entirely on direction. Without knowing where you\'re heading, any skill list feels simultaneously insufficient and overwhelming.',
      },
      {
        heading: 'What Actually Helps',
        content:
          'Not more motivation. Not another "top 10 skills" list. What helps is a structured way to:',
        bullets: [
          'Understand where you currently are in your skill development.',
          'Identify where you could go based on your interests and strengths.',
          'See a clear sequence of steps connecting the two.',
        ],
      },
    ],
  },
  {
    id: 'cgpa-limitations',
    title: 'Why CGPA Is Not Enough Anymore',
    category: 'Skill Intelligence',
    readTime: '6 min read',
    summary:
      'CGPA reliably measures academic consistency — understanding course material, performing under exam conditions, maintaining discipline across semesters. But is it sufficient as the primary measure of professional readiness? Increasingly, the answer is no.',
    sections: [
      {
        heading: 'The Limitations',
        content:
          'Traditional grading captures a narrow slice of capability:',
        bullets: [
          'Measures knowledge retention under controlled conditions — not the ability to apply knowledge in unstructured environments.',
          'A student who aces a database normalization exam may not be able to design a schema for a real app with ambiguous requirements.',
          'Aggregates diverse subject performance into one number — a 7.5 GPA obscures whether strength is in core subjects or electives.',
        ],
      },
      {
        heading: 'The Shift to Project-Based Evaluation',
        content:
          'In technology, product, and design roles, hiring has moved toward demonstrated work:',
        bullets: [
          'GitHub profiles and open-source contributions.',
          'Portfolio websites with project walkthroughs.',
          'Case study presentations and system design discussions.',
        ],
      },
      {
        heading: 'Toward Skill Progression Metrics',
        content:
          'What\'s missing is a system that tracks progression between academic performance and applied capability:',
        bullets: [
          'Track depth within specific skill areas — not averages across subjects.',
          'Update continuously as students complete projects and demonstrate competence.',
          'Compare current level against what target roles actually require.',
        ],
      },
    ],
  },
];

export const researchInsights: ResearchInsight[] = [
  {
    id: 'employability',
    title: 'Employability Is Stagnating Despite Higher Enrollment',
    stats: [
      { value: '~50%', label: 'National employability rate' },
      { value: '16–17%', label: 'Institutions with high placement conversion' },
    ],
    bullets: [
      'Curriculum revision cycles (3–5 years) lag technology cycles (months).',
      'Only a small percentage of institutions report full industry alignment.',
      'The issue is not student capability — it is structural lag.',
    ],
    northPosition: 'North operates as a dynamic layer over static curricula — mapping real-time industry skills to academic pathways.',
  },
  {
    id: 'directional-anxiety',
    title: 'Students Are Experiencing Directional Anxiety',
    stats: [
      { value: '2×', label: 'Families paying for degree + employability training' },
    ],
    bullets: [
      'Academic stress strongly correlates with employment anxiety.',
      'Peer comparison culture increases career insecurity.',
      'Students invest in parallel bootcamps due to lack of direction.',
    ],
    northPosition: 'North replaces ambiguity with measurable progression.',
  },
  {
    id: 'skill-based-hiring',
    title: 'Hiring Has Shifted to Skill-Based Evaluation',
    stats: [
      { value: '60–80%', label: 'Companies using skills-based hiring' },
      { value: '6×', label: 'Talent pool expansion with skills-first' },
    ],
    bullets: [
      'Employers cite "experience gap" as top concern.',
      'Recruiters increasingly evaluate GitHub, projects, simulations.',
      'Degrees are becoming entry tickets. Skills are becoming selection criteria.',
    ],
    northPosition: 'North builds verified skill portfolios — not just resumes.',
  },
  {
    id: 'evaluation-systems',
    title: 'Traditional Evaluation Systems Are Losing Relevance',
    stats: [
      { value: 'GPA ≠', label: 'Job readiness' },
    ],
    bullets: [
      'Grade inflation and relative grading reduce signal accuracy.',
      'Competency-based education is rising but poorly implemented.',
      'Industry increasingly distrusts grade-only filtering.',
    ],
    northPosition: 'North measures applied progression, not just exam performance.',
  },
];

export const sources = [
  { label: 'India Skills Report 2024 — Wheebox/CII', url: 'https://wheebox.com/india-skills-report' },
  { label: 'Employability & Talent Assessment Trends — NASSCOM', url: 'https://nasscom.in' },
  { label: 'National Education Policy 2020 — Ministry of Education', url: 'https://www.education.gov.in/nep' },
  { label: 'The Skills-Based Organization — Deloitte Insights', url: 'https://www2.deloitte.com/insights' },
  { label: 'Skills-First Hiring — LinkedIn Economic Graph', url: 'https://economicgraph.linkedin.com' },
  { label: 'Future of Jobs Report — World Economic Forum', url: 'https://www.weforum.org/reports/the-future-of-jobs-report' },
  { label: 'Outcome-Based Accreditation — NAAC', url: 'https://www.naac.gov.in' },
  { label: 'National Credit Framework — UGC', url: 'https://www.ugc.gov.in' },
];
