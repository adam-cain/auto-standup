"use client"
import { FormEvent, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot } from "lucide-react"
import { loginUser } from "@/lib/auth/actions"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth/config"
import { providerMap } from "@/lib/auth" 
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

const SIGNIN_ERROR_URL = "/error"

export default function LoginPage(props: {
  searchParams: { callbackUrl: string | undefined }
}) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    
    const email = String(formData.get('email'))
    const password = String(formData.get('password'))
    
    const result = await loginUser(email, password)
    
    if (result.success) {
      router.push('/onboarding')
    } else {
      setError(result.error || 'Login failed')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center mb-6">
            <Bot className="h-8 w-8 mr-2" />
            <span className="text-2xl font-bold">Auto Standup</span>
          </Link>
        </div>
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <form action={onSubmit} className="space-y-4">
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="w-full border rounded px-3 py-2 text-black"
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="w-full border rounded px-3 py-2 text-black"
                required
              />
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            {Object.values(providerMap).map((provider) => (
        <form
          key={provider.id}
          action={async () => {
            try {
              await signIn(provider.id, {
                redirectTo: props.searchParams?.callbackUrl ?? "",
              })
            } catch (error) {
              // Signin can fail for a number of reasons, such as the user
              // not existing, or the user not having the correct role.
              // In some cases, you may want to redirect to a custom error
              if (error instanceof AuthError) {
                return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
              }
 
              // Otherwise if a redirects happens Next.js can handle it
              // so you can just re-thrown the error and let Next.js handle it.
              // Docs:
              // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
              throw error
            }
          }}
        >
          <button type="submit">
            <span>Sign in with {provider.name}</span>
          </button>
        </form>
      ))}

            <div className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center text-xs text-gray-500">
          By logging in, you agree to our{" "}
          <Link href="#" className="hover:underline font-bold">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="hover:underline font-bold">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
} 