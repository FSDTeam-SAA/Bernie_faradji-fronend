import { Button } from "@/components/ui/button";
import { Car, Leaf, Landmark } from "lucide-react";

const services = [
  {
    title: "Congestion Charges",
    icon: Car,
  },
  {
    title: "ULEZ Standards",
    icon: Leaf,
  },
  {
    title: "Tunnel Charges",
    icon: Landmark,
  },
];

export default function ChargingServices() {
  return (
    <section id="journey-plan" className="scroll-mt-28 bg-[#F8FBFF] py-20 md:py-24 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto text-center">
          <h2 className="text-3xl font-normal leading-tight text-[#4E4E4E] md:text-[50px]">
            Charging Services Overview
          </h2>

          <p className="mt-6  max-w-[640px] mx-auto text-sm leading-6 text-[#6f7380] md:text-base">
            Monitor and manage all your city driving charges from a single
            dashboard. Stay compliant with London&apos;s environmental and
            congestion regulations effortlessly.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-[760px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="group relative cursor-pointer overflow-hidden rounded-lg bg-white px-6 py-8 text-center shadow-[0_18px_45px_rgba(15,23,42,0.10)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,91,200,0.20)]"
              >
                <div className="absolute inset-x-0 top-0 h-1 scale-x-0 bg-[#005cc8] transition-transform duration-500 group-hover:scale-x-100" />

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#005cc8] text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <Icon size={24} strokeWidth={2.4} />
                </div>

                <h3 className="mt-5 text-base font-medium text-[#555] transition-colors duration-300 group-hover:text-[#005cc8]">
                  {service.title}
                </h3>

                <div className="pointer-events-none absolute -bottom-12 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-[#005cc8]/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Button className="h-14 cursor-pointer montserrat rounded-md bg-[#004EB0] px-10 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#004EB0]/90 hover:shadow-xl">
            Plan Your Journey
          </Button>
        </div>
      </div>
    </section>
  );
}
