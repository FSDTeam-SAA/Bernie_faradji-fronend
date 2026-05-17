'use client';

import { motion } from 'framer-motion';

import Banner from './_components/Banner';
import QualityProcess from './_components/QualityProcess';

const page = () => {
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
    <div>
      <motion.div
        custom={0}
        variants={scrollSectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.22 }}
      >
        <Banner
          heading="About Us"
        description="At Bubblecar, we believe everyone deserves a fair chance to win. Our platform is built with trusted systems, real-time updates, and user-focused design to ensure every raffle feels exciting, engaging, and easy to participate in.
Join our growing community and experience the thrill of winning with [Your Raffle Brand]. Your next big win could be just one ticket away."
          imageSrc="/about.png"
        />
      </motion.div>

      <motion.div
        custom={1}
        variants={scrollSectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
      >
        <QualityProcess />
      </motion.div>
    </div>
  );
};

export default page;
