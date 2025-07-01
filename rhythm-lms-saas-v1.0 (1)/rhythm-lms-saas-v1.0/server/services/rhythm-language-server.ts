import { rhythmParser } from './rhythm-parser';
import { fileService } from './file-service';
import * as path from 'path';

interface CompletionItem {
  label: string;
  kind: string;
  detail?: string;
  documentation?: string;
  insertText: string;
}

interface DiagnosticItem {
  message: string;
  range: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
  severity: 'error' | 'warning' | 'information' | 'hint';
  source: string;
}

interface HoverInfo {
  contents: string[];
  range?: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
}

class RhythmLanguageServer {
  private directiveCompletions: CompletionItem[] = [];
  private componentCompletions: CompletionItem[] = [];
  private blockCompletions: CompletionItem[] = [];
  private variableCompletions: CompletionItem[] = [];
  private cachedFiles: Map<string, { content: string; components: string[] }> = new Map();
  
  constructor() {
    this.initializeCompletions();
  }
  
  private initializeCompletions() {
    // Initialize directive completions
    this.directiveCompletions = [
      {
        label: '@extends',
        kind: 'keyword',
        detail: 'Extends a layout template',
        documentation: 'Extends a layout template file and inherits its structure.',
        insertText: '@extends("${1:layout/base.rhy}")'
      },
      {
        label: '@section',
        kind: 'keyword',
        detail: 'Defines a section of content',
        documentation: 'Defines a named section of content that can be placed into a layout.',
        insertText: '@section("${1:name}")\n  $0\n@endsection'
      },
      {
        label: '@include',
        kind: 'keyword',
        detail: 'Includes another template file',
        documentation: 'Includes the content of another template file at this location.',
        insertText: '@include("${1:components/header.rhy}")'
      },
      {
        label: '@if',
        kind: 'keyword',
        detail: 'Conditional if statement',
        documentation: 'Conditionally renders content based on an expression.',
        insertText: '@if(${1:condition})\n  $0\n@endif'
      },
      {
        label: '@else',
        kind: 'keyword',
        detail: 'Else clause for an if statement',
        documentation: 'Alternative content if the if condition is not met.',
        insertText: '@else\n  $0'
      },
      {
        label: '@elseif',
        kind: 'keyword',
        detail: 'Else if clause for an if statement',
        documentation: 'Alternative condition if the previous if or elseif was not met.',
        insertText: '@elseif(${1:condition})\n  $0'
      },
      {
        label: '@each',
        kind: 'keyword',
        detail: 'Loop through an array',
        documentation: 'Iterates over each item in an array or collection.',
        insertText: '@each(${1:item} in ${2:items})\n  $0\n@endloop'
      },
      {
        label: '@loop',
        kind: 'keyword',
        detail: 'Loop with index',
        documentation: 'Loop that provides access to the index and the item.',
        insertText: '@loop(${1:item}, ${2:index} in ${3:items})\n  $0\n@endloop'
      },
      {
        label: '@block',
        kind: 'keyword',
        detail: 'Define a reusable block',
        documentation: 'Defines a reusable block of content that can be included elsewhere.',
        insertText: '@block("${1:name}")\n  $0\n@endblock'
      },
      {
        label: '@component',
        kind: 'keyword',
        detail: 'Create a reusable component',
        documentation: 'Defines a reusable component with props.',
        insertText: '@component("${1:name}", { ${2:props} })\n  $0\n@endcomponent'
      },
      {
        label: '@yield',
        kind: 'keyword',
        detail: 'Yields to a section',
        documentation: 'In a layout, yields to a section defined in an extending template.',
        insertText: '@yield("${1:name}")'
      },
      {
        label: '@use',
        kind: 'keyword',
        detail: 'Use a theme or stylesheet',
        documentation: 'Includes a theme or stylesheet in the template.',
        insertText: '@use("${1:theme/main}")'
      },
      {
        label: '@style',
        kind: 'keyword',
        detail: 'Define inline styles',
        documentation: 'Defines inline CSS styles for the template.',
        insertText: '@style\n  ${0:/* CSS styles */}\n@endstyle'
      },
      {
        label: '@ai',
        kind: 'keyword',
        detail: 'AI-powered content generation',
        documentation: 'Uses AI to generate or transform content based on instructions.',
        insertText: '@ai("${1:instruction}")\n  ${0:/* Context for AI */}\n@endai'
      },
    ];
    
    // Initialize common variable completions
    this.variableCompletions = [
      {
        label: 'user',
        kind: 'variable',
        detail: 'Current user object',
        documentation: 'Object containing information about the current user.',
        insertText: 'user'
      },
      {
        label: 'page',
        kind: 'variable',
        detail: 'Current page object',
        documentation: 'Object containing information about the current page.',
        insertText: 'page'
      },
      {
        label: 'site',
        kind: 'variable',
        detail: 'Site configuration',
        documentation: 'Object containing site-wide configuration and settings.',
        insertText: 'site'
      },
      {
        label: 'request',
        kind: 'variable',
        detail: 'Current request object',
        documentation: 'Object containing information about the current HTTP request.',
        insertText: 'request'
      },
    ];
  }
  
