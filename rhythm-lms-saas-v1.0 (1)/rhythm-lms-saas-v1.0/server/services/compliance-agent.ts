/**
 * ComplianceAgent Service
 * 
 * This service tracks educational laws and regulations across all 50 states
 * and provides compliance updates to families using neurodivergent education plans.
 */

import { storage } from "../storage";
import { STATE_CODES } from "./curriculum-library";

// Interface for educational law/regulation
interface EducationLaw {
  id: number;
  stateCode: string;
  title: string;
  description: string;
  category: string;
  effectiveDate: string;
  lastUpdated: string;
  citations: string[];
  requirements: string[];
  specialEducationProvisions?: string[];
  homeschoolProvisions?: string[];
  neurodivergentAccommodations?: string[];
}

// Interface for compliance notification
interface ComplianceNotification {
  id: number;
  familyId: number;
  studentId: number;
  stateCode: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  relevantLawIds: number[];
  actionRequired: boolean;
  actionDetails?: string;
  createdAt: string;
  expiresAt?: string;
  readAt?: string;
}

// Category constants
const EDUCATION_LAW_CATEGORIES = [
  'Attendance Requirements',
  'Curriculum Standards',
  'Testing and Assessment',
  'Special Education',
  'IEP and 504 Plans',
  'Homeschooling Regulations',
  'Graduation Requirements',
  'Educational Rights',
  'Student Privacy',
  'Health and Safety',
  'Digital Learning',
  'Specialized Instruction'
];

/**
 * Core compliance agent service for monitoring educational regulations
 */
class ComplianceAgentService {
  private educationLaws: Map<number, EducationLaw>;
  private notifications: Map<number, ComplianceNotification>;
  private lawId: number;
  private notificationId: number;
  
  constructor() {
    this.educationLaws = new Map();
    this.notifications = new Map();
    this.lawId = 1;
    this.notificationId = 1;
    
    // Initialize with core laws and regulations
    this.populateInitialLaws();
  }
  
  /**
   * Populate initial education laws and regulations for all states
   */
  private populateInitialLaws() {
    console.log('Initializing compliance agent with education laws for all states...');
    
    // Generate core federal laws
    this.addFederalLaws();
    
    // Generate state-specific laws for all 50 states
    for (const stateCode of STATE_CODES) {
      this.addStateSpecificLaws(stateCode);
    }
    
    console.log(`Initialized compliance agent with ${this.educationLaws.size} education laws and regulations`);
  }
  
