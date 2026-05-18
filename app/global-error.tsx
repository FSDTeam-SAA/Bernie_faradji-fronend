'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import './globals.css';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="bg-[#F3F8FF] text-[#1a2c44]">
        <main className="relative flex min-h-screen items-center overflow-hidden px-4 py-20 sm:px-6">
          <motion.div
            className="pointer-events-none absolute -left-12 top-20 h-56 w-56 rounded-full bg-[#1f6dd8]/18 blur-3xl"
            animate={{ y: [0, -14, 0], opacity: [0.32, 0.5, 0.32] }}
            transition={{ duration: 7.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="pointer-events-none absolute -right-10 bottom-16 h-56 w-56 rounded-full bg-[#004eb0]/18 blur-3xl"
            animate={{ y: [0, 16, 0], opacity: [0.3, 0.48, 0.3] }}
            transition={{ duration: 9.2, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.section
            initial={{ opacity: 0, y: 34, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mx-auto w-full max-w-2xl rounded-[20px] border border-[#d6e5fb] bg-white/95 p-7 text-center shadow-[0_22px_52px_rgba(0,78,176,0.18)] backdrop-blur-md sm:p-10"
          >
            <p className="montserrat text-sm font-semibold uppercase tracking-[0.26em] text-[#0057C4]">
              BubbleDrive
            </p>
            <h1 className="mt-3 text-[34px] leading-tight text-[#0f2440] sm:text-[46px]">Something Went Wrong</h1>
            <p className="montserrat mx-auto mt-4 max-w-xl text-[15px] leading-7 text-[#51627a] sm:text-[17px]">
              We hit an unexpected issue while loading this page. Try again now or return to the home page.
            </p>

            {process.env.NODE_ENV !== 'production' && error?.message ? (
              <p className="montserrat mt-4 rounded-[10px] bg-[#f2f7ff] p-3 text-left text-xs text-[#3f5674] sm:text-sm">
                {error.message}
              </p>
            ) : null}

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={reset}
                className="h-12 w-full rounded-[12px] bg-[#004EB0] px-7 text-sm font-semibold text-white hover:bg-[#004EB0]/90 sm:w-auto"
              >
                Try Again
              </Button>

              <Button
                asChild
                variant="secondary"
                className="h-12 w-full rounded-[12px] bg-[#eef5ff] px-7 text-sm font-semibold text-[#004EB0] hover:bg-[#dfeeff] sm:w-auto"
              >
                <Link href="/">Back To Home</Link>
              </Button>
            </div>
          </motion.section>
        </main>
      </body>
    </html>
  );
}
