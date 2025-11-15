import fs from 'fs/promises';
import path from 'path';

const COURSES_DIR = path.join(process.cwd(), 'content', 'courses');
const DATA_DIR = path.join(process.cwd(), 'data');
const ENROLLMENTS_FILE = path.join(DATA_DIR, 'enrollments.json');

async function ensureDirs() {
  await fs.mkdir(COURSES_DIR, { recursive: true });
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(ENROLLMENTS_FILE);
  } catch (e) {
    await fs.writeFile(ENROLLMENTS_FILE, '[]');
  }
}

// If FEATURE_STUDIO_DB is enabled and server storage is available, proxy to that implementation
let useDb = false;
let storageImpl: any = null;
if (process.env.FEATURE_STUDIO_DB === 'true') {
  try {
    // dynamically import server storage which uses Drizzle
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // Note: dynamic import is used to avoid import-time failures when DB is not configured
    // and to keep file-backed storage as default.
    // Import path relative to project root
    // This may throw if server/storage cannot be imported in certain runtimes
    // so we guard with try/catch.
    // @ts-ignore
    const s = require('../server/storage');
    if (s && s.storage) {
      storageImpl = s.storage;
      useDb = true;
    }
  } catch (err) {
    // ignore — fall back to file storage
    useDb = false;
  }
}
export type CourseMeta = {
  title: string;
  slug: string;
  excerpt?: string;
};

export async function listCourses(): Promise<CourseMeta[]> {
  if (useDb && storageImpl?.listCourses) {
    const rows = await storageImpl.listCourses();
    return rows.map((r: any) => ({ title: r.title || r.name, slug: String(r.id), excerpt: r.description || '' }));
  }

  await ensureDirs();
  const files = await fs.readdir(COURSES_DIR);
  const courses: CourseMeta[] = [];

  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const slug = file.replace(/\.md$/, '');
    const full = path.join(COURSES_DIR, file);
    const content = await fs.readFile(full, 'utf-8');
    const lines = content.split(/\r?\n/);
    let title = slug;
    let excerpt = '';
    if (lines.length) {
      const first = lines.find((l) => l.trim().length > 0) || '';
      if (first.startsWith('#')) title = first.replace(/^#+\s*/, '').trim();
      excerpt = lines.slice(1, 6).join(' ').slice(0, 200).trim();
    }
    courses.push({ title, slug, excerpt });
  }

  return courses;
}

export async function readCourse(slug: string): Promise<{ title: string; content: string } | null> {
  if (useDb && storageImpl?.getCourseById) {
    try {
      const row = await storageImpl.getCourseById(slug);
      if (!row) return null;
      return { title: row.title || row.name || `Course ${slug}`, content: row.description || '' };
    } catch (err) {
      // fall back to file storage
    }
  }

  await ensureDirs();
  const file = path.join(COURSES_DIR, `${slug}.md`);
  try {
    const content = await fs.readFile(file, 'utf-8');
    const lines = content.split(/\r?\n/);
    const titleLine = lines.find((l) => l.trim().length > 0) || slug;
    const title = titleLine.startsWith('#') ? titleLine.replace(/^#+\s*/, '').trim() : titleLine;
    return { title, content };
  } catch (e) {
    return null;
  }
}

export async function createCourse(slug: string, markdown: string) {
  if (useDb && storageImpl?.createCourse) {
    // some storage implementations might accept structured data; try best-effort
    try {
      await storageImpl.createCourse({ slug, title: slug, description: markdown });
      return;
    } catch (err) {
      // fall through to file storage
    }
  }

  await ensureDirs();
  const file = path.join(COURSES_DIR, `${slug}.md`);
  await fs.writeFile(file, markdown, 'utf-8');
}

export type Enrollment = {
  id: string;
  courseSlug: string;
  studentName: string;
  studentEmail: string;
  timestamp: string;
  garScore?: number | null;
  metadata?: Record<string, any> | null;
};

export async function listEnrollments(): Promise<Enrollment[]> {
  if (useDb && storageImpl?.listEnrollmentsByStudent) {
    // Use database storage to return enrollments if available
    try {
      const rows = await storageImpl.listEnrollmentsByStudent('');
      // normalize shape
      return (rows || []).map((r: any) => ({
        id: String(r.id || `${Date.now()}-${Math.random()}`),
        courseSlug: String(r.courseId || r.course?.id || r.courseSlug || ''),
        studentName: r.studentName || '',
        studentEmail: r.studentEmail || r.student?.email || '',
        timestamp: (r.createdAt || new Date()).toString(),
      }));
    } catch (err) {
      // fall back to file storage
    }
  }

  await ensureDirs();
  const raw = await fs.readFile(ENROLLMENTS_FILE, 'utf-8');
  try {
    return JSON.parse(raw) as Enrollment[];
  } catch (e) {
    return [];
  }
}

export async function addEnrollment(e: Omit<Enrollment, 'id' | 'timestamp'>) {
  if (useDb && storageImpl?.enrollStudentInCourse) {
    try {
      const row = await storageImpl.enrollStudentInCourse(e.studentEmail || e.studentName, e.courseSlug);
      return {
        id: String(row.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
        courseSlug: String(row.courseId || e.courseSlug),
        studentName: e.studentName,
        studentEmail: e.studentEmail,
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      // fall back
    }
  }

  await ensureDirs();
  const enrollments = await listEnrollments();
  const entry: Enrollment = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    ...e,
    garScore: (e as any).garScore ?? null,
    metadata: (e as any).metadata ?? null,
  };
  enrollments.push(entry);
  await fs.writeFile(ENROLLMENTS_FILE, JSON.stringify(enrollments, null, 2), 'utf-8');
  return entry;
}

export async function ensureSampleCourse() {
  await ensureDirs();
  const sample = path.join(COURSES_DIR, 'sample-course.md');
  try {
    await fs.access(sample);
  } catch (e) {
    const content = `# Sample Algebra I Course\n\nWelcome to Sample Algebra I.\n\n## Lesson 1 - Introduction to Equations\n\nA quadratic equation is...\n`;
    await fs.writeFile(sample, content, 'utf-8');
  }
}

export default { listCourses, readCourse, createCourse, listEnrollments, addEnrollment, ensureSampleCourse };
