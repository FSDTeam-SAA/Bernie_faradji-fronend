'use client'

import { Suspense, type FormEvent } from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Check, Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { AuthLayout, AuthLogo } from '@/components/auth/auth-layout'
import { toast } from 'sonner'

function NewPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')?.trim() ?? ''

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    if (email) return

    toast.error('Email not found', {
      description: 'Please verify OTP first.',
    })
    router.replace('/forgot-password')
  }, [email, router])

  const resetPasswordMutation = useMutation({
    mutationFn: async (payload: { email: string; newPassword: string }) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to reset password')
      }

      return response.json()
    },
    onSuccess: () => {
      setShowSuccessModal(true)
    },
    onError: (error: Error) => {
      toast.error('Password reset failed', {
        description: error.message || 'Please try again.',
      })
    },
  })

  const handleResetPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email) return

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    resetPasswordMutation.mutate({ email, newPassword })
  }

  return (
    <>
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
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
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
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
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
            disabled={resetPasswordMutation.isPending || !email}
            className="w-full cursor-pointer h-12 montserrat bg-[#033D86] hover:bg-[#033D86]/90 text-white font-semibold py-2.5 md:py-3 rounded-lg text-sm md:text-base"
          >
            {resetPasswordMutation.isPending ? 'Updating...' : 'Continue'}
          </Button>

          <p className="text-center text-sm text-gray-600">
            <Link href="/login" className="text-[#033D86] hover:text-[#033D86]/90 font-semibold montserrat">
              Back to Login
            </Link>
          </p>
        </form>
      </AuthLayout>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white px-8 py-10 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#033D86]/10">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#033D86]">
                <Check className="h-5 w-5 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-[#131313] mb-2 montserrat">Password Changed Successfully</h2>
            <p className="text-sm text-[#787878] montserrat mb-6">
              Your password has been updated successfully
            </p>
            <Button
              onClick={() => {
                setShowSuccessModal(false)
                toast.success('Password changed successfully!')
                router.push('/login')
              }}
              className="w-full h-11 montserrat bg-[#033D86] hover:bg-[#033D86]/90 text-white font-semibold rounded-lg"
            >
              Back to Login
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

function NewPasswordFallback() {
  return (
    <AuthLayout>
      <AuthLogo />
      <div className="space-y-4 md:space-y-6">
        <div className="mx-auto h-9 w-48 animate-pulse rounded bg-[#E3EAF4]" />
        <div className="mx-auto h-5 w-64 animate-pulse rounded bg-[#EEF3FA]" />
        <div className="h-12 animate-pulse rounded-[12px] bg-[#EAEAEA]" />
        <div className="h-12 animate-pulse rounded-[12px] bg-[#EAEAEA]" />
        <div className="h-12 animate-pulse rounded-lg bg-[#D9E5F5]" />
      </div>
    </AuthLayout>
  )
}

export default function NewPasswordPage() {
  return (
    <Suspense fallback={<NewPasswordFallback />}>
      <NewPasswordContent />
    </Suspense>
  )
}