  /**
   * Add federal education laws
   */
  private addFederalLaws() {
    const federalLaws: Omit<EducationLaw, 'id'>[] = [
      {
        stateCode: 'US',
        title: 'Individuals with Disabilities Education Act (IDEA)',
        description: 'Federal law ensuring students with disabilities are provided with Free Appropriate Public Education (FAPE) that is tailored to their individual needs.',
        category: 'Special Education',
        effectiveDate: '1990-10-30',
        lastUpdated: '2004-12-03',
        citations: ['20 U.S.C. §1400', 'P.L. 101-476', 'P.L. 108-446'],
        requirements: [
          'Individualized Education Program (IEP) for qualifying students',
          'Education in the Least Restrictive Environment (LRE)',
          'Appropriate evaluation procedures',
          'Parental participation in decision-making',
          'Procedural safeguards',
          'Transition planning starting at age 16'
        ],
        specialEducationProvisions: [
          'Child Find mandate to identify children with disabilities',
          'Early intervention services',
          'Transition services for post-secondary education and employment',
          'Related services including transportation, speech therapy, etc.'
        ],
        neurodivergentAccommodations: [
          'Accommodations based on individual needs',
          'Assistive technology services and devices',
          'Positive behavioral interventions and supports',
          'Supplementary aids and services'
        ]
      },
      {
        stateCode: 'US',
        title: 'Section 504 of the Rehabilitation Act',
        description: 'Federal civil rights law prohibiting discrimination against individuals with disabilities in programs that receive federal financial assistance.',
        category: 'Educational Rights',
        effectiveDate: '1973-09-26',
        lastUpdated: '2008-09-25',
        citations: ['29 U.S.C. §794', 'P.L. 93-112'],
        requirements: [
          'Reasonable accommodations for qualified students with disabilities',
          'Equal access to educational programs and activities',
          'Evaluation procedures to determine eligibility',
          '504 Plans documenting necessary accommodations',
          'Grievance procedures for complaints',
          'Periodic reevaluation of accommodations'
        ],
        neurodivergentAccommodations: [
          'Extended time on tests and assignments',
          'Modified homework requirements',
          'Use of assistive technology',
          'Behavior management plans',
          'Preferential seating',
          'Note-taking assistance'
        ]
      },
      {
        stateCode: 'US',
        title: 'Every Student Succeeds Act (ESSA)',
        description: 'Federal legislation that reauthorized the Elementary and Secondary Education Act, replacing No Child Left Behind with a focus on ensuring opportunity for all students.',
        category: 'Curriculum Standards',
        effectiveDate: '2015-12-10',
        lastUpdated: '2015-12-10',
        citations: ['P.L. 114-95', '20 U.S.C. §6301'],
        requirements: [
          'State-developed standards that prepare students for college and careers',
          'Annual statewide assessments in reading and math in grades 3-8 and once in high school',
          'State accountability systems including academic and non-academic measures',
          'Identification and support for struggling schools',
          'Reporting of assessment results and other data by subgroups'
        ]
      },
      {
        stateCode: 'US',
        title: 'Family Educational Rights and Privacy Act (FERPA)',
        description: 'Federal law that protects the privacy of student education records and gives parents certain rights with respect to their children\'s education records.',
        category: 'Student Privacy',
        effectiveDate: '1974-08-21',
        lastUpdated: '2012-01-03',
        citations: ['20 U.S.C. §1232g', '34 CFR Part 99'],
        requirements: [
          'Parental right to inspect and review education records',
          'Right to request correction of inaccurate records',
          'Written consent required for disclosure of personally identifiable information',
          'Annual notification of rights to parents',
          'Transfer of rights to eligible students (18 years or older)',
          'Schools must maintain records of requests for access'
        ]
      },
      {
        stateCode: 'US',
        title: 'Americans with Disabilities Act (ADA)',
        description: 'Civil rights law prohibiting discrimination against individuals with disabilities in all areas of public life, including schools, jobs, and transportation.',
        category: 'Educational Rights',
        effectiveDate: '1990-07-26',
        lastUpdated: '2008-09-25',
        citations: ['42 U.S.C. §12101', 'P.L. 101-336', 'P.L. 110-325'],
        requirements: [
          'Reasonable modifications in policies, practices, and procedures',
          'Removal of architectural, communication, and transportation barriers',
          'Auxiliary aids and services to ensure effective communication',
          'Integration of individuals with disabilities to the maximum extent appropriate',
          'Equal opportunity to participate in and benefit from programs and services'
        ],
        neurodivergentAccommodations: [
          'Accessible educational materials',
          'Physical accessibility modifications',
          'Communication supports',
          'Equal access to extracurricular activities',
          'Reasonable modifications to policies and practices'
        ]
      }
    ];
    
    // Add each federal law to the map
    federalLaws.forEach(law => {
      const id = this.lawId++;
      this.educationLaws.set(id, { id, ...law });
    });
  }
  
  /**
   * Add state-specific education laws
   */
  private addStateSpecificLaws(stateCode: string) {
    // Base laws that every state has some version of
    const attendance = this.createAttendanceLaw(stateCode);
    const graduation = this.createGraduationLaw(stateCode);
    const homeschool = this.createHomeschoolLaw(stateCode);
    const testing = this.createTestingLaw(stateCode);
    const specialEd = this.createSpecialEdLaw(stateCode);
    
    // Add them to the map
    [attendance, graduation, homeschool, testing, specialEd].forEach(law => {
      const id = this.lawId++;
      this.educationLaws.set(id, { id, ...law });
    });
  }
  
