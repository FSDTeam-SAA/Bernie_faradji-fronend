'use client';

import { motion } from 'framer-motion';
import {
  Building2,
  CarFront,
  Circle,
  Leaf,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

type JourneyOption = {
  id: 'congestion' | 'ulez' | 'tunnel';
  title: string;
  description: string;
  oldPrice: string;
  save: string;
  price: string;
  Icon: LucideIcon;
};

const journeyOptions: JourneyOption[] = [
  {
    id: 'congestion',
    title: 'Congestion Charge',
    description:
      'Standard daily charge for driving in Central London between 07:00 and 18:00.',
    oldPrice: '£15.00',
    save: 'SAVE 10%',
    price: '£13.50',
    Icon: CarFront,
  },
  {
    id: 'ulez',
    title: 'ULEZ',
    description:
      'Ultra Low Emission Zone charge for vehicles not meeting emissions standards.',
    oldPrice: '£12.50',
    save: 'SAVE 12%',
    price: '£11.00',
    Icon: Leaf,
  },
  {
    id: 'tunnel',
    title: 'Tunnel Charges',
    description:
      'Covers Blackwall and Silvertown tunnel crossings during peak hours.',
    oldPrice: '£2.50',
    save: 'SAVE 20%',
    price: '£2.00',
    Icon: Building2,
  },
];

export default function OneDayPass() {
  const [selectedJourney, setSelectedJourney] = useState<JourneyOption['id']>('congestion');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const activeJourney = useMemo(
    () => journeyOptions.find((option) => option.id === selectedJourney) ?? journeyOptions[0],
    [selectedJourney]
  );
  const formattedDate = useMemo(
    () => (selectedDate ? format(selectedDate, 'dd/MM/yy') : ''),
    [selectedDate]
  );

  useEffect(() => {
    if (!isCalendarOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!datePickerRef.current?.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true, amount: 0.2 }}
        className="rounded-[10px] p-4  sm:p-5 md:p-6"
      >
        <div className="space-y-4">
          <h3 className="montserrat flex items-center gap-2 text-[24px] font-semibold text-[#004EAF]">
            <CarFront className="size-[24px]" />
            Vehicle Details
          </h3>

          <div>
            <label className="montserrat text-[16px] text-[#595959]">vehicle registration number (vrn)</label>
            <div className="relative mt-1.5">
              <input
                type="text"
                placeholder="E.G. LN24 DRV"
                className="montserrat h-12 w-full rounded-[6px]  bg-[#F7F9FB] px-3 text-[16px] text-[#5d5959] outline-none transition-all placeholder:text-[#A1ACBC]"
              />
             
            </div>
          </div>

          <div>
            <label htmlFor="preferred-date" className="montserrat text-[16px] text-[#595959]">
              Enter Preferred Date
            </label>
            <input
              id="preferred-date"
              type="text"
              value={formattedDate}
              placeholder="DD/MM/YY"
              readOnly
              onClick={() => setIsCalendarOpen(true)}
              onFocus={() => setIsCalendarOpen(true)}
              className="montserrat mt-1.5 h-12 w-full cursor-pointer rounded-[6px]  bg-[#F7F9FB] px-3 text-[16px] text-[#5d5959] outline-none transition-all placeholder:text-[#A1ACBC] focus:border-[#0A4EA5]/55 focus:bg-white"
            />
          </div>

          <div ref={datePickerRef}>
            <p className="montserrat text-[14px] text-[#0B4FA8]">Select a Date</p>
            {isCalendarOpen && (
              <div className="mt-2 w-[260px] rounded-[6px] border border-[#E4EAF4] bg-white p-2">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  weekStartsOn={6}
                  onSelect={(date) => {
                    if (!date) {
                      return;
                    }

                    setSelectedDate(date);
                    setIsCalendarOpen(false);
                  }}
                  className="w-full p-0"
                />
              </div>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-7"
        >
          <h4 className="montserrat flex items-center gap-2 text-[24px] font-semibold text-[#004EAF]">
            <CarFront className="size-[24px]" />
            Choose Your Preferred Journey
          </h4>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {journeyOptions.map((option, idx) => {
              const isActive = selectedJourney === option.id;

              return (
                <motion.button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedJourney(option.id)}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.99 }}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className={cn(
                    'rounded-[8px] border p-3 text-left transition-all duration-300',
                    isActive
                      ? 'border-[#A6CFFF] bg-[#F8FBFF] shadow-[0_10px_20px_rgba(9,78,165,0.14)]'
                      : 'border-[#DCE6F3] bg-white hover:border-[#BED3F1]'
                  )}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className=" p-1 text-[#2F2F2F]">
                      <option.Icon className="size-6" />
                    </span>

                    <span
                      className={cn(
                        'flex size-4 items-center justify-center rounded-full border',
                        isActive ? 'border-[#0A4EA5] text-[#0A4EA5]' : 'border-[#CBD7E8] text-transparent'
                      )}
                    >
                      <Circle className="size-3" fill={isActive ? 'currentColor' : 'none'} />
                    </span>
                  </div>

                  <p className="montserrat text-[24px] font-bold text-[#2B2B2B]">{option.title}</p>
                  <p className="montserrat mt-3 min-h-12 text-[14px] leading-4 text-[#747474]">
                    {option.description}
                  </p>

                  <div className="mt-2 flex items-center gap-1 text-[16px]">
                    <span className="montserrat text-[#9F9F9F] line-through">{option.oldPrice}</span>
                    <span className="montserrat font-semibold text-[#004EAF] bg-[#E6EDF7] p-1 rounded-[4px]">{option.save}</span>
                  </div>
                  <p className="montserrat mt-1 text-[24px] font-semibold text-[#004EAF]">{option.price}</p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true, amount: 0.3 }}
        className="relative mx-auto w-full max-w-[430px] overflow-hidden rounded-[10px] border border-[#E0E8F4] bg-[#F4F7FC] p-5 shadow-[0_14px_28px_rgba(11,65,137,0.14)]"
      >
        <div className="absolute -right-12 -top-12 size-[120px] rounded-full bg-[#0A4EA5]/8 blur-2xl"></div>

        <h5 className="montserrat text-[24px] font-semibold text-[#2E3542]">Payment Summary</h5>
        <div className="montserrat mt-4 flex items-center justify-between text-[13px] font-semibold text-[#0A4EA5]">
          <span>{activeJourney.title} (1 Day)</span>
          <span>{activeJourney.price}</span>
        </div>

        <div className="my-4 h-px bg-[#D9E3F1]"></div>

        <div className="montserrat flex items-center justify-between text-[#2B3240]">
          <span className="text-[27px] font-semibold">Total Due</span>
          <span className="text-[48px] font-semibold">{activeJourney.price}</span>
        </div>

        <Button className="montserrat mt-4 h-12 cursor-pointer w-full rounded-[7px] bg-[#004EB0] text-[16px] font-semibold text-white ] hover:bg-[#004EB0]/90">
          Proceed to Secure Payment
        </Button>
      </motion.section>
    </div>
  );
}
