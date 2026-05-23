import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function InsuranceOpportunities() {
  return (
    <section id="insurance" className="scroll-mt-28 overflow-hidden bg-[#F8FBFF] py-20 md:py-24 lg:py-28">
      <div className="container mx-auto px-4 md:px-0">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Left Content */}
          <div className="relative">
            {/* Small blur effect */}
            <div className="absolute -left-10 top-0 h-44 w-44 rounded-full bg-[#005cc8]/10 blur-3xl" />

            <div className="relative z-10 max-w-[720px]">

              <h2 className="mt-6 text-4xl font-normal leading-tight tracking-tight text-[#353535] md:text-5xl lg:text-[50px] lg:leading-[1.7]">
                Special Insurance
                <br />
                Opportunities
              </h2>

              <p className="mt-7 text-base leading-8 text-[#4E4E4E] md:text-lg">
                Protecting what matters most should never feel complicated. At Bubblecar, we provide reliable insurance opportunities designed to give individuals and families confidence for the future. From financial protection to peace of mind, our platform connects users with accessible and trusted coverage options tailored to modern lifestyles.
              </p>

          

              {/* Button */}
              <div className="mt-10">
                <Link href="/insurance">
                <Button className="group montserrat cursor-pointer h-14 rounded-md bg-[#004EB0] px-8 text-base font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-[#004EB0]/90 hover:shadow-2xl">
                  View Insurance Listings

                  <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
          

            <div className="group relative overflow-hidden rounded-[8px] ">
              {/* Image */}
              <div className="relative h-[320px] w-[624px] overflow-hidden md:h-[420px]">
                <Image
                  src="/Insurance.png"
                  alt="Insurance"
                  fill
                  priority
                  className="object-cover rounded-[8px] h-full w-full transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
