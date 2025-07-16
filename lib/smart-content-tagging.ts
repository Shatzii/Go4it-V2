import { AIModelManager } from './ai-models'

export interface ContentTag {
  id: string
  name: string
  category: 'sport' | 'skill' | 'performance' | 'event' | 'location' | 'equipment' | 'technique' | 'strategy'
  confidence: number
  relevance: number
  metadata?: {
    position?: string
    level?: 'beginner' | 'intermediate' | 'advanced' | 'elite'
    timestamp?: string
    duration?: number
    quality?: 'poor' | 'fair' | 'good' | 'excellent'
  }
}

export interface ContentAnalysis {
  fileType: 'video' | 'image' | 'document'
  primarySport: string
  secondarySports: string[]
  tags: ContentTag[]
  skills: {
    name: string
    level: number
    confidence: number
  }[]
  performance: {
    overall: number
    technical: number
    tactical: number
    physical: number
    mental: number
  }
  context: {
    setting: 'practice' | 'game' | 'training' | 'competition' | 'scrimmage' | 'unknown'
    weather?: string
    surface?: string
    opponents?: string
    teammates?: string[]
  }
  suggestions: string[]
  autoCategories: string[]
  detectedObjects: string[]
  timestamps?: {
    start: number
    end: number
    description: string
    tags: string[]
  }[]
}

export class SmartContentTagger {
  private aiManager: AIModelManager
  private sportKeywords: { [key: string]: string[] }
  private skillPatterns: { [key: string]: RegExp[] }
  private performanceIndicators: { [key: string]: string[] }

  constructor() {
    this.aiManager = new AIModelManager({
      type: 'local',
      provider: 'go4it-ai-engine',
      model: 'sports-analysis-v1',
      endpoint: 'http://localhost:8080/api/analyze'
    })

    this.sportKeywords = {
      football: ['touchdown', 'quarterback', 'running back', 'wide receiver', 'linebacker', 'defensive back', 'offensive line', 'field goal', 'punt', 'snap', 'blitz', 'coverage', 'route', 'pocket', 'rushing', 'passing'],
      basketball: ['dribble', 'shoot', 'rebound', 'assist', 'steal', 'block', 'layup', 'three-point', 'free throw', 'defense', 'offense', 'pick and roll', 'fast break', 'court', 'basket', 'dunk'],
      soccer: ['goal', 'kick', 'dribble', 'pass', 'header', 'tackle', 'save', 'penalty', 'corner', 'offside', 'midfielder', 'striker', 'defender', 'goalkeeper', 'cross', 'volley'],
      baseball: ['pitch', 'hit', 'catch', 'throw', 'steal', 'slide', 'home run', 'strikeout', 'walk', 'bunt', 'double play', 'infield', 'outfield', 'mound', 'plate', 'base'],
      tennis: ['serve', 'forehand', 'backhand', 'volley', 'lob', 'smash', 'ace', 'deuce', 'advantage', 'set', 'match', 'court', 'net', 'baseline', 'rally', 'winner'],
      golf: ['drive', 'putt', 'chip', 'iron', 'wood', 'wedge', 'fairway', 'green', 'bunker', 'rough', 'tee', 'hole', 'par', 'birdie', 'eagle', 'bogey']
    }

    this.skillPatterns = {
      technique: [/technique/i, /form/i, /mechanics/i, /fundamentals/i, /execution/i],
      strategy: [/strategy/i, /tactics/i, /game plan/i, /approach/i, /decision/i],
      fitness: [/fitness/i, /conditioning/i, /stamina/i, /endurance/i, /strength/i],
      mental: [/mental/i, /focus/i, /concentration/i, /confidence/i, /pressure/i]
    }

    this.performanceIndicators = {
      excellent: ['perfect', 'outstanding', 'exceptional', 'flawless', 'masterful', 'elite', 'professional'],
      good: ['good', 'solid', 'effective', 'strong', 'confident', 'skilled', 'competent'],
      average: ['average', 'okay', 'decent', 'fair', 'moderate', 'standard', 'typical'],
      poor: ['poor', 'weak', 'struggling', 'needs work', 'inconsistent', 'below average']
    }
  }