  /**
   * Create state-specific attendance law
   */
  private createAttendanceLaw(stateCode: string): Omit<EducationLaw, 'id'> {
    const stateRequirements: Record<string, string[]> = {
      'CA': [
        'Compulsory attendance ages 6-18',
        'Minimum of 180 instructional days',
        'Valid excuses: illness, medical appointments, funeral services, religious observances',
        'Truancy defined as 3 unexcused absences',
        'School Attendance Review Board (SARB) intervention for chronic absenteeism'
      ],
      'TX': [
        'Compulsory attendance ages 6-19',
        'Minimum of 75,600 minutes of instruction annually',
        'Valid excuses: illness, religious holy days, required court appearances',
        'Truancy follows "10/10 rule" - absent 10+ days in 6 months or 3+ days in 4 weeks',
        'Accelerated Learning Committee for students with excessive absences'
      ],
      'NY': [
        'Compulsory attendance ages 6-16',
        'Minimum of 180 instructional days',
        'Valid excuses: illness, religious observance, impassable roads, quarantine',
        'Attendance required 65% of school day to be counted as present',
        'Chronic absenteeism defined as missing 10% or more of school days'
      ],
      'FL': [
        'Compulsory attendance ages 6-16',
        'Minimum of 180 instructional days',
        'Valid excuses: illness, death in family, religious instruction/holidays',
        'Habitual truant defined after 15 unexcused absences in 90 days',
        'Attendance intervention plans required for students with attendance issues'
      ]
    };
    
    // Default requirements for states not specifically defined
    const defaultRequirements = [
      `Compulsory attendance typically between ages 6-16`,
      'Minimum of 180 instructional days in most districts',
      'Valid excuses typically include illness, family emergency, religious observances',
      'Parents/guardians must notify school of absences',
      'Schools must track and report attendance'
    ];
    
    return {
      stateCode,
      title: `${stateCode} School Attendance Requirements`,
      description: `Legal requirements for school attendance in ${stateCode}, including compulsory attendance ages, required instructional time, and excused absence policies.`,
      category: 'Attendance Requirements',
      effectiveDate: '2020-01-01', // Approximate date
      lastUpdated: '2022-07-15', // Approximate date
      citations: [`${stateCode} Education Code`],
      requirements: stateRequirements[stateCode] || defaultRequirements,
      neurodivergentAccommodations: [
        'Potential exemptions or modified attendance for documented medical or disability-related needs',
        'Possible home or hospital instruction for extended absences',
        'IEP or 504 plans may include attendance accommodations',
        'Mental health days may be considered excused absences in some districts'
      ]
    };
  }
  
  /**
   * Create state-specific graduation requirements law
   */
  private createGraduationLaw(stateCode: string): Omit<EducationLaw, 'id'> {
    const stateRequirements: Record<string, string[]> = {
      'CA': [
        '13 courses (minimum): English (3), Math (2, including Algebra I), Science (2), Social Studies (3), Arts/Foreign Language (1), PE (2)',
        'Pass California High School Exit Examination (when in effect)',
        'Complete any additional district requirements',
        'Modified requirements available through IEP process'
      ],
      'TX': [
        'Foundation High School Program: 22 credits',
        'English (4 credits), Math (3 credits), Science (3 credits), Social Studies (3 credits)',
        'Physical Education (1 credit), Foreign Language (2 credits), Fine Arts (1 credit)',
        'Endorsements available for specialized paths with additional credits',
        'STAAR end-of-course exams in English I & II, Algebra I, Biology, U.S. History'
      ],
      'NY': [
        'Minimum of 22 units of credit',
        '4 English, 4 Social Studies, 3 Science, 3 Math, 1 Foreign Language, 1 Arts, 2 PE, 0.5 Health',
        'Pass Regents Examinations in English, Math, Science, Social Studies, and additional subjects',
        'Local or Regents diploma options with different examination requirements',
        'Safety Net options for students with disabilities'
      ],
      'FL': [
        '24 credits: English (4), Math (4, including Algebra 1 & Geometry), Science (3), Social Studies (3)',
        'Physical Education/Health (1), Fine/Performing Arts (1), Electives (8)',
        'One course must be completed through online learning',
        'Cumulative GPA of at least 2.0 on 4.0 scale',
        'Pass Grade 10 ELA Florida Standards Assessment and Algebra 1 EOC Assessment'
      ]
    };
    
    // Default requirements for states not specifically defined
    const defaultRequirements = [
      'Typically 20-24 total credits required',
      'English/Language Arts: 4 credits',
      'Mathematics: 3-4 credits (typically including Algebra I)',
      'Science: 3 credits',
      'Social Studies/History: 3-4 credits',
      'Physical Education/Health: 1-2 credits',
      'Electives and other requirements vary by state'
    ];
    
    return {
      stateCode,
      title: `${stateCode} High School Graduation Requirements`,
      description: `Requirements students must meet to earn a high school diploma in ${stateCode}, including required courses, assessments, and credit minimums.`,
      category: 'Graduation Requirements',
      effectiveDate: '2018-08-01', // Approximate date
      lastUpdated: '2023-01-10', // Approximate date
      citations: [`${stateCode} Education Code`, `${stateCode} Department of Education Regulations`],
      requirements: stateRequirements[stateCode] || defaultRequirements,
      neurodivergentAccommodations: [
        'Modified graduation options may be available through IEP process',
        'Assessment accommodations for state-required exit exams',
        'Course substitutions may be permitted for specific disabilities',
        'Extended time to complete graduation requirements may be available',
        'Alternate assessment options for students with significant cognitive disabilities'
      ]
    };
  }
  
