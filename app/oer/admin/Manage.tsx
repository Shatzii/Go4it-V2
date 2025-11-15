"use client"

import React from 'react'

export default function Manage() {
  const [catalog, setCatalog] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [form, setForm] = React.useState({ id: '', slug: '', title: '', price: 0, summary: '', content: '' })

  React.useEffect(() => {
    fetch('/api/oer/manage')
      .then(r => r.json())
      .then(data => setCatalog(data || []))
      .catch(() => setCatalog([]))
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/oer/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      setCatalog(data || [])
      setForm({ id: '', slug: '', title: '', price: 0, summary: '', content: '' })
    } catch (err) {
      alert('Failed to save')
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>OER Admin</h2>
      <form onSubmit={handleCreate} style={{ display: 'grid', gap: 8, maxWidth: 700 }}>
        <input placeholder="id (unique)" value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} />
        <input placeholder="slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
        <input placeholder="title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input placeholder="price (USD)" type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
        <input placeholder="summary" value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} />
        <textarea placeholder="content (markdown)" rows={6} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
        <button type="submit" disabled={loading}>{loading ? 'Saving…' : 'Create / Update Course'}</button>
      </form>

      <h3 style={{ marginTop: 18 }}>Existing</h3>
      <ul>
        {catalog.map(c => (
          <li key={c.id}><strong>{c.title}</strong> — <em>{c.slug}</em> — ${c.price}</li>
        ))}
      </ul>
    </div>
  )
}
