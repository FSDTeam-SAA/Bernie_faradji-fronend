import { Car, CircleCheck } from "lucide-react";
import Link from "next/link";

interface InsuranceCardProps {
  id: string;
  title: string;
  description: string;
  features: string[];
  memberRate: string;
  saveText?: string;
}

export default function InsuranceCard({
  id,
  title,
  description,
  features,
  memberRate,
  saveText = "Save 20%",
}: InsuranceCardProps) {
  return (
    <div className="relative h-full transform overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl">
      {/* Save Badge */}
      {saveText && (
        <span className="absolute top-4 right-4 montserrat rounded-[4px] bg-[#E5F0FF] px-3 py-1.5 text-base font-normal text-[#004EB0]">
          {saveText}
        </span>
      )}

      <div className="flex h-full flex-col">
        {/* Icon */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E5F0FF] text-blue-700">
          <Car size={20} />
        </div>

        {/* Title */}
        <h3 className="text-[32px] font-normal text-[#353535]">{title}</h3>

        {/* Description */}
        <p className="mt-2 overflow-hidden text-base font-normal text-[#4E4E4E] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] [display:-webkit-box]">
          {description}
        </p>

        {/* Features */}
        <ul className="mt-3 space-y-1 text-sm text-gray-600">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-5">
              <span>
                <CircleCheck size={16} className="text-[#004EB0]" />
              </span>
              <p className="montserrat text-base font-normal text-[#4E4E4E]">
                {feature}
              </p>
            </li>
          ))}
        </ul>

        {/* Member Rate & Button */}
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-medium text-[#004EB0]">{memberRate}</span>
          <Link
            href={`/insurance-details/${id}`}
            className="montserrat inline-flex h-12 cursor-pointer items-center rounded-md bg-[#004EB0] px-6 text-sm font-medium text-white transition hover:bg-[#004EB0]/90"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
