'use client';

import React, { useState } from 'react';

export default function TeacherCoursesPage() {
  const [title, setTitle] = useState('New Course Title');
  const [slug, setSlug] = useState('new-course');
  const [markdown, setMarkdown] = useState('# New Course\n\nCourse content here.');
  const [message, setMessage] = useState('');

  async function createCourse(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/academy/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, markdown }),
      });
      const data = await res.json();
      if (res.ok) setMessage('Course created');
      else setMessage(data.error || 'Create failed');
    } catch (err) {
      console.error(err);
      setMessage('Create failed');
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Teacher — Create Course</h1>
      <form onSubmit={createCourse}>
        <div className="mb-2">
          <label className="block">Title</label>
          <input className="border p-2 w-full" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="mb-2">
          <label className="block">Slug</label>
          <input className="border p-2 w-full" value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>
        <div className="mb-2">
          <label className="block">Markdown</label>
          <textarea rows={10} className="border p-2 w-full" value={markdown} onChange={(e) => setMarkdown(e.target.value)} />
        </div>
        <button className="bg-green-600 text-white px-3 py-1" type="submit">Create Course</button>
      </form>
      {message && <div className="mt-3">{message}</div>}
    </div>
  );
}
