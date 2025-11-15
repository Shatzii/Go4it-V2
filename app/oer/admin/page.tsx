import Manage from './Manage'
import { requireRole } from '@/lib/auth'

export default async function AdminPage() {
  try {
    await requireRole('teacher')
  } catch (err) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Access denied</h2>
        <p>You must be signed in with a teacher or admin role to view this page.</p>
      </div>
    )
  }

  return (
    <div>
      <Manage />
    </div>
  )
}
