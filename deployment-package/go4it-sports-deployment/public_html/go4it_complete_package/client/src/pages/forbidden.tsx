import { ErrorPage } from "@/components/error/ErrorPage";
import { LogIn } from "lucide-react";

export default function Forbidden() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <ErrorPage 
        errorCode={403}
        title="Access Denied"
        description="You don't have permission to access this page. If you believe this is an error, please contact support."
        actionButton={{
          label: "Sign In",
          href: "/login",
          icon: <LogIn className="h-4 w-4" />
        }}
      />
    </div>
  );
}