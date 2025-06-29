import { ErrorPage } from "@/components/error/ErrorPage";
import { HelpCircle } from "lucide-react";

export default function ServerError() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <ErrorPage 
        errorCode={500}
        title="Server Error"
        description="We're experiencing technical difficulties on our servers. Our team has been notified and is working to fix the issue."
        actionButton={{
          label: "Support",
          href: "/contact",
          icon: <HelpCircle className="h-4 w-4" />
        }}
      />
    </div>
  );
}