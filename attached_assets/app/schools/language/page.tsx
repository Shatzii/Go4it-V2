'use client'

import StandaloneNavigation from '@/app/schools/standalone-navigation'

export default function LanguageSchoolPage() {
  return (
    <StandaloneNavigation 
      schoolPath="/schools/language"
      schoolName="Global Language Academy"
      schoolTheme="Multilingual Immersion School"
      gradeLevel="All Ages & Levels"
      themeColor="from-green-500 to-teal-500"
    />
  )
}