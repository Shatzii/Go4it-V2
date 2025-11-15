"use client"

import React from 'react'

export default function EnrollButton({ course }: { course: { slug: string; title: string; price: number } }) {
  const [loading, setLoading] = React.useState(false)

  async function handleEnroll() {
    try {
      setLoading(true)
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: course.slug, price: course.price, title: course.title })
      })
      const data = await res.json()
      if (data?.url) {
        window.location.href = data.url
      } else {
        alert('Failed to create checkout session')
        setLoading(false)
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('enroll error', err)
      alert('Error creating checkout session')
      setLoading(false)
    }
  }

  return (
    <button onClick={handleEnroll} disabled={loading} className="oer-enroll-btn">
      {loading ? 'Processing…' : `Enroll — $${course.price}`}
    </button>
  )
}
