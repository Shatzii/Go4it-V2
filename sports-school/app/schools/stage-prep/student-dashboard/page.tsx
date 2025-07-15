import { redirect } from 'next/navigation'

// Redirect to the correct secondary school student dashboard
export default function StagePrepStudentDashboard() {
  redirect('/schools/secondary/student-dashboard')
}