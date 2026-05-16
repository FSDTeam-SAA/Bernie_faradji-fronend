import { notFound } from "next/navigation";

interface InsuranceDetailGroup {
  title: string;
  points: string[];
}

interface InsuranceDetailsContent {
  pageTitle: string;
  sections: {
    heading: string;
    groups: InsuranceDetailGroup[];
  }[];
}

const validPlanIds = new Set(["1", "2", "3", "4", "5", "6"]);

const insuranceDetailsDummyData: InsuranceDetailsContent = {
  pageTitle: "Insurance Details",
  sections: [
    {
      heading: "No-claims bonus protection",
      groups: [
        {
          title: "What's Included",
          points: [
            "Protection for up to 2 fault claims within a 5-year period",
            "Maintains no-claims discount eligibility",
            "Faster renewal approval process",
            "Reduced premium impact after eligible claims",
            "Available for experienced and low-risk drivers",
          ],
        },
        {
          title: "Benefits",
          points: [
            "Greater financial stability",
            "Long-term savings on renewals",
            "Peace of mind during unexpected incidents",
            "Ideal for regular city commuters",
          ],
        },
      ],
    },
    {
      heading: "24/7 Central London recovery",
      groups: [
        {
          title: "Coverage Area",
          points: [
            "Central London",
            "Congestion Zone routes",
            "Major London roads and surrounding M25 boundary areas",
          ],
        },
        {
          title: "Benefits",
          points: [
            "Fast response times",
            "24/7 emergency availability",
            "Recovery to approved garages or chosen UK destinations",
            "Professional roadside support team",
          ],
        },
      ],
    },
    {
      heading: "Congestion Zone penalty cover",
      groups: [
        {
          title: "Eligibility Conditions",
          points: [
            "Penalties must be unintentional",
            "Claims require valid proof and documentation",
            "Coverage applies only within approved policy regions",
          ],
        },
        {
          title: "Benefits",
          points: [
            "Extra financial protection for city drivers",
            "Ideal for frequent London commuters",
            "Reduces unexpected urban driving costs",
            "Added peace of mind during daily travel",
          ],
        },
      ],
    },
  ],
};

interface InsuranceDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function InsuranceDetailsPage({ params }: InsuranceDetailsPageProps) {
  const { id } = await params;

  if (!validPlanIds.has(id)) {
    notFound();
  }

  return (
    <section className="bg-[#ECEEF2] py-14 sm:py-16 md:py-20 lg:py-40">
      <div className="mx-auto w-full max-w-[980px] px-6 sm:px-10 md:px-14 lg:px-16">
        <h1 className="text-[42px] leading-[1.1] font-normal text-[#4E4E4E] sm:text-[50px] md:text-[50px]">
          {insuranceDetailsDummyData.pageTitle}
        </h1>

        <div className="mt-8 space-y-10 sm:mt-10 md:space-y-12">
          {insuranceDetailsDummyData.sections.map((section) => (
            <article key={section.heading} className="space-y-5 md:space-y-6">
              <h2 className="text-[30px] leading-tight font-normal text-[#353535] sm:text-[32px]">
                {section.heading}
              </h2>

              {section.groups.map((group) => (
                <div key={group.title} className="space-y-2 md:space-y-3">
                  <h3 className="montserrat text-[20px] font-semibold text-[#414141] sm:text-[22px]">
                    {group.title}
                  </h3>
                  <ul className="space-y-1 pl-4 sm:pl-5">
                    {group.points.map((point) => (
                      <li
                        key={point}
                        className="montserrat list-disc text-[17px] leading-relaxed text-[#5A5A5A] marker:text-[#7A7A7A] sm:text-[18px]"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
