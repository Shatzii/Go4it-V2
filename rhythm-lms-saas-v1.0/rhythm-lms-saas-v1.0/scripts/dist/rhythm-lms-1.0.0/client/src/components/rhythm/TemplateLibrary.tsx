import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Learning style enums
const LEARNING_STYLES = [
  'ADHD-Friendly',
  'Autism-Friendly',
  'Dyslexia-Friendly',
  'Dyscalculia-Friendly',
  'Universal Design',
];

// Subject categories
const SUBJECTS = [
  'English Language Arts',
  'Mathematics', 
  'Science',
  'Social Studies',
  'History',
  'Art',
  'Music',
];

// Grade levels
const GRADE_LEVELS = [
  'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
];

// Template categories
const TEMPLATE_CATEGORIES = [
  'Lesson Plan',
  'Activity',
  'Assessment',
  'Visual Aid',
  'Interactive Exercise',
  'Story',
  'Game',
];

// Mock templates data - this would come from your backend in a real implementation
const TEMPLATES = [
  {
    id: 1,
    title: 'Focus Heroes Math Challenge',
    description: 'Interactive math exercises with movement breaks and visual timers',
    subject: 'Mathematics',
    gradeLevel: ['3', '4', '5'],
    category: 'Activity',
    learningStyles: ['ADHD-Friendly'],
    superheroTheme: 'Focus Force',
    previewImage: 'math-activity.png',
    rhythmCode: `@rhythm
@template: Activity
@title: "Focus Heroes Math Challenge"
@subject: "Mathematics"
@gradeLevel: "3-5"
@learningStyle: "ADHD-Friendly"
@superhero-theme: "Focus Force"

<hero-header>
  <title>Focus Heroes Math Challenge</title>
  <theme-color>purple</theme-color>
  <energy-meter />
</hero-header>

<section type="intro" timer="2min">
  <h1>Welcome Focus Heroes!</h1>
  <p>Today we'll use our focusing superpowers to solve math mysteries!</p>
  <img src="focus-hero.svg" alt="Focus Hero character" />
</section>

<section type="activity" timer="5min">
  <h2>Power Challenge 1: Multiplication Mastery</h2>
  <div class="problem-set" visual-support="true">
    {problems.map(p => <math-problem type="multiplication" difficulty="adaptive" />)}
  </div>
  <movement-break timer="30sec">
    <instruction>Super Speed Jumps</instruction>
  </movement-break>
</section>

<section type="activity" timer="5min">
  <h2>Power Challenge 2: Pattern Recognition</h2>
  <div class="problem-set" visual-support="true">
    {patterns.map(p => <pattern-problem sequence={p} />)}
  </div>
  <movement-break timer="30sec">
    <instruction>Hero Arm Circles</instruction>
  </movement-break>
</section>

<section type="conclusion">
  <h2>Superpower Summary</h2>
  <progress-tracker />
  <reward-badge name="Focus Master" condition="completion >= 80%" />
  <next-steps>
    <p>Get ready for tomorrow's Division Defenders challenge!</p>
  </next-steps>
</section>

<footer>
  <superhero-quote>
    "Your focus determines your reality. Great job today, hero!"
  </superhero-quote>
</footer>
`
  },
  {
    id: 2,
    title: 'Pattern Pioneers Science Exploration',
    description: 'Structured science experiment with visual schedules and clear expectations',
    subject: 'Science',
    gradeLevel: ['4', '5', '6'],
    category: 'Lesson Plan',
    learningStyles: ['Autism-Friendly'],
    superheroTheme: 'Pattern Pioneers',
    previewImage: 'science-experiment.png',
    rhythmCode: `@rhythm
@template: LessonPlan
@title: "Pattern Pioneers Science Exploration"
@subject: "Science"
@gradeLevel: "4-6"
@learningStyle: "Autism-Friendly"
@superhero-theme: "Pattern Pioneers"

<hero-header>
  <title>Pattern Pioneers: Planet Classification</title>
  <theme-color>blue</theme-color>
  <visual-schedule />
</hero-header>

<section type="preparation">
  <sensory-notice>
    <item>We will be using bright images of planets</item>
    <item>This activity involves group discussion</item>
    <item>Noise level: Medium</item>
  </sensory-notice>
  <materials-list>
    <material>Planet cards</material>
    <material>Classification worksheet</material>
    <material>Pattern identification guide</material>
  </materials-list>
</section>

<section type="introduction" timer="5min">
  <h1>Welcome Pattern Pioneers!</h1>
  <p>Today we'll use our pattern-finding superpowers to classify planets.</p>
  <visual-instructions>
    <step>1. Observe planet images</step>
    <step>2. Find similarities and differences</step>
    <step>3. Create classification system</step>
    <step>4. Share your discoveries</step>
  </visual-instructions>
</section>

<section type="activity" timer="15min">
  <h2>Planet Classification Mission</h2>
  <div class="pattern-activity" structured-approach="true">
    <planet-cards display="organized-grid" />
    <classification-worksheet />
  </div>
  <quiet-corner available="true" />
</section>

<section type="conclusion">
  <h2>Pattern Discovery Complete</h2>
  <progress-tracker visual="true" />
  <transition-warning>
    <p>In 5 minutes, we will transition to the next subject.</p>
  </transition-warning>
</section>

<footer>
  <superhero-quote>
    "Your ability to see patterns helps science advance. Well done, pioneers!"
  </superhero-quote>
</footer>
`
  },
  {
    id: 3,
    title: 'Story Explorers Reading Adventure',
    description: 'Multi-sensory reading approach with audio options and visual supports',
    subject: 'English Language Arts',
    gradeLevel: ['2', '3', '4'],
    category: 'Story',
    learningStyles: ['Dyslexia-Friendly'],
    superheroTheme: 'Vision Voyagers',
    previewImage: 'reading-adventure.png',
    rhythmCode: `@rhythm
@template: Story
@title: "Story Explorers Reading Adventure"
@subject: "English Language Arts"
@gradeLevel: "2-4"
@learningStyle: "Dyslexia-Friendly"
@superhero-theme: "Vision Voyagers"

<hero-header>
  <title>Vision Voyagers: The Lost Library</title>
  <theme-color>orange</theme-color>
  <font-control />
</hero-header>

<section type="story-settings">
  <font-options>
    <font name="OpenDyslexic" default="true" />
    <font name="Comic Sans MS" />
    <font name="Arial" />
  </font-options>
  <color-schemes>
    <scheme name="Cream Background" background="#FFF9E5" text="#333333" default="true" />
    <scheme name="Blue Tint" background="#E8F4FF" text="#333333" />
    <scheme name="Dark Mode" background="#232323" text="#E8E8E8" />
  </color-schemes>
  <reading-options>
    <option name="Line Spacing" values="1.5, 2.0, 2.5" default="2.0" />
    <option name="Letter Spacing" values="normal, 0.5px, 1px" default="0.5px" />
  </reading-options>
</section>

<section type="story-content">
  <chapter number="1" title="The Mysterious Map">
    <p highlight-read-along="true">Max discovered the old map in the attic. The yellowed paper had strange markings all over it.</p>
    <p highlight-read-along="true">"What does this mean?" he wondered, tracing the lines with his finger.</p>
    
    <vocabulary-support>
      <word term="yellowed" definition="turned yellow with age">
        <img src="yellowed-paper.svg" alt="Old yellow paper" />
      </word>
      <word term="markings" definition="symbols or writing">
        <img src="map-symbols.svg" alt="Map symbols" />
      </word>
    </vocabulary-support>
    
    <comprehension-check>
      <question type="multiple-choice">
        <prompt>Where did Max find the map?</prompt>
        <option correct="true">In the attic</option>
        <option>In a library</option>
        <option>At school</option>
      </question>
    </comprehension-check>
  </chapter>
</section>

<section type="interactive-elements">
  <audio-controls>
    <play-button />
    <speed-control values="0.8, 1.0, 1.2, 1.5" default="1.0" />
  </audio-controls>
  <tracking-guide type="reading-ruler" togglable="true" />
</section>

<footer>
  <superhero-quote>
    "Every word you conquer makes you stronger. Keep reading, voyager!"
  </superhero-quote>
</footer>
`
  },
  {
    id: 4,
    title: 'Number Sense Building Blocks',
    description: 'Concrete math representations with real-world applications',
    subject: 'Mathematics',
    gradeLevel: ['1', '2', '3'],
    category: 'Interactive Exercise',
    learningStyles: ['Dyscalculia-Friendly'],
    superheroTheme: 'Memory Mavericks',
    previewImage: 'math-blocks.png',
    rhythmCode: `@rhythm
@template: InteractiveExercise
@title: "Number Sense Building Blocks"
@subject: "Mathematics"
@gradeLevel: "1-3"
@learningStyle: "Dyscalculia-Friendly"
@superhero-theme: "Memory Mavericks"

<hero-header>
  <title>Memory Mavericks: Number Detective Agency</title>
  <theme-color>green</theme-color>
  <math-tools-tray />
</hero-header>

<section type="warm-up" timer="5min">
  <h1>Number Detective Training</h1>
  <p>Today we'll train our memory powers to work with numbers in the real world!</p>
  
  <number-line 
    interactive="true" 
    range="0-20"
    visual-markers="true"
    haptic-feedback="true"
  />
  
  <counting-practice
    objects="familiar"
    animation="sequential"
    audio-support="true"
  />
</section>

<section type="concept-introduction">
  <h2>Detective Tools: Grouping Numbers</h2>
  
  <multi-sensory-representation>
    <visual-blocks groupable="true" quantity="10" />
    <audio-pattern beat-counts="true" />
    <tactile-suggestion>
      Use small objects like buttons or beans to form groups
    </tactile-suggestion>
  </multi-sensory-representation>
  
  <real-world-connection>
    <scenario>
      <p>Detective Maya needs to sort 10 clues into groups.</p>
      <p>How many ways can she organize them?</p>
    </scenario>
    <manipulatives type="draggable" />
  </real-world-connection>
</section>

<section type="guided-practice" error-tolerance="high">
  <h2>Number Pattern Mysteries</h2>
  
  <progressive-challenges>
    <challenge level="1">
      <instruction>Find groups of 2 in the detective office</instruction>
      <interactive-scene scene="office" find-groups-of="2" />
    </challenge>
    <challenge level="2">
      <instruction>Share 15 cookies equally among 3 friends</instruction>
      <division-visualizer dividend="15" divisor="3" />
    </challenge>
  </progressive-challenges>
  
  <strategy-reminders visible="always">
    <strategy>Count objects one by one</strategy>
    <strategy>Use the number line to help</strategy>
    <strategy>Group objects to count faster</strategy>
  </strategy-reminders>
</section>

<footer>
  <superhero-quote>
    "Numbers are everywhere, and your memory powers help you detect their patterns!"
  </superhero-quote>
</footer>
`
  },
  {
    id: 5,
    title: 'Sensory-Friendly History Journey',
    description: 'History exploration with adjustable sensory inputs and flexible response options',
    subject: 'History',
    gradeLevel: ['5', '6', '7'],
    category: 'Lesson Plan',
    learningStyles: ['Autism-Friendly', 'Universal Design'],
    superheroTheme: 'Sensory Squad',
    previewImage: 'history-journey.png',
    rhythmCode: `@rhythm
@template: LessonPlan
@title: "Sensory-Friendly History Journey"
@subject: "History"
@gradeLevel: "5-7"
@learningStyle: "Autism-Friendly, Universal Design"
@superhero-theme: "Sensory Squad"

<hero-header>
  <title>Sensory Squad Time Travelers: Ancient Egypt</title>
  <theme-color>purple</theme-color>
  <sensory-controls />
</hero-header>

<section type="pre-lesson">
  <sensory-guide>
    <item type="visual">
      <description>This lesson contains images of ancient Egyptian artifacts and pyramids</description>
      <adjustment>Image brightness and contrast can be adjusted</adjustment>
    </item>
    <item type="auditory">
      <description>Optional ancient music samples and narration</description>
      <adjustment>Volume controls and option to mute specific sounds</adjustment>
    </item>
    <item type="other">
      <description>Virtual "touch" interaction with 3D models</description>
      <adjustment>Can be disabled if causing distraction</adjustment>
    </item>
  </sensory-guide>
  
  <visual-schedule>
    <activity minutes="5">Introduction to Ancient Egypt</activity>
    <activity minutes="10">Explore Pyramid Construction</activity>
    <activity minutes="5">Break / Quiet Time</activity>
    <activity minutes="10">Daily Life Artifacts</activity>
    <activity minutes="5">Knowledge Check</activity>
  </visual-schedule>
</section>

<section type="lesson-content">
  <h1>Ancient Egypt Exploration</h1>
  
  <multimedia-presentation sensory-adjustable="true">
    <slide title="The Mighty Nile">
      <content>
        <p>The Nile River was essential to Ancient Egyptian civilization.</p>
        <historical-map 
          interactive="true" 
          highlight-key-areas="true"
        />
      </content>
      <notes display="optional">
        Annual flooding brought fertile soil for farming
      </notes>
    </slide>
    
    <slide title="Pyramid Construction">
      <content>
        <p>Pyramids were built as tombs for pharaohs.</p>
        <pyramid-model 
          interactive="true" 
          animation-speed="adjustable"
          text-to-speech="available"
        />
      </content>
    </slide>
  </multimedia-presentation>
  
  <response-options>
    <option type="written">Journal entry as an Egyptian citizen</option>
    <option type="visual">Draw a pyramid construction scene</option>
    <option type="verbal">Record audio description of Egyptian daily life</option>
    <option type="multiple-choice">Complete structured quiz</option>
  </response-options>
</section>

<section type="transition">
  <countdown timer="5min" visual="true" />
  <calming-activity optional="true">
    <deep-breathing animation="gentle" />
  </calming-activity>
</section>

<footer>
  <superhero-quote>
    "Your sensory awareness helps you experience history in unique ways!"
  </superhero-quote>
</footer>
`
  }
];

