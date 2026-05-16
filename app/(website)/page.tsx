import AboutUs from "@/components/Homepage_Components/AboutUs";
import ChargingServices from "@/components/Homepage_Components/ChargingServices";
import Hero from "@/components/Homepage_Components/Hero";
import InsuranceOpportunities from "@/components/Homepage_Components/InsuranceOpportunities";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero
        heading="Win Big London’s Essential Prize Draw"
        description="Enter our exclusive monthly raffle by purchasing entry tokens and get a chance to win luxury rewards, travel experiences, and exciting premium prizes."
        imageSrc="/hero.png"
        buttons={[
          { text: "Buy Entry Tokens", href: "/lottery" },
          { text: "View Past Winners", href: "/winners", variant: "outline" },
        ]}
      />
      <ChargingServices />
      <InsuranceOpportunities />
      <AboutUs />
    </main>
  );
}
