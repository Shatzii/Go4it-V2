import { ErrorPage } from "@/components/error/ErrorPage";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <ErrorPage 
        errorCode={404}
        title="Page Not Found"
        description="The page you're looking for doesn't exist or has been moved to another location."
        actionButton={{
          label: "Go Back",
          href: "#",
          icon: <ArrowLeft className="h-4 w-4" />
        }}
      />
    </div>
  );
}
