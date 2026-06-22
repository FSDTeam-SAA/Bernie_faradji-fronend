"use client";

import Link from "next/link";
import CountUp from "react-countup";
import { motion } from "framer-motion";

export default function AboutUs() {
  const stats = [
    { end: 3, suffix: "+", label: "Years Experience" },
    { end: 50, suffix: "+", label: "Winners" },
    { end: 10000, suffix: "+", separator: ",", label: "Satisfied Researchers" },
  ];

  return (
    <section id="about" className="scroll-mt-28 bg-[#F8FBFF] py-20 md:py-24">
      <div className="mx-auto  container px-4 md:px-6">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-[44px] leading-none font-normal text-[#4E4E4E] md:text-[50px]">
            About Us 
          </h2>
          <div className="mt-3 flex justify-center">
          </div>
        </motion.div>

        {/* Summary Content */}
        <motion.div
          className="mt-8 space-y-5 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="text-lg font-normal leading-7 text-[#4E4E4E]">
            <span className="font-semibold text-[#1A365D]">Welcome to Bubbledrive </span> {" "} 
            our mission is simple: to create a smarter, more rewarding driving experience for 
            everyday motorists. We&apos;ve built a driver-focused ecosystem designed to help vehicle 
            owners save both time and money while managing their everyday driving needs.
          </p>

          <p className="text-lg font-normal leading-7 text-[#4E4E4E]">
            <span className="font-semibold text-[#1A365D]">A Platform Built for Drivers</span> {" "} 
            Bubbledrive brings together a range of services that help motorists manage their 
            driving-related expenses in one place, including a dedicated insurance section. 
            Every aspect of Bubbledrive is focused on creating a better experience for vehicle owners.
          </p>

          <p className="text-lg font-normal leading-7 text-[#4E4E4E]">
            <span className="font-semibold text-[#1A365D]">Making Driving More Rewarding</span> {" "}  
            What makes Bubbledrive truly unique is our driver-exclusive lottery and rewards system. 
            Participation is reserved for eligible drivers with a vehicle registered in their own name, 
            and your vehicle registration number forms an important part of the lottery experience.
          </p>

          <p className="text-lg font-normal leading-7 text-[#4E4E4E]">
            <span className="font-semibold text-[#1A365D]">An Exclusive Driver Community</span> {" "}  
            When you join Bubbledrive, you become part of an exclusive community built around supporting 
            drivers. We&apos;re committed to developing new ways to help drivers maximise value from their 
            membership while making everyday motoring more affordable and enjoyable.
          </p>

          <p className="text-lg font-normal leading-7 text-[#4E4E4E]">
            <span className="font-semibold text-[#1A365D]">Our Vision</span> {" "}  
            To become the UK&apos;s leading driver-focused platform, combining practical motoring services, 
            member savings, and innovative reward opportunities within a single trusted destination. 
            At Bubbledrive, we&apos;re not just helping people drive. We&apos;re helping drivers get more value 
            from every journey.
          </p>
        </motion.div>

        {/* View Details Button */}
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-[8px] bg-[#004EB0] px-6 py-3 text-base font-medium text-white transition-all hover:bg-[#0A4EA5]/90 hover:shadow-md"
          >
            View Details
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="mt-12 rounded-[8px] bg-white px-5 py-7 shadow-[0_10px_30px_rgba(24,34,51,0.12)] md:px-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3 md:gap-0">
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className={idx !== stats.length - 1 ? "md:border-r md:border-[#E6EAF0]" : ""}
              >
                <p className="text-[42px] font-semibold leading-none text-[#1A365D]">
                  <CountUp
                    end={stat.end}
                    duration={3}
                    suffix={stat.suffix}
                    separator={stat.separator}
                  />
                </p>
                <p className="mt-3 text-base leading-none text-[#3f454f]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}