  async analyzeContent(
    filePath: string,
    fileName: string,
    fileType: 'video' | 'image' | 'document',
    userContext?: {
      sport?: string
      position?: string
      level?: string
      description?: string
    }
  ): Promise<ContentAnalysis> {
    const analysis: ContentAnalysis = {
      fileType,
      primarySport: userContext?.sport || 'unknown',
      secondarySports: [],
      tags: [],
      skills: [],
      performance: {
        overall: 0,
        technical: 0,
        tactical: 0,
        physical: 0,
        mental: 0
      },
      context: {
        setting: 'unknown'
      },
      suggestions: [],
      autoCategories: [],
      detectedObjects: [],
      timestamps: []
    }

    try {
      // Analyze file content based on type
      switch (fileType) {
        case 'video':
          await this.analyzeVideo(filePath, fileName, analysis, userContext)
          break
        case 'image':
          await this.analyzeImage(filePath, fileName, analysis, userContext)
          break
        case 'document':
          await this.analyzeDocument(filePath, fileName, analysis, userContext)
          break
      }

      // Generate additional metadata
      this.generateAutoCategories(analysis)
      this.generateSuggestions(analysis)
      this.calculatePerformanceScores(analysis)

      return analysis
    } catch (error) {
      console.error('Content analysis failed:', error)
      return this.getFallbackAnalysis(fileType, userContext)
    }
  }

  private async analyzeVideo(
    filePath: string,
    fileName: string,
    analysis: ContentAnalysis,
    userContext?: any
  ): Promise<void> {
    // AI video analysis
    const prompt = `Analyze this sports video and provide detailed tagging information:
    
    File: ${fileName}
    Sport: ${userContext?.sport || 'unknown'}
    Position: ${userContext?.position || 'unknown'}
    Level: ${userContext?.level || 'unknown'}
    Description: ${userContext?.description || 'none'}
    
    Please identify:
    1. Primary and secondary sports
    2. Skills demonstrated
    3. Performance quality (1-10 scale)
    4. Technical execution
    5. Tactical awareness
    6. Physical attributes
    7. Mental aspects
    8. Context (practice/game/training)
    9. Key timestamps with descriptions
    10. Equipment and objects visible
    
    Provide specific, actionable insights for athletic development.`

    const aiResponse = await this.aiManager.generateResponse(prompt, { filePath, fileType: 'video' })
    this.parseAIResponse(aiResponse, analysis)

    // Add sport-specific tags
    if (userContext?.sport) {
      this.addSportSpecificTags(analysis, userContext.sport)
    }

    // Analyze filename for additional context
    this.analyzeFileName(fileName, analysis)
  }

  private async analyzeImage(
    filePath: string,
    fileName: string,
    analysis: ContentAnalysis,
    userContext?: any
  ): Promise<void> {
    const prompt = `Analyze this sports image and provide tagging information:
    
    File: ${fileName}
    Sport: ${userContext?.sport || 'unknown'}
    Context: ${userContext?.description || 'none'}
    
    Please identify:
    1. Sport being played
    2. Action or skill being performed
    3. Setting (indoor/outdoor, facility type)
    4. Equipment visible
    5. Technique quality
    6. Player position/role
    7. Context (game/practice/training)
    8. Performance indicators
    
    Focus on visual elements that can help with athletic development.`

    const aiResponse = await this.aiManager.generateResponse(prompt, { filePath, fileType: 'image' })
    this.parseAIResponse(aiResponse, analysis)

    // Add image-specific tags
    this.addImageSpecificTags(analysis, userContext)
  }

