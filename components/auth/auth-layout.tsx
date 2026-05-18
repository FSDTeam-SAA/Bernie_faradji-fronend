import type { ReactNode } from 'react'
import Image from 'next/image'

type AuthLayoutProps = {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden">
        <Image
          src="/car.png"
          alt="Blue car with city skyline"
          width={1000}
          height={1000}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-12 bg-[#FFFFFF]">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}

export function AuthLogo() {
  return (
    <div className="flex justify-center mb-8">
      <div className="w-[136px] h-[136px]">
        <Image
          src="/carlogo.png"
          alt="BubbleDrive logo"
          width={1000}
          height={1000}
          className="w-full h-full object-cover"
          priority
        />
      </div>
    </div>
  )
}
