import React from 'react';
import { useParams } from 'wouter';
import AcademicProgressDashboard from '@/components/academics/AcademicProgressDashboard';
import { PageHeader } from '@/components/ui/page-header';

/**
 * Academic Progress Page
 * 
 * This page displays the academic progress dashboard for a student athlete.
 * The dashboard provides a comprehensive breakdown of academic performance with
 * NCAA eligibility tracking and specialized insights for neurodivergent students.
 */
const AcademicProgressPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  
  return (
    <div className="container mx-auto pt-8 pb-16">
      <PageHeader
        title="Academic Progress"
        description="Comprehensive academic performance tracking with NCAA eligibility insights"
      />
      
      <div className="my-8">
        <AcademicProgressDashboard />
      </div>
    </div>
  );
};

export default AcademicProgressPage;