  private async analyzeDocument(
    filePath: string,
    fileName: string,
    analysis: ContentAnalysis,
    userContext?: any
  ): Promise<void> {
    // For documents, we'll analyze the content and extract relevant information
    const prompt = `Analyze this sports document and extract tagging information:
    
    File: ${fileName}
    Sport: ${userContext?.sport || 'unknown'}
    
    Please identify:
    1. Document type (stats, report, plan, etc.)
    2. Sports covered
    3. Skills or techniques mentioned
    4. Performance data
    5. Training or game information
    6. Key insights or recommendations
    7. Relevant categories
    
    Extract actionable information for athletic development.`

    const aiResponse = await this.aiManager.generateResponse(prompt, { filePath, fileType: 'document' })
    this.parseAIResponse(aiResponse, analysis)

    // Add document-specific tags
    this.addDocumentSpecificTags(analysis, fileName)
  }

  private parseAIResponse(response: string, analysis: ContentAnalysis): void {
    // Parse AI response and extract structured data
    const lines = response.split('\n')
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase()
      
      // Extract sport information
      if (lowerLine.includes('primary sport:')) {
        analysis.primarySport = this.extractValue(line) || analysis.primarySport
      }
      
      // Extract performance scores
      if (lowerLine.includes('overall:')) {
        analysis.performance.overall = this.extractScore(line)
      }
      if (lowerLine.includes('technical:')) {
        analysis.performance.technical = this.extractScore(line)
      }
      if (lowerLine.includes('tactical:')) {
        analysis.performance.tactical = this.extractScore(line)
      }
      if (lowerLine.includes('physical:')) {
        analysis.performance.physical = this.extractScore(line)
      }
      if (lowerLine.includes('mental:')) {
        analysis.performance.mental = this.extractScore(line)
      }
      
      // Extract context
      if (lowerLine.includes('setting:')) {
        const setting = this.extractValue(line)?.toLowerCase()
        if (setting && ['practice', 'game', 'training', 'competition', 'scrimmage'].includes(setting)) {
          analysis.context.setting = setting as any
        }
      }
      
      // Extract skills
      if (lowerLine.includes('skill:') || lowerLine.includes('technique:')) {
        const skill = this.extractSkill(line)
        if (skill) {
          analysis.skills.push(skill)
        }
      }
      
      // Extract tags
      if (lowerLine.includes('tag:')) {
        const tag = this.extractTag(line)
        if (tag) {
          analysis.tags.push(tag)
        }
      }
    }
  }

  private addSportSpecificTags(analysis: ContentAnalysis, sport: string): void {
    const keywords = this.sportKeywords[sport.toLowerCase()] || []
    
    keywords.forEach(keyword => {
      analysis.tags.push({
        id: `sport-${keyword}`,
        name: keyword,
        category: 'sport',
        confidence: 0.8,
        relevance: 0.7,
        metadata: {
          level: 'intermediate'
        }
      })
    })
  }

  private addImageSpecificTags(analysis: ContentAnalysis, userContext?: any): void {
    // Add tags specific to image analysis
    analysis.tags.push({
      id: 'visual-analysis',
      name: 'Visual Analysis',
      category: 'technique',
      confidence: 0.9,
      relevance: 0.8,
      metadata: {
        quality: 'good'
      }
    })

    if (userContext?.position) {
      analysis.tags.push({
        id: `position-${userContext.position}`,
        name: userContext.position,
        category: 'sport',
        confidence: 0.9,
        relevance: 0.9,
        metadata: {
          position: userContext.position
        }
      })
    }
  }

  private addDocumentSpecificTags(analysis: ContentAnalysis, fileName: string): void {
    // Analyze filename for document type
    const lowerName = fileName.toLowerCase()
    
    if (lowerName.includes('stats')) {
      analysis.tags.push({
        id: 'statistics',
        name: 'Statistics',
        category: 'performance',
        confidence: 0.95,
        relevance: 0.9
      })
    }
    
    if (lowerName.includes('report')) {
      analysis.tags.push({
        id: 'report',
        name: 'Performance Report',
        category: 'performance',
        confidence: 0.95,
        relevance: 0.9
      })
    }
    
    if (lowerName.includes('plan') || lowerName.includes('training')) {
      analysis.tags.push({
        id: 'training-plan',
        name: 'Training Plan',
        category: 'strategy',
        confidence: 0.9,
        relevance: 0.9
      })
    }
  }

  private analyzeFileName(fileName: string, analysis: ContentAnalysis): void {
    const lowerName = fileName.toLowerCase()
    
    // Extract date information
    const dateMatch = lowerName.match(/(\d{4})-(\d{2})-(\d{2})|(\d{2})-(\d{2})-(\d{4})/)
    if (dateMatch) {
      analysis.tags.push({
        id: 'dated-content',
        name: 'Dated Content',
        category: 'event',
        confidence: 0.9,
        relevance: 0.7,
        metadata: {
          timestamp: dateMatch[0]
        }
      })
    }
    
    // Extract game/practice indicators
    if (lowerName.includes('game')) {
      analysis.context.setting = 'game'
    } else if (lowerName.includes('practice')) {
      analysis.context.setting = 'practice'
    } else if (lowerName.includes('training')) {
      analysis.context.setting = 'training'
    }
    
    // Extract opponent information
    const opponentMatch = lowerName.match(/vs\.?\s*(\w+)/)
    if (opponentMatch) {
      analysis.context.opponents = opponentMatch[1]
    }
  }

  private generateAutoCategories(analysis: ContentAnalysis): void {
    // Generate categories based on analysis
    const categories: string[] = []
    
    // Sport-based categories
    if (analysis.primarySport !== 'unknown') {
      categories.push(analysis.primarySport)
    }
    
    // Performance-based categories
    if (analysis.performance.overall >= 8) {
      categories.push('High Performance')
    } else if (analysis.performance.overall >= 6) {
      categories.push('Good Performance')
    } else if (analysis.performance.overall >= 4) {
      categories.push('Developing Performance')
    } else {
      categories.push('Needs Improvement')
    }
    
    // Context-based categories
    if (analysis.context.setting !== 'unknown') {
      categories.push(analysis.context.setting.charAt(0).toUpperCase() + analysis.context.setting.slice(1))
    }
    
    // Skill-based categories
    const primarySkills = analysis.skills
      .filter(skill => skill.confidence > 0.7)
      .sort((a, b) => b.level - a.level)
      .slice(0, 3)
      .map(skill => skill.name)
    
    categories.push(...primarySkills)
    
    analysis.autoCategories = categories
  }

  private generateSuggestions(analysis: ContentAnalysis): void {
    const suggestions: string[] = []
    
    // Performance-based suggestions
    if (analysis.performance.technical < 6) {
      suggestions.push('Focus on technical skill development')
    }
    if (analysis.performance.tactical < 6) {
      suggestions.push('Work on game strategy and decision-making')
    }
    if (analysis.performance.physical < 6) {
      suggestions.push('Improve physical conditioning and strength')
    }
    if (analysis.performance.mental < 6) {
      suggestions.push('Develop mental toughness and focus')
    }
    
    // Context-based suggestions
    if (analysis.context.setting === 'practice') {
      suggestions.push('Consider recording game footage for comparison')
    } else if (analysis.context.setting === 'game') {
      suggestions.push('Analyze practice footage to identify improvement areas')
    }
    
    // Skill-based suggestions
    const weakSkills = analysis.skills
      .filter(skill => skill.level < 6)
      .sort((a, b) => a.level - b.level)
      .slice(0, 2)
    
    weakSkills.forEach(skill => {
      suggestions.push(`Improve ${skill.name} through targeted practice`)
    })
    
    analysis.suggestions = suggestions
  }

  private calculatePerformanceScores(analysis: ContentAnalysis): void {
    // Calculate overall performance based on individual metrics
    const scores = [
      analysis.performance.technical,
      analysis.performance.tactical,
      analysis.performance.physical,
      analysis.performance.mental
    ].filter(score => score > 0)
    
    if (scores.length > 0) {
      analysis.performance.overall = scores.reduce((sum, score) => sum + score, 0) / scores.length
    }
  }

  private extractValue(line: string): string | null {
    const match = line.match(/:\s*(.+)/)
    return match ? match[1].trim() : null
  }

  private extractScore(line: string): number {
    const match = line.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  }

  private extractSkill(line: string): { name: string; level: number; confidence: number } | null {
    const value = this.extractValue(line)
    if (!value) return null
    
    const parts = value.split(',')
    const name = parts[0]?.trim()
    const level = parts[1] ? this.extractScore(parts[1]) : 5
    const confidence = parts[2] ? this.extractScore(parts[2]) : 0.8
    
    return name ? { name, level, confidence } : null
  }

  private extractTag(line: string): ContentTag | null {
    const value = this.extractValue(line)
    if (!value) return null
    
    const parts = value.split(',')
    const name = parts[0]?.trim()
    const category = parts[1]?.trim() as ContentTag['category'] || 'skill'
    const confidence = parts[2] ? this.extractScore(parts[2]) : 0.8
    
    return name ? {
      id: `tag-${name.toLowerCase().replace(/\s+/g, '-')}`,
      name,
      category,
      confidence,
      relevance: 0.7
    } : null
  }

  private getFallbackAnalysis(fileType: 'video' | 'image' | 'document', userContext?: any): ContentAnalysis {
    return {
      fileType,
      primarySport: userContext?.sport || 'unknown',
      secondarySports: [],
      tags: [{
        id: 'uploaded-content',
        name: 'Uploaded Content',
        category: 'event',
        confidence: 1.0,
        relevance: 0.5
      }],
      skills: [],
      performance: {
        overall: 0,
        technical: 0,
        tactical: 0,
        physical: 0,
        mental: 0
      },
      context: {
        setting: 'unknown'
      },
      suggestions: ['Manual analysis recommended'],
      autoCategories: [fileType, 'needs-analysis'],
      detectedObjects: [],
      timestamps: []
    }
  }

  // Public methods for managing tags
  async getTagSuggestions(query: string, sport?: string): Promise<ContentTag[]> {
    const suggestions: ContentTag[] = []
    const lowerQuery = query.toLowerCase()
    
    // Search through sport keywords
    if (sport && this.sportKeywords[sport.toLowerCase()]) {
      this.sportKeywords[sport.toLowerCase()]
        .filter(keyword => keyword.toLowerCase().includes(lowerQuery))
        .forEach(keyword => {
          suggestions.push({
            id: `sport-${keyword}`,
            name: keyword,
            category: 'sport',
            confidence: 0.9,
            relevance: 0.8
          })
        })
    }
    
    // Search through all sports if no specific sport
    if (!sport) {
      Object.entries(this.sportKeywords).forEach(([sportName, keywords]) => {
        keywords
          .filter(keyword => keyword.toLowerCase().includes(lowerQuery))
          .forEach(keyword => {
            suggestions.push({
              id: `sport-${keyword}`,
              name: keyword,
              category: 'sport',
              confidence: 0.8,
              relevance: 0.7,
              metadata: {
                level: 'intermediate'
              }
            })
          })
      })
    }
    
    return suggestions.slice(0, 10) // Limit to top 10 suggestions
  }

  async bulkAnalyze(files: { path: string; name: string; type: 'video' | 'image' | 'document' }[]): Promise<ContentAnalysis[]> {
    const analyses: ContentAnalysis[] = []
    
    // Process files in batches to avoid overwhelming the system
    const batchSize = 3
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize)
      const batchPromises = batch.map(file => 
        this.analyzeContent(file.path, file.name, file.type)
      )
      
      const batchResults = await Promise.allSettled(batchPromises)
      batchResults.forEach(result => {
        if (result.status === 'fulfilled') {
          analyses.push(result.value)
        }
      })
    }
    
    return analyses
  }
}

export const smartContentTagger = new SmartContentTagger()