// import Image from "next/image";
// import { Button } from "@/components/ui/button";

// export default function Hero() {
//   return (
//     <section className="relative min-h-162.5 overflow-hidden md:min-h-190 lg:min-h-screen">
//       {/* Background Image */}
//       <div className="absolute inset-0">
//         <Image
//           src="/hero.png"
//           alt="London Bridge"
//           fill
//           priority
//           quality={100}
//           className=" object-cover"
//         />
//       </div>

//       {/* Hero Content */}
//       <div className="relative z-10 flex  items-center pt-24  lg:min-h-screen">
//         <div className="container mx-auto px-4 md:px-6">
//           <div className=" text-white">

//             {/* Heading */}
//             <h1 className="text-4xl font-normal leading-tight tracking-tight md:text-5xl lg:text-[60px] lg:leading-[1.5]">
//               Win Big London’s
//               <br />
//               Essential Prize Draw
//             </h1>

//             {/* Description */}
//             <p className="mt-6 max-w-186.75 text-2xl leading-7 text-[#FFFFFF] md:text-lg">
//               Enter our exclusive monthly raffle by purchasing entry
//               tokens and get a chance to win luxury rewards, travel
//               experiences, and exciting premium prizes.
//             </p>

//             {/* Buttons */}
//             <div className="mt-10 flex flex-wrap items-center gap-4">
//               <Button className="h-14 montserrat rounded-md bg-[#004EB0] px-8  text-base font-bold  text-white shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-[#004EB0]/90">
//                 Buy Entry Tokens
//               </Button>

//               <Button
//                 variant="outline"
//                 className="h-14 rounded-md border montserrat  border-[#0000001F] bg-[#FFFFFF33]/50 px-8 text-base font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:text-white"
//               >
//                 View Past Winners
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }




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
    <section className="relative min-h-[650px] md:min-h-[760px] lg:min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt="Hero Image"
          fill
          priority
          quality={100}
          className="object-cover"
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center pt-24 lg:min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-white max-w-[620px]">
            {/* Heading */}
            <h1 className="text-4xl font-normal leading-tight tracking-tight md:text-5xl lg:text-[60px] lg:leading-[1.5]">
              {heading}
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg md:text-xl text-[#FFFFFF] leading-7">
              {description}
            </p>

            {/* Buttons */}
            {buttons.length > 0 && (
              <div className="mt-10 flex flex-wrap items-center gap-4">
                {buttons.map((btn, idx) =>
                  btn.href ? (
                    <a
                      key={idx}
                      href={btn.href}
                      className={`h-14 px-8 text-base  montserrat font-bold transition-all duration-300 inline-flex items-center justify-center rounded-md ${
                        btn.variant === "outline"
                          ? "border border-[#0000001F] bg-[#FFFFFF33]/50 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
                          : "bg-[#004EB0] text-white shadow-2xl hover:scale-[1.02] hover:bg-[#004EB0]/90"
                      }`}
                    >
                      {btn.text}
                    </a>
                  ) : (
                    <Button
                      key={idx}
                      variant={btn.variant || "default"}
                      className={`h-14 px-8 text-base font-bold transition-all duration-300 ${
                        btn.variant === "outline"
                          ? "border border-[#0000001F] !montserrat bg-[#FFFFFF33]/50 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
                          : "bg-[#004EB0] text-white shadow-2xl hover:scale-[1.02] hover:bg-[#004EB0]/90"
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