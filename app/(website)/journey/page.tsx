'use client';

import { motion } from 'framer-motion';

import OneDayPass from './_components/OneDayPass';
import SubscriptionPlans from './_components/SubscriptionPlans';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function JourneyDiscountPlansPage() {
  return (
    <section className="bg-[#FFFFFF] pb-20 pt-36 md:pb-24 md:pt-44">
      <div className="container mx-auto px-4 md:px-0">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-[40px] font-normal leading-tight text-[#131313] md:text-[40px]">
            Journey Discount Plans
          </h1>
          <p className="montserrat mt-2 text-[14px] text-[#424242] md:text-[18px]">
            Pay daily or subscribe monthly for better driving discounts across London zones.
          </p>
        </motion.div>

        <Tabs defaultValue="subscription" className="mx-auto mt-8 w-full  md:mt-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <TabsList className="h-15 rounded-[8px] border border-[#8FA1BC] bg-transparent p-1">
              <TabsTrigger
                value="oneDay"
                className="montserrat rounded-[6px] text-[24px] font-medium data-[state=active]:bg-[#004EAF] data-[state=active]:text-white"
              >
                One-Day-Pass
              </TabsTrigger>
              <TabsTrigger
                value="subscription"
                className="montserrat rounded-[6px] text-[24px] font-medium data-[state=active]:bg-[#004EAF] data-[state=active]:text-white"
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
