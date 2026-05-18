'use client'

import type { FormEvent } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { AuthLayout, AuthLogo } from '@/components/auth/auth-layout'

export default function NewPasswordPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleResetPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push('/login')
  }

  return (
    <AuthLayout>
      <AuthLogo />

      <h1 className="text-2xl text-[#131313] md:text-4xl font-medium text-center mb-2">
        New Password
      </h1>
      <p className="text-[#787878] text-center mb-8 text-sm md:text-base montserrat">
        Please create your new password
      </p>

      <form onSubmit={handleResetPassword} className="space-y-4 md:space-y-6">
        <div>
          <Label htmlFor="password" className="block text-base font-semibold mb-2 text-[#2A2A2A] montserrat">
            New Password <span className="text-[#8C311E]">*</span>
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
            Re-enter Password <span className="text-[#8C311E]">*</span>
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

        <Button
          type="submit"
          className="w-full cursor-pointer h-12 montserrat bg-[#033D86] hover:bg-[#033D86]/90 text-white font-semibold py-2.5 md:py-3 rounded-lg text-sm md:text-base"
        >
          Continue
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
