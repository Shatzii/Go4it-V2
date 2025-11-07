/**
 * Seed script for Studio curriculum
 * Populates 9th grade Unit 1 + sample daily studios
 * Run: npm run seed:studio
 */

import { db } from '../lib/db/index';
import { dailyStudios, studioRotations, curriculumUnits } from '../lib/db/schema/studio';

async function seedStudio() {
  console.log('🌱 Seeding Studio curriculum...');

  try {
    // Create Unit 1: Energy Systems & Performance
    const unit1 = await db.insert(curriculumUnits).values({
      id: 'G9-U1-Energy',
      gradeLevel: 9,
      title: 'Energy Systems & Athletic Performance',
      description: 'Explore how the body converts food into movement, integrating math, ELA, science, and social studies through the lens of sports performance.',
      durationWeeks: 6,
      essentialQuestion: 'How do biological, economic, and social systems work together to optimize athletic performance?',
      coreStandards: JSON.stringify([
        'HSN.Q.A.1', // Math: Units
        'RI.9-10.8', // ELA: Argument analysis
        'HS-LS1-7', // Science: Cellular respiration
        'D2.Eco.1.9-12', // Social Studies: Economics
      ]),
    }).returning();

    console.log('✓ Created curriculum unit:', unit1[0].id);

    // Create sample daily studio for Day 1
    const today = new Date().toISOString().split('T')[0];
    const studio = await db.insert(dailyStudios).values({
      date: today,
      gradeLevel: 9,
      unitId: 'G9-U1-Energy',
      theme: 'Energy Systems & Athletic Performance',
      drivingQuestion: 'How do our bodies convert food into movement, and why does it matter for training?',
      ncaaTasks: JSON.stringify([
        'Complete NCAA Eligibility Center profile (85% done)',
        'Upload Q1 transcript by Friday',
        'Review core course requirements with counselor',
      ]),
      athleteAIData: JSON.stringify({
        sleepScore: 7.5,
        readiness: 8.2,
        trainingLoad: 6.5,
      }),
    }).returning();

    console.log('✓ Created daily studio for:', studio[0].date);

    // Create rotations for each subject
    const rotations = [
      {
        dailyStudioId: studio[0].id,
        subject: 'math' as const,
        title: 'Rates & Proportional Reasoning',
        duration: 40,
        standards: JSON.stringify(['HSN.Q.A.1', '8.EE.B.5']),
        objectives: JSON.stringify([
          'Calculate VO2max and heart rate zones using proportional reasoning',
          'Graph training intensity vs. caloric expenditure',
        ]),
        activities: JSON.stringify([
          {
            type: 'mini_lesson',
            duration: 10,
            content: 'Introduction to rate calculations in sports performance',
            resources: ['Worksheet: VO2max calculator'],
          },
          {
            type: 'guided_practice',
            duration: 20,
            content: 'Calculate personal training zones using heart rate data',
          },
          {
            type: 'concept_check',
            duration: 10,
            content: 'Quick quiz: Proportional reasoning problems',
          },
        ]),
        exitTicketQuestion: 'Calculate your personal target heart rate zone for aerobic training',
        differentiation: JSON.stringify({
          scaffolded: 'Pre-filled template with partial calculations',
          extended: 'Compare multiple athletes and predict optimal training zones',
        }),
      },
      {
        dailyStudioId: studio[0].id,
        subject: 'ela' as const,
        title: 'Argument Analysis',
        duration: 40,
        standards: JSON.stringify(['RI.9-10.8', 'W.9-10.1']),
        objectives: JSON.stringify([
          'Analyze scientific claims about nutrition and performance',
          'Identify evidence-based vs. marketing claims',
        ]),
        activities: JSON.stringify([
          {
            type: 'close_reading',
            duration: 15,
            content: 'Read: "The Science of Sports Nutrition" (2-page article)',
          },
          {
            type: 'writing_workshop',
            duration: 20,
            content: 'Draft 1-paragraph argument: Do carbs boost performance?',
          },
          {
            type: 'peer_review',
            duration: 5,
            content: 'Exchange drafts and provide feedback',
          },
        ]),
        exitTicketQuestion: 'What makes a nutrition claim trustworthy?',
      },
      {
        dailyStudioId: studio[0].id,
        subject: 'science' as const,
        title: 'Cellular Respiration Lab',
        duration: 40,
        standards: JSON.stringify(['HS-LS1-7', 'HS-LS2-3']),
        objectives: JSON.stringify([
          'Model aerobic vs. anaerobic energy pathways',
          'Connect cellular processes to athletic performance',
        ]),
        activities: JSON.stringify([
          {
            type: 'lab_demo',
            duration: 20,
            content: 'Virtual lab: Measuring CO2 production in yeast fermentation',
          },
          {
            type: 'cer_writeup',
            duration: 15,
            content: 'CER: Why do sprinters rely on anaerobic systems?',
          },
          {
            type: 'exit_ticket',
            duration: 5,
            content: 'Diagram the ATP-PC system',
          },
        ]),
        exitTicketQuestion: 'Diagram and label the three energy systems',
      },
      {
        dailyStudioId: studio[0].id,
        subject: 'socialStudies' as const,
        title: 'Economics of Professional Sports',
        duration: 40,
        standards: JSON.stringify(['D2.Eco.1.9-12', 'D2.Eco.14.9-12']),
        objectives: JSON.stringify([
          'Analyze supply and demand in the sports labor market',
          'Compare athlete salaries across leagues and countries',
        ]),
        activities: JSON.stringify([
          {
            type: 'case_study',
            duration: 20,
            content: 'Case: Why are NBA salaries higher than WNBA?',
          },
          {
            type: 'learning_log',
            duration: 15,
            content: 'Reflection: How does scarcity affect athlete compensation?',
          },
          {
            type: 'exit_ticket',
            duration: 5,
            content: 'Define: opportunity cost in professional sports',
          },
        ]),
        exitTicketQuestion: 'Explain how scarcity affects professional athlete salaries',
      },
    ];

    await db.insert(studioRotations).values(rotations);
    console.log('✓ Created 4 rotations for each subject');

    console.log('\n✅ Studio seed complete!');
    console.log(`   Unit: ${unit1[0].title}`);
    console.log(`   Sample studio date: ${studio[0].date}`);
    console.log('\nNext steps:');
    console.log('  1. Set NEXT_PUBLIC_FEATURE_STUDIO=true in .env');
    console.log('  2. npm run dev');
    console.log('  3. Visit /dashboard/studio or /dashboard/studio?marketing=1');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

seedStudio()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
