'use client'

import type { FormEvent } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { AuthLayout, AuthLogo } from '@/components/auth/auth-layout'

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleCreateAccount = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push('/verify-otp')
  }

  return (
    <AuthLayout>
      <AuthLogo />

      <p className="text-center text-[#787878] text-xs md:text-sm mb-3 montserrat">
        Welcome to Wellness Made Clear
      </p>
      <h1 className="text-2xl text-[#131313] md:text-4xl font-medium text-center mb-6 md:mb-8">
        Create an account
      </h1>

      <form onSubmit={handleCreateAccount} className="space-y-4 md:space-y-5">
        <div>
          <Label htmlFor="name" className="block text-base font-semibold mb-2 text-[#2A2A2A] montserrat">
            Name <span className="text-[#8C311E]">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            required
            placeholder="Enter your name..."
            className="w-full px-4 h-12 bg-[#EAEAEA] montserrat border-0 rounded-lg text-sm md:text-base placeholder:text-[#787878] focus:ring-2 focus:ring-blue-600"
          />
        </div>

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

        <div>
          <Label htmlFor="password" className="block text-base font-semibold mb-2 text-[#2A2A2A] montserrat">
            Password <span className="text-[#8C311E]">*</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Enter password..."
              className="w-full px-4 h-12 bg-[#EAEAEA] montserrat border-0 rounded-[12px] text-sm md:text-base placeholder:text-[#787878] focus:ring-2 focus:ring-blue-600 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="confirm" className="block text-base font-semibold mb-2 text-[#2A2A2A] montserrat">
            Confirm Password <span className="text-[#8C311E]">*</span>
          </Label>
          <div className="relative">
            <Input
              id="confirm"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              placeholder="Enter password again..."
              className="w-full px-4 h-12 bg-[#EAEAEA] montserrat border-0 rounded-[12px] text-sm md:text-base placeholder:text-[#787878] focus:ring-2 focus:ring-blue-600 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox id="terms" className="mt-1" required />
          <Label htmlFor="terms" className="text-sm text-[#2A2A2A] cursor-pointer leading-relaxed montserrat">
            I agree to the{' '}
            <Link href="/about" className="text-[#033D86] hover:text-[#033D86]/90">
              terms & conditions
            </Link>
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full cursor-pointer h-12 montserrat bg-[#033D86] hover:bg-[#033D86]/90 text-white font-semibold py-2.5 md:py-3 rounded-lg text-sm md:text-base"
        >
          Create Account
        </Button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-[#033D86] hover:text-[#033D86]/90 font-semibold montserrat">
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
