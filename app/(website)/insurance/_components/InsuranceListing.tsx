'use client';
import { motion } from "framer-motion";
import InsuranceCard from "./InsuranceCard";

const insuranceData = [
  {
    id: "1",
    title: "City-Premium Plus",
    description: "Comprehensive cover optimized for London Congestion Zone regular users. Includes full ULEZ protection.",
    features: ["No-claims bonus protection", "24/7 Central London recovery"],
    memberRate: "£42.50/mo",
  },
  {
    id: "2",
    title: "Courier Trust Shield",
    description: "Specifically designed for multi-drop delivery drivers. High-value goods-in-transit cover as standard.",
    features: ["No-claims bonus protection", "24/7 Central London recovery"],
    memberRate: "£42.50/mo",
  },
  {
    id: "3",
    title: "Professional Indemnity",
    description: "Integrated vehicle and business liability for transport consultants and logistics firms.",
    features: ["No-claims bonus protection", "24/7 Central London recovery"],
    memberRate: "£42.50/mo",
  },
   {
    id: "4",
    title: "City-Premium Plus",
    description: "Comprehensive cover optimized for London Congestion Zone regular users. Includes full ULEZ protection.",
    features: ["No-claims bonus protection", "24/7 Central London recovery"],
    memberRate: "£42.50/mo",
  },
  {
    id: "5",
    title: "Courier Trust Shield",
    description: "Specifically designed for multi-drop delivery drivers. High-value goods-in-transit cover as standard.",
    features: ["No-claims bonus protection", "24/7 Central London recovery"],
    memberRate: "£42.50/mo",
  },
  {
    id: "6",
    title: "Professional Indemnity",
    description: "Integrated vehicle and business liability for transport consultants and logistics firms.",
    features: ["No-claims bonus protection", "24/7 Central London recovery"],
    memberRate: "£42.50/mo",
  },
  
];

export default function InsuranceListing() {
  return (
    <section className="bg-[#F8FBFF] py-20 md:py-24 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center  mx-auto">
          <h2 className="text-3xl font-normal text-[#4E4E4E] md:text-5xl">Insurance Listing</h2>
          <p className="mt-2 text-sm text-[#4E4E4E] md:text-base">
            Explore Our Helpful Insurance Plans
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:auto-rows-fr lg:grid-cols-3">
          {insuranceData.map((item, idx) => (
            <motion.div
              key={idx}
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <InsuranceCard
                id={item.id}
                title={item.title}
                description={item.description}
                features={item.features}
                memberRate={item.memberRate}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
