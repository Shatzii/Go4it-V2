"use client";

import { useState } from "react";
import { StarPathPanel, StarPathBadge, StarPathSection } from "@/components/starpath";
import { BookOpen, CheckCircle, Lock, Play, Download, Brain, Globe, Trophy } from "lucide-react";

interface LessonModule {
  week: number;
  title: string;
  description: string;
  courses: {
    courseId: string;
    courseName: string;
    topics: string[];
    activities: string[];
    assessments: string[];
    hdrPillars: string[];
  }[];
  culturalFocus: string;
  germanVocab: string[];
  completed: boolean;
  locked: boolean;
}

export default function WeeklyLessonModules() {
  const [selectedWeek, setSelectedWeek] = useState(1);

  const modules: LessonModule[] = [
    {
      week: 1,
      title: "Foundations & Orientation",
      description: "Introduction to StarPath methodology, baseline assessments, and German immersion launch",
      courses: [
        {
          courseId: "SCI-401",
          courseName: "Human Performance Biology",
          topics: [
            "Introduction to exercise physiology",
            "Baseline fitness testing protocols",
            "Heart rate zones and training adaptation",
            "Body systems overview"
          ],
          activities: [
            "Complete fitness assessment battery",
            "Record baseline metrics (HR, speed, power)",
            "Create performance tracking spreadsheet",
            "Daily HRV and wellness monitoring"
          ],
          assessments: [
            "Fitness test data analysis",
            "Training zones calculation",
            "Weekly reflection: How does my body respond to training?"
          ],
          hdrPillars: ["Physical Development", "Mental & Emotional"]
        },
        {
          courseId: "LANG-401",
          courseName: "German Language Immersion",
          topics: [
            "Survival German basics",
            "Numbers, colors, common objects",
            "Training commands and body parts",
            "Greetings and daily routines"
          ],
          activities: [
            "Morning routine in German (daily)",
            "Label training equipment in German",
            "Practice 10 commands during warmup",
            "Record yourself using 5 new phrases"
          ],
          assessments: [
            "Vocabulary quiz: 50 essential words",
            "Video demonstration: Following German commands",
            "Cultural journal: First impressions of Vienna"
          ],
          hdrPillars: ["Cultural & Experiential", "Social Skills"]
        },
        {
          courseId: "HDR-401",
          courseName: "Human Development Record",
          topics: [
            "6 Pillars introduction",
            "Daily documentation systems",
            "Notion portfolio setup",
            "Goal setting frameworks"
          ],
          activities: [
            "Create HDR dashboard in Notion",
            "Set SMART goals for each pillar",
            "Complete daily wellness check-ins",
            "Weekly growth reflection video"
          ],
          assessments: [
            "Portfolio setup completion",
            "Week 1 synthesis: My starting point",
            "Goal clarity assessment"
          ],
          hdrPillars: ["All 6 Pillars - Foundation"]
        }
      ],
      culturalFocus: "Vienna city orientation, public transport navigation, Austrian sports culture introduction",
      germanVocab: ["Guten Morgen", "Danke", "Bitte", "Training", "Fußball", "Laufen", "Springen", "Werfen", "Schnell", "Langsam"],
      completed: true,
      locked: false
    },
    {
      week: 2,
      title: "Growth Mindset & Adaptation",
      description: "Deep dive into neuroplasticity, habit formation, and performance psychology",
      courses: [
        {
          courseId: "SCI-401",
          courseName: "Human Performance Biology",
          topics: [
            "Neuroplasticity and motor learning",
            "Muscle fiber types and adaptation",
            "Energy systems (ATP-CP, Glycolytic, Oxidative)",
            "Recovery science fundamentals"
          ],
          activities: [
            "Track energy levels across training types",
            "Analyze recovery patterns (sleep, HRV)",
            "Experiment: Different warmup protocols",
            "Film technical skills for baseline"
          ],
          assessments: [
            "Energy systems concept map",
            "Recovery strategy implementation plan",
            "Quiz: Muscle physiology basics"
          ],
          hdrPillars: ["Physical Development", "Mental Resilience"]
        },
        {
          courseId: "ELA-401",
          courseName: "Athletic Literature",
          topics: [
            "'Mindset' by Carol Dweck - Chapters 1-3",
            "Fixed vs. Growth mindset in sports",
            "Reflective writing techniques",
            "Evidence-based reading strategies"
          ],
          activities: [
            "Read Mindset Chapters 1-3",
            "Daily journal: Growth moments in training",
            "Group discussion: Real examples from our week",
            "Create growth mindset poster (bilingual)"
          ],
          assessments: [
            "Reading comprehension quiz",
            "Essay: How growth mindset applies to my sport",
            "Peer discussion participation grade"
          ],
          hdrPillars: ["Mental & Emotional", "Leadership"]
        },
        {
          courseId: "MATH-401",
          courseName: "Performance Analytics",
          topics: [
            "Ratios and percentages in training",
            "Basic statistics: Mean, median, mode",
            "Data visualization (charts, graphs)",
            "Performance trend analysis"
          ],
          activities: [
            "Calculate training load ratios",
            "Create performance graphs in Excel/Sheets",
            "Analyze 2 weeks of HRV data",
            "Compare sprint times: Calculate improvement %"
          ],
          assessments: [
            "Data analysis project: My performance trends",
            "Math skills quiz: Ratios and statistics",
            "Presentation: What my data tells me"
          ],
          hdrPillars: ["Technical & Mechanical", "Career Planning"]
        }
      ],
      culturalFocus: "Austrian coffee culture, local markets exploration, European training philosophy",
      germanVocab: ["Kraft", "Ausdauer", "Geschwindigkeit", "Übung", "Pause", "Wasser", "Essen", "Schlafen", "Müde", "Stark"],
      completed: false,
      locked: false
    },
    {
      week: 3,
      title: "Nutrition Science & Recovery",
      description: "Biochemistry of performance fueling, hydration science, and sleep optimization",
      courses: [
        {
          courseId: "HE-401",
          courseName: "Nutrition & Recovery Science",
          topics: [
            "Macronutrients: Carbs, protein, fats",
            "Hydration and electrolyte balance",
            "Pre/post workout nutrition timing",
            "Sleep cycles and recovery hormones"
          ],
          activities: [
            "Track all meals with photos (German labels)",
            "Calculate macros for training days",
            "Hydration experiment: Performance impact",
            "Sleep tracking with analysis"
          ],
          assessments: [
            "Nutrition journal with cultural notes",
            "Macro calculation project",
            "Sleep optimization implementation plan"
          ],
          hdrPillars: ["Nutrition & Recovery", "Physical Development"]
        },
        {
          courseId: "SOC-401",
          courseName: "Global Sports Sociology",
          topics: [
            "European vs American food culture",
            "Social eating customs",
            "Sports nutrition across cultures",
            "Community and family meal traditions"
          ],
          activities: [
            "Interview: Local athlete about nutrition habits",
            "Compare Austrian vs home country meals",
            "Visit farmers market - document in German",
            "Cook traditional Austrian recovery meal"
          ],
          assessments: [
            "Cultural comparison essay",
            "Market visit photo journal with vocabulary",
            "Presentation: Food culture insights"
          ],
          hdrPillars: ["Cultural & Experiential", "Life Skills"]
        }
      ],
      culturalFocus: "Viennese food markets, traditional Austrian cuisine, sustainable eating practices",
      germanVocab: ["Frühstück", "Mittagessen", "Abendessen", "Hunger", "Durst", "Gesund", "Gemüse", "Obst", "Fleisch", "Brot"],
      completed: false,
      locked: false
    },
    {
      week: 4,
      title: "Leadership & Team Dynamics",
      description: "Communication skills, emotional intelligence, and group performance psychology",
      courses: [
        {
          courseId: "SOC-401",
          courseName: "Global Sports Sociology",
          topics: [
            "Leadership styles in sports",
            "Team roles and dynamics",
            "Cultural dimensions of leadership",
            "Communication across languages"
          ],
          activities: [
            "Lead one training session warmup",
            "Observe European coach communication styles",
            "Group project: Team building activity design",
            "Interview teammate (in German if possible)"
          ],
          assessments: [
            "Leadership style self-assessment",
            "Team dynamics analysis essay",
            "Peer feedback on leadership moment"
          ],
          hdrPillars: ["Social Skills", "Leadership", "Emotional Intelligence"]
        },
        {
          courseId: "ELA-401",
          courseName: "Athletic Literature",
          topics: [
            "'7 Habits of Highly Effective Teens' - Habits 1-3",
            "Proactive language and mindset",
            "Goal-setting with purpose",
            "Priority management for athletes"
          ],
          activities: [
            "Read Habits 1-3",
            "Create personal mission statement",
            "Time audit: Where do my hours go?",
            "Implement one habit this week"
          ],
          assessments: [
            "Reading comprehension quiz",
            "Personal mission statement presentation",
            "Weekly habit implementation journal"
          ],
          hdrPillars: ["Mental & Emotional", "Life Skills"]
        }
      ],
      culturalFocus: "Austrian leadership in sports, team vs individual culture, multilingual communication",
      germanVocab: ["Team", "Kapitän", "Zusammen", "Helfen", "Sprechen", "Zuhören", "Führen", "Folgen", "Respekt", "Vertrauen"],
      completed: false,
      locked: true
    }
  ];

  const selectedModule = modules.find(m => m.week === selectedWeek);

  return (
    <div className="space-y-6">
      <StarPathSection
        title="12-Week Curriculum Journey"
        subtitle="Structured learning modules integrating academics, athletics, and cultural immersion"
        centered
      />

      {/* Week Selector */}
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
        {modules.map((module) => (
          <button
            key={module.week}
            onClick={() => !module.locked && setSelectedWeek(module.week)}
            disabled={module.locked}
            className={`relative p-3 rounded-lg font-bold transition ${
              selectedWeek === module.week
                ? "bg-amber-500 text-black"
                : module.locked
                ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                : module.completed
                ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                : "bg-white/10 text-white border border-amber-500/30 hover:bg-white/20"
            }`}
          >
            {module.locked && (
              <Lock className="w-3 h-3 absolute top-1 right-1" />
            )}
            {module.completed && !module.locked && (
              <CheckCircle className="w-3 h-3 absolute top-1 right-1" />
            )}
            <div className="text-xs mb-1">Week</div>
            <div className="text-lg">{module.week}</div>
          </button>
        ))}
      </div>

      {selectedModule && (
        <>
          {/* Week Overview */}
          <StarPathPanel>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold text-amber-400 mb-2">
                  Week {selectedModule.week}: {selectedModule.title}
                </h2>
                <p className="text-gray-300 text-lg">{selectedModule.description}</p>
              </div>
              <div className="flex gap-2">
                {selectedModule.completed && <StarPathBadge variant="green">Completed</StarPathBadge>}
                {selectedModule.locked && <StarPathBadge variant="warm">Locked</StarPathBadge>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-black/30 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-5 h-5 text-amber-500" />
                  <h4 className="font-bold text-white">Cultural Focus</h4>
                </div>
                <p className="text-gray-300 text-sm">{selectedModule.culturalFocus}</p>
              </div>

              <div className="bg-black/30 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-5 h-5 text-blue-400" />
                  <h4 className="font-bold text-white">German Vocabulary (Week {selectedModule.week})</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedModule.germanVocab.map((word, i) => (
                    <span key={i} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </StarPathPanel>

          {/* Course Details */}
          {selectedModule.courses.map((course, index) => (
            <StarPathPanel key={index}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-amber-500" />
                  <div>
                    <h3 className="text-xl font-bold text-white">{course.courseId}</h3>
                    <p className="text-gray-400">{course.courseName}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {course.hdrPillars.map((pillar, i) => (
                    <StarPathBadge key={i} variant="blue">{pillar}</StarPathBadge>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-bold text-amber-400 mb-2 text-sm uppercase">Learning Topics</h4>
                  <ul className="space-y-1">
                    {course.topics.map((topic, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-green-400 mb-2 text-sm uppercase">Activities & Evidence</h4>
                  <ul className="space-y-1">
                    {course.activities.map((activity, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                        <Play className="w-3 h-3 text-green-400 mt-1" />
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-purple-400 mb-2 text-sm uppercase">Assessments</h4>
                  <ul className="space-y-1">
                    {course.assessments.map((assessment, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                        <Trophy className="w-3 h-3 text-purple-400 mt-1" />
                        {assessment}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {!selectedModule.locked && (
                <div className="mt-6 pt-4 border-t border-amber-500/20 flex gap-3">
                  <a
                    href={`/curriculum/quiz?course=${course.courseId}&week=${selectedModule.week}`}
                    className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-2 rounded-lg font-bold transition inline-flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Start Assessment
                  </a>
                  <button className="bg-white/10 hover:bg-white/20 border border-amber-500/30 text-white px-6 py-2 rounded-lg font-bold transition inline-flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Materials
                  </button>
                </div>
              )}
            </StarPathPanel>
          ))}

          {/* Daily Schedule */}
          <StarPathPanel>
            <h3 className="text-2xl font-bold text-white mb-4">Daily Schedule - Week {selectedModule.week}</h3>
            <div className="space-y-2 font-mono text-sm">
              <div className="grid grid-cols-[120px_1fr] gap-4 p-3 bg-black/30 rounded border border-amber-500/20">
                <span className="text-amber-500 font-bold">07:00–08:00</span>
                <span className="text-gray-300">German Immersion Launch • Morning routine • Vocabulary focus</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4 p-3 bg-black/30 rounded border border-blue-500/20">
                <span className="text-blue-400 font-bold">08:00–10:00</span>
                <span className="text-gray-300">Performance Science in German • Training with German commands</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4 p-3 bg-black/30 rounded border border-green-500/20">
                <span className="text-green-400 font-bold">10:00–12:00</span>
                <span className="text-gray-300">English Literacy & Leadership • Book discussions • Reflection writing</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4 p-3 bg-black/30 rounded border border-purple-500/20">
                <span className="text-purple-400 font-bold">13:00–16:00</span>
                <span className="text-gray-300">Cultural Laboratory • {selectedModule.culturalFocus}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4 p-3 bg-black/30 rounded border border-amber-500/20">
                <span className="text-amber-500 font-bold">16:00–18:00</span>
                <span className="text-gray-300">Technical Training Integration • Bilingual tactical instruction</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4 p-3 bg-black/30 rounded border border-blue-500/20">
                <span className="text-blue-400 font-bold">18:00–20:00</span>
                <span className="text-gray-300">Portfolio Synthesis • Evidence organization • Daily reflection</span>
              </div>
            </div>
          </StarPathPanel>
        </>
      )}
    </div>
  );
}
