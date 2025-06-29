import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Copy, Code, PlayCircle, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeEditorProps {
  value?: string;
  language?: string;
  theme?: 'vs-dark' | 'light';
  height?: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
  title?: string;
  description?: string;
  onSave?: (value: string) => void;
  onRun?: (value: string) => void;
}

export function CodeEditor({
  value = '',
  language = 'javascript',
  theme = 'vs-dark',
  height = '400px',
  onChange,
  readOnly = false,
  title = 'Code Editor',
  description = 'Edit your code here',
  onSave,
  onRun,
}: CodeEditorProps) {
  const [code, setCode] = useState(value);
  const [activeTab, setActiveTab] = useState('edit');
  const [preview, setPreview] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setCode(value);
  }, [value]);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
    if (onChange) {
      onChange(value);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Copied to clipboard',
      description: 'Code has been copied to clipboard',
    });
  };

  const handleSave = () => {
    if (onSave) {
      onSave(code);
    }
    toast({
      title: 'Code saved',
      description: 'Your code has been saved successfully',
    });
  };

  const handleRun = () => {
    if (onRun) {
      onRun(code);
      return;
    }

    // Basic preview for HTML
    if (language === 'html') {
      setPreview(code);
      setActiveTab('preview');
    } else {
      toast({
        title: 'Run feature',
        description: 'Run functionality is only available for HTML preview or when onRun prop is provided',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `code.${language}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: 'Download started',
      description: `File downloaded as code.${language}`,
    });
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex gap-2">
            {!readOnly && (
              <>
                <Button variant="ghost" size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-1" /> Save
                </Button>
                <Button variant="ghost" size="sm" onClick={handleRun}>
                  <PlayCircle className="h-4 w-4 mr-1" /> Run
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-1" /> Copy
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="edit">
              <Code className="h-4 w-4 mr-1" /> Edit
            </TabsTrigger>
            {language === 'html' && (
              <TabsTrigger value="preview">
                <PlayCircle className="h-4 w-4 mr-1" /> Preview
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="edit">
            <div className="border rounded-md overflow-hidden">
              <Editor
                height={height}
                language={language}
                value={code}
                theme={theme}
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  readOnly,
                  automaticLayout: true,
                }}
              />
            </div>
          </TabsContent>
          {language === 'html' && (
            <TabsContent value="preview">
              <div className="border rounded-md overflow-hidden" style={{ height }}>
                <iframe
                  title="HTML Preview"
                  srcDoc={preview}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default CodeEditor;