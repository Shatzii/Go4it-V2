'use client';

import StandaloneNavigation from '@/app/schools/standalone-navigation';

export default function SecondarySchoolPage() {
  return (
    <StandaloneNavigation
      schoolPath="/schools/secondary"
      schoolName="S.T.A.G.E Prep School"
      schoolTheme="Strategic Teaching for Academic Growth & Excellence (7-12)"
      gradeLevel="7th Grade - 12th Grade"
      themeColor="from-purple-500 to-pink-500"
    />
  );
}