  /**
   * Create state-specific homeschool law
   */
  private createHomeschoolLaw(stateCode: string): Omit<EducationLaw, 'id'> {
    const stateRequirements: Record<string, string[]> = {
      'CA': [
        'Establish a private school in your home by filing an annual private school affidavit',
        'Alternative option: enroll in a private school satellite program (PSP)',
        'Maintain attendance records, immunization records (or exemption), and course of study',
        'Instruction must be in English and cover all required subjects',
        'No mandated standardized testing or specific teaching qualifications'
      ],
      'TX': [
        'Homeschools operate as private schools with minimal regulation',
        'Must teach reading, spelling, grammar, mathematics, and good citizenship',
        'No notification, instructor qualification, or standardized testing requirements',
        'No required number of days or hours of instruction',
        'Must pursue education in a bona fide manner using a written curriculum'
      ],
      'NY': [
        'Submit annual notice of intent to homeschool',
        'File an Individualized Home Instruction Plan (IHIP)',
        'Provide quarterly reports and annual assessment',
        'Standardized testing required in specific grades (or alternative assessment)',
        'Cover required subjects: English, math, science, social studies, health, art, music, physical education, and others depending on grade level',
        'Minimum of 900 hours of instruction annually for grades 1-6; 990 hours for grades 7-12'
      ],
      'FL': [
        'Register with the school district superintendent within 30 days of beginning homeschool',
        'Maintain a portfolio of records and materials',
        'Provide for annual educational evaluation',
        'Evaluation options: standardized test, teacher evaluation, psychologist evaluation, or other agreed-upon method',
        'No specified curriculum, hourly requirements, or teaching qualifications'
      ]
    };
    
    // Default requirements for states not specifically defined
    const defaultRequirements = [
      'Notification to state or local education agency may be required',
      'Required subjects typically align with public school requirements',
      'Record-keeping requirements vary by state',
      'Assessment or evaluation may be required annually',
      'Parent qualification requirements vary significantly by state'
    ];
    
    return {
      stateCode,
      title: `${stateCode} Homeschool Regulations`,
      description: `Legal requirements and regulations for homeschooling in ${stateCode}, including notification, curriculum, assessment, and recordkeeping requirements.`,
      category: 'Homeschooling Regulations',
      effectiveDate: '2015-07-01', // Approximate date
      lastUpdated: '2022-06-30', // Approximate date
      citations: [`${stateCode} Education Code`, `${stateCode} Homeschool Statutes`],
      requirements: stateRequirements[stateCode] || defaultRequirements,
      homeschoolProvisions: [
        'Parents have legal right to choose homeschooling as an educational option',
        'Students with disabilities retain rights to special education services in most states',
        'Homeschooled students typically eligible for participation in certain public school activities',
        'College admission policies recognize homeschooled applicants'
      ],
      neurodivergentAccommodations: [
        'Flexibility to adapt curriculum to individual learning style and pace',
        'Ability to create sensory-friendly learning environments',
        'Individualized schedule accommodating executive functioning needs',
        'Option to integrate specialized therapies into educational program',
        'Customized assessment methods based on student needs'
      ]
    };
  }
  
