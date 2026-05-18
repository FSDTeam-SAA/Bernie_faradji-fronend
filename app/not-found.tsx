'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-b from-[#EEF5FF] via-white to-[#F7FBFF] px-4 py-20 sm:px-6">
      <motion.div
        className="pointer-events-none absolute -left-16 top-24 h-52 w-52 rounded-full bg-[#3A7ED9]/20 blur-3xl"
        animate={{ y: [0, -16, 0], x: [0, 10, 0], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 8.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -right-14 bottom-14 h-56 w-56 rounded-full bg-[#005cc8]/20 blur-3xl"
        animate={{ y: [0, 14, 0], x: [0, -8, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 9.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.section
        initial={{ opacity: 0, y: 36, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto w-full max-w-2xl overflow-hidden rounded-[20px] border border-[#d7e5fb] bg-white/90 p-7 text-center shadow-[0_26px_55px_rgba(0,78,176,0.18)] backdrop-blur-xl sm:p-10"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.55 }}
          className="montserrat text-sm font-semibold uppercase tracking-[0.28em] text-[#0057C4]"
        >
          BubbleDrive
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.65 }}
          className="mt-3 text-[72px] leading-none text-[#003a84] sm:text-[94px]"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-[30px] leading-tight text-[#131313] sm:text-[42px]"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.55 }}
          className="montserrat mx-auto mt-4 max-w-xl text-[15px] leading-7 text-[#465972] sm:text-[17px]"
        >
          The page you are looking for might have been moved, removed, or does not exist.
          Let&apos;s get you back to your journey.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.55 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button asChild className="h-12 w-full rounded-[12px] bg-[#004EB0] px-7 text-sm font-semibold text-white hover:bg-[#004EB0]/90 sm:w-auto">
            <Link href="/">Back To Home</Link>
          </Button>

          <Button
            asChild
            variant="secondary"
            className="h-12 w-full rounded-[12px] bg-[#eef5ff] px-7 text-sm font-semibold text-[#004EB0] hover:bg-[#dfeeff] sm:w-auto"
          >
            <Link href="/journey">View Journey Plans</Link>
          </Button>
        </motion.div>
      </motion.section>
    </main>
  );
}