interface TemplateCardProps {
  template: any;
  onSelect: (template: any) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card className="h-full bg-dark-800 border border-dark-700 overflow-hidden flex flex-col">
        <div className="h-40 bg-gradient-to-br from-indigo-800/30 to-purple-800/30 p-4 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto flex items-center justify-center mb-2">
              <i className={`ri-${template.category === 'Lesson Plan' ? 'book-open' : 
                              template.category === 'Activity' ? 'gamepad' :
                              template.category === 'Story' ? 'book' :
                              template.category === 'Interactive Exercise' ? 'bubble-chart' :
                              'file'}-line text-white text-xl`}>
              </i>
            </div>
            <span className="text-xs font-medium text-indigo-200">{template.category}</span>
          </div>
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold text-white">{template.title}</CardTitle>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {template.learningStyles.map((style: string) => (
              <Badge key={style} variant="secondary" className="text-xs font-normal">
                {style}
              </Badge>
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="text-sm text-gray-300 py-2 flex-grow">
          <p>{template.description}</p>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-xs text-gray-400">
            <div className="flex items-center">
              <i className="ri-book-line mr-1"></i>
              <span>{template.subject}</span>
            </div>
            <div className="flex items-center">
              <i className="ri-group-line mr-1"></i>
              <span>Grades {template.gradeLevel.join(', ')}</span>
            </div>
            <div className="flex items-center mt-1">
              <i className="ri-superhero-line mr-1"></i>
              <span>{template.superheroTheme}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-indigo-700 text-indigo-200 hover:text-white hover:bg-indigo-800/50"
            onClick={() => onSelect(template)}
          >
            <i className="ri-eye-line mr-1"></i> Preview
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

interface TemplatePreviewProps {
  template: any;
  onClose: () => void;
  onUse: (template: any) => void;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template, onClose, onUse }) => {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [selectedTab, setSelectedTab] = useState<'content' | 'settings' | 'adaptations'>('content');
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-dark-900 rounded-xl border border-dark-700 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-dark-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
              <i className="ri-rhythm-line text-white"></i>
            </div>
            <h2 className="text-xl font-bold text-white">{template.title}</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-dark-800 rounded-md flex overflow-hidden">
              <button 
                className={`px-3 py-1.5 text-sm font-medium ${viewMode === 'preview' ? 'bg-indigo-700 text-white' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setViewMode('preview')}
              >
                Preview
              </button>
              <button 
                className={`px-3 py-1.5 text-sm font-medium ${viewMode === 'code' ? 'bg-indigo-700 text-white' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setViewMode('code')}
              >
                Rhythm Code
              </button>
            </div>
            
            <button 
              className="text-gray-400 hover:text-white"
              onClick={onClose}
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>
        </div>
        
        <div className="flex flex-1 min-h-0">
          {viewMode === 'preview' ? (
            <div className="flex-1 overflow-auto p-4">
              <div className="bg-dark-800 rounded-lg border border-dark-700 p-4">
                <h3 className="text-lg font-semibold text-center mb-4">Preview Rendering</h3>
                <div className="bg-gray-700 text-white p-6 rounded-md flex items-center justify-center h-96">
                  <div className="text-center">
                    <i className="ri-image-line text-5xl mb-4 text-gray-400"></i>
                    <p className="text-lg">Preview Image for {template.title}</p>
                    <p className="text-gray-400 text-sm mt-2">
                      (Placeholder for rendered template)
                    </p>
                  </div>
                </div>
                <p className="text-gray-400 text-center text-sm mt-2">
                  Interactive preview shows how template appears to students
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-auto p-4 font-mono text-gray-300 bg-dark-950 border-r border-dark-700">
              <pre className="text-sm whitespace-pre">
                <code>{template.rhythmCode}</code>
              </pre>
            </div>
          )}
          
          <div className="w-80 border-l border-dark-700 bg-dark-800 flex flex-col">
            <Tabs defaultValue="content" className="flex-1 flex flex-col">
              <TabsList className="flex px-2 pt-2 bg-transparent border-b border-dark-700">
                <TabsTrigger value="content" className="flex-1 data-[state=active]:bg-dark-700">Content</TabsTrigger>
                <TabsTrigger value="settings" className="flex-1 data-[state=active]:bg-dark-700">Settings</TabsTrigger>
                <TabsTrigger value="adaptations" className="flex-1 data-[state=active]:bg-dark-700">Adaptations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="flex-1 overflow-auto p-4 space-y-4 mt-0">
                <div>
                  <h3 className="font-medium text-sm text-gray-400 mb-1">Template Type</h3>
                  <p className="text-white">{template.category}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-gray-400 mb-1">Subject</h3>
                  <p className="text-white">{template.subject}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-gray-400 mb-1">Grade Levels</h3>
                  <p className="text-white">{template.gradeLevel.join(', ')}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-gray-400 mb-1">Description</h3>
                  <p className="text-white">{template.description}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-gray-400 mb-1">Superhero Theme</h3>
                  <p className="text-white">{template.superheroTheme}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="flex-1 overflow-auto p-4 space-y-4 mt-0">
                <div>
                  <h3 className="font-medium text-sm text-gray-400 mb-2">Appearance</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Color Theme</label>
                      <Select defaultValue="purple">
                        <SelectTrigger className="bg-dark-700 border-dark-600">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="purple">Focus Force (Purple)</SelectItem>
                          <SelectItem value="blue">Pattern Pioneers (Blue)</SelectItem>
                          <SelectItem value="teal">Sensory Squad (Teal)</SelectItem>
                          <SelectItem value="orange">Vision Voyagers (Orange)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Font Style</label>
                      <Select defaultValue="standard">
                        <SelectTrigger className="bg-dark-700 border-dark-600">
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="dyslexic">OpenDyslexic</SelectItem>
                          <SelectItem value="comic">Comic Sans</SelectItem>
                          <SelectItem value="large">Large Text</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-sm text-gray-400 mb-2">Content Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300">Show Timers</label>
                      <div className="relative inline-flex h-5 w-10 items-center rounded-full bg-dark-700">
                        <span className="absolute left-1 h-3 w-3 rounded-full bg-indigo-600 transition-transform" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300">Audio Narration</label>
                      <div className="relative inline-flex h-5 w-10 items-center rounded-full bg-dark-700">
                        <span className="absolute left-1 h-3 w-3 rounded-full bg-gray-500 transition-transform" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300">Visual Supports</label>
                      <div className="relative inline-flex h-5 w-10 items-center rounded-full bg-indigo-900">
                        <span className="absolute translate-x-5 h-3 w-3 rounded-full bg-indigo-600 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-sm text-gray-400 mb-2">Advanced Settings</h3>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Difficulty Level</label>
                    <Select defaultValue="standard">
                      <SelectTrigger className="bg-dark-700 border-dark-600">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Simplified</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="adaptive">Adaptive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="adaptations" className="flex-1 overflow-auto p-4 space-y-4 mt-0">
                <div>
                  <h3 className="font-medium text-sm text-gray-400 mb-1">Learning Style Adaptations</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {template.learningStyles.map((style: string) => (
                      <Badge key={style} className="bg-indigo-900 hover:bg-indigo-800">
                        {style}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {template.learningStyles.includes('ADHD-Friendly') && (
                  <div>
                    <h3 className="font-medium text-sm text-indigo-400 mb-2">ADHD-Friendly Features</h3>
                    <ul className="space-y-1.5 text-sm">
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mr-1.5 mt-0.5"></i>
                        <span>Visual timers and transition warnings</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mr-1.5 mt-0.5"></i>
                        <span>Built-in movement breaks and fidget options</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mr-1.5 mt-0.5"></i>
                        <span>Chunked instructions with visual supports</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mr-1.5 mt-0.5"></i>
                        <span>High-interest superhero theme engagement</span>
                      </li>
                    </ul>
                  </div>
                )}
                
                {template.learningStyles.includes('Autism-Friendly') && (
                  <div>
                    <h3 className="font-medium text-sm text-blue-400 mb-2">Autism-Friendly Features</h3>
                    <ul className="space-y-1.5 text-sm">
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mr-1.5 mt-0.5"></i>
                        <span>Visual schedules with clear expectations</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mr-1.5 mt-0.5"></i>
                        <span>Sensory considerations and adjustments</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mr-1.5 mt-0.5"></i>
                        <span>Predictable routines with transition supports</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mr-1.5 mt-0.5"></i>
                        <span>Optional quiet/calming spaces in activities</span>
                      </li>
                    </ul>
                  </div>
                )}
                
                {template.learningStyles.includes('Dyslexia-Friendly') && (
                  <div>
                    <h3 className="font-medium text-sm text-orange-400 mb-2">Dyslexia-Friendly Features</h3>
                    <ul className="space-y-1.5 text-sm">
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mr-1.5 mt-0.5"></i>
                        <span>Dyslexia-friendly font options</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mr-1.5 mt-0.5"></i>
                        <span>Text-to-speech audio support</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mr-1.5 mt-0.5"></i>
                        <span>Color overlays and contrast controls</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mr-1.5 mt-0.5"></i>
                        <span>Interactive tracking guides for reading</span>
                      </li>
                    </ul>
                  </div>
                )}
                
                {template.learningStyles.includes('Dyscalculia-Friendly') && (
                  <div>
                    <h3 className="font-medium text-sm text-green-400 mb-2">Dyscalculia-Friendly Features</h3>
                    <ul className="space-y-1.5 text-sm">
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mr-1.5 mt-0.5"></i>
                        <span>Multi-sensory math representations</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mr-1.5 mt-0.5"></i>
                        <span>Visual number lines and counting supports</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mr-1.5 mt-0.5"></i>
                        <span>Real-world applications of numerical concepts</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mr-1.5 mt-0.5"></i>
                        <span>Strategy reminders and scaffolded learning</span>
                      </li>
                    </ul>
                  </div>
                )}
                
                {template.learningStyles.includes('Universal Design') && (
                  <div>
                    <h3 className="font-medium text-sm text-purple-400 mb-2">Universal Design Features</h3>
                    <ul className="space-y-1.5 text-sm">
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mr-1.5 mt-0.5"></i>
                        <span>Multiple means of engagement</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mr-1.5 mt-0.5"></i>
                        <span>Multiple means of representation</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mr-1.5 mt-0.5"></i>
                        <span>Multiple means of action and expression</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-check-line text-green-500 mr-1.5 mt-0.5"></i>
                        <span>Adaptive content with customization options</span>
                      </li>
                    </ul>
                  </div>
                )}
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-sm text-gray-400 mb-2">Customization</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    You can customize this template for additional learning styles:
                  </p>
                  
                  <Select defaultValue="">
                    <SelectTrigger className="bg-dark-700 border-dark-600">
                      <SelectValue placeholder="Add adaptation for..." />
                    </SelectTrigger>
                    <SelectContent>
                      {LEARNING_STYLES.filter(
                        style => !template.learningStyles.includes(style)
                      ).map(style => (
                        <SelectItem key={style} value={style.toLowerCase()}>
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="p-4 border-t border-dark-700">
              <Button 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white"
                onClick={() => onUse(template)}
              >
                Use This Template
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const TemplateLibrary: React.FC = () => {
  const [_, setLocation] = useLocation();
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [filters, setFilters] = useState({
    subject: '',
    gradeLevel: '',
    learningStyle: '',
    category: '',
    searchQuery: '',
  });
  
  // Simulate fetching templates
  const { data: templates = TEMPLATES } = useQuery({
    queryKey: ['templates'],
    queryFn: () => Promise.resolve(TEMPLATES),
  });
  
  // Apply filters to templates
  const filteredTemplates = templates.filter(template => {
    if (filters.subject && template.subject !== filters.subject) return false;
    if (filters.gradeLevel && !template.gradeLevel.includes(filters.gradeLevel)) return false;
    if (filters.learningStyle && !template.learningStyles.includes(filters.learningStyle)) return false;
    if (filters.category && template.category !== filters.category) return false;
    
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        template.title.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.subject.toLowerCase().includes(query) ||
        template.superheroTheme.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  const clearFilters = () => {
    setFilters({
      subject: '',
      gradeLevel: '',
      learningStyle: '',
      category: '',
      searchQuery: '',
    });
  };
  
  const handleUseTemplate = (template: any) => {
    setSelectedTemplate(null);
    // Navigate to our Rhythm Editor with the template ID
    setLocation(`/rhythm-editor?template=${template.id}`);
  };
  
  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Rhythm Template Library</h1>
            <p className="text-gray-400 mt-1">
              Superhero-themed educational templates for neurodivergent learners
            </p>
          </div>
          
          <Button 
            className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white"
            onClick={() => setLocation('/editor')}
          >
            <i className="ri-add-line mr-1"></i>
            Create Custom Template
          </Button>
        </div>
        
        {/* Filters Section */}
        <div className="bg-dark-900 rounded-xl border border-dark-800 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search templates..."
                className="bg-dark-800 border-dark-700 focus:border-indigo-600"
                value={filters.searchQuery}
                onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Select 
                value={filters.subject}
                onValueChange={(value) => setFilters({...filters, subject: value})}
              >
                <SelectTrigger className="bg-dark-800 border-dark-700">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Subjects</SelectItem>
                  {SUBJECTS.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={filters.gradeLevel}
                onValueChange={(value) => setFilters({...filters, gradeLevel: value})}
              >
                <SelectTrigger className="bg-dark-800 border-dark-700">
                  <SelectValue placeholder="Grade Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Grades</SelectItem>
                  {GRADE_LEVELS.map(grade => (
                    <SelectItem key={grade} value={grade}>{grade === 'K' ? 'Kindergarten' : `Grade ${grade}`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={filters.learningStyle}
                onValueChange={(value) => setFilters({...filters, learningStyle: value})}
              >
                <SelectTrigger className="bg-dark-800 border-dark-700">
                  <SelectValue placeholder="Learning Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Styles</SelectItem>
                  {LEARNING_STYLES.map(style => (
                    <SelectItem key={style} value={style}>{style}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={filters.category}
                onValueChange={(value) => setFilters({...filters, category: value})}
              >
                <SelectTrigger className="bg-dark-800 border-dark-700">
                  <SelectValue placeholder="Template Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {TEMPLATE_CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="ghost" 
              className="text-gray-400 hover:text-white"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </div>
        
        {/* Templates Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {filteredTemplates.length} {filteredTemplates.length === 1 ? 'Template' : 'Templates'} 
              {(filters.subject || filters.gradeLevel || filters.learningStyle || filters.category || filters.searchQuery) ? ' Matching Filters' : ''}
            </h2>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-400 mr-2">Sort by:</span>
              <Select defaultValue="popular">
                <SelectTrigger className="bg-dark-800 border-dark-700 w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="recent">Newest First</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={setSelectedTemplate}
                />
              ))}
            </div>
          ) : (
            <div className="bg-dark-900 rounded-xl border border-dark-800 p-10 text-center">
              <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-search-line text-2xl text-gray-500"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">No Templates Found</h3>
              <p className="text-gray-400 mb-6">
                No templates match your selected filters. Try adjusting your search criteria.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
        
        {/* Resource Section */}
        <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl p-6 mb-4">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Rhythm Language Guide</h2>
              <p className="text-gray-300 mb-4">
                Learn how to create and customize your own neurodivergent-friendly templates with our 
                comprehensive Rhythm Language documentation.
              </p>
              <Button className="bg-white text-indigo-900 hover:bg-gray-100">
                View Documentation
              </Button>
            </div>
            <div className="md:ml-auto flex gap-4">
              <div className="bg-dark-800/70 p-4 rounded-lg text-center">
                <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center mx-auto mb-2">
                  <i className="ri-book-open-line text-white"></i>
                </div>
                <h3 className="font-medium">Tutorials</h3>
                <p className="text-sm text-gray-400">Step-by-step guides</p>
              </div>
              <div className="bg-dark-800/70 p-4 rounded-lg text-center">
                <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center mx-auto mb-2">
                  <i className="ri-code-box-line text-white"></i>
                </div>
                <h3 className="font-medium">Examples</h3>
                <p className="text-sm text-gray-400">Sample templates</p>
              </div>
              <div className="bg-dark-800/70 p-4 rounded-lg text-center">
                <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center mx-auto mb-2">
                  <i className="ri-community-line text-white"></i>
                </div>
                <h3 className="font-medium">Community</h3>
                <p className="text-sm text-gray-400">Share & collaborate</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm">
          <p>Rhythm Education © {new Date().getFullYear()}</p>
        </footer>
      </div>
      
      {/* Template Preview Modal */}
      {selectedTemplate && (
        <TemplatePreview
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          onUse={handleUseTemplate}
        />
      )}
    </div>
  );
};

export default TemplateLibrary;