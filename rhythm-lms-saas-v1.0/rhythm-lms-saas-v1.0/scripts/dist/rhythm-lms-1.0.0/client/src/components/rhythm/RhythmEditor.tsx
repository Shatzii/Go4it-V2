import React, { useState, useEffect, useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Types for editor settings with neurodivergent-friendly options
interface EditorSettings {
  theme: 'vs-dark' | 'light' | 'high-contrast' | 'adhd-friendly' | 'autism-friendly' | 'dyslexia-friendly';
  fontSize: number;
  fontFamily: string;
  wordWrap: 'on' | 'off';
  lineHeight: number;
  letterSpacing: number;
  cursorWidth: number;
  highlightActiveLine: boolean;
  highlightCurrentScope: boolean;
  showLineNumbers: boolean;
  enableLivePreview: boolean;
  focusMode: 'off' | 'line' | 'paragraph';
  visualGuides: boolean;
  autocompletionLevel: 'minimal' | 'standard' | 'verbose';
}

// Neurodivergent profile presets
const profiles = {
  'standard': {
    theme: 'vs-dark' as const,
    fontSize: 14,
    fontFamily: 'Consolas, "Courier New", monospace',
    wordWrap: 'on' as const,
    lineHeight: 1.5,
    letterSpacing: 0,
    cursorWidth: 2,
    highlightActiveLine: true,
    highlightCurrentScope: true,
    showLineNumbers: true,
    enableLivePreview: true,
    focusMode: 'off' as const,
    visualGuides: true,
    autocompletionLevel: 'standard' as const,
  },
  'adhd-friendly': {
    theme: 'adhd-friendly' as const,
    fontSize: 16,
    fontFamily: 'Verdana, Arial, sans-serif',
    wordWrap: 'on' as const,
    lineHeight: 1.8,
    letterSpacing: 0.5,
    cursorWidth: 3,
    highlightActiveLine: true,
    highlightCurrentScope: true,
    showLineNumbers: true,
    enableLivePreview: true, 
    focusMode: 'line' as const,
    visualGuides: true,
    autocompletionLevel: 'minimal' as const,
  },
  'autism-friendly': {
    theme: 'autism-friendly' as const,
    fontSize: 15,
    fontFamily: 'Arial, sans-serif',
    wordWrap: 'on' as const,
    lineHeight: 1.7,
    letterSpacing: 0.3,
    cursorWidth: 2,
    highlightActiveLine: true,
    highlightCurrentScope: true,
    showLineNumbers: true,
    enableLivePreview: false, // Fewer distractions
    focusMode: 'paragraph' as const,
    visualGuides: true,
    autocompletionLevel: 'verbose' as const, // More detailed guidance
  },
  'dyslexia-friendly': {
    theme: 'dyslexia-friendly' as const,
    fontSize: 16,
    fontFamily: 'OpenDyslexic, Comic Sans MS, Arial, sans-serif',
    wordWrap: 'on' as const,
    lineHeight: 2,
    letterSpacing: 0.7,
    cursorWidth: 3,
    highlightActiveLine: true,
    highlightCurrentScope: true,
    showLineNumbers: true,
    enableLivePreview: true,
    focusMode: 'line' as const,
    visualGuides: true,
    autocompletionLevel: 'standard' as const,
  }
};

// Superhero theme colors for syntax highlighting
const superheroThemeColors = {
  'focus-force': {
    primary: '#8B5CF6', // Purple
    secondary: '#3B82F6', // Blue
    background: '#1E1E3F', // Dark purple-blue
    text: '#E2E8F0',
    keyword: '#FF79C6', // Pink
    string: '#A9E34B', // Green
    comment: '#6B7280', // Gray
    tag: '#F472B6', // Pink
    attribute: '#60A5FA', // Blue
    variable: '#F59E0B', // Amber
  },
  'pattern-pioneers': {
    primary: '#2563EB', // Blue
    secondary: '#0EA5E9', // Sky blue
    background: '#0F172A', // Dark blue
    text: '#E2E8F0',
    keyword: '#3B82F6', // Blue
    string: '#10B981', // Green
    comment: '#64748B', // Slate
    tag: '#2563EB', // Blue 
    attribute: '#4ADE80', // Green
    variable: '#F59E0B', // Amber
  },
  'sensory-squad': {
    primary: '#0D9488', // Teal
    secondary: '#14B8A6', // Teal light
    background: '#042F2E', // Dark teal
    text: '#E2E8F0',
    keyword: '#06B6D4', // Cyan
    string: '#22C55E', // Green
    comment: '#64748B', // Slate
    tag: '#0891B2', // Cyan dark
    attribute: '#4ADE80', // Green
    variable: '#FBBF24', // Amber
  },
  'vision-voyagers': {
    primary: '#EA580C', // Orange
    secondary: '#F97316', // Orange light
    background: '#27272A', // Zinc dark
    text: '#E2E8F0',
    keyword: '#F97316', // Orange
    string: '#84CC16', // Lime
    comment: '#A1A1AA', // Zinc
    tag: '#FB923C', // Orange light
    attribute: '#FACC15', // Yellow
    variable: '#38BDF8', // Sky
  }
};

// Sample rhythm template for new files
const DEFAULT_TEMPLATE = `@rhythm
@template: LessonPlan
@title: "My Superhero Lesson"
@subject: "Choose Subject"
@gradeLevel: "K-12"
@learningStyle: "Universal Design"
@superhero-theme: "Focus Force"

<hero-header>
  <title>Superhero Lesson: An Adventure in Learning</title>
  <theme-color>purple</theme-color>
</hero-header>

<section type="introduction" timer="5min">
  <h1>Welcome Superheroes!</h1>
  <p>Today we'll use our special powers to learn about...</p>
</section>

<section type="activity" timer="15min">
  <h2>Power Challenge</h2>
  <!-- Add your main activity content here -->
</section>

<section type="conclusion">
  <h2>Superpower Summary</h2>
  <progress-tracker />
  <reward-badge name="Learning Champion" condition="completion >= 80%" />
</section>

<footer>
  <superhero-quote>
    "With great knowledge comes great power!"
  </superhero-quote>
</footer>
`;

// Define Rhythm language syntax highlighting rules
const configureSyntaxHighlighting = (monaco: Monaco, theme: string = 'focus-force') => {
  // Get theme colors based on selected superhero theme
  const colors = superheroThemeColors[theme as keyof typeof superheroThemeColors] || 
                superheroThemeColors['focus-force'];
  
  // Register the custom Rhythm language
  monaco.languages.register({ id: 'rhythm' });

  // Define token providers for syntax highlighting
  monaco.languages.setMonarchTokensProvider('rhythm', {
    tokenizer: {
      root: [
        // Metadata tags
        [/@template:|@title:|@subject:|@gradeLevel:|@learningStyle:|@superhero-theme:/, 'keyword'],
        [/@rhythm/, 'keyword.rhythm'],
        
        // HTML-like tags
        [/<\/?[a-zA-Z][\w\-\.]*(?:\s+[a-zA-Z\-_]+(?:=(?:"[^"]*"|'[^']*'|[\w\-_]+))?)*\s*\/?>/, 'tag'],
        
        // Attribute names and values
        [/[a-zA-Z\-_]+(?==)/, 'attribute.name'],
        [/=/, 'operator'],
        [/"[^"]*"|'[^']*'/, 'attribute.value'],
        
        // Comments
        [/<!--.*?-->/, 'comment'],
        
        // String literals
        [/".*?"/, 'string'],
        [/'.*?'/, 'string'],

        // Curly braces for logic expressions
        [/{/, { token: 'delimiter.curly', next: '@curlyExp' }],
        [/}/, 'delimiter.curly'],
        
        // Variables
        [/\{[\w\.$]+\}/, 'variable'],
      ],
      
      // For expressions within curly braces
      curlyExp: [
        [/[^{}]+/, 'expression'],
        [/{/, { token: 'delimiter.curly', next: '@curlyExp' }],
        [/}/, { token: 'delimiter.curly', next: '@pop' }]
      ]
    }
  });

  // Create custom themes for different neurodivergent profiles
  monaco.editor.defineTheme('adhd-friendly', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: colors.keyword, fontStyle: 'bold' },
      { token: 'keyword.rhythm', foreground: colors.primary, fontStyle: 'bold' },
      { token: 'tag', foreground: colors.tag, fontStyle: 'bold' },
      { token: 'attribute.name', foreground: colors.attribute },
      { token: 'attribute.value', foreground: colors.string },
      { token: 'string', foreground: colors.string },
      { token: 'comment', foreground: colors.comment },
      { token: 'variable', foreground: colors.variable },
      { token: 'expression', foreground: colors.secondary },
    ],
    colors: {
      'editor.background': colors.background,
      'editor.foreground': colors.text,
      'editorCursor.foreground': colors.primary,
      'editor.lineHighlightBackground': '#FFFFFF15',
      'editorLineNumber.foreground': '#FFFFFF60',
      'editor.selectionBackground': '#FFFFFF30',
    }
  });

  monaco.editor.defineTheme('autism-friendly', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: colors.keyword, fontStyle: 'bold' },
      { token: 'keyword.rhythm', foreground: colors.primary, fontStyle: 'bold' },
      { token: 'tag', foreground: colors.tag },
      { token: 'attribute.name', foreground: colors.attribute },
      { token: 'attribute.value', foreground: colors.string },
      { token: 'string', foreground: colors.string },
      { token: 'comment', foreground: colors.comment },
      { token: 'variable', foreground: colors.variable },
      { token: 'expression', foreground: colors.secondary },
    ],
    colors: {
      'editor.background': '#0A1022', // Darker, less distracting background
      'editor.foreground': colors.text,
      'editorCursor.foreground': colors.primary,
      'editor.lineHighlightBackground': '#FFFFFF10', // Subtle highlighting
      'editorLineNumber.foreground': '#FFFFFF50',
      'editor.selectionBackground': '#FFFFFF25',
    }
  });

  monaco.editor.defineTheme('dyslexia-friendly', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: colors.keyword, fontStyle: 'bold' },
      { token: 'keyword.rhythm', foreground: colors.primary, fontStyle: 'bold' },
      { token: 'tag', foreground: colors.tag, fontStyle: 'bold' },
      { token: 'attribute.name', foreground: colors.attribute },
      { token: 'attribute.value', foreground: colors.string },
      { token: 'string', foreground: colors.string },
      { token: 'comment', foreground: colors.comment },
      { token: 'variable', foreground: colors.variable, fontStyle: 'bold' },
      { token: 'expression', foreground: colors.secondary },
    ],
    colors: {
      'editor.background': '#1A1A2E', // Dark blue background (easier on the eyes)
      'editor.foreground': '#F0F0F5', // High contrast foreground
      'editorCursor.foreground': colors.primary,
      'editor.lineHighlightBackground': '#FFFFFF18', // Clearer line highlight
      'editorLineNumber.foreground': '#FFFFFF70', // More visible line numbers
      'editor.selectionBackground': '#FFFFFF35', // More visible selection
    }
  });
  
  // Set completions for Rhythm language
  monaco.languages.registerCompletionItemProvider('rhythm', {
    provideCompletionItems: (model, position) => {
      const line = model.getLineContent(position.lineNumber);
      
      // For tags
      if (line.trim().startsWith('<') || /<\w*$/.test(line.substring(0, position.column))) {
        return {
          suggestions: [
            {
              label: 'hero-header',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'hero-header>\n  <title>${1:Title}</title>\n  <theme-color>${2:purple}</theme-color>\n</hero-header>',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'Main header with title and theme',
              documentation: 'Creates the hero header section with title and theme color.'
            },
            {
              label: 'section',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'section type="${1:introduction}" timer="${2:5min}">\n  <h1>${3:Section Title}</h1>\n  <p>${4:Content goes here}</p>\n</section>',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'Content section with type and timer',
              documentation: 'Creates a content section with optional type and timer attributes.'
            },
            {
              label: 'movement-break',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'movement-break timer="${1:30sec}">\n  <instruction>${2:Movement instructions}</instruction>\n</movement-break>',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'ADHD-friendly movement break',
              documentation: 'Adds a timed movement break with instructions for students with ADHD.'
            },
            {
              label: 'visual-schedule',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'visual-schedule>\n  <activity minutes="${1:5}">${2:Activity description}</activity>\n</visual-schedule>',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'Autism-friendly visual schedule',
              documentation: 'Creates a visual schedule of activities for autistic students.'
            },
            {
              label: 'font-options',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'font-options>\n  <font name="OpenDyslexic" default="true" />\n  <font name="Comic Sans MS" />\n  <font name="Arial" />\n</font-options>',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'Dyslexia-friendly font options',
              documentation: 'Provides dyslexia-friendly font choices for reading content.'
            },
            {
              label: 'superhero-quote',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'superhero-quote>\n  "${1:With great knowledge comes great power!}"\n</superhero-quote>',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'Motivational superhero quote',
              documentation: 'Adds an inspirational superhero-themed quote.'
            }
          ]
        };
      }
      
      // For metadata tags
      if (line.trim().startsWith('@') || /@\w*$/.test(line.substring(0, position.column))) {
        return {
          suggestions: [
            {
              label: '@rhythm',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: '@rhythm',
              detail: 'Rhythm language declaration',
              documentation: 'Declares this file as a Rhythm language template.'
            },
            {
              label: '@template:',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: '@template: "${1|LessonPlan,Activity,Story,Assessment,Game|}"',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'Template type declaration',
              documentation: 'Defines the type of educational template.'
            },
            {
              label: '@title:',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: '@title: "${1:Template Title}"',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'Template title',
              documentation: 'Sets the title of the template.'
            },
            {
              label: '@subject:',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: '@subject: "${1|Mathematics,English Language Arts,Science,Social Studies,History,Art,Music|}"',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'Subject area',
              documentation: 'Defines the academic subject for this template.'
            },
            {
              label: '@gradeLevel:',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: '@gradeLevel: "${1:K-12}"',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'Grade level range',
              documentation: 'Specifies the grade levels this template is designed for.'
            },
            {
              label: '@learningStyle:',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: '@learningStyle: "${1|ADHD-Friendly,Autism-Friendly,Dyslexia-Friendly,Dyscalculia-Friendly,Universal Design|}"',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'Neurodivergent learning style',
              documentation: 'Indicates which neurodivergent learning style this template is adapted for.'
            },
            {
              label: '@superhero-theme:',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: '@superhero-theme: "${1|Focus Force,Pattern Pioneers,Sensory Squad,Vision Voyagers,Memory Mavericks|}"',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'Superhero theme',
              documentation: 'Applies a superhero theme to engage students with the content.'
            }
          ]
        };
      }
      
      return { suggestions: [] };
    }
  });
  
  // Provide hover information for Rhythm elements
  monaco.languages.registerHoverProvider('rhythm', {
    provideHover: (model, position) => {
      const word = model.getWordAtPosition(position);
      if (!word) return null;
      
      const line = model.getLineContent(position.lineNumber);
      
      // For tags
      if (line.includes('<')) {
        const tagMatch = /<(\w+)/.exec(line);
        if (tagMatch && tagMatch[1]) {
          const tagName = tagMatch[1];
          
          const tagInfo: Record<string, { description: string, example: string }> = {
            'hero-header': {
              description: 'Main header section for the template with title and theme color.',
              example: '<hero-header>\n  <title>Focus Force: Math Adventure</title>\n  <theme-color>purple</theme-color>\n</hero-header>'
            },
            'section': {
              description: 'Content section with type and optional timer for time management.',
              example: '<section type="activity" timer="10min">\n  <h2>Main Activity</h2>\n  <p>Activity content goes here...</p>\n</section>'
            },
            'movement-break': {
              description: 'ADHD-friendly movement break with timer and instructions.',
              example: '<movement-break timer="30sec">\n  <instruction>Stand up and stretch</instruction>\n</movement-break>'
            },
            'visual-schedule': {
              description: 'Autism-friendly visual schedule showing activities and timeframes.',
              example: '<visual-schedule>\n  <activity minutes="5">Introduction</activity>\n  <activity minutes="10">Main activity</activity>\n</visual-schedule>'
            }
          };
          
          if (tagInfo[tagName]) {
            return {
              contents: [
                { value: `**${tagName}**` },
                { value: tagInfo[tagName].description },
                { value: '```rhythm\n' + tagInfo[tagName].example + '\n```' }
              ]
            };
          }
        }
      }
      
      // For metadata tags
      if (line.includes('@')) {
        const metaMatch = /@(\w+):?/.exec(line);
        if (metaMatch && metaMatch[1]) {
          const metaName = metaMatch[1];
          
          const metaInfo: Record<string, { description: string, example: string }> = {
            'rhythm': {
              description: 'Declares this file as a Rhythm language template.',
              example: '@rhythm'
            },
            'template': {
              description: 'Defines the type of educational template.',
              example: '@template: "LessonPlan"'
            },
            'title': {
              description: 'Sets the title of the template.',
              example: '@title: "Focus Force: Math Adventures"'
            },
            'subject': {
              description: 'Defines the academic subject for this template.',
              example: '@subject: "Mathematics"'
            },
            'gradeLevel': {
              description: 'Specifies the grade levels this template is designed for.',
              example: '@gradeLevel: "3-5"'
            },
            'learningStyle': {
              description: 'Indicates which neurodivergent learning style this template is adapted for.',
              example: '@learningStyle: "ADHD-Friendly"'
            },
            'superhero-theme': {
              description: 'Applies a superhero theme to engage students with the content.',
              example: '@superhero-theme: "Focus Force"'
            }
          };
          
          if (metaInfo[metaName]) {
            return {
              contents: [
                { value: `**@${metaName}**` },
                { value: metaInfo[metaName].description },
                { value: '```rhythm\n' + metaInfo[metaName].example + '\n```' }
              ]
            };
          }
        }
      }
      
      return null;
    }
  });
};

