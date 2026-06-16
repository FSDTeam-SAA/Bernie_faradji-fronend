"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
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
  { label: "Satisfied Members", value: "10,000+" },
];

const supportEmail = "info@bubbledrive.co.uk";

export default function QualityProcess() {
  return (
    <section className="bg-[#EEF2F7] py-12 px-4 sm:py-16 md:py-20 lg:py-24">
      <div className="container mx-auto  px-0 sm:px-4 md:px-6">
        
        {/* About Us - Bubbledrive  - About Us Section */}
        <div className="mx-auto mt-2 w-full md:mt-16 lg:mt-20">
          <motion.div
            className="mt-6 space-y-6 text-[#3A3E44] sm:mt-8 md:space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div>
              <h3 className="text-xl font-medium text-[#143A73] sm:text-2xl md:text-3xl lg:text-4xl">
                Welcome to Bubbledrive 
              </h3>
              <p className="mt-2 text-sm leading-relaxed sm:mt-3 sm:text-base md:text-lg">
                At Bubbledrive, our mission is simple: to create a smarter,
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
              <h3 className="text-xl font-medium text-[#143A73] sm:text-2xl md:text-3xl lg:text-4xl">
                A Platform Built for Drivers
              </h3>
              <p className="mt-2 text-sm leading-relaxed sm:mt-3 sm:text-base md:text-lg">
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
              <h3 className="text-xl font-medium text-[#143A73] sm:text-2xl md:text-3xl lg:text-4xl">
                Making Driving More Rewarding
              </h3>
              <p className="mt-2 text-sm leading-relaxed sm:mt-3 sm:text-base md:text-lg">
                What makes Bubbledrive truly unique is our driver-exclusive
                lottery and rewards system. Unlike traditional prize platforms,
                participation is reserved for eligible drivers with a vehicle
                registered in their own name. Even more uniquely, a driver&apos;s
                vehicle registration number forms an important part of the
                overall lottery experience, helping create a prize system
                designed specifically for the driving community. This innovative
                approach allows us to offer a fun and engaging experience that
                reflects our commitment to drivers and sets Bubbledrive apart
                from conventional lottery platform.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium text-[#143A73] sm:text-2xl md:text-3xl lg:text-4xl">
                An Exclusive Driver Community
              </h3>
              <p className="mt-2 text-sm leading-relaxed sm:mt-3 sm:text-base md:text-lg">
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
              <h3 className="text-xl font-medium text-[#143A73] sm:text-2xl md:text-3xl lg:text-4xl">
                Our Vision
              </h3>
              <p className="mt-2 text-sm leading-relaxed sm:mt-3 sm:text-base md:text-lg">
                Our vision is to become the UK&apos;s leading driver-focused
                platform, combining practical motoring services, member savings,
                and innovative reward opportunities within a single trusted
                destination. At Bubbledrive, we&apos;re not just helping people
                drive. We&apos;re helping drivers get more value from every journey.
              </p>
            </div>

            <motion.div
              className="rounded-[8px] border border-[#C9D6E8] bg-white p-5 shadow-[0_12px_28px_rgba(28,58,100,0.12)] sm:p-6 md:flex md:items-center md:justify-between md:gap-6"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              viewport={{ once: true, amount: 0.4 }}
            >
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#E8F1FF] text-[#143A73]">
                  <Mail className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="montserrat text-xs font-semibold uppercase tracking-wide text-[#3E7FD9]">
                    Contact Bubbledrive
                  </p>
                  <h3 className="mt-1 text-xl font-medium text-[#143A73] sm:text-2xl">
                    Need help or have a question?
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5D6672] sm:text-base">
                    For membership, service, or general enquiries, contact our
                    team directly.
                  </p>
                </div>
              </div>

              <a
                href={`mailto:${supportEmail}`}
                aria-label={`Email Bubbledrive at ${supportEmail}`}
                className="montserrat mt-4 inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-md bg-[#143A73] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(20,58,115,0.22)] transition-colors hover:bg-[#0E2E5F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3E7FD9] focus-visible:ring-offset-2 sm:mt-0 sm:shrink-0"
              >
                <Mail className="size-4" aria-hidden="true" />
                <span className="break-all leading-none sm:break-normal">
                  {supportEmail}
                </span>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Our Quality Process Section */}
        <div className="mx-auto mt-12 max-w-3xl text-center sm:mt-14 md:mt-16 lg:mt-20">
          <motion.h2
            className="text-3xl font-normal leading-tight text-[#2C2C2C] sm:text-4xl md:text-[42px] lg:text-[48px]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            Our Quality Process
          </motion.h2>
          <motion.p
            className="montserrat mt-2 px-2 text-xs text-[#5D6672] sm:mt-3 sm:text-sm md:text-base"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            How we ensure excellence in every service
          </motion.p>
        </div>

        {/* Process Steps */}
        <div className="mx-auto mt-8 max-w-[1080px] sm:mt-10 md:mt-12">
          {/* Desktop Steps (md and up) */}
          <div className="relative hidden md:block">
            <div className="absolute left-[calc(12.5%+18px)] right-[calc(12.5%+18px)] top-[18px] h-px bg-[#D9DEE7]"></div>
            <div className="grid grid-cols-4 gap-2 lg:gap-4">
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
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white sm:h-9 sm:w-9 sm:text-sm ${
                      step.number === 1
                        ? "bg-[#3E7FD9]"
                        : step.number === 4
                          ? "bg-[#183D73]"
                          : "bg-[#25559D]"
                    }`}
                  >
                    {step.number}
                  </div>
                  <p className="montserrat mt-2 text-base font-medium leading-snug text-[#143A73] sm:mt-3 sm:text-lg md:text-xl lg:text-[22px]">
                    {step.title}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile/Tablet Steps (below md) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:hidden">
            {steps.map((step, idx) => (
              <motion.div
                key={step.number}
                className="rounded-lg bg-white/60 p-3 text-center shadow-sm sm:p-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                viewport={{ once: true, amount: 0.4 }}
              >
                <div
                  className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white sm:h-9 sm:w-9 ${
                    step.number === 1 ? "bg-[#3B78D8]" : "bg-[#123B76]"
                  }`}
                >
                  {step.number}
                </div>
                <p className="montserrat mt-2 text-xs font-medium text-[#143A73] sm:mt-3 sm:text-sm">
                  {step.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Image Section */}
        <motion.div
          className="mx-auto mt-10 w-full max-w-[760px] overflow-hidden rounded-[8px] shadow-[0_14px_36px_rgba(15,23,42,0.18)] sm:mt-12 md:mt-14 lg:mt-16"
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
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 760px"
              className="object-cover"
              priority={false}
            />
          </div>
        </motion.div>

        {/* Our Team Section */}
        <motion.div
          className="mx-auto mt-12 max-w-3xl text-center sm:mt-14 md:mt-16 lg:mt-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h3 className="text-2xl leading-tight text-[#2B2E35] sm:text-3xl md:text-4xl lg:text-[50px]">
            Our Team
          </h3>
          <p className="montserrat mt-2 px-3 text-xs text-[#6E7681] sm:mt-3 sm:text-sm md:text-base">
            Excellent Workers who work for your satisfaction and celebration
          </p>
        </motion.div>

        {/* Team Stats Section */}
        <div className="mx-auto mt-6 max-w-[1040px] rounded-[10px] bg-white px-4 py-5 shadow-[0_10px_24px_rgba(46,74,113,0.16)] sm:mt-7 sm:px-6 sm:py-6 md:mt-8 md:px-8 md:py-7">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-0">
            {teamStats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                className={`text-center ${
                  idx !== teamStats.length - 1
                    ? "sm:border-r sm:border-[#E6EAF0]"
                    : ""
                } ${
                  idx === 1 && idx !== teamStats.length - 1
                    ? "sm:border-r"
                    : ""
                } md:border-r`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true, amount: 0.5 }}
              >
                <h4 className="montserrat text-2xl font-bold leading-none text-[#173E7A] sm:text-3xl md:text-[32px] lg:text-[34px]">
                  {stat.value}
                </h4>
                <p className="montserrat mt-1 text-xs text-[#525A65] sm:mt-2 sm:text-sm md:text-base">
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
