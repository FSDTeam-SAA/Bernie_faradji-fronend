"use client";

import CountUp from "react-countup";

export default function AboutUs() {
  const stats = [
    { end: 15, suffix: "+", label: "Years Experience" },
    { end: 50, suffix: "+", label: "Team Members" },
    { end: 10000, suffix: "+", separator: ",", label: "Satisfied Researchers" },
  ];

  return (
    <section id="about" className="scroll-mt-28 bg-[#F8FBFF] py-20 md:py-24">
      <div className="mx-auto w-full max-w-[1080px] px-4 md:px-6">
        <div className="mx-auto container text-center">
          <h2 className="text-[44px] leading-none font-normal text-[#353535] md:text-[52px]">
            About Us 
          </h2>
          <p className="mt-8 text-lg font-normal leading-7 text-[#4E4E4E]">
            At Bubblecar, we believe everyone deserves a fair chance to win. Our
            platform is built with trusted systems, real-time updates, and
            user-focused design to ensure every raffle feels exciting, engaging,
            and easy to participate in.
            <br />
            Join our growing community and experience the thrill of winning with
            [Your Raffle Brand]. Your next big win could be just one ticket
            away.
          </p>
        </div>

        <div className="mt-12 rounded-[8px] bg-white px-5 py-7 shadow-[0_10px_30px_rgba(24,34,51,0.12)] md:px-12">
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3 md:gap-0">
            {stats.map((stat) => (
              <div key={stat.label}>
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
        </div>
      </div>
    </section>
  );
}