interface RhythmEditorProps {
  initialCode?: string;
  fileName?: string;
  onSave?: (code: string) => void;
}

const RhythmEditor: React.FC<RhythmEditorProps> = ({ 
  initialCode = DEFAULT_TEMPLATE,
  fileName = 'untitled.rhy',
  onSave
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [code, setCode] = useState(initialCode);
  const [editorSettings, setEditorSettings] = useState<EditorSettings>(profiles.standard);
  const [profile, setProfile] = useState<string>('standard');
  const [superheroTheme, setSuperheroTheme] = useState<string>('focus-force');
  const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'split'>('split');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved' | 'saving'>('saved');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Helper function to update editor settings
  const updateEditorSettings = (newSettings: Partial<EditorSettings>) => {
    setEditorSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  // Handle change of neurodivergent profile preset
  const handleProfileChange = (newProfile: string) => {
    setProfile(newProfile);
    
    // Update settings based on profile
    if (newProfile in profiles) {
      const profileSettings = profiles[newProfile as keyof typeof profiles];
      setEditorSettings(profileSettings);
      
      // Update the editor's options if it exists
      if (editorRef.current) {
        editorRef.current.updateOptions({
          fontSize: profileSettings.fontSize,
          fontFamily: profileSettings.fontFamily,
          wordWrap: profileSettings.wordWrap,
          lineHeight: profileSettings.lineHeight,
          letterSpacing: profileSettings.letterSpacing, 
          cursorWidth: profileSettings.cursorWidth
        });
      }
    }
  };
  
  // Handle change of superhero theme
  const handleSuperheroThemeChange = (newTheme: string) => {
    setSuperheroTheme(newTheme);
    
    // Reconfigure syntax highlighting with new theme
    if (monacoRef.current) {
      configureSyntaxHighlighting(monacoRef.current, newTheme);
      
      // Update editor theme based on profile
      if (editorRef.current) {
        editorRef.current.updateOptions({
          theme: editorSettings.theme
        });
      }
    }
  };
  
  // Handle saving code
  const handleSave = () => {
    if (onSave) {
      setIsSaving(true);
      setSaveStatus('saving');
      
      // Simulate network delay
      setTimeout(() => {
        onSave(code);
        setIsSaving(false);
        setSaveStatus('saved');
      }, 600);
    }
  };
  
  // Initialize Monaco editor
  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    // Configure Rhythm language highlighting
    configureSyntaxHighlighting(monaco, superheroTheme);
    
    // Set editor options based on current settings
    editor.updateOptions({
      fontSize: editorSettings.fontSize,
      fontFamily: editorSettings.fontFamily,
      wordWrap: editorSettings.wordWrap,
      lineHeight: editorSettings.lineHeight,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      theme: editorSettings.theme
    });
    
    // Add keyboard shortcut for save
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });
    
    // Add focus line highlighting for focus mode
    if (editorSettings.focusMode !== 'off') {
      const lineDecorationsCollection = editor.createDecorationsCollection();
      
      editor.onDidChangeCursorPosition((e) => {
        if (editorSettings.focusMode === 'line') {
          // Highlight current line
          const decorations = [{
            range: new monaco.Range(e.position.lineNumber, 1, e.position.lineNumber, 1),
            options: {
              isWholeLine: true,
              className: 'focused-line',
              inlineClassName: 'focused-text'
            }
          }];
          lineDecorationsCollection.set(decorations);
        } else if (editorSettings.focusMode === 'paragraph') {
          // Find paragraph boundaries
          const model = editor.getModel();
          if (!model) return;
          
          let startLine = e.position.lineNumber;
          let endLine = e.position.lineNumber;
          
          // Find paragraph start (empty line or start of file)
          while (startLine > 1) {
            const lineContent = model.getLineContent(startLine - 1).trim();
            if (lineContent === '') break;
            startLine--;
          }
          
          // Find paragraph end (empty line or end of file)
          const lineCount = model.getLineCount();
          while (endLine < lineCount) {
            const lineContent = model.getLineContent(endLine + 1).trim();
            if (lineContent === '') break;
            endLine++;
          }
          
          // Highlight paragraph
          const decorations = [{
            range: new monaco.Range(startLine, 1, endLine, 1),
            options: {
              isWholeLine: true,
              className: 'focused-paragraph',
              inlineClassName: 'focused-text'
            }
          }];
          lineDecorationsCollection.set(decorations);
        }
      });
    }
  };
  
  // Handle code changes
  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      setSaveStatus('unsaved');
    }
  };
  
  // Render a preview of the template
  const renderPreview = () => {
    // Extract template metadata
    const titleMatch = /@title:\s*"([^"]*)"/.exec(code);
    const title = titleMatch ? titleMatch[1] : 'Untitled Template';
    
    const subjectMatch = /@subject:\s*"([^"]*)"/.exec(code);
    const subject = subjectMatch ? subjectMatch[1] : 'Subject not specified';
    
    const gradeLevelMatch = /@gradeLevel:\s*"([^"]*)"/.exec(code);
    const gradeLevel = gradeLevelMatch ? gradeLevelMatch[1] : 'Grade level not specified';
    
    const learningStyleMatch = /@learningStyle:\s*"([^"]*)"/.exec(code);
    const learningStyle = learningStyleMatch ? learningStyleMatch[1] : 'Universal Design';
    
    const themeMatch = /@superhero-theme:\s*"([^"]*)"/.exec(code);
    const theme = themeMatch ? themeMatch[1] : 'Focus Force';
    
    // Simulated preview (in real implementation, this would render actual content)
    return (
      <div className="p-6 bg-dark-900 rounded-md border border-dark-700">
        <div className="p-4 rounded-t-md bg-gradient-to-r from-indigo-700 to-purple-700">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="bg-white/20">{subject}</Badge>
            <Badge variant="secondary" className="bg-white/20">Grades {gradeLevel}</Badge>
          </div>
        </div>
        
        <div className="bg-dark-800 p-5 rounded-b-md">
          <div className="flex items-center gap-3 mb-3">
            <Badge className="bg-purple-600">{learningStyle}</Badge>
            <Badge className="bg-indigo-600">{theme}</Badge>
          </div>
          
          <div className="mb-5">
            <h3 className="text-lg font-semibold mb-2">Preview</h3>
            <p className="text-gray-300 text-sm mb-4">
              This is a simplified preview of how your template will appear to students.
              The actual rendered version will include all interactive elements and adaptations.
            </p>
          </div>
          
          <div className="border border-dark-600 rounded-md p-4 my-4 bg-dark-900">
            <h4 className="font-medium mb-2">Introduction Section</h4>
            <div className="h-24 flex items-center justify-center border border-dashed border-dark-600 rounded bg-dark-950/50 mb-2">
              <span className="text-gray-500">Introduction content will render here</span>
            </div>
          </div>
          
          <div className="border border-dark-600 rounded-md p-4 my-4 bg-dark-900">
            <h4 className="font-medium mb-2">Activity Section</h4>
            <div className="h-24 flex items-center justify-center border border-dashed border-dark-600 rounded bg-dark-950/50 mb-2">
              <span className="text-gray-500">Activity content will render here</span>
            </div>
          </div>
          
          <div className="border border-dark-600 rounded-md p-4 my-4 bg-dark-900">
            <h4 className="font-medium mb-2">Conclusion Section</h4>
            <div className="h-24 flex items-center justify-center border border-dashed border-dark-600 rounded bg-dark-950/50 mb-2">
              <span className="text-gray-500">Conclusion content will render here</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-indigo-900/20 border border-indigo-900/30 rounded-md">
            <div className="flex items-center gap-2">
              <i className="ri-information-line text-indigo-400"></i>
              <span className="text-indigo-300 text-sm">
                This template includes {learningStyle} adaptations that will be applied during rendering.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Inject custom CSS for editor appearance
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .focused-line {
        background-color: rgba(255, 255, 255, 0.07);
      }
      .focused-paragraph {
        background-color: rgba(255, 255, 255, 0.05);
      }
      .focused-text {
        font-weight: normal;
      }
      
      /* Custom scrollbars for improved visibility */
      .monaco-editor .monaco-scrollable-element > .scrollbar > .slider {
        background: rgba(100, 100, 150, 0.4) !important;
      }
      .monaco-editor .monaco-scrollable-element > .scrollbar > .slider:hover {
        background: rgba(100, 100, 150, 0.6) !important;
      }
      
      /* Improved line number contrast */
      .monaco-editor .margin-view-overlays .line-numbers {
        color: rgba(180, 180, 200, 0.8) !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Update editor when settings change
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize: editorSettings.fontSize,
        fontFamily: editorSettings.fontFamily,
        wordWrap: editorSettings.wordWrap,
        lineHeight: editorSettings.lineHeight,
        letterSpacing: editorSettings.letterSpacing,
        theme: editorSettings.theme
      });
    }
  }, [editorSettings]);
  
  // Handle fullscreen mode
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isFullscreen]);
  
  return (
    <motion.div 
      className={`${isFullscreen ? 'fixed inset-0 z-50 bg-dark-950 p-4' : 'w-full'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col h-full rounded-lg border border-dark-700 bg-dark-900 overflow-hidden">
        {/* Editor Header */}
        <div className="flex items-center justify-between p-2 border-b border-dark-700 bg-dark-800">
          <div className="flex items-center">
            <div className="flex items-center bg-dark-700 px-3 py-1.5 rounded-md mr-3">
              <i className="ri-rhythm-line text-indigo-400 mr-1.5"></i>
              <span className="text-sm font-medium text-gray-200">{fileName}</span>
              <span className="ml-2 text-xs text-gray-500">
                {saveStatus === 'unsaved' && '●'}
                {saveStatus === 'saving' && '...'}
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-white h-8"
                onClick={handleSave}
                disabled={isSaving || saveStatus === 'saved'}
              >
                <i className="ri-save-line mr-1"></i> Save
              </Button>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-400 hover:text-white h-8 w-8"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    <i className={`ri-${isFullscreen ? 'fullscreen-exit' : 'fullscreen'}-line`}></i>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="mr-2">
              <Select
                value={profile}
                onValueChange={handleProfileChange}
              >
                <SelectTrigger className="h-8 bg-dark-700 border-dark-600 text-sm w-[160px]">
                  <SelectValue placeholder="Choose profile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="adhd-friendly">ADHD-Friendly</SelectItem>
                  <SelectItem value="autism-friendly">Autism-Friendly</SelectItem>
                  <SelectItem value="dyslexia-friendly">Dyslexia-Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-dark-700 rounded-md flex overflow-hidden">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-8 px-3 ${viewMode === 'editor' ? 'bg-dark-600 text-white' : 'text-gray-400'}`}
                onClick={() => setViewMode('editor')}
              >
                <i className="ri-code-line mr-1"></i> Code
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-8 px-3 ${viewMode === 'split' ? 'bg-dark-600 text-white' : 'text-gray-400'}`}
                onClick={() => setViewMode('split')}
              >
                <i className="ri-layout-left-right-line mr-1"></i> Split
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-8 px-3 ${viewMode === 'preview' ? 'bg-dark-600 text-white' : 'text-gray-400'}`}
                onClick={() => setViewMode('preview')}
              >
                <i className="ri-eye-line mr-1"></i> Preview
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor Pane */}
          {(viewMode === 'editor' || viewMode === 'split') && (
            <div className={`
              ${viewMode === 'split' ? 'w-1/2 border-r border-dark-700' : 'w-full'}
              flex flex-col min-h-0
            `}>
              <div className="flex-1">
                <Editor
                  height="100%"
                  language="rhythm"
                  theme={editorSettings.theme}
                  value={code}
                  onChange={handleCodeChange}
                  onMount={handleEditorDidMount}
                  options={{
                    fontSize: editorSettings.fontSize,
                    fontFamily: editorSettings.fontFamily,
                    wordWrap: editorSettings.wordWrap,
                    lineHeight: editorSettings.lineHeight,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    tabSize: 2,
                    suggest: {
                      showWords: true,
                      snippetsPreventQuickSuggestions: false,
                    },
                    renderWhitespace: 'boundary',
                    links: true,
                    lineNumbers: editorSettings.showLineNumbers ? 'on' : 'off',
                  }}
                />
              </div>
            </div>
          )}
          
          {/* Preview Pane */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className={`
              ${viewMode === 'split' ? 'w-1/2' : 'w-full'}
              overflow-auto
            `}>
              <div className="p-4">
                {renderPreview()}
              </div>
            </div>
          )}
        </div>
        
        {/* Settings Panel */}
        <div className="border-t border-dark-700 bg-dark-800">
          <Tabs defaultValue="appearance" className="w-full">
            <div className="flex items-center px-4 pt-1">
              <TabsList className="bg-dark-900">
                <TabsTrigger value="appearance" className="text-xs data-[state=active]:bg-dark-700">
                  <i className="ri-palette-line mr-1"></i> Appearance
                </TabsTrigger>
                <TabsTrigger value="accessibility" className="text-xs data-[state=active]:bg-dark-700">
                  <i className="ri-eye-line mr-1"></i> Accessibility
                </TabsTrigger>
                <TabsTrigger value="themes" className="text-xs data-[state=active]:bg-dark-700">
                  <i className="ri-superhero-line mr-1"></i> Themes
                </TabsTrigger>
                <TabsTrigger value="help" className="text-xs data-[state=active]:bg-dark-700">
                  <i className="ri-question-line mr-1"></i> Help
                </TabsTrigger>
              </TabsList>
              
              <div className="ml-auto">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 text-xs px-2 text-gray-400"
                  onClick={() => handleProfileChange('standard')}
                >
                  Reset to Default
                </Button>
              </div>
            </div>
            
            <TabsContent value="appearance" className="p-4 pt-2 space-y-4 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs text-gray-400 mb-1.5 block">Editor Theme</Label>
                  <Select
                    value={editorSettings.theme}
                    onValueChange={(value) => updateEditorSettings({ theme: value as any })}
                  >
                    <SelectTrigger className="h-8 bg-dark-700 border-dark-600 text-sm">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vs-dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="high-contrast">High Contrast</SelectItem>
                      <SelectItem value="adhd-friendly">ADHD-Friendly</SelectItem>
                      <SelectItem value="autism-friendly">Autism-Friendly</SelectItem>
                      <SelectItem value="dyslexia-friendly">Dyslexia-Friendly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-xs text-gray-400 mb-1.5 block">Font Family</Label>
                  <Select
                    value={editorSettings.fontFamily}
                    onValueChange={(value) => updateEditorSettings({ fontFamily: value })}
                  >
                    <SelectTrigger className="h-8 bg-dark-700 border-dark-600 text-sm">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consolas, 'Courier New', monospace">Consolas</SelectItem>
                      <SelectItem value="'Fira Code', monospace">Fira Code</SelectItem>
                      <SelectItem value="'OpenDyslexic', Arial, sans-serif">OpenDyslexic</SelectItem>
                      <SelectItem value="'Comic Sans MS', Arial, sans-serif">Comic Sans MS</SelectItem>
                      <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                      <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-xs text-gray-400 mb-1.5 block">Focus Mode</Label>
                  <Select
                    value={editorSettings.focusMode}
                    onValueChange={(value) => updateEditorSettings({ focusMode: value as any })}
                  >
                    <SelectTrigger className="h-8 bg-dark-700 border-dark-600 text-sm">
                      <SelectValue placeholder="Select focus mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="off">Off</SelectItem>
                      <SelectItem value="line">Highlight Line</SelectItem>
                      <SelectItem value="paragraph">Highlight Paragraph</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-gray-400">Font Size: {editorSettings.fontSize}px</Label>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-6 w-6 p-0 text-gray-400"
                        onClick={() => updateEditorSettings({ fontSize: Math.max(10, editorSettings.fontSize - 1) })}
                      >
                        <i className="ri-subtract-line"></i>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-6 w-6 p-0 text-gray-400"
                        onClick={() => updateEditorSettings({ fontSize: Math.min(30, editorSettings.fontSize + 1) })}
                      >
                        <i className="ri-add-line"></i>
                      </Button>
                    </div>
                  </div>
                  <Slider
                    min={10}
                    max={30}
                    step={1}
                    value={[editorSettings.fontSize]}
                    onValueChange={(value) => updateEditorSettings({ fontSize: value[0] })}
                    className="my-1.5"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-gray-400">Line Height: {editorSettings.lineHeight}x</Label>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-6 w-6 p-0 text-gray-400"
                        onClick={() => updateEditorSettings({ lineHeight: Math.max(1, editorSettings.lineHeight - 0.1) })}
                      >
                        <i className="ri-subtract-line"></i>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-6 w-6 p-0 text-gray-400"
                        onClick={() => updateEditorSettings({ lineHeight: Math.min(3, editorSettings.lineHeight + 0.1) })}
                      >
                        <i className="ri-add-line"></i>
                      </Button>
                    </div>
                  </div>
                  <Slider
                    min={1}
                    max={3}
                    step={0.1}
                    value={[editorSettings.lineHeight]}
                    onValueChange={(value) => updateEditorSettings({ lineHeight: value[0] })}
                    className="my-1.5"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-gray-400">Letter Spacing: {editorSettings.letterSpacing}px</Label>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-6 w-6 p-0 text-gray-400"
                        onClick={() => updateEditorSettings({ letterSpacing: Math.max(0, editorSettings.letterSpacing - 0.1) })}
                      >
                        <i className="ri-subtract-line"></i>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-6 w-6 p-0 text-gray-400"
                        onClick={() => updateEditorSettings({ letterSpacing: Math.min(2, editorSettings.letterSpacing + 0.1) })}
                      >
                        <i className="ri-add-line"></i>
                      </Button>
                    </div>
                  </div>
                  <Slider
                    min={0}
                    max={2}
                    step={0.1}
                    value={[editorSettings.letterSpacing]}
                    onValueChange={(value) => updateEditorSettings({ letterSpacing: value[0] })}
                    className="my-1.5"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="accessibility" className="p-4 pt-2 space-y-4 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-3">Reading & Comprehension</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Word Wrap</Label>
                      <Switch
                        checked={editorSettings.wordWrap === 'on'}
                        onCheckedChange={(checked) => updateEditorSettings({ wordWrap: checked ? 'on' : 'off' })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Show Line Numbers</Label>
                      <Switch
                        checked={editorSettings.showLineNumbers}
                        onCheckedChange={(checked) => updateEditorSettings({ showLineNumbers: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Visual Guides</Label>
                      <Switch
                        checked={editorSettings.visualGuides}
                        onCheckedChange={(checked) => updateEditorSettings({ visualGuides: checked })}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Focus & Attention</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Highlight Active Line</Label>
                      <Switch
                        checked={editorSettings.highlightActiveLine}
                        onCheckedChange={(checked) => updateEditorSettings({ highlightActiveLine: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Highlight Current Scope</Label>
                      <Switch
                        checked={editorSettings.highlightCurrentScope}
                        onCheckedChange={(checked) => updateEditorSettings({ highlightCurrentScope: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Live Preview</Label>
                      <Switch
                        checked={editorSettings.enableLivePreview}
                        onCheckedChange={(checked) => updateEditorSettings({ enableLivePreview: checked })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium mb-3">Accessibility Presets</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button 
                      variant="outline" 
                      className={`h-auto py-3 justify-start text-left ${profile === 'adhd-friendly' ? 'border-indigo-500 bg-indigo-900/20' : 'border-dark-700'}`}
                      onClick={() => handleProfileChange('adhd-friendly')}
                    >
                      <div>
                        <div className="flex items-center mb-1">
                          <i className="ri-focus-3-line text-indigo-400 mr-1.5"></i>
                          <span className="font-medium">ADHD-Friendly</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Increases spacing, adds movement breaks, and reduces distractions
                        </p>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className={`h-auto py-3 justify-start text-left ${profile === 'autism-friendly' ? 'border-blue-500 bg-blue-900/20' : 'border-dark-700'}`}
                      onClick={() => handleProfileChange('autism-friendly')}
                    >
                      <div>
                        <div className="flex items-center mb-1">
                          <i className="ri-rhythm-line text-blue-400 mr-1.5"></i>
                          <span className="font-medium">Autism-Friendly</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Adds structure, predictability, and reduces sensory overload
                        </p>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className={`h-auto py-3 justify-start text-left ${profile === 'dyslexia-friendly' ? 'border-orange-500 bg-orange-900/20' : 'border-dark-700'}`}
                      onClick={() => handleProfileChange('dyslexia-friendly')}
                    >
                      <div>
                        <div className="flex items-center mb-1">
                          <i className="ri-text-spacing text-orange-400 mr-1.5"></i>
                          <span className="font-medium">Dyslexia-Friendly</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Special fonts, increased spacing, and color contrast adjustments
                        </p>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="themes" className="p-4 pt-2 space-y-4 mt-0">
              <div>
                <h3 className="text-sm font-medium mb-3">Superhero Themes</h3>
                <p className="text-xs text-gray-400 mb-4">
                  Select a superhero theme to customize syntax highlighting and editor appearance.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card className={`
                    cursor-pointer border
                    ${superheroTheme === 'focus-force' ? 'border-indigo-600 bg-indigo-900/10' : 'border-dark-700 bg-dark-800'}
                  `} onClick={() => handleSuperheroThemeChange('focus-force')}>
                    <div className="p-3">
                      <div className="flex items-center mb-1">
                        <div className="w-4 h-4 rounded-full bg-indigo-600 mr-2"></div>
                        <h4 className="font-medium">Focus Force</h4>
                      </div>
                      <p className="text-xs text-gray-400">
                        Purple/blue theme focused on concentration and energy
                      </p>
                    </div>
                  </Card>
                  
                  <Card className={`
                    cursor-pointer border
                    ${superheroTheme === 'pattern-pioneers' ? 'border-blue-600 bg-blue-900/10' : 'border-dark-700 bg-dark-800'}
                  `} onClick={() => handleSuperheroThemeChange('pattern-pioneers')}>
                    <div className="p-3">
                      <div className="flex items-center mb-1">
                        <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
                        <h4 className="font-medium">Pattern Pioneers</h4>
                      </div>
                      <p className="text-xs text-gray-400">
                        Blue theme emphasizing structure and systematic thinking
                      </p>
                    </div>
                  </Card>
                  
                  <Card className={`
                    cursor-pointer border
                    ${superheroTheme === 'sensory-squad' ? 'border-teal-600 bg-teal-900/10' : 'border-dark-700 bg-dark-800'}
                  `} onClick={() => handleSuperheroThemeChange('sensory-squad')}>
                    <div className="p-3">
                      <div className="flex items-center mb-1">
                        <div className="w-4 h-4 rounded-full bg-teal-600 mr-2"></div>
                        <h4 className="font-medium">Sensory Squad</h4>
                      </div>
                      <p className="text-xs text-gray-400">
                        Teal theme designed for sensory processing and calm focus
                      </p>
                    </div>
                  </Card>
                  
                  <Card className={`
                    cursor-pointer border
                    ${superheroTheme === 'vision-voyagers' ? 'border-orange-600 bg-orange-900/10' : 'border-dark-700 bg-dark-800'}
                  `} onClick={() => handleSuperheroThemeChange('vision-voyagers')}>
                    <div className="p-3">
                      <div className="flex items-center mb-1">
                        <div className="w-4 h-4 rounded-full bg-orange-600 mr-2"></div>
                        <h4 className="font-medium">Vision Voyagers</h4>
                      </div>
                      <p className="text-xs text-gray-400">
                        Orange/warm theme optimized for visual processing and reading
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="help" className="p-4 pt-2 space-y-4 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Rhythm Language Basics</h3>
                  <p className="text-xs text-gray-400 mb-3">
                    The Rhythm language is designed for creating neurodivergent-friendly educational content
                    with superhero themes.
                  </p>
                  
                  <div className="space-y-2">
                    <div className="text-xs p-2 bg-dark-850 rounded-md">
                      <p className="font-mono text-indigo-400 mb-1">@rhythm</p>
                      <p className="text-gray-400">Declares a Rhythm template file</p>
                    </div>
                    
                    <div className="text-xs p-2 bg-dark-850 rounded-md">
                      <p className="font-mono text-indigo-400 mb-1">@template: "LessonPlan"</p>
                      <p className="text-gray-400">Specifies the template type</p>
                    </div>
                    
                    <div className="text-xs p-2 bg-dark-850 rounded-md">
                      <p className="font-mono text-indigo-400 mb-1">&lt;section type="activity"&gt;...&lt;/section&gt;</p>
                      <p className="text-gray-400">Creates a content section with specified type</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Keyboard Shortcuts</h3>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2 bg-dark-850 rounded-md">
                      <span className="text-gray-300">Save</span>
                      <span className="text-gray-400">Ctrl+S / ⌘+S</span>
                    </div>
                    
                    <div className="flex justify-between p-2 bg-dark-850 rounded-md">
                      <span className="text-gray-300">Format Document</span>
                      <span className="text-gray-400">Shift+Alt+F / Shift+⌥+F</span>
                    </div>
                    
                    <div className="flex justify-between p-2 bg-dark-850 rounded-md">
                      <span className="text-gray-300">Show Completions</span>
                      <span className="text-gray-400">Ctrl+Space / ⌘+Space</span>
                    </div>
                    
                    <div className="flex justify-between p-2 bg-dark-850 rounded-md">
                      <span className="text-gray-300">Toggle Preview</span>
                      <span className="text-gray-400">Ctrl+Alt+P / ⌘+⌥+P</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="outline" className="text-xs w-full">
                      <i className="ri-book-open-line mr-1"></i> View Full Documentation
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};

export default RhythmEditor;