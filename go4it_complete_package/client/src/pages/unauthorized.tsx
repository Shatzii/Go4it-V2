import { ErrorPage } from "@/components/error/ErrorPage";
import { LogIn } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <ErrorPage 
        errorCode={401}
        title="Authentication Required"
        description="Please log in to access this page. If you're already logged in, your session may have expired."
        showRefresh={false}
        actionButton={{
          label: "Sign In",
          href: "/login",
          icon: <LogIn className="h-4 w-4" />
        }}
      />
    </div>
  );
}