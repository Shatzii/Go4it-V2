# Installing the Quantum Animation Engine

This guide will help you install and integrate the Quantum Animation Engine into your existing website.

## Prerequisites

- Node.js 16+ and npm/yarn
- React 18+
- TypeScript 4.5+
- TailwindCSS 3.0+

## Installation Options

### Option 1: Direct Copy

1. Copy the entire `client/src/lib/quantum-animation` folder to your project
2. Install the required dependencies:

```bash
npm install @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-tabs lucide-react
```

### Option 2: NPM Package (Future)

```bash
npm install quantum-animation-engine
```

## Set Up in Your Project

### Step 1: Import the Components

```tsx
// Import the main component
import { AdvancedAnimationStudio } from './lib/quantum-animation';

// If you need direct access to the data or utilities
import { 
  animationPresets, 
  renderingEngines,
  getBestRenderingEngine 
} from './lib/quantum-animation';
```

### Step 2: Add to Your Application

```tsx
function MyApp() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Animation Dashboard</h1>
      <AdvancedAnimationStudio />
    </div>
  );
}
```

### Step 3: Configure TailwindCSS

If you're using TailwindCSS, make sure your configuration includes the necessary components and variants.

Add to your `tailwind.config.js`:

```js
module.exports = {
  content: [
    // Include your application files
    "./src/**/*.{js,ts,jsx,tsx}",
    // Also include the quantum animation files
    "./src/lib/quantum-animation/**/*.{js,ts,jsx,tsx}",
  ],
  // Rest of your config
}
```

## Customization

### Custom Styling

The Quantum Animation Engine uses TailwindCSS for styling. You can customize the appearance by:

1. Modifying the theme colors in your `tailwind.config.js`
2. Adding custom classes to the components
3. Creating a custom wrapper component with your own styles

### Adding Custom Animations

To add your own animation presets:

```tsx
import { AdvancedAnimationStudio } from './lib/quantum-animation';
import { animationPresets } from './lib/quantum-animation/data';

// Add your custom animation preset
const customPresets = [
  ...animationPresets,
  {
    id: 'my_custom_animation',
    name: 'My Custom Animation',
    category: 'custom',
    description: 'A custom animation for my specific needs',
    status: 'active',
    version: '1.0.0',
    frameRate: 60,
    duration: 4.5,
    resolution: '4K',
    fileSize: 22.0,
    lastModified: new Date().toISOString(),
    dependencies: ['core-motion'],
    metrics: [
      { id: 'speed', name: 'Speed', unit: 'mph', precision: 1 }
    ],
    assets: [
      { id: 'video_file', name: 'Base Video', path: '/videos/custom.mp4', type: 'video' },
      { id: 'html_file', name: 'HTML Renderer', path: '/videos/hd/custom.html', type: 'html' }
    ]
  }
];

function MyCustomAnimationApp() {
  return (
    <div>
      <h1>Custom Animation Studio</h1>
      <AdvancedAnimationStudio customPresets={customPresets} />
    </div>
  );
}
```

## Troubleshooting

### Common Issues

1. **Component styling issues**: Make sure TailwindCSS is properly configured and all required dependencies are installed.

2. **Missing icons**: Ensure Lucide React is installed: `npm install lucide-react`

3. **Type errors**: Verify you have TypeScript 4.5+ installed and types are properly configured.

## Support

For additional support, contact us at support@go4itsports.com.

## License

MIT License