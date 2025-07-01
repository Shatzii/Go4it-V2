import React from 'react';
import { Block } from '../editor/VisualBlockEditor';

// Template system for Neurodivergent School for Superheroes
export const neurodivergentSuperherosTemplates = {
  // Home page template
  homePage: (): Block[] => [
    {
      id: 'header-1',
      type: 'heading',
      content: 'Welcome to the Neurodivergent School for Superheroes',
      settings: { 
        level: 1, 
        align: 'center',
        color: '#4C2C8A' // Purple theme color for neurodivergent focus
      }
    },
    {
      id: 'intro-paragraph',
      type: 'paragraph',
      content: 'Where your unique abilities become your superpowers! Our school celebrates neurodiversity and helps every student discover their special gifts.',
      settings: { 
        size: 'large',
        align: 'center',
        color: '#333333'
      }
    },
    {
      id: 'hero-image',
      type: 'image',
      content: 'https://images.unsplash.com/photo-1501432377862-3d0432b87a14?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHN1cGVyaGVyb3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
      settings: {
        width: '100%',
        rounded: true,
        shadow: true,
        alt: 'Diverse group of children with superhero capes',
        caption: 'Every student has unique superpowers waiting to be discovered'
      }
    },
    {
      id: 'features-heading',
      type: 'heading',
      content: 'Our Superhero Programs',
      settings: { 
        level: 2, 
        align: 'center',
        color: '#4C2C8A'
      }
    },
    {
      id: 'features-layout',
      type: 'layout',
      content: [
        {
          id: 'feature-1',
          type: 'layout',
          content: [
            {
              id: 'feature-1-icon',
              type: 'image',
              content: 'https://cdn-icons-png.flaticon.com/512/6813/6813816.png',
              settings: {
                width: '80px',
                align: 'center',
                alt: 'Brain with lightning bolt icon'
              }
            },
            {
              id: 'feature-1-heading',
              type: 'heading',
              content: 'Focus Force',
              settings: { 
                level: 3, 
                align: 'center',
                color: '#FF8800' // High contrast orange for ADHD focus
              }
            },
            {
              id: 'feature-1-text',
              type: 'paragraph',
              content: 'Channel your energy into amazing focus abilities through movement-based learning, fidget-friendly classrooms, and interest-driven projects.',
              settings: { 
                align: 'center'
              }
            }
          ],
          settings: {
            padding: 'medium',
            background: '#FFF5E6', // Light orange for visual focus
            rounded: true,
            shadow: true
          }
        },
        {
          id: 'feature-2',
          type: 'layout',
          content: [
            {
              id: 'feature-2-icon',
              type: 'image',
              content: 'https://cdn-icons-png.flaticon.com/512/3462/3462204.png',
              settings: {
                width: '80px',
                align: 'center',
                alt: 'Puzzle piece with light bulb'
              }
            },
            {
              id: 'feature-2-heading',
              type: 'heading',
              content: 'Pattern Masters',
              settings: { 
                level: 3, 
                align: 'center',
                color: '#00AAFF' // Calming blue for autism-friendly design
              }
            },
            {
              id: 'feature-2-text',
              type: 'paragraph',
              content: 'Enhance your pattern recognition abilities and detail-oriented superpowers through structured, predictable learning environments with visual supports.',
              settings: { 
                align: 'center'
              }
            }
          ],
          settings: {
            padding: 'medium',
            background: '#E6F7FF', // Light blue for sensory sensitivity
            rounded: true,
            shadow: true
          }
        },
        {
          id: 'feature-3',
          type: 'layout',
          content: [
            {
              id: 'feature-3-icon',
              type: 'image',
              content: 'https://cdn-icons-png.flaticon.com/512/3731/3731671.png',
              settings: {
                width: '80px',
                align: 'center',
                alt: 'Book with stars'
              }
            },
            {
              id: 'feature-3-heading',
              type: 'heading',
              content: 'Word Wizards',
              settings: { 
                level: 3, 
                align: 'center',
                color: '#4CAF50' // Growth-oriented green for dyslexia support
              }
            },
            {
              id: 'feature-3-text',
              type: 'paragraph',
              content: 'Transform reading and writing challenges into creative storytelling abilities with multi-sensory learning techniques and assistive technology.',
              settings: { 
                align: 'center'
              }
            }
          ],
          settings: {
            padding: 'medium',
            background: '#E8F5E9', // Light green for reduced visual stress
            rounded: true,
            shadow: true
          }
        }
      ],
      settings: {
        columns: 3,
        gap: 'medium',
        padding: 'medium'
      }
    },
    {
      id: 'approach-heading',
      type: 'heading',
      content: 'Our Superhero Approach',
      settings: { 
        level: 2, 
        align: 'center',
        color: '#4C2C8A'
      }
    },
    {
      id: 'approach-paragraph',
      type: 'paragraph',
      content: 'At the Neurodivergent School for Superheroes, we believe that every brain is different and special. Our teaching methods are designed to celebrate these differences and help each student discover their unique powers.',
      settings: { 
        align: 'center'
      }
    },
    {
      id: 'approach-list',
      type: 'list',
      content: [
        'Strengths-based learning that focuses on what you CAN do',
        'Sensory-friendly environments with flexible seating and lighting options',
        'Visual schedules and supports to boost independence',
        'Mindfulness and emotional regulation training',
        'Interest-based learning that connects to your passions',
        'Assistive technology to support different learning styles'
      ],
      settings: { 
        style: 'unordered' 
      }
    },
    {
      id: 'cta-layout',
      type: 'layout',
      content: [
        {
          id: 'cta-heading',
          type: 'heading',
          content: 'Ready to Discover Your Superpowers?',
          settings: { 
            level: 2, 
            align: 'center',
            color: '#ffffff'
          }
        },
        {
          id: 'cta-paragraph',
          type: 'paragraph',
          content: 'Join our school and begin your journey to becoming the superhero you were always meant to be!',
          settings: { 
            align: 'center',
            color: '#ffffff',
            size: 'large'
          }
        },
        {
          id: 'cta-button',
          type: 'button',
          content: 'Schedule a Tour',
          settings: { 
            style: 'primary',
            size: 'large',
            align: 'center',
            color: '#FF8800',
            background: '#ffffff'
          }
        }
      ],
      settings: {
        columns: 1,
        padding: 'large',
        background: '#4C2C8A', // Purple superhero theme
        rounded: true,
        align: 'center'
      }
    }
  ],

  // About page template specifically designed for neurodivergent students
  aboutPage: (): Block[] => [
    {
      id: 'about-header',
      type: 'heading',
      content: 'About Our School',
      settings: { 
        level: 1, 
        align: 'center',
        color: '#4C2C8A'
      }
    },
    {
      id: 'about-intro',
      type: 'paragraph',
      content: 'The Neurodivergent School for Superheroes was founded with a simple mission: to create a learning environment where neurodivergent students can thrive by embracing their unique abilities.',
      settings: { 
        size: 'large',
        align: 'center' 
      }
    },
    {
      id: 'school-image',
      type: 'image',
      content: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y29sb3JmdWwlMjBzY2hvb2x8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
      settings: {
        width: '100%',
        rounded: true,
        shadow: true,
        alt: 'Colorful, sensory-friendly school building',
        caption: 'Our sensory-friendly school building with flexible learning spaces'
      }
    },
    {
      id: 'mission-heading',
      type: 'heading',
      content: 'Our Mission',
      settings: { 
        level: 2, 
        color: '#4C2C8A'
      }
    },
    {
      id: 'mission-paragraph',
      type: 'paragraph',
      content: 'We believe that neurodivergent thinking is a superpower, not a disability. Our mission is to help students harness their unique cognitive abilities through:',
      settings: {}
    },
    {
      id: 'mission-list',
      type: 'list',
      content: [
        'Creating learning environments that adapt to students instead of forcing students to adapt',
        'Teaching self-advocacy and self-regulation skills for lifelong success',
        'Developing individualized learning plans that build on each student\'s strengths',
        'Fostering an inclusive community that celebrates neurodiversity'
      ],
      settings: {
        style: 'ordered'
      }
    },
    {
      id: 'team-heading',
      type: 'heading',
      content: 'Our Superhero Staff',
      settings: { 
        level: 2, 
        color: '#4C2C8A'
      }
    },
    {
      id: 'team-paragraph',
      type: 'paragraph',
      content: 'Our teachers and staff members are the real superheroes - many are neurodivergent themselves and bring personal understanding to their teaching approach.',
      settings: {}
    },
    {
      id: 'team-layout',
      type: 'layout',
      content: [
        {
          id: 'team-1',
          type: 'layout',
          content: [
            {
              id: 'team-1-image',
              type: 'image',
              content: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dGVhY2hlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
              settings: {
                width: '100%',
                rounded: true,
                alt: 'Dr. Maya Rodriguez, School Director'
              }
            },
            {
              id: 'team-1-name',
              type: 'heading',
              content: 'Dr. Maya Rodriguez',
              settings: { 
                level: 3, 
                align: 'center'
              }
            },
            {
              id: 'team-1-role',
              type: 'paragraph',
              content: 'School Director',
              settings: { 
                align: 'center',
                style: 'italic'
              }
            },
            {
              id: 'team-1-description',
              type: 'paragraph',
              content: 'With ADHD herself, Dr. Rodriguez has devoted her career to creating education systems that work for all types of minds.',
              settings: { 
                align: 'center'
              }
            }
          ],
          settings: {
            padding: 'medium',
            background: '#ffffff',
            rounded: true,
            shadow: true
          }
        },
        {
          id: 'team-2',
          type: 'layout',
          content: [
            {
              id: 'team-2-image',
              type: 'image',
              content: 'https://images.unsplash.com/photo-1531945086322-64e2ffae14a6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8dGVhY2hlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
              settings: {
                width: '100%',
                rounded: true,
                alt: 'Mr. James Chen, Lead Teacher'
              }
            },
            {
              id: 'team-2-name',
              type: 'heading',
              content: 'Mr. James Chen',
              settings: { 
                level: 3,
                align: 'center'
              }
            },
            {
              id: 'team-2-role',
              type: 'paragraph',
              content: 'Lead Teacher',
              settings: { 
                align: 'center',
                style: 'italic'
              }
            },
            {
              id: 'team-2-description',
              type: 'paragraph',
              content: 'As an autistic educator, Mr. Chen brings a unique perspective to teaching pattern recognition and logical thinking skills.',
              settings: { 
                align: 'center'
              }
            }
          ],
          settings: {
            padding: 'medium',
            background: '#ffffff',
            rounded: true,
            shadow: true
          }
        },
        {
          id: 'team-3',
          type: 'layout',
          content: [
            {
              id: 'team-3-image',
              type: 'image',
              content: 'https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHRlYWNoZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
              settings: {
                width: '100%',
                rounded: true,
                alt: 'Ms. Aisha Johnson, Sensory Integration Specialist'
              }
            },
            {
              id: 'team-3-name',
              type: 'heading',
              content: 'Ms. Aisha Johnson',
              settings: { 
                level: 3, 
                align: 'center'
              }
            },
            {
              id: 'team-3-role',
              type: 'paragraph',
              content: 'Sensory Integration Specialist',
              settings: { 
                align: 'center',
                style: 'italic'
              }
            },
            {
              id: 'team-3-description',
              type: 'paragraph',
              content: 'Ms. Johnson creates sensory-friendly environments that help students regulate their nervous systems for optimal learning.',
              settings: { 
                align: 'center'
              }
            }
          ],
          settings: {
            padding: 'medium',
            background: '#ffffff',
            rounded: true,
            shadow: true
          }
        }
      ],
      settings: {
        columns: 3,
        gap: 'medium'
      }
    },
    {
      id: 'approach-heading',
      type: 'heading',
      content: 'Our Learning Environment',
      settings: { 
        level: 2, 
        color: '#4C2C8A'
      }
    },
    {
      id: 'environment-layout',
      type: 'layout',
      content: [
        {
          id: 'environment-image',
          type: 'image',
          content: 'https://images.unsplash.com/photo-1522661067900-ab829854a57f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8c2Vuc29yeSUyMHJvb218ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
          settings: {
            width: '100%',
            rounded: true,
            shadow: true,
            alt: 'Sensory-friendly classroom with flexible seating options'
          }
        },
        {
          id: 'environment-text',
          type: 'layout',
          content: [
            {
              id: 'environment-subheading',
              type: 'heading',
              content: 'Designed for Neurodivergent Success',
              settings: { 
                level: 3,
                color: '#4C2C8A'
              }
            },
            {
              id: 'environment-paragraph',
              type: 'paragraph',
              content: 'Our school is designed with sensory needs in mind. We feature:',
              settings: {}
            },
            {
              id: 'environment-list',
              type: 'list',
              content: [
                'Adjustable lighting for different sensory preferences',
                'Noise-canceling options and quiet spaces',
                'Movement-friendly classrooms with flexible seating',
                'Sensory regulation stations in every classroom',
                'Visual schedules and clear signage',
                'Color-coded areas for different activities',
                'Technology integration for alternative learning methods'
              ],
              settings: {}
            }
          ],
          settings: {
            padding: 'medium'
          }
        }
      ],
      settings: {
        columns: 2,
        gap: 'large'
      }
    }
  ],

  // Program page template optimized for neurodivergent information processing
  programsPage: (): Block[] => [
    {
      id: 'programs-header',
      type: 'heading',
      content: 'Our Superhero Programs',
      settings: { 
        level: 1, 
        align: 'center',
        color: '#4C2C8A'
      }
    },
    {
      id: 'programs-intro',
      type: 'paragraph',
      content: 'Each of our programs is designed to harness specific neurodivergent strengths and turn them into superpowers. We offer structured, predictable learning experiences with clear visual supports.',
      settings: { 
        size: 'large',
        align: 'center' 
      }
    },
    {
      id: 'program-1-layout',
      type: 'layout',
      content: [
        {
          id: 'program-1-image',
          type: 'image',
          content: 'https://images.unsplash.com/photo-1516383274235-5f42d6c6426d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGZvY3VzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
          settings: {
            width: '100%',
            rounded: true,
            shadow: true,
            alt: 'Student channeling focus energy'
          }
        },
        {
          id: 'program-1-content',
          type: 'layout',
          content: [
            {
              id: 'program-1-heading',
              type: 'heading',
              content: 'Focus Force Academy (ADHD Strengths)',
              settings: { 
                level: 2, 
                color: '#FF8800'
              }
            },
            {
              id: 'program-1-paragraph',
              type: 'paragraph',
              content: 'For students with ADHD and high energy, our Focus Force Academy channels that energy into powerful learning experiences. We embrace movement, novelty, and hyper-focus as learning tools.',
              settings: {}
            },
            {
              id: 'program-1-features',
              type: 'list',
              content: [
                'Movement-integrated learning with standing desks and fidget tools',
                'Time-management and organization skill building',
                'Interest-based deep dive projects that harness hyperfocus',
                'Short learning segments with frequent breaks',
                'Real-world, hands-on learning experiences'
              ],
              settings: {}
            },
            {
              id: 'program-1-quote',
              type: 'paragraph',
              content: '"Since joining Focus Force, I've learned how to use my energy as a superpower instead of seeing it as a problem. Now I can focus when I need to!" - Alex, Age 11',
              settings: { 
                style: 'italic',
                color: '#FF8800'
              }
            }
          ],
          settings: {
            padding: 'medium'
          }
        }
      ],
      settings: {
        columns: 2,
        gap: 'large',
        background: '#FFF5E6',
        padding: 'medium',
        rounded: true
      }
    },
    {
      id: 'program-2-layout',
      type: 'layout',
      content: [
        {
          id: 'program-2-content',
          type: 'layout',
          content: [
            {
              id: 'program-2-heading',
              type: 'heading',
              content: 'Pattern Masters Institute (Autism Strengths)',
              settings: { 
                level: 2, 
                color: '#00AAFF'
              }
            },
            {
              id: 'program-2-paragraph',
              type: 'paragraph',
              content: 'Our Pattern Masters program celebrates the exceptional pattern recognition, detail orientation, and specialized interests that many autistic students possess.',
              settings: {}
            },
            {
              id: 'program-2-features',
              type: 'list',
              content: [
                'Clear, predictable routines with visual schedules',
                'Structured learning environments with minimal sensory distractions',
                'Special interest integration into academic subjects',
                'Social skills development through interest-based groups',
                'Direct, clear communication and instruction'
              ],
              settings: {}
            },
            {
              id: 'program-2-quote',
              type: 'paragraph',
              content: '"I love Pattern Masters because the teachers understand how I think. They don't make me do eye contact when it's uncomfortable, and I can use my knowledge about trains in my math projects!" - Sam, Age 9',
              settings: { 
                style: 'italic',
                color: '#00AAFF'
              }
            }
          ],
          settings: {
            padding: 'medium'
          }
        },
        {
          id: 'program-2-image',
          type: 'image',
          content: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fHBhdHRlcm58ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
          settings: {
            width: '100%',
            rounded: true,
            shadow: true,
            alt: 'Student engaged in pattern recognition activity'
          }
        }
      ],
      settings: {
        columns: 2,
        gap: 'large',
        background: '#E6F7FF',
        padding: 'medium',
        rounded: true
      }
    },
    {
      id: 'program-3-layout',
      type: 'layout',
      content: [
        {
          id: 'program-3-image',
          type: 'image',
          content: 'https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cmVhZGluZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
          settings: {
            width: '100%',
            rounded: true,
            shadow: true,
            alt: 'Student using assistive technology for reading'
          }
        },
        {
          id: 'program-3-content',
          type: 'layout',
          content: [
            {
              id: 'program-3-heading',
              type: 'heading',
              content: 'Word Wizards Guild (Dyslexia Strengths)',
              settings: { 
                level: 2, 
                color: '#4CAF50'
              }
            },
            {
              id: 'program-3-paragraph',
              type: 'paragraph',
              content: 'Our Word Wizards program transforms reading and writing challenges into creative storytelling and visual thinking superpowers.',
              settings: {}
            },
            {
              id: 'program-3-features',
              type: 'list',
              content: [
                'Multi-sensory reading and writing instruction (Orton-Gillingham approach)',
                'Assistive technology for reading and writing support',
                'Audio books and text-to-speech tools',
                'Visual storytelling through art, comics, and digital media',
                'Emphasis on verbal skills and discussion-based learning'
              ],
              settings: {}
            },
            {
              id: 'program-3-quote',
              type: 'paragraph',
              content: '"Before Word Wizards, I thought I was bad at stories because reading was hard. Now I know I'm actually great at stories - I just tell them in different ways like comic books and voice recordings!" - Jamie, Age 10',
              settings: { 
                style: 'italic',
                color: '#4CAF50'
              }
            }
          ],
          settings: {
            padding: 'medium'
          }
        }
      ],
      settings: {
        columns: 2,
        gap: 'large',
        background: '#E8F5E9',
        padding: 'medium',
        rounded: true
      }
    },
    {
      id: 'enrollment-heading',
      type: 'heading',
      content: 'Joining Our School',
      settings: { 
        level: 2, 
        align: 'center',
        color: '#4C2C8A'
      }
    },
    {
      id: 'enrollment-paragraph',
      type: 'paragraph',
      content: 'Our enrollment process is designed to be straightforward and accessible. We focus on understanding each student's unique profile of strengths and challenges.',
      settings: { 
        align: 'center'
      }
    },
    {
      id: 'enrollment-steps',
      type: 'list',
      content: [
        'Schedule a school tour (in-person or virtual)',
        'Complete our strengths-based student profile',
        'Attend a student visit day to experience our learning environment',
        'Meet with our admissions team to discuss program placement',
        'Receive enrollment decision and welcome packet'
      ],
      settings: { 
        style: 'ordered'
      }
    },
    {
      id: 'program-cta',
      type: 'layout',
      content: [
        {
          id: 'cta-heading',
          type: 'heading',
          content: 'Ready to Unlock Your Superpowers?',
          settings: { 
            level: 2, 
            align: 'center',
            color: '#ffffff'
          }
        },
        {
          id: 'cta-button',
          type: 'button',
          content: 'Schedule a Tour',
          settings: { 
            style: 'primary',
            size: 'large',
            align: 'center',
            background: '#ffffff',
            color: '#4C2C8A'
          }
        }
      ],
      settings: {
        columns: 1,
        padding: 'large',
        background: '#4C2C8A',
        rounded: true,
        align: 'center'
      }
    }
  ],

  // Resources page template with accessible layout for neurodivergent students
  resourcesPage: (): Block[] => [
    {
      id: 'resources-header',
      type: 'heading',
      content: 'Superhero Resources',
      settings: { 
        level: 1, 
        align: 'center',
        color: '#4C2C8A'
      }
    },
    {
      id: 'resources-intro',
      type: 'paragraph',
      content: 'We've gathered these resources to help you understand and celebrate neurodiversity. These tools are designed to be accessible for different learning styles.',
      settings: { 
        size: 'large',
        align: 'center' 
      }
    },
    {
      id: 'resources-categories',
      type: 'layout',
      content: [
        {
          id: 'for-students',
          type: 'layout',
          content: [
            {
              id: 'students-heading',
              type: 'heading',
              content: 'For Students',
              settings: { 
                level: 2, 
                align: 'center',
                color: '#4C2C8A'
              }
            },
            {
              id: 'students-image',
              type: 'image',
              content: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGhhcHB5JTIwY2hpbGRyZW58ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
              settings: {
                width: '100%',
                rounded: true,
                shadow: true,
                alt: 'Diverse group of students working together'
              }
            },
            {
              id: 'students-list',
              type: 'list',
              content: [
                '<a href="#">Sensory Regulation Strategies</a> - Visual guide with techniques you can use anywhere',
                '<a href="#">Famous Neurodivergent Superheroes</a> - Comic book series about real-life neurodivergent heroes',
                '<a href="#">The Superpower Podcast</a> - By kids, for kids, about embracing differences',
                '<a href="#">Calm Down Corner Guide</a> - How to create your own calming space at home',
                '<a href="#">Social Scripts Library</a> - Visual guides for navigating social situations'
              ],
              settings: {
                style: 'unordered'
              }
            }
          ],
          settings: {
            padding: 'medium',
            background: '#F0E6FF', // Light purple
            rounded: true
          }
        },
        {
          id: 'for-families',
          type: 'layout',
          content: [
            {
              id: 'families-heading',
              type: 'heading',
              content: 'For Families',
              settings: { 
                level: 2, 
                align: 'center',
                color: '#4C2C8A'
              }
            },
            {
              id: 'families-image',
              type: 'image',
              content: 'https://images.unsplash.com/photo-1608583774426-2f26b1b71927?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGZhbWlseSUyMHJlYWRpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
              settings: {
                width: '100%',
                rounded: true,
                shadow: true,
                alt: 'Family reading together'
              }
            },
            {
              id: 'families-list',
              type: 'list',
              content: [
                '<a href="#">Strengths-Based Parenting Guide</a> - How to focus on your child's unique abilities',
                '<a href="#">Creating Sensory-Friendly Homes</a> - Simple modifications for every budget',
                '<a href="#">Parent Support Group Schedule</a> - Monthly virtual and in-person meetings',
                '<a href="#">Advocacy Toolkit</a> - Resources for supporting your child in all environments',
                '<a href="#">Family Book Club List</a> - Books featuring neurodivergent characters'
              ],
              settings: {
                style: 'unordered'
              }
            }
          ],
          settings: {
            padding: 'medium',
            background: '#E6F7FF', // Light blue
            rounded: true
          }
        },
        {
          id: 'for-educators',
          type: 'layout',
          content: [
            {
              id: 'educators-heading',
              type: 'heading',
              content: 'For Educators',
              settings: { 
                level: 2, 
                align: 'center',
                color: '#4C2C8A'
              }
            },
            {
              id: 'educators-image',
              type: 'image',
              content: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8dGVhY2hlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
              settings: {
                width: '100%',
                rounded: true,
                shadow: true,
                alt: 'Teacher working with student'
              }
            },
            {
              id: 'educators-list',
              type: 'list',
              content: [
                '<a href="#">Universal Design for Learning Toolkit</a> - Practical classroom strategies',
                '<a href="#">Professional Development Workshops</a> - Schedule and registration',
                '<a href="#">Classroom Sensory Audit Guide</a> - Identifying and addressing sensory barriers',
                '<a href="#">Executive Function Support Strategies</a> - Helping students with organization',
                '<a href="#">Inclusive Communication Methods</a> - Supporting all communication styles'
              ],
              settings: {
                style: 'unordered'
              }
            }
          ],
          settings: {
            padding: 'medium',
            background: '#E8F5E9', // Light green
            rounded: true
          }
        }
      ],
      settings: {
        columns: 3,
        gap: 'medium'
      }
    }
  ]
};

// Export a function to generate a template based on the page type
export const generateNeurodivergentTemplate = (
  pageType: 'home' | 'about' | 'programs' | 'resources'
): Block[] => {
  switch (pageType) {
    case 'home':
      return neurodivergentSuperherosTemplates.homePage();
    case 'about':
      return neurodivergentSuperherosTemplates.aboutPage();
    case 'programs':
      return neurodivergentSuperherosTemplates.programsPage();
    case 'resources':
      return neurodivergentSuperherosTemplates.resourcesPage();
    default:
      return neurodivergentSuperherosTemplates.homePage();
  }
};