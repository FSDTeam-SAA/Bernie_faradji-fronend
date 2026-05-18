'use client'

import type { FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { AuthLayout, AuthLogo } from '@/components/auth/auth-layout'

export default function ForgotPasswordPage() {
  const router = useRouter()

  const handleSendOtp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push('/verify-otp')
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

      <form onSubmit={handleSendOtp} className="space-y-4 md:space-y-6">
        <div>
          <Label htmlFor="email" className="block text-base font-semibold mb-2 text-[#2A2A2A] montserrat">
            Email <span className="text-[#8C311E]">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            required
            placeholder="Enter your email address..."
            className="w-full px-4 h-12 bg-[#EAEAEA] montserrat border-0 rounded-lg text-sm md:text-base placeholder:text-[#787878] focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <Button
          type="submit"
          className="w-full cursor-pointer h-12 montserrat bg-[#033D86] hover:bg-[#033D86]/90 text-white font-semibold py-2.5 md:py-3 rounded-lg text-sm md:text-base"
        >
          Send OTP
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
