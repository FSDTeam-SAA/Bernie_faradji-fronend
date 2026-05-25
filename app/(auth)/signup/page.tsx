'use client'

import type { FormEvent } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { AuthLayout, AuthLogo } from '@/components/auth/auth-layout'
import { toast } from 'sonner' 

type RegisterData = {
  name: string
  email: string
  password: string
}

export default function SignupPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
  })

  const [confirmPassword, setConfirmPassword] = useState('')

  // TanStack Query Mutation
  const mutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Registration failed')
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Account created successfully!', {
        description: 'Please log in with your credentials.',
      })
      router.push('/login')
    },
    onError: (error: Error) => {
      toast.error('Registration failed', {
        description: error.message || 'Something went wrong. Please try again.',
      })
    },
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (formData.password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    mutation.mutate(formData)
  }

  const handleInputChange = (field: keyof RegisterData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
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

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
        <div>
          <Label htmlFor="name" className="block text-base font-semibold mb-2 text-[#2A2A2A] montserrat">
            Name <span className="text-[#8C311E]">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            required
            placeholder="Enter your name..."
            value={formData.name}
            onChange={handleInputChange('name')}
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
            value={formData.email}
            onChange={handleInputChange('email')}
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
              value={formData.password}
              onChange={handleInputChange('password')}
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
          disabled={mutation.isPending}
          className="w-full cursor-pointer h-12 montserrat bg-[#033D86] hover:bg-[#033D86]/90 text-white font-semibold py-2.5 md:py-3 rounded-lg text-sm md:text-base disabled:opacity-70"
        >
          {mutation.isPending ? 'Creating Account...' : 'Create Account'}
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