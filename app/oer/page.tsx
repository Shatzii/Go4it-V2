import fs from 'fs'
import path from 'path'
import EnrollButton from './EnrollButton'

export default function OerPage() {
  const catalogPath = path.join(process.cwd(), 'content', 'oer', 'catalog.json')
  let courses = [] as any[]
  try {
    const raw = fs.readFileSync(catalogPath, 'utf8')
    courses = JSON.parse(raw)
  } catch (err) {
    // server render error — show empty list
    courses = []
  }

  return (
    <main style={{ maxWidth: 960, margin: '32px auto', padding: '0 16px' }}>
      <h1>Open Educational Resources (OER) · Courses</h1>
      <p>Browse available self-study classes and short courses. Click enroll to purchase access.</p>

      <div style={{ display: 'grid', gap: 18 }}>
        {courses.map((c) => (
          <article key={c.id} style={{ padding: 18, border: '1px solid #e6e6e6', borderRadius: 8 }}>
            <h2 style={{ margin: '0 0 6px' }}>{c.title}</h2>
            <p style={{ margin: '0 0 8px', color: '#555' }}>{c.summary}</p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <EnrollButton course={c} />
              <a href={`/${c.contentPath.replace('content/', '')}`} target="_blank" rel="noreferrer">Preview</a>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
