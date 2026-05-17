'use client';

import { motion } from 'framer-motion';
import AboutUs from "@/components/Homepage_Components/AboutUs";
import ChargingServices from "@/components/Homepage_Components/ChargingServices";
import Hero from "@/components/Homepage_Components/Hero";
import InsuranceOpportunities from "@/components/Homepage_Components/InsuranceOpportunities";

export default function HomePage() {
  const scrollSectionVariants = {
    hidden: { opacity: 0, y: 56, scale: 0.985 },
    show: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.86,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

  return (
    <main className="min-h-screen">
      <motion.div
        custom={0}
        variants={scrollSectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.22 }}
      >
        <Hero
          heading="Win Big London’s Essential Prize Draw"
          description="Enter our exclusive monthly raffle by purchasing entry tokens and get a chance to win luxury rewards, travel experiences, and exciting premium prizes."
          imageSrc="/hero.png"
          buttons={[
            { text: "Buy Entry Tokens", href: "/lottery" },
            { text: "View Past Winners", href: "/winners", variant: "outline" },
          ]}
        />
      </motion.div>

      <motion.div
        custom={1}
        variants={scrollSectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
      >
        <ChargingServices />
      </motion.div>

      <motion.div
        custom={2}
        variants={scrollSectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
      >
        <InsuranceOpportunities />
      </motion.div>

      <motion.div
        custom={3}
        variants={scrollSectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <AboutUs />
      </motion.div>
    </main>
  );
}
