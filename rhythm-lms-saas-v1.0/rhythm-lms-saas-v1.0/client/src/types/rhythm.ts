// Core directive types
export type DirectiveType = 
  | 'extends'
  | 'section'
  | 'include'
  | 'block'
  | 'if'
  | 'elseif'
  | 'else'
  | 'loop'
  | 'each'
  | 'role'
  | 'ai'
  | 'prompt'
  | 'model'
  | 'use'
  | 'style'
  | 'component';

// Directive node in the AST
export interface DirectiveNode {
  type: DirectiveType;
  name: string;
  arguments?: string[];
  content?: string;
  children?: (DirectiveNode | TextNode | HtmlNode)[];
  line: number;
  column: number;
}

// Text node in the AST
export interface TextNode {
  type: 'text';
  content: string;
  line: number;
  column: number;
}

// HTML node in the AST
export interface HtmlNode {
  type: 'html';
  tag: string;
  attributes: Record<string, string>;
  selfClosing: boolean;
  content?: string;
  children?: (DirectiveNode | TextNode | HtmlNode)[];
  line: number;
  column: number;
}

// Combined AST node type
export type AstNode = DirectiveNode | TextNode | HtmlNode;

// Complete AST representation of a Rhythm file
export interface RhythmAst {
  type: 'program';
  children: AstNode[];
}

// Rhythm file representation
export interface RhythmFile {
  path: string;
  ast: RhythmAst;
  raw: string;
}

// Tokenizer result
export interface Token {
  type: 
    | 'directive'
    | 'directive-end'
    | 'html-open'
    | 'html-close'
    | 'text'
    | 'attribute'
    | 'string';
  value: string;
  line: number;
  column: number;
}

// Parser error
export interface ParserError {
  message: string;
  line: number;
  column: number;
  source?: string;
}

// Compilation result
export interface CompilationResult {
  html?: string;
  json?: any;
  errors?: ParserError[];
  warnings?: ParserError[];
}

// AI model type
export type AIModelType = 'local' | 'remote' | 'custom';

// AI model configuration
export interface AIModel {
  id: string;
  name: string;
  description: string;
  type: AIModelType;
  path?: string; // For local models
  apiKey?: string; // For remote models
  contextSize?: number;
  parameters?: Record<string, any>;
}
