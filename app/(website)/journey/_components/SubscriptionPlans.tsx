'use client';

import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const subscriptionPlans = [
  {
    name: 'Daily Package',
    price: '£9.99 Daily',
    desc: '10% Off Congestion Charges',
    headerClass: 'bg-[#3683E2]',
  },
  {
    name: 'Weekly Package',
    price: '£19.99/Week',
    desc: '20% Off + AutoPay',
    headerClass: 'bg-[#004EAF]',
  },
  {
    name: '1 Month Package',
    price: '£34.99/month',
    desc: '35% Off + Family Vehicles',
    headerClass: 'bg-[#002A5D]',
  },
];

export default function SubscriptionPlans() {
  return (
    <div className="grid gap-4 sm:gap-5 md:grid-cols-3 md:gap-6 lg:px-10">
      {subscriptionPlans.map((plan, idx) => (
        <motion.article
          key={plan.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ y: -6 }}
          className="overflow-hidden rounded-[12px] border border-[#E5EBF4] bg-white shadow-[0_10px_25px_rgba(16,45,86,0.13)] transition-shadow duration-300 hover:shadow-[0_16px_32px_rgba(8,51,114,0.2)]"
        >
          <div className={cn('px-4 py-3.5 text-center sm:py-3', plan.headerClass)}>
            <h3 className="montserrat text-[20px] font-bold leading-tight text-white sm:text-[22px] md:text-[24px]">
              {plan.name}
            </h3>
          </div>

          <div className="px-4 pb-5 pt-4 text-center sm:px-5">
            <p className="montserrat text-[28px] font-semibold leading-tight text-[#131313] sm:text-[30px] md:text-[32px]">
              {plan.price}
            </p>
            <p className="montserrat mt-2 text-[14px] text-[#373E49] sm:mt-3 sm:text-[16px]">• {plan.desc}</p>

            <Button className="montserrat mt-4 h-11 w-full cursor-pointer rounded-[10px] bg-[#0A4EA5] text-[15px] font-semibold text-white duration-300 hover:bg-[#0B4593] sm:mt-5 sm:h-12 sm:text-[16px]">
              Subscribe Now
            </Button>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