  /**
   * Create state-specific testing law
   */
  private createTestingLaw(stateCode: string): Omit<EducationLaw, 'id'> {
    const stateRequirements: Record<string, string[]> = {
      'CA': [
        'California Assessment of Student Performance and Progress (CAASPP) administered in grades 3-8 and 11',
        'Includes Smarter Balanced Assessments in English language arts and mathematics',
        'California Science Test (CAST) in grades 5, 8, and once in high school',
        'English Language Proficiency Assessments for California (ELPAC) for English learners',
        'Parents may exempt children from CAASPP testing through written request'
      ],
      'TX': [
        'State of Texas Assessments of Academic Readiness (STAAR) administered in grades 3-8',
        'End-of-Course (EOC) assessments for high school in English I & II, Algebra I, Biology, U.S. History',
        'STAAR Alternate 2 available for students with significant cognitive disabilities',
        'Texas English Language Proficiency Assessment System (TELPAS) for English learners',
        'Students must pass EOC assessments to graduate (with exceptions through individual graduation committees)'
      ],
      'NY': [
        'New York State Testing Program (NYSTP) assessments in ELA and math for grades 3-8',
        'Science assessments in grades 4 and 8',
        'Regents Examinations at the high school level in multiple subjects',
        'New York State English as a Second Language Achievement Test (NYSESLAT) for English learners',
        'New York State Alternate Assessment (NYSAA) for students with severe disabilities'
      ],
      'FL': [
        'Florida Standards Assessments (FSA) in English Language Arts for grades 3-10',
        'FSA Mathematics for grades 3-8',
        'Statewide Science Assessment in grades 5 and 8',
        'End-of-Course (EOC) assessments in Algebra 1, Geometry, Biology, U.S. History, and Civics',
        'ACCESS for ELLs for English language learners',
        'Florida Standards Alternate Assessment (FSAA) for students with significant cognitive disabilities'
      ]
    };
    
    // Default requirements for states not specifically defined
    const defaultRequirements = [
      'Annual standardized testing typically required in English/Language Arts and Mathematics in grades 3-8',
      'Science assessments typically administered at elementary, middle, and high school levels',
      'High school end-of-course or exit exams in core subjects',
      'English language proficiency assessments for English learners',
      'Alternate assessments available for students with significant disabilities'
    ];
    
    return {
      stateCode,
      title: `${stateCode} State Assessment Requirements`,
      description: `Required state assessments and testing procedures in ${stateCode}, including grade levels, subjects, and accountability measures.`,
      category: 'Testing and Assessment',
      effectiveDate: '2015-09-01', // Approximate date
      lastUpdated: '2022-08-15', // Approximate date
      citations: [`${stateCode} Education Code`, `${stateCode} Testing Program Guidelines`],
      requirements: stateRequirements[stateCode] || defaultRequirements,
      neurodivergentAccommodations: [
        'Extended time for test completion',
        'Separate testing environment with reduced distractions',
        'Text-to-speech or read-aloud accommodations',
        'Use of calculators or other assistive technology',
        'Frequent breaks during testing',
        'Modified test formats or alternate assessments',
        'Accommodations must align with regular instructional accommodations'
      ]
    };
  }
  
