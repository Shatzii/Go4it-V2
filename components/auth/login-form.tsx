'use client'

import { SignIn } from '@clerk/nextjs'

interface LoginFormProps {
  onSuccess?: () => void
  redirectTo?: string
}

export default function LoginForm({ onSuccess, redirectTo = '/dashboard' }: LoginFormProps) {
  return (
    <div className="w-full max-w-md">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-xl",
            formButtonPrimary: "bg-primary hover:bg-primary/90",
          }
        }}
        redirectUrl={redirectTo}
        signUpUrl="/register"
        afterSignInUrl={redirectTo}
      />
    </div>
  )
}
