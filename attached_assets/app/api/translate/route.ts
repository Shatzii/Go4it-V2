import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage, sourceLanguage } = await request.json();
    
    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Mock translation service - in production, integrate with Google Translate API or similar
    const translatedText = await translateText(text, targetLanguage, sourceLanguage);
    
    return NextResponse.json({
      translatedText,
      sourceLanguage: sourceLanguage === 'auto' ? 'en' : sourceLanguage,
      targetLanguage,
      confidence: 0.95
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}

async function translateText(text: string, targetLanguage: string, sourceLanguage: string): Promise<string> {
  // This is a mock implementation. In production, you would integrate with:
  // - Google Translate API
  // - Azure Translator
  // - AWS Translate
  // - OpenAI API for translation
  
  const translations: Record<string, Record<string, string>> = {
    'hello': {
      'es': 'hola',
      'fr': 'bonjour',
      'de': 'hallo',
      'zh': '你好',
      'ja': 'こんにちは',
      'ar': 'مرحبا',
      'hi': 'नमस्ते',
      'pt': 'olá',
      'ru': 'привет'
    },
    'welcome': {
      'es': 'bienvenido',
      'fr': 'bienvenue',
      'de': 'willkommen',
      'zh': '欢迎',
      'ja': 'いらっしゃいませ',
      'ar': 'أهلا وسهلا',
      'hi': 'स्वागत है',
      'pt': 'bem-vindo',
      'ru': 'добро пожаловать'
    },
    'thank you': {
      'es': 'gracias',
      'fr': 'merci',
      'de': 'danke',
      'zh': '谢谢',
      'ja': 'ありがとう',
      'ar': 'شكرا',
      'hi': 'धन्यवाद',
      'pt': 'obrigado',
      'ru': 'спасибо'
    }
  };

  const lowerText = text.toLowerCase();
  
  // Check for simple word translations
  if (translations[lowerText] && translations[lowerText][targetLanguage]) {
    return translations[lowerText][targetLanguage];
  }
  
  // For more complex translations, you would call the actual translation service
  // For now, return a mock translation
  const mockTranslations: Record<string, string> = {
    'es': `[ES] ${text}`,
    'fr': `[FR] ${text}`,
    'de': `[DE] ${text}`,
    'zh': `[中文] ${text}`,
    'ja': `[日本語] ${text}`,
    'ar': `[العربية] ${text}`,
    'hi': `[हिन्दी] ${text}`,
    'pt': `[PT] ${text}`,
    'ru': `[RU] ${text}`
  };
  
  return mockTranslations[targetLanguage] || `[${targetLanguage.toUpperCase()}] ${text}`;
}

export async function GET(request: NextRequest) {
  // Return supported languages
  const supportedLanguages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' }
  ];
  
  return NextResponse.json({ languages: supportedLanguages });
}