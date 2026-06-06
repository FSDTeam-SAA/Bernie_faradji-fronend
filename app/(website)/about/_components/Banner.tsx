"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface HeroButton {
  text: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "outline";
}

interface HeroProps {
  heading: string;
  description: string;
  imageSrc: string;
  buttons?: HeroButton[];
}

export default function Banner({
  heading,
  description,
  imageSrc,
  buttons = [],
}: HeroProps) {
  const contentVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.16,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 36 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 26, scale: 0.97 },
    show: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.55,
        delay: 0.45 + index * 0.1,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

  return (
    <section className="relative overflow-hidden min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-screen">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.12, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={imageSrc}
          alt="Hero Image"
          fill
          priority
          quality={100}
          className="object-cover"
        />
      </motion.div>

      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/45 sm:bg-gradient-to-r sm:from-black/55 sm:via-black/20 sm:to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1 }}
      />

      {/* Floating Blur Effects */}
      <motion.div
        className="pointer-events-none absolute -left-16 top-24 h-52 w-52 rounded-full bg-[#3A7ED9]/20 blur-3xl"
        animate={{
          y: [0, -16, 0],
          x: [0, 10, 0],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{
          duration: 8.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="pointer-events-none absolute -right-14 bottom-14 h-56 w-56 rounded-full bg-[#005cc8]/25 blur-3xl"
        animate={{
          y: [0, 14, 0],
          x: [0, -8, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 9.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-screen items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-6xl text-center"
            variants={contentVariants}
            initial="hidden"
            animate="show"
          >
            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="
                text-[32px]
                sm:text-[42px]
                md:text-[52px]
                lg:text-[60px]
                xl:text-[72px]
                font-normal
                leading-tight
                tracking-tight
                text-white
                drop-shadow-[0_14px_28px_rgba(0,0,0,0.35)]
              "
            >
              {heading}
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="
                mx-auto
                mt-4
                max-w-[95%]
                sm:max-w-[85%]
                md:max-w-[700px]
                lg:max-w-[850px]
                xl:max-w-[950px]
                text-sm
                sm:text-base
                md:text-lg
                lg:text-xl
                leading-relaxed
                text-white/90
              "
            >
              {description}
            </motion.p>

            {/* Buttons */}
            {buttons.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="
                  mt-6
                  sm:mt-8
                  md:mt-10
                  flex
                  flex-col
                  sm:flex-row
                  items-center
                  justify-center
                  gap-3
                  sm:gap-4
                "
              >
                {buttons.map((btn, idx) =>
                  btn.href ? (
                    <motion.a
                      key={idx}
                      custom={idx}
                      variants={buttonVariants}
                      whileHover={{ y: -3, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={btn.href}
                      className={`
                        h-11 sm:h-12 md:h-14
                        px-5 sm:px-7 md:px-8
                        text-sm sm:text-base
                        font-bold
                        montserrat
                        inline-flex
                        items-center
                        justify-center
                        rounded-md
                        transition-all
                        duration-300
                        ${
                          btn.variant === "outline"
                            ? "border border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
                            : "bg-[#004EB0] text-white shadow-lg hover:bg-[#0046A8]"
                        }
                      `}
                    >
                      {btn.text}
                    </motion.a>
                  ) : (
                    <motion.div
                      key={idx}
                      custom={idx}
                      variants={buttonVariants}
                      whileHover={{ y: -3, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={btn.variant || "default"}
                        onClick={btn.onClick}
                        className={`
                          h-11 sm:h-12 md:h-14
                          px-5 sm:px-7 md:px-8
                          text-sm sm:text-base
                          font-bold
                          transition-all
                          duration-300
                          ${
                            btn.variant === "outline"
                              ? "border border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
                              : "bg-[#004EB0] text-white shadow-lg hover:bg-[#0046A8]"
                          }
                        `}
                      >
                        {btn.text}
                      </Button>
                    </motion.div>
                  )
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}