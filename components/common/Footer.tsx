import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#033D86] py-10 text-white font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/whitelogo.png"
              alt="BubbleDrive Logo"
              width={180}
              height={60}
              className="h-auto w-[140px] sm:w-[160px] md:w-[180px]"
              priority
            />
          </Link>

          {/* Footer Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-medium md:text-base">
            <Link
              href="/lottery"
              className="transition-opacity hover:opacity-80"
            >
              Lottery
            </Link>

            <Link
              href="/insurance"
              className="transition-opacity hover:opacity-80"
            >
              Insurance
            </Link>

            <Link
              href="/journey"
              className="transition-opacity hover:opacity-80"
            >
              Journey Plan
            </Link>

            <Link
              href="/about"
              className="transition-opacity hover:opacity-80"
            >
              About Us
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-white/20" />

        {/* Copyright */}
        <div className="text-center text-xs text-white/70 sm:text-sm">
          © {new Date().getFullYear()} BubbleDrive. All rights reserved.
        </div>
      </div>
    </footer>
  );
}