'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import {
  Languages,
  Globe,
  Volume2,
  BookOpen,
  Users,
  Settings,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Mic,
  Play,
} from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
  completeness: number;
  isActive: boolean;
}

interface TranslationProject {
  id: string;
  name: string;
  sourceLanguage: string;
  targetLanguages: string[];
  progress: number;
  totalStrings: number;
  translatedStrings: number;
  status: 'active' | 'completed' | 'paused';
}

interface CulturalAdaptation {
  language: string;
  dateFormat: string;
  numberFormat: string;
  currencyFormat: string;
  educationalSystem: string;
  culturalNotes: string[];
}

const supportedLanguages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    rtl: false,
    completeness: 100,
    isActive: true,
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    rtl: false,
    completeness: 95,
    isActive: true,
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    rtl: false,
    completeness: 90,
    isActive: true,
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    rtl: false,
    completeness: 85,
    isActive: true,
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    rtl: false,
    completeness: 80,
    isActive: true,
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    rtl: false,
    completeness: 75,
    isActive: true,
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    rtl: true,
    completeness: 70,
    isActive: true,
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    rtl: false,
    completeness: 65,
    isActive: false,
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    rtl: false,
    completeness: 60,
    isActive: false,
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    rtl: false,
    completeness: 55,
    isActive: false,
  },
];

