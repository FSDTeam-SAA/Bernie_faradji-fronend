'use client';

import { motion } from 'framer-motion';

import OneDayPass from './_components/OneDayPass';
import SubscriptionPlans from './_components/SubscriptionPlans';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function JourneyDiscountPlansPage() {
  return (
    <section className="relative overflow-hidden bg-[#FFFFFF] pb-16 pt-28 sm:pb-20 sm:pt-32 md:pb-24 md:pt-44">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[#0A4EA5]/12 blur-3xl sm:hidden"></div>
      <div className="pointer-events-none absolute -bottom-20 right-0 h-48 w-48 rounded-full bg-[#5B9FF5]/20 blur-3xl sm:hidden"></div>

      <div className="container mx-auto px-4 sm:px-5 md:px-0">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-[30px] font-normal leading-tight text-[#131313] sm:text-[34px] md:text-[40px]">
            Journey Discount Plans
          </h1>
          <p className="montserrat mx-auto mt-3 max-w-2xl text-[14px] leading-6 text-[#424242] sm:text-[15px] md:text-[18px]">
            Pay daily or subscribe monthly for better driving discounts across London zones.
          </p>
        </motion.div>

        <Tabs defaultValue="subscription" className="mx-auto mt-7 w-full md:mt-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <TabsList className="mx-auto grid h-auto w-full max-w-2xl grid-cols-2 gap-1 rounded-[12px] border border-[#8FA1BC] bg-[#ECF2FB] p-1.5 shadow-[0_10px_30px_rgba(10,78,165,0.12)] md:h-14 md:rounded-[8px] md:bg-transparent md:p-1 md:shadow-none">
              <TabsTrigger
                value="oneDay"
                className="montserrat min-h-11 rounded-[8px] px-2 text-[14px] font-semibold leading-tight sm:text-[15px] md:text-[24px] md:font-medium md:rounded-[6px] data-[state=active]:bg-[#004EAF] data-[state=active]:text-white"
              >
                One-Day-Pass
              </TabsTrigger>
              <TabsTrigger
                value="subscription"
                className="montserrat min-h-11 rounded-[8px] px-2 text-[14px] font-semibold leading-tight sm:text-[15px] md:text-[24px] md:font-medium md:rounded-[6px] data-[state=active]:bg-[#004EAF] data-[state=active]:text-white"
              >
                Subscription
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="oneDay" className="mt-6 md:mt-7">
            <OneDayPass />
          </TabsContent>

          <TabsContent value="subscription" className="mt-6 md:mt-7 lg:pb-50 ">
            <SubscriptionPlans />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
