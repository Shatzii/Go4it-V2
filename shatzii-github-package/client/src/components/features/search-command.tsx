import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, Home, Brain, Zap, BarChart3, Users, Settings, FileText } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  icon: React.ReactNode;
}

export default function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();

  const searchResults: SearchResult[] = [
    { id: "home", title: "Home", description: "Main landing page", url: "/", category: "Navigation", icon: <Home className="h-4 w-4" /> },
    { id: "dashboard", title: "Personal Dashboard", description: "Your productivity metrics and goals", url: "/dashboard", category: "Personal", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "ai-agents", title: "AI Agents", description: "Autonomous AI agent management", url: "/ai-agents", category: "AI", icon: <Brain className="h-4 w-4" /> },
    { id: "neural-playground", title: "Neural Lab", description: "Experiment with AI models", url: "/neural-playground", category: "AI", icon: <Zap className="h-4 w-4" /> },
    { id: "model-marketplace", title: "Model Marketplace", description: "Browse and deploy AI models", url: "/model-marketplace", category: "AI", icon: <Users className="h-4 w-4" /> },
    { id: "autonomous-marketing", title: "Live Marketing", description: "Real-time marketing operations", url: "/autonomous-marketing", category: "Operations", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "autonomous-sales", title: "Live Sales", description: "Autonomous sales processes", url: "/autonomous-sales", category: "Operations", icon: <Users className="h-4 w-4" /> },
    { id: "enterprise-dashboard", title: "Enterprise Dashboard", description: "Company-wide analytics", url: "/enterprise-dashboard", category: "Enterprise", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "products", title: "Products", description: "Our AI platform offerings", url: "/products", category: "Products", icon: <FileText className="h-4 w-4" /> },
    { id: "pharaoh", title: "Pharaoh Control", description: "Enterprise automation platform", url: "/products/pharaoh", category: "Products", icon: <Settings className="h-4 w-4" /> },
    { id: "sentinel", title: "Sentinel Guard", description: "AI security monitoring", url: "/products/sentinel", category: "Products", icon: <Zap className="h-4 w-4" /> },
  ];

  const handleSelect = (url: string) => {
    setLocation(url);
    setOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const groupedResults = searchResults.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full max-w-md bg-slate-800/50 border-cyan-500/20 text-slate-300 hover:bg-slate-700/50 hover:text-cyan-400 text-left justify-start"
        >
          <Search className="h-4 w-4 mr-2" />
          <span>Search pages...</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-700 px-1.5 font-mono text-xs font-medium text-slate-400">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 bg-slate-900/95 backdrop-blur-xl border-cyan-500/20">
        <Command className="bg-transparent">
          <CommandInput 
            placeholder="Search pages and features..." 
            className="bg-transparent border-none text-slate-100 placeholder:text-slate-400"
          />
          <CommandList className="max-h-96">
            <CommandEmpty className="py-6 text-center text-slate-400">
              No results found.
            </CommandEmpty>
            {Object.entries(groupedResults).map(([category, results]) => (
              <CommandGroup key={category} heading={category} className="text-cyan-400">
                {results.map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelect(result.url)}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-800/50 text-slate-300 hover:text-cyan-400"
                  >
                    {result.icon}
                    <div className="flex-1">
                      <div className="font-medium">{result.title}</div>
                      <div className="text-sm text-slate-400">{result.description}</div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}