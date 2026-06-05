"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  { number: 1, title: "Explore Services" },
  { number: 2, title: "Input Details" },
  { number: 3, title: "Complete Payment" },
  { number: 4, title: "Win Prizes" },
];

const teamStats = [
  { label: "Years Experience", value: "3+" },
  { label: "Winners", value: "50+" },
  { label: "Satisfied Researchers", value: "10,000+" },
];

export default function QualityProcess() {
  return (
    <section className="bg-[#EEF2F7] py-16 md:py-20 lg:py-6">
      <div className="container mx-auto px-0 md:px-0">
        {/* Our Quality Process Section */}
      

        {/* About Us - Bubble drive - About Us Section */}
        <div className="mx-auto mt-16 w-full md:mt-20">
       

          <motion.div
            className="mt-8 space-y-6 text-[#3A3E44]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div>
              <h3 className="text-2xl font-medium text-[#143A73] md:text-3xl">
                Welcome to Bubbledrive Ltd
              </h3>
              <p className="mt-3 leading-relaxed">
                At Bubbledrive Ltd, our mission is simple: to create a smarter,
                more rewarding driving experience for everyday motorists. We
                understand that driving comes with a variety of ongoing costs
                and responsibilities, from congestion charges and tunnel fees to
                insurance payments and other vehicle-related expenses. That&apos;s
                why we&apos;ve built a driver-focused ecosystem designed to help
                vehicle owners save both time and money while managing their
                everyday driving needs. Bubbledrive is an exclusive membership
                platform created specifically for drivers who own a vehicle
                registered in their name. Our goal is to provide convenient
                access to essential motoring services while delivering
                additional value through savings, rewards, and unique member
                benefits.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-medium text-[#143A73] md:text-3xl ">
                A Platform Built for Drivers
              </h3>
              <p className="mt-3 leading-relaxed">
                Bubbledrive brings together a range of services that help
                motorists manage their driving-related expenses in one place.
                Members can access information and payment services for various
                driving charges, including national and local road user charges,
                helping make vehicle ownership simpler and more convenient. Our
                platform also features a dedicated insurance section, allowing
                drivers to explore insurance options and manage important
                vehicle-related services through a single account. We believe
                drivers deserve a platform designed around their needs, which is
                why every aspect of Bubbledrive is focused on creating a better
                experience for vehicle owners.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-medium text-[#143A73] md:text-3xl">
                Making Driving More Rewarding
              </h3>
              <p className="mt-3 leading-relaxed">
                What makes Bubbledrive truly unique is our driver-exclusive
                lottery and rewards system. Unlike traditional prize platforms,
                participation is reserved for eligible drivers with a vehicle
                registered in their own name. Even more uniquely, a driver&apos;s
                vehicle registration number forms an important part of the
                overall lottery experience, helping create a prize system
                designed specifically for the driving community. This innovative
                approach allows us to offer a fun and engaging experience that
                reflects our commitment to drivers and sets Bubbledrive apart
                from conventional lottery platforms.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-medium text-[#143A73] md:text-3xl">
                An Exclusive Driver Community
              </h3>
              <p className="mt-3 leading-relaxed">
                When you join Bubbledrive, you become part of an exclusive
                community built around supporting drivers. Our members benefit
                from a platform that aims to reduce stress, simplify
                vehicle-related payments, provide access to valuable services,
                and create exciting opportunities through driver-focused rewards
                and prize draws. We are committed to developing new ways to help
                drivers maximise value from their membership while making
                everyday motoring more affordable and enjoyable.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-medium text-[#143A73] md:text-3xl">
                Our Vision
              </h3>
              <p className="mt-3 leading-relaxed">
                Our vision is to become the UK&apos;s leading driver-focused
                platform, combining practical motoring services, member savings,
                and innovative reward opportunities within a single trusted
                destination. At Bubbledrive, we&apos;re not just helping people
                drive. We&apos;re helping drivers get more value from every journey.
              </p>
            </div>
          </motion.div>
        </div>
          <div className="mx-auto max-w-3xl text-center mt-14">
          <motion.h2
            className="text-[36px] font-normal leading-tight text-[#2C2C2C] md:text-[48px]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            Our Quality Process
          </motion.h2>
          <motion.p
            className="montserrat mt-2 text-sm text-[#5D6672] md:text-[16px]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            How we ensure excellence in every service
          </motion.p>
        </div>

        <div className="mx-auto mt-10 max-w-[1080px] md:mt-12">
          <div className="relative hidden md:block">
            <div className="absolute left-[calc(12.5%+18px)] right-[calc(12.5%+18px)] top-[18px] h-px bg-[#D9DEE7]"></div>
            <div className="grid grid-cols-4 gap-2">
              {steps.map((step, idx) => (
                <motion.div
                  key={step.number}
                  className="relative z-10 flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true, amount: 0.5 }}
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-[14px] font-medium text-white ${
                      step.number === 1
                        ? "bg-[#3E7FD9]"
                        : step.number === 4
                          ? "bg-[#183D73]"
                          : "bg-[#25559D]"
                    }`}
                  >
                    {step.number}
                  </div>
                  <p className="montserrat mt-3.5 text-[22px] font-medium leading-snug text-[#143A73]">
                    {step.title}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-7 md:hidden">
            {steps.map((step, idx) => (
              <motion.div
                key={step.number}
                className="rounded-lg bg-white/60 p-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                viewport={{ once: true, amount: 0.4 }}
              >
                <div
                  className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-white ${
                    step.number === 1 ? "bg-[#3B78D8]" : "bg-[#123B76]"
                  }`}
                >
                  {step.number}
                </div>
                <p className="montserrat mt-3 text-sm font-medium text-[#143A73]">
                  {step.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="mx-auto mt-12 w-full max-w-[760px] overflow-hidden rounded-[8px] shadow-[0_14px_36px_rgba(15,23,42,0.18)] md:mt-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="relative aspect-[16/9] w-full">
            <Image
              src="/about2.png"
              alt="Our team at work"
              fill
              sizes="(max-width: 768px) 100vw, 760px"
              className="object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          className="mx-auto mt-16 max-w-3xl text-center md:mt-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h3 className="text-[34px] leading-tight text-[#2B2E35] md:text-[50px]">
            Our Team
          </h3>
          <p className="montserrat mt-2 text-sm text-[#6E7681] md:text-[16px]">
            Excellent Workers who work for your satisfaction and celebration
          </p>
        </motion.div>
      

        <div className="mx-auto mt-7 max-w-[1040px] rounded-[10px] bg-white px-6 py-7 shadow-[0_10px_24px_rgba(46,74,113,0.16)] md:mt-8 md:px-8">
          <div className="grid gap-5 md:grid-cols-3 md:gap-0">
            {teamStats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                className={`${idx !== teamStats.length - 1 ? "md:border-r md:border-[#E6EAF0]" : ""} text-center`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true, amount: 0.5 }}
              >
                <h4 className="montserrat text-[32px] font-bold leading-none text-[#173E7A] md:text-[34px]">
                  {stat.value}
                </h4>
                <p className="montserrat mt-2 text-[14px] text-[#525A65]">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
