'use client'

import type { FormEvent } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { AuthLayout, AuthLogo } from '@/components/auth/auth-layout'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')

  const mutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forget-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to send OTP')
      }

      return response.json()
    },
    onSuccess: (_data, submittedEmail) => {
      toast.success('OTP Sent Successfully!', {
        description: 'Please check your email for the verification code.',
      })
      router.push(`/verify-otp?email=${encodeURIComponent(submittedEmail)}`)
    },
    onError: (error: Error) => {
      toast.error('Failed to send OTP', {
        description: error.message || 'Something went wrong. Please try again.',
      })
    },
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmedEmail = email.trim()
    if (!trimmedEmail) return
    mutation.mutate(trimmedEmail)
  }

  return (
    <AuthLayout>
      <AuthLogo />

      <h1 className="text-2xl text-[#131313] md:text-4xl font-medium text-center mb-2">
        Forgot Password!
      </h1>
      <p className="text-[#787878] text-center mb-8 text-sm md:text-base montserrat">
        Enter your email to recover your password
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div>
          <Label htmlFor="email" className="block text-base font-semibold mb-2 text-[#2A2A2A] montserrat">
            Email <span className="text-[#8C311E]">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            required
            placeholder="Enter your email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 h-12 bg-[#EAEAEA] montserrat border-0 rounded-lg text-sm md:text-base placeholder:text-[#787878] focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="w-full cursor-pointer h-12 montserrat bg-[#033D86] hover:bg-[#033D86]/90 text-white font-semibold py-2.5 md:py-3 rounded-lg text-sm md:text-base disabled:opacity-70"
        >
          {mutation.isPending ? 'Sending OTP...' : 'Send OTP'}
        </Button>

        <p className="text-center text-sm text-gray-600">
          <Link href="/login" className="text-[#033D86] hover:text-[#033D86]/90 font-semibold montserrat">
            Back to Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
