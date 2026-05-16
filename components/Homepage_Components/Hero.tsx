'use client';
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

export default function Hero({
  heading,
  description,
  imageSrc,
  buttons = [],
}: HeroProps) {
  return (
    <section className="relative min-h-[600px] sm:min-h-[650px] md:min-h-[760px] lg:min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt="Hero Image"
          fill
          priority
          quality={100}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Overlay for better text visibility on mobile */}
      <div className="absolute inset-0 bg-black/30 sm:bg-transparent"></div>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center lg:justify-start pt-24 sm:pt-32 lg:pt-80 min-h-[600px]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center lg:text-left max-w-[620px]">
            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-normal leading-tight tracking-tight text-white">
              {heading}
            </h1>

            {/* Description */}
            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white/90 leading-7">
              {description}
            </p>

            {/* Buttons */}
            {buttons.length > 0 && (
              <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4">
                {buttons.map((btn, idx) =>
                  btn.href ? (
                    <a
                      key={idx}
                      href={btn.href}
                      className={`h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-base font-bold montserrat inline-flex items-center justify-center rounded-md transition-all duration-300 ${
                        btn.variant === "outline"
                          ? "border border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
                          : "bg-[#004EB0] text-white shadow-lg hover:scale-105 hover:bg-[#0046A8]"
                      }`}
                    >
                      {btn.text}
                    </a>
                  ) : (
                    <Button
                      key={idx}
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
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}