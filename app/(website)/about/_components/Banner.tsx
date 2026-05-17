'use client';
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
    <section className="relative min-h-[600px] sm:min-h-[650px] md:min-h-[760px] lg:min-h-screen overflow-hidden">
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
          className="object-cover w-full h-full"
        />
      </motion.div>

      {/* Overlay for better text visibility on mobile */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/35 sm:bg-gradient-to-r sm:from-black/45 sm:via-black/10 sm:to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />

      <motion.div
        className="pointer-events-none absolute -left-16 top-24 h-52 w-52 rounded-full bg-[#3A7ED9]/20 blur-3xl"
        animate={{ y: [0, -16, 0], x: [0, 10, 0], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 8.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-14 bottom-14 h-56 w-56 rounded-full bg-[#005cc8]/25 blur-3xl"
        animate={{ y: [0, 14, 0], x: [0, -8, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 9.4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center lg:justify-start pt-24 sm:pt-32 lg:pt-80 min-h-150">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center "
            variants={contentVariants}
            initial="hidden"
            animate="show"
          >
            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-normal text-center leading-tight tracking-tight text-white drop-shadow-[0_14px_28px_rgba(0,0,0,0.35)]"
            >
              {heading}
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="mt-4 w-300 mx-auto sm:mt-6 text-base sm:text-lg md:text-xl text-white/90 leading-7"
            >
              {description}
            </motion.p>

            {/* Buttons */}
            {buttons.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="mt-6 sm:mt-10 flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4"
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
                      className={`h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-base font-bold montserrat inline-flex items-center justify-center rounded-md transition-all duration-300 ${
                        btn.variant === "outline"
                          ? "border border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
                          : "bg-[#004EB0] text-white shadow-lg hover:scale-105 hover:bg-[#0046A8]"
                      }`}
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
                        className={`h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-base font-bold transition-all duration-300 ${
                          btn.variant === "outline"
                            ? "border border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
                            : "bg-[#004EB0] text-white shadow-lg hover:scale-105 hover:bg-[#0046A8]"
                        }`}
                        onClick={btn.onClick}
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
