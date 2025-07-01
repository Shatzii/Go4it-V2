import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Editor from "@/pages/Editor";
import Home from "@/pages/Home";
import TemplateLibraryPage from "@/pages/TemplateLibraryPage";
import RhythmEditorPage from "@/pages/RhythmEditorPage";
import CurriculumGeneratorPage from "@/pages/CurriculumGeneratorPage";
import StudentDashboardPage from "@/pages/StudentDashboardPage";
import StudentProfilePage from "@/pages/StudentProfilePage";
import SetupWizardPage from "@/pages/SetupWizardPage";
import { FileProvider } from "@/context/FileContext";
import { EditorProvider } from "@/context/EditorContext";
import { AIProvider } from "@/context/AIContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/editor" component={Editor} />
      <Route path="/templates" component={TemplateLibraryPage} />
      <Route path="/rhythm-editor" component={RhythmEditorPage} />
      <Route path="/curriculum-generator" component={CurriculumGeneratorPage} />
      <Route path="/setup" component={SetupWizardPage} />
      <Route path="/dashboard/:id?" component={StudentDashboardPage} />
      <Route path="/profile/:id?" component={StudentProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AIProvider>
      <FileProvider>
        <EditorProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </EditorProvider>
      </FileProvider>
    </AIProvider>
  );
}

export default App;
