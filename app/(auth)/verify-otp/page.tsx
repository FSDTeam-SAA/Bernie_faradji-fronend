'use client'

import type { FormEvent, KeyboardEvent } from 'react'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { AuthLayout, AuthLogo } from '@/components/auth/auth-layout'

export default function VerifyOTPPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(['', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOtp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push('/reset-password')
  }

  const handleRequestOtp = () => {
    setOtp(['', '', '', ''])
    inputRefs.current[0]?.focus()
  }

  return (
    <AuthLayout>
      <AuthLogo />

      <h1 className="text-2xl text-[#131313] md:text-4xl font-medium text-center mb-2">Enter OTP</h1>
      <p className="text-[#787878] text-center mb-8 text-sm md:text-base montserrat">
        An OTP has been sent to your email address. Please verify it below.
      </p>

      <form onSubmit={handleVerifyOtp} className="space-y-4 md:space-y-6">
        <div>
          <Label className="block text-base font-semibold mb-4 text-[#2A2A2A] montserrat">
            Verification Code <span className="text-[#8C311E]">*</span>
          </Label>
          <div className="flex gap-3 md:gap-4 justify-center mb-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(event) => handleChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                className="w-12 h-12 md:w-14 md:h-14 text-center text-lg md:text-xl font-semibold bg-[#EAEAEA] border-2 border-transparent rounded-lg focus:border-[#033D86] focus:ring-2 focus:ring-[#033D86]/30 focus:outline-none"
                inputMode="numeric"
                required
              />
            ))}
          </div>
        </div>

        <p className="text-center text-xs md:text-sm text-gray-600 montserrat">
          Didn&apos;t receive OTP?{' '}
          <button
            type="button"
            onClick={handleRequestOtp}
            className="text-[#033D86] hover:text-[#033D86]/90 font-semibold cursor-pointer"
          >
            Request OTP
          </button>
        </p>

        <Button
          type="submit"
          className="w-full cursor-pointer h-12 montserrat bg-[#033D86] hover:bg-[#033D86]/90 text-white font-semibold py-2.5 md:py-3 rounded-lg text-sm md:text-base"
        >
          Verify
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