  /**
   * Update cache with new components and blocks found in files
   */
  public async updateCache(filePath: string, content?: string) {
    try {
      // If content not provided, load from file
      if (!content) {
        const fileContent = await fileService.getFileContent(filePath);
        content = fileContent.content;
      }
      
      // Extract components and blocks from content
      const components: string[] = [];
      const componentRegex = /@component\s*\(\s*["']([^"']+)["']/g;
      const blockRegex = /@block\s*\(\s*["']([^"']+)["']/g;
      
      let match;
      while ((match = componentRegex.exec(content)) !== null) {
        components.push(match[1]);
      }
      
      while ((match = blockRegex.exec(content)) !== null) {
        components.push(match[1]);
      }
      
      // Store in cache
      this.cachedFiles.set(filePath, { content, components });
      
      // Update component completions
      this.refreshComponentCompletions();
    } catch (error) {
      console.error(`Error updating language server cache for ${filePath}:`, error);
    }
  }
  
  /**
   * Rebuild component completions from cache
   */
  private refreshComponentCompletions() {
    const components = new Set<string>();
    const blocks = new Set<string>();
    
    // Collect all unique components and blocks
    this.cachedFiles.forEach(({ components: fileComponents }) => {
      fileComponents.forEach(comp => {
        if (comp.startsWith('block:')) {
          blocks.add(comp.substring(6));
        } else {
          components.add(comp);
        }
      });
    });
    
    // Build component completions
    this.componentCompletions = Array.from(components).map(name => ({
      label: name,
      kind: 'class',
      detail: `Component: ${name}`,
      documentation: `A reusable component named "${name}".`,
      insertText: `@component("${name}", { $1 })\n  $0\n@endcomponent`
    }));
    
    // Build block completions
    this.blockCompletions = Array.from(blocks).map(name => ({
      label: name,
      kind: 'interface',
      detail: `Block: ${name}`,
      documentation: `A reusable content block named "${name}".`,
      insertText: `@block("${name}")\n  $0\n@endblock`
    }));
  }
  
  /**
   * Get completions at a specific position in a file
   */
  public async getCompletions(filePath: string, line: number, character: number): Promise<CompletionItem[]> {
    try {
      // Ensure file is in cache
      if (!this.cachedFiles.has(filePath)) {
        await this.updateCache(filePath);
      }
      
      const fileData = this.cachedFiles.get(filePath);
      if (!fileData) return [];
      
      const lines = fileData.content.split('\n');
      const currentLine = lines[line];
      const textBeforeCursor = currentLine.substring(0, character);
      
      // Check if we're typing a directive
      if (textBeforeCursor.trimLeft().startsWith('@') || textBeforeCursor.trimLeft() === '@') {
        return this.directiveCompletions;
      }
      
      // Check if we're inside a component or block
      const componentRegex = /@component\s*\(\s*["']([^"']+)["']\s*,\s*{/;
      if (componentRegex.test(textBeforeCursor)) {
        // We're inside a component props section
        return [
          {
            label: 'title',
            kind: 'field',
            detail: 'Title prop',
            insertText: 'title: "${1:Title}"'
          },
          {
            label: 'className',
            kind: 'field',
            detail: 'CSS class name',
            insertText: 'className: "${1:class-name}"'
          },
          {
            label: 'id',
            kind: 'field',
            detail: 'Element ID',
            insertText: 'id: "${1:element-id}"'
          },
          {
            label: 'style',
            kind: 'field',
            detail: 'Inline styles',
            insertText: 'style: { ${1:property}: "${2:value}" }'
          }
        ];
      }
      
      // Inside a template expression {{ ... }}
      if (textBeforeCursor.includes('{{') && !textBeforeCursor.includes('}}')) {
        return this.variableCompletions;
      }
      
      // Default to all available completions
      return [
        ...this.directiveCompletions,
        ...this.componentCompletions,
        ...this.blockCompletions,
        ...this.variableCompletions
      ];
    } catch (error) {
      console.error('Error getting completions:', error);
      return [];
    }
  }
  
  /**
   * Get diagnostics (errors and warnings) for a file
   */
  public async getDiagnostics(filePath: string, content?: string): Promise<DiagnosticItem[]> {
    try {
      // If content not provided, use cached or load from file
      if (!content) {
        if (this.cachedFiles.has(filePath)) {
          content = this.cachedFiles.get(filePath)!.content;
        } else {
          const fileContent = await fileService.getFileContent(filePath);
          content = fileContent.content;
          await this.updateCache(filePath, content);
        }
      }
      
      // Parse with rhythm parser to get errors
      const result = await rhythmParser.compile(content);
      const diagnostics: DiagnosticItem[] = [];
      
      // Convert parser errors to diagnostic items
      if (result.errors && result.errors.length > 0) {
        result.errors.forEach(error => {
          diagnostics.push({
            message: error.message,
            range: {
              start: { line: error.line - 1, character: error.column - 1 },
              end: { line: error.line - 1, character: error.column + 10 }
            },
            severity: 'error',
            source: 'rhythm'
          });
        });
      }
      
      // Convert parser warnings to diagnostic items
      if (result.warnings && result.warnings.length > 0) {
        result.warnings.forEach(warning => {
          diagnostics.push({
            message: warning.message,
            range: {
              start: { line: warning.line - 1, character: warning.column - 1 },
              end: { line: warning.line - 1, character: warning.column + 10 }
            },
            severity: 'warning',
            source: 'rhythm'
          });
        });
      }
      
      // Add additional diagnostics
      
      // Check for unclosed directives
      const directiveStack: {directive: string, line: number, col: number}[] = [];
      const lines = content.split('\n');
      
      lines.forEach((line, lineIndex) => {
        // Check for directive starts
        const startMatches = line.matchAll(/@(\w+)(?:\(|\s)/g);
        for (const match of startMatches) {
          const directive = match[1];
          if (['if', 'section', 'block', 'component', 'each', 'loop', 'ai', 'style'].includes(directive)) {
            directiveStack.push({
              directive,
              line: lineIndex,
              col: match.index || 0
            });
          }
        }
        
        // Check for directive ends
        const endMatches = line.matchAll(/@end(\w+)/g);
        for (const match of endMatches) {
          const directive = match[1];
          // Find matching start directive
          const lastIndex = directiveStack.findIndex(d => d.directive === directive);
          if (lastIndex >= 0) {
            // Remove this directive and all nested ones
            directiveStack.splice(lastIndex);
          } else {
            // Unmatched end directive
            diagnostics.push({
              message: `Unexpected @end${directive} without matching @${directive}`,
              range: {
                start: { line: lineIndex, character: match.index || 0 },
                end: { line: lineIndex, character: (match.index || 0) + match[0].length }
              },
              severity: 'error',
              source: 'rhythm'
            });
          }
        }
      });
      
      // Report unclosed directives
      directiveStack.forEach(d => {
        diagnostics.push({
          message: `Unclosed @${d.directive} directive`,
          range: {
            start: { line: d.line, character: d.col },
            end: { line: d.line, character: d.col + d.directive.length + 1 }
          },
          severity: 'error',
          source: 'rhythm'
        });
      });
      
      return diagnostics;
    } catch (error) {
      console.error('Error getting diagnostics:', error);
      return [];
    }
  }
  
  /**
   * Get hover information at a specific position
   */
  public async getHoverInfo(filePath: string, line: number, character: number): Promise<HoverInfo | null> {
    try {
      // Ensure file is in cache
      if (!this.cachedFiles.has(filePath)) {
        await this.updateCache(filePath);
      }
      
      const fileData = this.cachedFiles.get(filePath);
      if (!fileData) return null;
      
      const lines = fileData.content.split('\n');
      const currentLine = lines[line];
      
      // Check if hovering over a directive
      const directiveMatch = /@(\w+)/.exec(currentLine);
      if (directiveMatch && directiveMatch.index <= character && directiveMatch.index + directiveMatch[0].length >= character) {
        const directive = directiveMatch[1];
        const directiveCompletion = this.directiveCompletions.find(c => c.label === `@${directive}`);
        
        if (directiveCompletion) {
          return {
            contents: [
              `**${directiveCompletion.label}**`,
              directiveCompletion.detail || '',
              directiveCompletion.documentation || ''
            ],
            range: {
              start: { line, character: directiveMatch.index },
              end: { line, character: directiveMatch.index + directiveMatch[0].length }
            }
          };
        }
      }
      
      // Check if hovering over a component name
      const componentMatch = /@component\s*\(\s*["']([^"']+)["']/.exec(currentLine);
      if (componentMatch && 
          componentMatch.index + '@component("'.length <= character && 
          componentMatch.index + '@component("'.length + componentMatch[1].length >= character) {
        
        return {
          contents: [
            `**Component: ${componentMatch[1]}**`,
            'A reusable UI component that can be included in templates.'
          ],
          range: {
            start: { line, character: componentMatch.index + '@component("'.length },
            end: { line, character: componentMatch.index + '@component("'.length + componentMatch[1].length }
          }
        };
      }
      
      // Check if hovering over a variable in template expression
      const exprMatch = /{{([^}]+)}}/.exec(currentLine);
      if (exprMatch && exprMatch.index + 2 <= character && exprMatch.index + 2 + exprMatch[1].length >= character) {
        // Extract the variable name at cursor position
        const exprContent = exprMatch[1].trim();
        const varMatch = /(\w+)(?:\.\w+)*/.exec(exprContent);
        
        if (varMatch) {
          const varName = varMatch[1];
          const varCompletion = this.variableCompletions.find(v => v.label === varName);
          
          if (varCompletion) {
            return {
              contents: [
                `**${varCompletion.label}**`,
                varCompletion.detail || '',
                varCompletion.documentation || ''
              ],
              range: {
                start: { line, character: exprMatch.index + 2 + exprContent.indexOf(varName) },
                end: { line, character: exprMatch.index + 2 + exprContent.indexOf(varName) + varName.length }
              }
            };
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting hover info:', error);
      return null;
    }
  }
  
  /**
   * Initialize the language server by scanning all rhythm files
   */
  public async initialize() {
    try {
      // Get all rhythm files in the project
      const fileTree = await fileService.getFileTree();
      
      const processNode = async (node: any) => {
        if (node.type === 'file' && node.path.endsWith('.rhy')) {
          await this.updateCache(node.path);
        } else if (node.type === 'directory' && node.children) {
          for (const child of node.children) {
            await processNode(child);
          }
        }
      };
      
      await processNode(fileTree);
      console.log('Rhythm Language Server initialized');
    } catch (error) {
      console.error('Error initializing Rhythm Language Server:', error);
    }
  }
}

export const rhythmLanguageServer = new RhythmLanguageServer();