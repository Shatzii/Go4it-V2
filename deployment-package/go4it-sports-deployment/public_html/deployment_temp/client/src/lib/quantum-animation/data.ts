// Animation Presets and Data for the Quantum Animation Engine
// Version 5.0.1 - 256-bit Quantum HDR Pipeline

// Define animation presets and their details
export const animationPresets = [
  {
    id: 'sprint_40',
    name: '40-Yard Dash',
    category: 'sprint',
    description: 'Advanced 40-yard sprint animation with real-time tracking',
    status: 'active',
    version: '3.2.1',
    frameRate: 60,
    duration: 5.2,
    resolution: '4K',
    fileSize: 28.4,
    lastModified: '2025-04-12T08:30:00Z',
    dependencies: ['core-motion', 'physics-engine', 'motion-blur'],
    metrics: [
      { id: 'time', name: 'Time', unit: 'seconds', precision: 2 },
      { id: 'acceleration', name: 'Acceleration', unit: 'm/s²', precision: 1 },
      { id: 'top_speed', name: 'Top Speed', unit: 'mph', precision: 1 },
      { id: 'stride_length', name: 'Stride Length', unit: 'inches', precision: 0 },
      { id: 'stride_rate', name: 'Stride Rate', unit: 'steps/s', precision: 1 }
    ],
    assets: [
      { id: 'video_file', name: 'Base Video', path: '/videos/40_yard_dash.mp4', type: 'video' },
      { id: 'html_file', name: 'HTML Renderer', path: '/videos/hd/40_yard_dash.html', type: 'html' },
      { id: 'motion_data', name: 'Motion Capture Data', path: '/data/sprint/motion_40yd.json', type: 'json' },
      { id: 'character_model', name: 'Athlete Model', path: '/models/athlete_sprint.glb', type: 'model' }
    ]
  },
  {
    id: 'vertical_jump',
    name: 'Vertical Jump',
    category: 'jump',
    description: 'Vertical leap measurement with power and height analytics',
    status: 'active',
    version: '3.0.5',
    frameRate: 120,
    duration: 3.5,
    resolution: '4K',
    fileSize: 22.7,
    lastModified: '2025-04-10T14:22:00Z',
    dependencies: ['core-motion', 'physics-engine', 'gravity-system'],
    metrics: [
      { id: 'height', name: 'Jump Height', unit: 'inches', precision: 1 },
      { id: 'power', name: 'Power Output', unit: 'watts', precision: 0 },
      { id: 'hang_time', name: 'Hang Time', unit: 'seconds', precision: 2 },
      { id: 'approach_speed', name: 'Approach Speed', unit: 'mph', precision: 1 }
    ],
    assets: [
      { id: 'video_file', name: 'Base Video', path: '/videos/vertical_jump.mp4', type: 'video' },
      { id: 'html_file', name: 'HTML Renderer', path: '/videos/hd/vertical_jump.html', type: 'html' },
      { id: 'motion_data', name: 'Motion Capture Data', path: '/data/jump/motion_vertical.json', type: 'json' },
      { id: 'character_model', name: 'Athlete Model', path: '/models/athlete_jump.glb', type: 'model' }
    ]
  },
  {
    id: 'agility_shuttle',
    name: 'Agility Drill',
    category: 'agility',
    description: '5-10-5 shuttle run with direction change analysis',
    status: 'active',
    version: '2.9.3',
    frameRate: 60,
    duration: 6.0,
    resolution: '4K',
    fileSize: 31.2,
    lastModified: '2025-04-11T11:15:00Z',
    dependencies: ['core-motion', 'physics-engine', 'direction-system'],
    metrics: [
      { id: 'time', name: 'Total Time', unit: 'seconds', precision: 2 },
      { id: 'change_dir_speed', name: 'Direction Change', unit: 'seconds', precision: 2 },
      { id: 'lateral_speed', name: 'Lateral Speed', unit: 'mph', precision: 1 },
      { id: 'stability', name: 'Stability', unit: '%', precision: 0 }
    ],
    assets: [
      { id: 'video_file', name: 'Base Video', path: '/videos/agility_drill.mp4', type: 'video' },
      { id: 'html_file', name: 'HTML Renderer', path: '/videos/hd/agility_drill.html', type: 'html' },
      { id: 'motion_data', name: 'Motion Capture Data', path: '/data/agility/motion_shuttle.json', type: 'json' },
      { id: 'character_model', name: 'Athlete Model', path: '/models/athlete_agility.glb', type: 'model' }
    ]
  },
  {
    id: 'bench_press',
    name: 'Bench Press',
    category: 'strength',
    description: 'Bench press strength test with form and power analysis',
    status: 'active',
    version: '2.7.8',
    frameRate: 60,
    duration: 4.0,
    resolution: '4K',
    fileSize: 24.5,
    lastModified: '2025-04-09T16:40:00Z',
    dependencies: ['core-motion', 'physics-engine', 'weight-system'],
    metrics: [
      { id: 'weight', name: 'Weight', unit: 'lbs', precision: 0 },
      { id: 'reps', name: 'Repetitions', unit: '', precision: 0 },
      { id: 'power', name: 'Power Output', unit: 'watts', precision: 0 },
      { id: 'form_score', name: 'Form Score', unit: '%', precision: 0 }
    ],
    assets: [
      { id: 'video_file', name: 'Base Video', path: '/videos/bench_press.mp4', type: 'video' },
      { id: 'html_file', name: 'HTML Renderer', path: '/videos/hd/bench_press.html', type: 'html' },
      { id: 'motion_data', name: 'Motion Capture Data', path: '/data/strength/motion_bench.json', type: 'json' },
      { id: 'character_model', name: 'Athlete Model', path: '/models/athlete_strength.glb', type: 'model' }
    ]
  }
];

