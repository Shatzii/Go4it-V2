export default function SchoolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

// Generate static params for all school routes
export async function generateStaticParams() {
  const schools = [
    'primary',
    'secondary', 
    'language',
    'law',
    'sports',
    'go4it-sports-academy'
  ]
  
  return schools.map((school) => ({
    school: school,
  }))
}