export function MultilingualSupport() {
  const [activeLanguages, setActiveLanguages] = useState<Language[]>(
    supportedLanguages.filter((lang) => lang.isActive),
  );
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translationText, setTranslationText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [projects, setProjects] = useState<TranslationProject[]>([]);
  const [culturalAdaptations, setCulturalAdaptations] = useState<CulturalAdaptation[]>([]);
  const [autoDetectLanguage, setAutoDetectLanguage] = useState(true);
  const [enableSpeechToText, setEnableSpeechToText] = useState(true);
  const [enableTextToSpeech, setEnableTextToSpeech] = useState(true);

  useEffect(() => {
    loadTranslationProjects();
    loadCulturalAdaptations();
  }, []);

  const loadTranslationProjects = async () => {
    // Mock data for demonstration
    const mockProjects: TranslationProject[] = [
      {
        id: '1',
        name: 'Mathematics Course Content',
        sourceLanguage: 'en',
        targetLanguages: ['es', 'fr', 'de'],
        progress: 85,
        totalStrings: 1500,
        translatedStrings: 1275,
        status: 'active',
      },
      {
        id: '2',
        name: 'Science Lab Instructions',
        sourceLanguage: 'en',
        targetLanguages: ['zh', 'ja', 'ar'],
        progress: 60,
        totalStrings: 800,
        translatedStrings: 480,
        status: 'active',
      },
      {
        id: '3',
        name: 'User Interface Elements',
        sourceLanguage: 'en',
        targetLanguages: ['es', 'fr', 'de', 'zh', 'ja'],
        progress: 100,
        totalStrings: 500,
        translatedStrings: 500,
        status: 'completed',
      },
    ];
    setProjects(mockProjects);
  };

  const loadCulturalAdaptations = async () => {
    // Mock data for demonstration
    const mockAdaptations: CulturalAdaptation[] = [
      {
        language: 'es',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: '1.234,56',
        currencyFormat: '€1.234,56',
        educationalSystem: 'European/Spanish System',
        culturalNotes: [
          'Siesta time consideration',
          'Family-oriented learning',
          'Religious holidays',
        ],
      },
      {
        language: 'ja',
        dateFormat: 'YYYY/MM/DD',
        numberFormat: '1,234.56',
        currencyFormat: '¥1,234',
        educationalSystem: 'Japanese System',
        culturalNotes: ['Respect for teachers', 'Group harmony', 'Seasonal celebrations'],
      },
      {
        language: 'ar',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: '1,234.56',
        currencyFormat: '1,234.56 ر.س',
        educationalSystem: 'Islamic/Arabic System',
        culturalNotes: ['Prayer times', 'Islamic holidays', 'Gender considerations'],
      },
    ];
    setCulturalAdaptations(mockAdaptations);
  };

  const translateText = async () => {
    if (!translationText.trim()) return;

    setIsTranslating(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: translationText,
          targetLanguage: targetLanguage,
          sourceLanguage: autoDetectLanguage ? 'auto' : currentLanguage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTranslatedText(data.translatedText);
      } else {
        // Mock translation for demo
        setTranslatedText(`[${targetLanguage.toUpperCase()}] ${translationText}`);
      }
    } catch (error) {
      console.error('Translation failed:', error);
      setTranslatedText(`[${targetLanguage.toUpperCase()}] ${translationText}`);
    } finally {
      setIsTranslating(false);
    }
  };

  const speakText = (text: string, language: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const toggleLanguage = (languageCode: string) => {
    setActiveLanguages((prev) =>
      prev.map((lang) =>
        lang.code === languageCode ? { ...lang, isActive: !lang.isActive } : lang,
      ),
    );
  };

  const exportTranslations = () => {
    const data = {
      languages: activeLanguages,
      projects: projects,
      culturalAdaptations: culturalAdaptations,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translations.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCompletenessColor = (completeness: number) => {
    if (completeness >= 90) return 'bg-green-500';
    if (completeness >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Languages className="w-6 h-6" />
            Multilingual Support
          </h1>
          <p className="text-gray-600">Manage translations and cultural adaptations</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportTranslations}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync
          </Button>
        </div>
      </div>

      {/* Language Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Supported Languages
          </CardTitle>
          <CardDescription>Manage active languages and translation completeness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {supportedLanguages.map((language) => (
              <div key={language.code} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{language.flag}</span>
                    <div>
                      <h3 className="font-medium">{language.name}</h3>
                      <p className="text-sm text-gray-600">{language.nativeName}</p>
                    </div>
                  </div>
                  <Switch
                    checked={language.isActive}
                    onCheckedChange={() => toggleLanguage(language.code)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completeness</span>
                    <span className="text-sm font-medium">{language.completeness}%</span>
                  </div>
                  <Progress value={language.completeness} className="h-2" />

                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    {language.rtl && <Badge variant="outline">RTL</Badge>}
                    <Badge variant={language.isActive ? 'default' : 'secondary'}>
                      {language.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Translation */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Translation</CardTitle>
          <CardDescription>Translate text instantly with AI-powered translation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Switch checked={autoDetectLanguage} onCheckedChange={setAutoDetectLanguage} />
              <label className="text-sm">Auto-detect language</label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={enableSpeechToText} onCheckedChange={setEnableSpeechToText} />
              <label className="text-sm">Speech-to-text</label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={enableTextToSpeech} onCheckedChange={setEnableTextToSpeech} />
              <label className="text-sm">Text-to-speech</label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Source Text</label>
                <div className="flex items-center gap-2">
                  {!autoDetectLanguage && (
                    <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {activeLanguages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.flag} {lang.code.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {enableSpeechToText && (
                    <Button variant="outline" size="sm">
                      <Mic className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              <Textarea
                placeholder="Enter text to translate..."
                value={translationText}
                onChange={(e) => setTranslationText(e.target.value)}
                className="min-h-32"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Translated Text</label>
                <div className="flex items-center gap-2">
                  <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {activeLanguages
                        .filter((lang) => lang.code !== currentLanguage)
                        .map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.flag} {lang.code.toUpperCase()}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {enableTextToSpeech && translatedText && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => speakText(translatedText, targetLanguage)}
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              <Textarea
                placeholder="Translation will appear here..."
                value={translatedText}
                readOnly
                className="min-h-32"
              />
            </div>
          </div>

          <Button
            onClick={translateText}
            disabled={isTranslating || !translationText.trim()}
            className="w-full"
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </Button>
        </CardContent>
      </Card>

      {/* Translation Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Translation Projects</CardTitle>
          <CardDescription>Manage large-scale translation projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{project.name}</h3>
                  <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Progress</span>
                    <span className="text-sm font-medium">
                      {project.translatedStrings} / {project.totalStrings} strings
                    </span>
                  </div>
                  <Progress value={project.progress} className="h-2" />

                  <div className="flex items-center gap-2 text-sm">
                    <span>Source: {project.sourceLanguage.toUpperCase()}</span>
                    <span>→</span>
                    <span>
                      Targets:{' '}
                      {project.targetLanguages.map((lang) => lang.toUpperCase()).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cultural Adaptations */}
      <Card>
        <CardHeader>
          <CardTitle>Cultural Adaptations</CardTitle>
          <CardDescription>Customize content for different cultural contexts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {culturalAdaptations.map((adaptation) => (
              <div key={adaptation.language} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">
                    {supportedLanguages.find((lang) => lang.code === adaptation.language)?.flag}
                  </span>
                  <h3 className="font-medium">
                    {supportedLanguages.find((lang) => lang.code === adaptation.language)?.name}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Date Format</span>
                      <span className="text-sm">{adaptation.dateFormat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Number Format</span>
                      <span className="text-sm">{adaptation.numberFormat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Currency Format</span>
                      <span className="text-sm">{adaptation.currencyFormat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Educational System</span>
                      <span className="text-sm">{adaptation.educationalSystem}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Cultural Notes</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {adaptation.culturalNotes.map((note, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span>•</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