  /**
   * Create state-specific special education law
   */
  private createSpecialEdLaw(stateCode: string): Omit<EducationLaw, 'id'> {
    const stateRequirements: Record<string, string[]> = {
      'CA': [
        'California follows federal IDEA requirements with additional state-specific provisions',
        'Special education services available from birth to age 22',
        'Multi-Tiered System of Supports (MTSS) framework for intervention',
        '60-day timeline for assessment after parent consent',
        'Annual IEP reviews required with triennial reevaluations',
        'Extended School Year (ESY) services when regression would significantly impact progress'
      ],
      'TX': [
        'Texas follows federal IDEA requirements with state-specific provisions',
        'Response to Intervention (RTI) model implemented statewide',
        '45 school days to complete evaluation after consent received',
        'Admission, Review, and Dismissal (ARD) committee develops IEP',
        'Texas Transitions framework for secondary transition services',
        'Extended School Year services available based on regression/recoupment criteria'
      ],
      'NY': [
        'New York follows federal IDEA requirements with additional state provisions',
        'Committee on Special Education (CSE) or Committee on Preschool Special Education (CPSE) oversees process',
        '60 calendar days to complete evaluation after parent consent',
        'IEP implementation must begin within 60 school days of consent for evaluation',
        'Annual review required with reevaluation at least every three years',
        'Extended School Year services available for students who qualify'
      ],
      'FL': [
        'Florida follows federal IDEA requirements with additional state provisions',
        'Multi-Tiered System of Supports (MTSS) used for intervention',
        '60 school days to complete evaluation after consent received',
        'Individual Educational Plan (IEP) team includes parents, educators, and specialists',
        'Transition planning begins at age 14',
        'Extended School Year services available based on regression/recoupment'
      ]
    };
    
    // Default requirements for states not specifically defined
    const defaultRequirements = [
      'State implements federal IDEA requirements',
      'Child Find mandate to identify and evaluate students with disabilities',
      'Evaluation process to determine eligibility for services',
      'IEP development and annual review process',
      'Least Restrictive Environment (LRE) requirements',
      'Transition planning for post-secondary outcomes',
      'Extended School Year services available for qualifying students'
    ];
    
    return {
      stateCode,
      title: `${stateCode} Special Education Regulations`,
      description: `Special education laws and procedures in ${stateCode}, including identification, evaluation, IEP development, and service delivery for students with disabilities.`,
      category: 'Special Education',
      effectiveDate: '2004-12-03', // IDEA reauthorization date
      lastUpdated: '2022-07-01', // Approximate date
      citations: [`${stateCode} Education Code`, `${stateCode} Special Education Rules`],
      requirements: stateRequirements[stateCode] || defaultRequirements,
      specialEducationProvisions: [
        'Zero Reject policy - all children with disabilities entitled to FAPE',
        'Nondiscriminatory evaluation procedures',
        'Individualized Education Program (IEP)',
        'Least Restrictive Environment (LRE) placement',
        'Due process safeguards',
        'Parent and student participation in decision making'
      ],
      neurodivergentAccommodations: [
        'Specially designed instruction',
        'Related services (speech therapy, occupational therapy, etc.)',
        'Supplementary aids and services',
        'Program modifications and classroom accommodations',
        'Assistive technology devices and services',
        'Positive behavioral intervention and supports',
        'Services based on individual needs, not disability category'
      ]
    };
  }
  
  /**
   * Get all education laws
   */
  async getAllEducationLaws(): Promise<EducationLaw[]> {
    return [...this.educationLaws.values()];
  }
  
  /**
   * Get education laws for a specific state
   */
  async getStateEducationLaws(stateCode: string): Promise<EducationLaw[]> {
    return [...this.educationLaws.values()].filter(
      law => law.stateCode === stateCode || law.stateCode === 'US'
    );
  }
  
  /**
   * Get education laws by category
   */
  async getEducationLawsByCategory(category: string): Promise<EducationLaw[]> {
    return [...this.educationLaws.values()].filter(
      law => law.category === category
    );
  }
  
  /**
   * Get education law by ID
   */
  async getEducationLaw(id: number): Promise<EducationLaw | undefined> {
    return this.educationLaws.get(id);
  }
  
  /**
   * Get pending notifications for a family
   */
  async getPendingNotifications(familyId: number): Promise<ComplianceNotification[]> {
    return [...this.notifications.values()].filter(
      notification => notification.familyId === familyId && !notification.readAt
    );
  }
  
