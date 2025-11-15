import fs from 'fs/promises';
import path from 'path';
import EnrollButton from '../EnrollButton';

type Params = { params: { slug: string } };

export default async function Page({ params }: Params) {
  const slug = params.slug;
  // load catalog
  let catalog: any[] = [];
  try {
    const raw = await fs.readFile('content/oer/catalog.json', 'utf8');
    catalog = JSON.parse(raw);
  } catch (e) {
    catalog = [];
  }

  // try to find by slug or id
  const course = catalog.find(c => c.slug === slug || c.id === slug);
  if (!course) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Course not found</h2>
        <p>No course matches '{slug}'.</p>
      </div>
    );
  }

  let content = '';
  try {
    if (course.contentPath) {
      content = await fs.readFile(path.join(process.cwd(), course.contentPath), 'utf8');
    }
  } catch (e) {
    content = '';
  }

  // Basic markdown -> HTML: very small fallback (preserve paragraphs, headings)
  function renderMarkdown(md: string) {
    if (!md) return '<p></p>';
    // naive: escape then replace headings and line breaks
    const safe = md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const html = safe
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\n\n+/g, '</p><p>')
      .replace(/\n/g, '<br/>');
    return `<p>${html}</p>`;
  }

  return (
    <div style={{ maxWidth: 900, margin: '24px auto', padding: 18 }}>
      <h1>{course.title}</h1>
      <p style={{ color: '#666' }}>{course.summary}</p>

      <div style={{ margin: '18px 0' }}>
        {/* EnrollButton is a client component; pass slug from course.id if present */}
        {/* Ensure EnrollButton sees slug matching product mapping */}
        <EnrollButton course={{ slug: course.id || course.slug, title: course.title, price: course.price }} />
      </div>

      <div style={{ marginTop: 24 }} dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
    </div>
  );
}
