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
    <div className="grid gap-5 md:grid-cols-3 md:gap-6 lg:px-10 ">
      {subscriptionPlans.map((plan, idx) => (
        <motion.article
          key={plan.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ y: -6 }}
          className="overflow-hidden rounded-[10px] border border-[#E5EBF4] bg-white shadow-[0_8px_22px_rgba(16,45,86,0.13)]  transition-shadow duration-300 hover:shadow-[0_16px_32px_rgba(8,51,114,0.2)]"
        >
          <div className={cn('px-4 py-3 text-center', plan.headerClass)}>
            <h3 className="montserrat text-[24px] font-bold leading-tight text-white">{plan.name}</h3>
          </div>

          <div className="px-5 pb-5 pt-4 text-center">
            <p className="montserrat text-[32px] font-semibold leading-tight text-[#131313]">{plan.price}</p>
            <p className="montserrat mt-3 text-[16px] text-[#373E49]">• {plan.desc}</p>

            <Button className="montserrat duration-300 cursor-pointer mt-5 h-12 w-full rounded-[10px] bg-[#0A4EA5] text-[16px] font-semibold text-white  hover:bg-[#0B4593]">
              Subscribe Now
            </Button>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
