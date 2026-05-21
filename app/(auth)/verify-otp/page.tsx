'use client'

import { Suspense, type ClipboardEvent, type FormEvent, type KeyboardEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { AuthLayout, AuthLogo } from '@/components/auth/auth-layout'
import { toast } from 'sonner'

const OTP_LENGTH = 6
const createEmptyOtp = () => Array.from({ length: OTP_LENGTH }, () => '')

function VerifyOTPContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')?.trim() ?? ''

  const [otp, setOtp] = useState(createEmptyOtp)
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array.from({ length: OTP_LENGTH }, () => null))

  useEffect(() => {
    if (email) return

    toast.error('Email not found', {
      description: 'Please enter your email first to continue.',
    })
    router.replace('/forgot-password')
  }, [email, router])

  const verifyMutation = useMutation({
    mutationFn: async (payload: { email: string; otp: string }) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'OTP verification failed')
      }

      return response.json()
    },
    onSuccess: (_data, variables) => {
      toast.success('OTP verified successfully!')
      router.push(`/reset-password?email=${encodeURIComponent(variables.email)}`)
    },
    onError: (error: Error) => {
      toast.error('OTP verification failed', {
        description: error.message || 'Please check your code and try again.',
      })
    },
  })

  const resendMutation = useMutation({
    mutationFn: async (targetEmail: string) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forget-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: targetEmail }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to resend OTP')
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('OTP resent successfully!')
    },
    onError: (error: Error) => {
      toast.error('Failed to resend OTP', {
        description: error.message || 'Please try again.',
      })
    },
  })

  const handleChange = (index: number, value: string) => {
    const digits = value.replace(/\D/g, '')
    if (!digits) {
      const clearedOtp = [...otp]
      clearedOtp[index] = ''
      setOtp(clearedOtp)
      return
    }

    if (digits.length === 1) {
      const singleOtp = [...otp]
      singleOtp[index] = digits
      setOtp(singleOtp)

      if (index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus()
      }
      return
    }

    const pastedOtp = [...otp]
    digits
      .slice(0, OTP_LENGTH - index)
      .split('')
      .forEach((digit, offset) => {
        pastedOtp[index + offset] = digit
      })

    setOtp(pastedOtp)

    const nextIndex = Math.min(index + digits.length, OTP_LENGTH - 1)
    inputRefs.current[nextIndex]?.focus()
  }

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      if (otp[index]) {
        const clearedOtp = [...otp]
        clearedOtp[index] = ''
        setOtp(clearedOtp)
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
      return
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()

    const pastedDigits = event.clipboardData.getData('text').replace(/\D/g, '')
    if (!pastedDigits) return

    const nextOtp = [...otp]
    const digitsToInsert = pastedDigits.slice(0, OTP_LENGTH - index)

    digitsToInsert.split('').forEach((digit, offset) => {
      nextOtp[index + offset] = digit
    })

    setOtp(nextOtp)

    const nextIndex = Math.min(index + digitsToInsert.length, OTP_LENGTH - 1)
    inputRefs.current[nextIndex]?.focus()
  }

  const handleVerifyOtp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email) return

    const otpCode = otp.join('')
    if (otpCode.length !== OTP_LENGTH) {
      toast.error('Please enter the full 6-digit OTP.')
      return
    }

    verifyMutation.mutate({ email, otp: otpCode })
  }

  const handleRequestOtp = () => {
    if (!email) return
    setOtp(createEmptyOtp())
    inputRefs.current[0]?.focus()
    resendMutation.mutate(email)
  }

  return (
    <AuthLayout>
      <AuthLogo />

      <h1 className="text-2xl text-[#131313] md:text-4xl font-medium text-center mb-2">Enter OTP</h1>
      <p className="text-[#787878] text-center mb-8 text-sm md:text-base montserrat">
        An OTP has been sent to {email || 'your email address'}. Please verify it below.
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
                onPaste={(event) => handlePaste(index, event)}
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
            disabled={resendMutation.isPending || !email}
            className="text-[#033D86] hover:text-[#033D86]/90 font-semibold cursor-pointer"
          >
            {resendMutation.isPending ? 'Sending...' : 'Request OTP'}
          </button>
        </p>

        <Button
          type="submit"
          disabled={verifyMutation.isPending || otp.join('').length !== OTP_LENGTH || !email}
          className="w-full cursor-pointer h-12 montserrat bg-[#033D86] hover:bg-[#033D86]/90 text-white font-semibold py-2.5 md:py-3 rounded-lg text-sm md:text-base"
        >
          {verifyMutation.isPending ? 'Verifying...' : 'Verify'}
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

function VerifyOTPFallback() {
  return (
    <AuthLayout>
      <AuthLogo />
      <div className="space-y-4 md:space-y-6">
        <div className="mx-auto h-9 w-40 animate-pulse rounded bg-[#E3EAF4]" />
        <div className="mx-auto h-5 w-72 animate-pulse rounded bg-[#EEF3FA]" />
        <div className="flex justify-center gap-3 md:gap-4">
          {Array.from({ length: OTP_LENGTH }).map((_, index) => (
            <div
              key={index}
              className="h-12 w-12 animate-pulse rounded-lg bg-[#EAEAEA] md:h-14 md:w-14"
            />
          ))}
        </div>
        <div className="h-12 animate-pulse rounded-lg bg-[#D9E5F5]" />
      </div>
    </AuthLayout>
  )
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<VerifyOTPFallback />}>
      <VerifyOTPContent />
    </Suspense>
  )
}
