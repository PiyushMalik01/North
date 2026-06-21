export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  grade?: string; // e.g. 'A', 'B+' or undefined if ongoing
  progress: number; // 0-100
}

export interface ClassSlot {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
  time: string;
  subject: string;
  room: string;
}

export interface PYQ {
  id: string;
  subject: string;
  year: number;
  title: string;
}

export interface MockExam {
  id: string;
  subject: string;
  questions: number;
  durationMin: number;
}

// Grade → GPA points (10-point scale)
export const gradePoints: Record<string, number> = {
  'A+': 10,
  A: 10,
  'A-': 9,
  'B+': 9,
  B: 8,
  'B-': 7,
  'C+': 7,
  C: 6,
  D: 5,
  F: 0,
};

export const subjects: Subject[] = [
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    code: 'CS301',
    credits: 4,
    grade: 'A',
    progress: 100,
  },
  {
    id: 'dbms',
    name: 'Database Management Systems',
    code: 'CS302',
    credits: 3,
    grade: 'B+',
    progress: 100,
  },
  {
    id: 'os',
    name: 'Operating Systems',
    code: 'CS303',
    credits: 4,
    grade: 'A-',
    progress: 100,
  },
  {
    id: 'cn',
    name: 'Computer Networks',
    code: 'CS304',
    credits: 3,
    grade: undefined,
    progress: 68,
  },
  {
    id: 'maths',
    name: 'Discrete Mathematics',
    code: 'MA201',
    credits: 3,
    grade: undefined,
    progress: 51,
  },
  {
    id: 'web',
    name: 'Web Technologies',
    code: 'CS305',
    credits: 3,
    grade: undefined,
    progress: 82,
  },
];

export const timetable: ClassSlot[] = [
  // Monday
  { day: 'Mon', time: '09:00', subject: 'DSA', room: 'LH-101' },
  { day: 'Mon', time: '11:00', subject: 'OS', room: 'LH-203' },
  { day: 'Mon', time: '14:00', subject: 'Web', room: 'Lab-2' },
  // Tuesday
  { day: 'Tue', time: '10:00', subject: 'DBMS', room: 'LH-104' },
  { day: 'Tue', time: '12:00', subject: 'Maths', room: 'LH-301' },
  { day: 'Tue', time: '15:00', subject: 'CN', room: 'LH-202' },
  // Wednesday
  { day: 'Wed', time: '09:00', subject: 'OS', room: 'LH-203' },
  { day: 'Wed', time: '11:00', subject: 'DSA', room: 'Lab-1' },
  { day: 'Wed', time: '14:00', subject: 'DBMS', room: 'LH-104' },
  // Thursday
  { day: 'Thu', time: '10:00', subject: 'CN', room: 'LH-202' },
  { day: 'Thu', time: '12:00', subject: 'Web', room: 'Lab-2' },
  { day: 'Thu', time: '15:00', subject: 'Maths', room: 'LH-301' },
  // Friday
  { day: 'Fri', time: '09:00', subject: 'DSA', room: 'LH-101' },
  { day: 'Fri', time: '11:00', subject: 'CN', room: 'LH-202' },
  { day: 'Fri', time: '14:00', subject: 'OS', room: 'LH-203' },
];

export const pyqs: PYQ[] = [
  { id: 'pyq-1', subject: 'DSA', year: 2024, title: 'End Semester Examination 2024' },
  { id: 'pyq-2', subject: 'DBMS', year: 2024, title: 'End Semester Examination 2024' },
  { id: 'pyq-3', subject: 'OS', year: 2023, title: 'End Semester Examination 2023' },
  { id: 'pyq-4', subject: 'CN', year: 2024, title: 'Mid Semester Test 2024' },
  { id: 'pyq-5', subject: 'Maths', year: 2023, title: 'End Semester Examination 2023' },
  { id: 'pyq-6', subject: 'Web', year: 2024, title: 'Mid Semester Test 2024' },
];

export const mockExams: MockExam[] = [
  { id: 'mock-1', subject: 'DSA', questions: 30, durationMin: 60 },
  { id: 'mock-2', subject: 'DBMS', questions: 25, durationMin: 45 },
  { id: 'mock-3', subject: 'OS', questions: 30, durationMin: 60 },
  { id: 'mock-4', subject: 'CN', questions: 20, durationMin: 40 },
];
