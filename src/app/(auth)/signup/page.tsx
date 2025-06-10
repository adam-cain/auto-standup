"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot } from "lucide-react"
import { signUp } from "@/lib/auth"
import { redirect } from "next/navigation"

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(formData: FormData) {
    const email = String(formData.get('email'))
    const password = String(formData.get('password'))
    const res = await signUp(email, password)
    if (res.success) {
      redirect('/onboarding')
    } else {
      setError(res.error || "An error occurred during signup")
    }
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
            <CardTitle className="text-2xl text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Enter your details below to sign up
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
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
              <Button type="submit" className="w-full" size="lg">
                Sign up
              </Button>
            </form>
            <div className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
