import { redirect } from 'next/navigation'

// Redirect to the correct secondary school teacher dashboard
export default function StagePrepTeacherDashboard() {
  redirect('/schools/secondary/teacher-dashboard')
}