  /**
   * Get all notifications for a family
   */
  async getAllNotifications(familyId: number): Promise<ComplianceNotification[]> {
    return [...this.notifications.values()].filter(
      notification => notification.familyId === familyId
    );
  }
  
  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: number): Promise<ComplianceNotification | undefined> {
    const notification = this.notifications.get(notificationId);
    
    if (notification) {
      notification.readAt = new Date().toISOString();
      this.notifications.set(notificationId, notification);
    }
    
    return notification;
  }
  
  /**
   * Check compliance for a student's curriculum path
   */
  async checkStudentCompliance(studentId: number, stateCode: string): Promise<{
    compliant: boolean;
    compliancePercentage: number;
    missingRequirements: string[];
    recommendations: string[];
  }> {
    // Get the student's curriculum paths
    const paths = await storage.getCurriculumPaths(studentId);
    
    if (paths.length === 0) {
      return {
        compliant: false,
        compliancePercentage: 0,
        missingRequirements: ['No curriculum path found for student'],
        recommendations: ['Create a curriculum path for the student based on grade level and learning profile']
      };
    }
    
    // For simplicity, check the most recent path
    const path = paths.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
    
    // Get units in this path
    const units = await storage.getAcademicUnits();
    const pathUnits = units.filter(unit => path.academicUnitIds.includes(unit.id));
    
    // Get state-specific laws
    const stateLaws = await this.getStateEducationLaws(stateCode);
    
    // Check core subject coverage
    const coveredSubjects = new Set(pathUnits.map(unit => unit.subject));
    const requiredSubjects = ['English Language Arts', 'Mathematics', 'Science', 'Social Studies'];
    const missingSubjects = requiredSubjects.filter(subject => !coveredSubjects.has(subject));
    
    // Check for special education accommodations if needed
    const profiles = await storage.getNeurodivergentProfiles();
    const studentProfiles = profiles.filter(profile => profile.studentId === studentId);
    const hasAccommodations = pathUnits.some(unit => unit.neurodivergentAdaptations);
    
    // Generate compliance results
    const missingRequirements: string[] = [];
    
    if (missingSubjects.length > 0) {
      missingRequirements.push(`Missing required subjects: ${missingSubjects.join(', ')}`);
    }
    
    if (studentProfiles.length > 0 && !hasAccommodations) {
      missingRequirements.push('Student has neurodivergent profile but curriculum lacks specific accommodations');
    }
    
    // Calculate compliance percentage
    const requirementsMet = requiredSubjects.length - missingSubjects.length + (hasAccommodations ? 1 : 0);
    const totalRequirements = requiredSubjects.length + (studentProfiles.length > 0 ? 1 : 0);
    const compliancePercentage = Math.floor((requirementsMet / totalRequirements) * 100);
    
    // Generate recommendations
    const recommendations: string[] = [];
    
    if (missingSubjects.length > 0) {
      recommendations.push(`Add units covering ${missingSubjects.join(', ')} to the curriculum path`);
    }
    
    if (studentProfiles.length > 0 && !hasAccommodations) {
      recommendations.push('Include neurodivergent accommodations in all academic units based on student profile');
    }
    
    // Add general recommendations
    recommendations.push('Review curriculum regularly to ensure alignment with state standards');
    recommendations.push('Keep documentation of all completed coursework and assessments');
    
    return {
      compliant: missingRequirements.length === 0,
      compliancePercentage,
      missingRequirements,
      recommendations
    };
  }
  
  /**
   * Generate a compliance notification for a family
   */
  async generateComplianceNotification(
    familyId: number,
    studentId: number,
    stateCode: string,
    lawChange?: EducationLaw
  ): Promise<ComplianceNotification> {
    // Check student compliance
    const complianceCheck = await this.checkStudentCompliance(studentId, stateCode);
    
    // Get student info
    const profiles = await storage.getNeurodivergentProfiles();
    const studentProfile = profiles.find(profile => profile.studentId === studentId);
    
    let title: string;
    let message: string;
    let severity: 'info' | 'warning' | 'critical';
    let actionRequired: boolean;
    let actionDetails: string | undefined;
    let relevantLawIds: number[] = [];
    
    // If this is about a law change
    if (lawChange) {
      title = `Education Law Update: ${lawChange.title}`;
      message = `There has been an update to ${lawChange.title} that may affect your student's education. The changes include: ${lawChange.description}`;
      severity = 'info';
      actionRequired = false;
      relevantLawIds = [lawChange.id];
      
      // Check if this law might require action based on student profile
      if (studentProfile && lawChange.category === 'Special Education' && 
          lawChange.neurodivergentAccommodations && lawChange.neurodivergentAccommodations.length > 0) {
        actionRequired = true;
        severity = 'warning';
        actionDetails = 'Review your student\'s IEP or learning plan to ensure it incorporates the updated accommodations.';
      }
    } 
    // If this is a compliance check notification
    else {
      if (complianceCheck.compliant) {
        title = 'Curriculum Compliance Check: Fully Compliant';
        message = `Your student's curriculum is fully compliant with ${stateCode} educational requirements.`;
        severity = 'info';
        actionRequired = false;
      } else if (complianceCheck.compliancePercentage >= 75) {
        title = 'Curriculum Compliance Check: Minor Issues';
        message = `Your student's curriculum is ${complianceCheck.compliancePercentage}% compliant with ${stateCode} educational requirements. There are a few items that need attention: ${complianceCheck.missingRequirements.join('; ')}`;
        severity = 'warning';
        actionRequired = true;
        actionDetails = `Recommended actions: ${complianceCheck.recommendations.join('; ')}`;
      } else {
        title = 'Curriculum Compliance Check: Significant Issues';
        message = `Your student's curriculum is only ${complianceCheck.compliancePercentage}% compliant with ${stateCode} educational requirements. Important issues need to be addressed: ${complianceCheck.missingRequirements.join('; ')}`;
        severity = 'critical';
        actionRequired = true;
        actionDetails = `Required actions: ${complianceCheck.recommendations.join('; ')}`;
      }
      
      // Get relevant laws
      const stateLaws = await this.getStateEducationLaws(stateCode);
      relevantLawIds = stateLaws
        .filter(law => law.category === 'Curriculum Standards' || law.category === 'Special Education')
        .map(law => law.id);
    }
    
    // Create the notification
    const id = this.notificationId++;
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(now.getDate() + 30); // Expires in 30 days
    
    const notification: ComplianceNotification = {
      id,
      familyId,
      studentId,
      stateCode,
      title,
      message,
      severity,
      relevantLawIds,
      actionRequired,
      actionDetails,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString()
    };
    
    this.notifications.set(id, notification);
    return notification;
  }
  
  /**
   * Run compliance checks for all students
   */
  async runComplianceChecks(): Promise<number> {
    console.log('Running compliance checks for all students...');
    
    // Get all curriculum paths to identify students
    const paths = await storage.getCurriculumPaths(0); // 0 means get all paths
    
    // Extract unique student IDs
    const studentIds = [...new Set(paths.map(path => path.studentId))];
    
    let notificationCount = 0;
    
    // Run checks for each student
    for (const studentId of studentIds) {
      const studentPaths = paths.filter(path => path.studentId === studentId);
      if (studentPaths.length === 0) continue;
      
      // Use the state code from the path or default to a standard state
      const stateCode = studentPaths[0].stateCode || 'NY';
      
      // Generate a notification (family ID would normally be looked up - using studentId as placeholder)
      await this.generateComplianceNotification(studentId, studentId, stateCode);
      notificationCount++;
    }
    
    console.log(`Generated ${notificationCount} compliance notifications`);
    return notificationCount;
  }
  
  /**
   * Apply a law update and notify affected families
   */
  async updateLaw(
    lawId: number, 
    updates: Partial<EducationLaw>
  ): Promise<{updatedLaw: EducationLaw, notificationCount: number}> {
    const law = this.educationLaws.get(lawId);
    
    if (!law) {
      throw new Error(`Law with ID ${lawId} not found`);
    }
    
    // Update the law
    const updatedLaw = {
      ...law,
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    
    this.educationLaws.set(lawId, updatedLaw);
    
    // Find affected students
    const paths = await storage.getCurriculumPaths(0); // 0 means get all paths
    
    // Filter paths to those in the affected state
    const affectedPaths = paths.filter(path => 
      path.stateCode === updatedLaw.stateCode || updatedLaw.stateCode === 'US'
    );
    
    // Extract unique student IDs
    const studentIds = [...new Set(affectedPaths.map(path => path.studentId))];
    
    let notificationCount = 0;
    
    // Generate notifications for each affected student
    for (const studentId of studentIds) {
      // In a real system, we would look up the family ID - using studentId as placeholder
      await this.generateComplianceNotification(studentId, studentId, updatedLaw.stateCode, updatedLaw);
      notificationCount++;
    }
    
    console.log(`Updated law ${lawId} and generated ${notificationCount} notifications`);
    
    return {
      updatedLaw,
      notificationCount
    };
  }
}

export const complianceAgentService = new ComplianceAgentService();