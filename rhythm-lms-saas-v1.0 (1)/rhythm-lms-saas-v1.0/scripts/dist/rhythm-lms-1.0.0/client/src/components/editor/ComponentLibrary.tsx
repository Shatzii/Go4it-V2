import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Calculator, 
  Globe, 
  Music, 
  Paintbrush, 
  SearchIcon, 
  Stars, 
  Triangle,
  BookText,
  LayoutGrid,
  Shapes,
  Sparkles
} from 'lucide-react';
import { Block } from './VisualBlockEditor';

interface ComponentLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (blocks: Omit<Block, 'id'>[]) => void;
  ageGroup?: 'kids' | 'teens' | 'all';
}

// Define our educational component templates
const COMPONENTS = {
  math: [
    {
      name: 'Addition Practice',
      description: 'Practice adding numbers with examples and exercises',
      blocks: [
        {
          type: 'heading',
          content: 'Addition Practice',
          settings: { level: 2, align: 'center' }
        },
        {
          type: 'paragraph',
          content: 'Let\'s practice adding numbers together! Remember, addition means combining numbers to find their total.',
          settings: { size: 'medium' }
        },
        {
          type: 'layout',
          content: [
            {
              type: 'heading',
              content: 'Examples',
              settings: { level: 3 }
            },
            {
              type: 'paragraph',
              content: '2 + 2 = 4\n3 + 5 = 8\n7 + 3 = 10',
              settings: { size: 'large', style: 'code' }
            }
          ],
          settings: { columns: 1, gap: 'medium', align: 'center', padding: 'large', background: 'accent' }
        },
        {
          type: 'heading',
          content: 'Your Turn!',
          settings: { level: 3 }
        },
        {
          type: 'paragraph',
          content: 'Try solving these addition problems:',
          settings: {}
        },
        {
          type: 'list',
          content: ['4 + 3 = ?', '8 + 2 = ?', '5 + 6 = ?', '9 + 7 = ?'],
          settings: { style: 'ordered' }
        }
      ]
    },
    {
      name: 'Multiplication Table',
      description: 'Visual multiplication table from 1 to 10',
      blocks: [
        {
          type: 'heading',
          content: 'Multiplication Table',
          settings: { level: 2, align: 'center' }
        },
        {
          type: 'paragraph',
          content: 'A multiplication table helps us learn how to multiply numbers. Each cell shows what happens when you multiply the row number by the column number.',
          settings: {}
        },
        {
          type: 'layout',
          content: [
            {
              type: 'image',
              content: 'https://www.dadsworksheets.com/charts/multiplication-chart/multiplication-chart-1-10.jpg',
              settings: { alt: 'Multiplication table from 1 to 10', width: '100%' }
            }
          ],
          settings: { columns: 1, padding: 'medium', align: 'center' }
        },
        {
          type: 'paragraph',
          content: 'For example, to find 3 × 4, look at the row for 3 and the column for 4. Where they meet, you\'ll find 12!',
          settings: {}
        }
      ]
    }
  ],
  science: [
    {
      name: 'Water Cycle',
      description: 'Interactive explanation of the water cycle',
      blocks: [
        {
          type: 'heading',
          content: 'The Water Cycle',
          settings: { level: 2, align: 'center' }
        },
        {
          type: 'paragraph',
          content: 'The water cycle shows how water moves around our planet. It\'s a continuous journey that water takes through Earth\'s ecosystems.',
          settings: {}
        },
        {
          type: 'image',
          content: 'https://cdn.britannica.com/45/149145-050-A2D646AB/cycle-evaporation-transpiration-part-condensation.jpg',
          settings: { alt: 'The water cycle diagram', width: '80%', caption: 'The Water Cycle' }
        },
        {
          type: 'heading',
          content: 'Steps in the Water Cycle',
          settings: { level: 3 }
        },
        {
          type: 'list',
          content: [
            'Evaporation: Water from oceans, lakes, and rivers turns into water vapor',
            'Condensation: Water vapor forms clouds',
            'Precipitation: Water falls from clouds as rain, snow, or hail',
            'Collection: Water returns to oceans, lakes, and rivers'
          ],
          settings: {}
        },
        {
          type: 'button',
          content: 'Learn More About The Water Cycle',
          settings: { url: 'https://www.usgs.gov/special-topics/water-science-school/science/water-cycle', style: 'primary', align: 'center' }
        }
      ]
    },
    {
      name: 'Solar System',
      description: 'Overview of planets in our solar system',
      blocks: [
        {
          type: 'heading',
          content: 'Our Solar System',
          settings: { level: 2, align: 'center' }
        },
        {
          type: 'paragraph',
          content: 'Our solar system consists of the Sun and everything that orbits around it, including planets, moons, asteroids, and comets.',
          settings: {}
        },
        {
          type: 'image',
          content: 'https://solarsystem.nasa.gov/system/resources/detail_files/2486_stsci-h-p1936a_1800.jpg',
          settings: { alt: 'Solar System', width: '100%' }
        },
        {
          type: 'heading',
          content: 'The Planets',
          settings: { level: 3 }
        },
        {
          type: 'layout',
          content: [
            {
              type: 'list',
              content: [
                'Mercury - Closest to the Sun',
                'Venus - Hottest planet',
                'Earth - Our home planet',
                'Mars - The Red Planet'
              ],
              settings: {}
            },
            {
              type: 'list',
              content: [
                'Jupiter - The largest planet',
                'Saturn - Known for its rings',
                'Uranus - Tilted on its side',
                'Neptune - The windiest planet'
              ],
              settings: {}
            }
          ],
          settings: { columns: 2, gap: 'medium' }
        }
      ]
    }
  ],
  language: [
    {
      name: 'Parts of Speech',
      description: 'Learn about nouns, verbs, adjectives, and more',
      blocks: [
        {
          type: 'heading',
          content: 'Parts of Speech',
          settings: { level: 2, align: 'center' }
        },
        {
          type: 'paragraph',
          content: 'Parts of speech are categories of words that have similar grammatical properties. Understanding them helps us use language correctly.',
          settings: {}
        },
        {
          type: 'layout',
          content: [
            {
              type: 'heading',
              content: 'Nouns',
              settings: { level: 3 }
            },
            {
              type: 'paragraph',
              content: 'Nouns are words that name people, places, things, or ideas.\n\nExamples: cat, city, happiness, teacher',
              settings: {}
            }
          ],
          settings: { columns: 1, padding: 'medium', background: 'blue', color: 'white' }
        },
        {
          type: 'layout',
          content: [
            {
              type: 'heading',
              content: 'Verbs',
              settings: { level: 3 }
            },
            {
              type: 'paragraph',
              content: 'Verbs are action words or words that show a state of being.\n\nExamples: run, jump, is, believe',
              settings: {}
            }
          ],
          settings: { columns: 1, padding: 'medium', background: 'green', color: 'white' }
        },
        {
          type: 'layout',
          content: [
            {
              type: 'heading',
              content: 'Adjectives',
              settings: { level: 3 }
            },
            {
              type: 'paragraph',
              content: 'Adjectives describe or modify nouns.\n\nExamples: happy, blue, big, interesting',
              settings: {}
            }
          ],
          settings: { columns: 1, padding: 'medium', background: 'purple', color: 'white' }
        }
      ]
    },
    {
      name: 'Story Starter',
      description: 'Template to help kids start writing a story',
      blocks: [
        {
          type: 'heading',
          content: 'My Story',
          settings: { level: 2, align: 'center' }
        },
        {
          type: 'paragraph',
          content: 'Use this template to start writing your own amazing story!',
          settings: {}
        },
        {
          type: 'heading',
          content: 'Title: [Your Story Title]',
          settings: { level: 3 }
        },
        {
          type: 'heading',
          content: 'Characters',
          settings: { level: 4 }
        },
        {
          type: 'list',
          content: [
            'Main Character: [Name] - [Description]',
            'Supporting Character: [Name] - [Description]',
            'Villain or Challenge: [Description]'
          ],
          settings: {}
        },
        {
          type: 'heading',
          content: 'Setting',
          settings: { level: 4 }
        },
        {
          type: 'paragraph',
          content: 'Where and when does your story take place? Describe it here...',
          settings: { style: 'italic' }
        },
        {
          type: 'heading',
          content: 'Beginning',
          settings: { level: 4 }
        },
        {
          type: 'paragraph',
          content: 'Start your story here. Introduce your characters and setting...',
          settings: { style: 'italic' }
        },
        {
          type: 'heading',
          content: 'Middle',
          settings: { level: 4 }
        },
        {
          type: 'paragraph',
          content: 'What problem or adventure do your characters face? How do they try to solve it?',
          settings: { style: 'italic' }
        },
        {
          type: 'heading',
          content: 'End',
          settings: { level: 4 }
        },
        {
          type: 'paragraph',
          content: 'How does your story end? What do your characters learn?',
          settings: { style: 'italic' }
        }
      ]
    }
  ],
  art: [
    {
      name: 'Color Theory',
      description: 'Introduction to primary, secondary, and tertiary colors',
      blocks: [
        {
          type: 'heading',
          content: 'Color Theory Basics',
          settings: { level: 2, align: 'center' }
        },
        {
          type: 'paragraph',
          content: 'Color theory helps us understand how colors work together. It\'s important for artists, designers, and anyone who works with colors.',
          settings: {}
        },
        {
          type: 'heading',
          content: 'Primary Colors',
          settings: { level: 3 }
        },
        {
          type: 'paragraph',
          content: 'Primary colors are the three basic colors that can\'t be created by mixing other colors. They are:',
          settings: {}
        },
        {
          type: 'layout',
          content: [
            {
              type: 'paragraph',
              content: 'Red',
              settings: { align: 'center', size: 'large' }
            },
            {
              type: 'paragraph',
              content: 'Yellow',
              settings: { align: 'center', size: 'large' }
            },
            {
              type: 'paragraph',
              content: 'Blue',
              settings: { align: 'center', size: 'large' }
            }
          ],
          settings: { columns: 3, gap: 'medium', background: 'accent', padding: 'medium' }
        },
        {
          type: 'heading',
          content: 'Secondary Colors',
          settings: { level: 3 }
        },
        {
          type: 'paragraph',
          content: 'Secondary colors are created by mixing two primary colors:',
          settings: {}
        },
        {
          type: 'list',
          content: [
            'Red + Yellow = Orange',
            'Yellow + Blue = Green',
            'Blue + Red = Purple'
          ],
          settings: {}
        },
        {
          type: 'image',
          content: 'https://www.canva.com/design/play/DAF8wSGSJ54/8-mh-_yR_7JuR79eMxl_Ng/view?utm_content=DAF8wSGSJ54&utm_campaign=designshare&utm_medium=embeds&utm_source=link',
          settings: { alt: 'Color wheel showing primary and secondary colors', width: '70%' }
        }
      ]
    }
  ],
  history: [
    {
      name: 'Ancient Egypt',
      description: 'Overview of ancient Egyptian civilization',
      blocks: [
        {
          type: 'heading',
          content: 'Ancient Egypt',
          settings: { level: 2, align: 'center' }
        },
        {
          type: 'image',
          content: 'https://cdn.britannica.com/36/167636-050-BF90337E/Great-Sphinx-of-Giza-pyramid-background-Egypt.jpg',
          settings: { alt: 'Pyramids and Sphinx in Egypt', width: '80%' }
        },
        {
          type: 'paragraph',
          content: 'Ancient Egypt was one of the world\'s first great civilizations. It existed for over 3,000 years, from around 3100 BCE to 30 BCE.',
          settings: {}
        },
        {
          type: 'heading',
          content: 'Famous Features of Ancient Egypt',
          settings: { level: 3 }
        },
        {
          type: 'list',
          content: [
            'Pyramids: Massive structures built as tombs for pharaohs',
            'Hieroglyphics: A writing system using pictures and symbols',
            'Mummies: Preserved bodies wrapped in bandages',
            'Pharaohs: Kings and queens who ruled Ancient Egypt',
            'Nile River: Provided water and fertile soil for farming'
          ],
          settings: {}
        },
        {
          type: 'heading',
          content: 'Daily Life',
          settings: { level: 3 }
        },
        {
          type: 'paragraph',
          content: 'Most ancient Egyptians worked as farmers, growing crops like wheat and barley along the Nile River. They also built irrigation systems to control the water from the Nile.',
          settings: {}
        },
        {
          type: 'button',
          content: 'Explore More About Ancient Egypt',
          settings: { url: 'https://www.natgeokids.com/uk/discover/history/egypt/ten-facts-about-ancient-egypt/', style: 'primary', align: 'center' }
        }
      ]
    }
  ]
};

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  isOpen,
  onClose,
  onInsert,
  ageGroup = 'kids'
}) => {
  const [activeTab, setActiveTab] = useState<string>('math');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const handleInsert = (template: any) => {
    onInsert(template.blocks);
    onClose();
  };
  
  const filteredComponents = () => {
    if (!searchTerm) {
      return COMPONENTS[activeTab as keyof typeof COMPONENTS] || [];
    }
    
    const searchLower = searchTerm.toLowerCase();
    
    // Search across all categories
    const results: any[] = [];
    
    Object.values(COMPONENTS).forEach((categoryComponents: any) => {
      categoryComponents.forEach((component: any) => {
        if (
          component.name.toLowerCase().includes(searchLower) ||
          component.description.toLowerCase().includes(searchLower)
        ) {
          results.push(component);
        }
      });
    });
    
    return results;
  };
  
  const renderComponentCard = (component: any, index: number) => (
    <div 
      key={index}
      className="border rounded-md p-4 hover:border-primary transition-colors cursor-pointer"
      onClick={() => handleInsert(component)}
    >
      <h3 className="font-medium text-lg mb-1">{component.name}</h3>
      <p className="text-sm text-muted-foreground mb-4">{component.description}</p>
      <div className="flex justify-end">
        <Button size="sm">
          {ageGroup === 'kids' ? 'Add to My Page' : 'Insert'}
        </Button>
      </div>
    </div>
  );
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'math':
        return <Calculator className="h-4 w-4" />;
      case 'science':
        return <Flask className="h-4 w-4" />;
      case 'language':
        return <BookText className="h-4 w-4" />;
      case 'art':
        return <Paintbrush className="h-4 w-4" />;
      case 'history':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <Shapes className="h-4 w-4" />;
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            {ageGroup === 'kids' 
              ? 'Learning Blocks Library' 
              : 'Educational Component Library'}
          </DialogTitle>
          <DialogDescription>
            {ageGroup === 'kids'
              ? "Add special learning blocks to your page! These blocks teach cool subjects."
              : "Browse and insert pre-built educational components organized by subject area."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 my-2">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={
              ageGroup === 'kids' 
                ? "Find learning blocks..." 
                : "Search components..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
        
        {!searchTerm && (
          <Tabs defaultValue="math" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="math" className="flex items-center gap-1">
                <Calculator className="h-4 w-4" />
                <span>Math</span>
              </TabsTrigger>
              <TabsTrigger value="science" className="flex items-center gap-1">
                <Flask className="h-4 w-4" />
                <span>Science</span>
              </TabsTrigger>
              <TabsTrigger value="language" className="flex items-center gap-1">
                <BookText className="h-4 w-4" />
                <span>Language</span>
              </TabsTrigger>
              <TabsTrigger value="art" className="flex items-center gap-1">
                <Paintbrush className="h-4 w-4" />
                <span>Art</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>History</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        
        <ScrollArea className="mt-4 pr-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredComponents().map((component, index) => 
              renderComponentCard(component, index)
            )}
            
            {filteredComponents().length === 0 && (
              <div className="col-span-2 text-center py-12">
                <Shapes className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-1">
                  {ageGroup === 'kids' 
                    ? "No learning blocks found" 
                    : "No components found"}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? `Try a different search term or browse by category` 
                    : `This category doesn't have any components yet`}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// Add a missing component that's used in the ComponentLibrary
const Flask = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 3h6v2H9z"></path>
    <path d="M9 5v1A5 5 0 0 0 5 11v4c0 3 2 5 5 5h4c3 0 5-2 5-5v-4a5 5 0 0 0-4-4.9V5"></path>
    <path d="M8 15h8"></path>
  </svg>
);