// Define rendering engines with capabilities
export const renderingEngines = [
  { 
    id: 'quantum_hdr', 
    name: 'Quantum HDR Pipeline', 
    description: 'Hyper-realistic neural rendering with 256-bit color depth and advanced ray tracing',
    version: '5.0.1',
    capabilities: ['Neural Rendering', '256-bit Color', 'Quantum Ray Tracing', 'AI-driven Anti-aliasing', 'Volumetric Lighting'],
    performance: 98,
    quality: 100,
    compatibility: 80
  },
  { 
    id: 'web_real', 
    name: 'WebReal Engine', 
    description: 'Browser-optimized real-time rendering with WebGL2',
    version: '3.8.5',
    capabilities: ['WebGL2', 'Real-time Shadows', 'Skinned Meshes', 'Parallax Mapping'],
    performance: 92,
    quality: 87,
    compatibility: 96
  },
  { 
    id: 'mobile_hd', 
    name: 'Mobile HD Pipeline', 
    description: 'Mobile-optimized rendering with battery efficiency',
    version: '2.9.7',
    capabilities: ['Mobile Optimization', 'Battery Aware', 'Adaptive Quality', 'Hardware Acceleration'],
    performance: 88,
    quality: 82,
    compatibility: 98
  },
  { 
    id: 'html5_motion', 
    name: 'HTML5 Motion System', 
    description: 'Pure web standards implementation with CSS animations',
    version: '3.4.6',
    capabilities: ['CSS Animations', 'SVG Integration', 'Canvas 2D', 'Web Animation API'],
    performance: 90,
    quality: 80,
    compatibility: 100
  }
];

// Motion capture libraries
export const motionCaptureSystems = [
  {
    id: 'mocap_pro',
    name: 'MoCap Pro',
    description: 'Professional-grade motion capture processing system',
    formats: ['FBX', 'BVH', 'JSON', 'GLB'],
    precision: 'High',
    latency: 'Ultra-low',
    integration: ['Video Analysis', 'Real-time Feedback', 'Multi-camera']
  },
  {
    id: 'ai_motion',
    name: 'AI Motion Mapper',
    description: 'AI-powered video-to-motion capture system',
    formats: ['JSON', 'GLB', 'CSV'],
    precision: 'Medium-High',
    latency: 'Low',
    integration: ['Single Camera', 'Smartphone Compatible', 'Cloud Processing']
  },
  {
    id: 'html5_tracking',
    name: 'HTML5 Motion Tracker',
    description: 'Browser-based motion tracking using web APIs',
    formats: ['JSON', 'CSV'],
    precision: 'Medium',
    latency: 'Medium',
    integration: ['Webcam', 'Browser-only', 'Real-time']
  }
];