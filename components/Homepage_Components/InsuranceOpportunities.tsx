import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function InsuranceOpportunities() {
  return (
    <section id="insurance" className="scroll-mt-28 overflow-hidden bg-[#F8FBFF] py-5 md:py-24 lg:py-28">
      <div className="container mx-auto px-4 md:px-0">
        <div className="grid items-center gap-9 lg:grid-cols-2 lg:gap-14">
          {/* Left Content */}
          <div className="relative">
            {/* Small blur effect */}
            <div className="absolute -left-10 top-0 h-44 w-44 rounded-full bg-[#005cc8]/10 blur-3xl" />

            <div className="relative z-10 max-w-[720px]">

              <h2 className="mt-6 text-[30px] font-normal leading-tight tracking-tight text-[#353535] sm:text-4xl md:text-5xl lg:text-[50px] lg:leading-[1.7]">
                Special Insurance
                <br />
                Opportunities
              </h2>

              <p className="mt-5 text-[15px] leading-7 text-[#4E4E4E] sm:text-base md:mt-7 md:text-lg md:leading-8">
                Protecting what matters most should never feel complicated. At Bubbledrive, we provide reliable insurance opportunities designed to give individuals and families confidence for the future. From financial protection to peace of mind, our platform connects users with accessible and trusted coverage options tailored to modern lifestyles.
              </p>

          

              {/* Button */}
              <div className="mt-8 md:mt-10">
                <Link href="/insurance">
                <Button className="group montserrat h-12 w-full cursor-pointer justify-center rounded-md bg-[#004EB0] px-5 text-[15px] font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-[#004EB0]/90 hover:shadow-2xl sm:h-14 sm:w-auto sm:px-8 sm:text-base">
                  View Insurance Listings

                  <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative w-full">
          

            <div className="group relative mx-auto w-full max-w-[624px] overflow-hidden rounded-[8px] lg:mx-0">
              {/* Image */}
              <div className="relative aspect-[1.55] w-full overflow-hidden rounded-[8px] md:aspect-auto md:h-[420px] lg:w-[624px]">
                <Image
                  src="/Insurance.png"
                  alt="Insurance"
                  fill
                  priority
                  className="rounded-[8px] object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
