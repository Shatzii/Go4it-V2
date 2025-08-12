'use client'

import StandaloneNavigation from '@/app/schools/standalone-navigation'

export default function LawSchoolPage() {
  return (
    <StandaloneNavigation 
      schoolPath="/schools/law"
      schoolName="Future Legal Professionals"
      schoolTheme="Law School & Justice Academy"
      gradeLevel="Pre-Law & Law School"
      themeColor="from-blue-600 to-indigo-600"
    />
  )
}