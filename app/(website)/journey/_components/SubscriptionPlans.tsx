'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { addMonths, format, startOfDay } from 'date-fns';
import { motion } from 'framer-motion';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface SubscriptionPlanApiItem {
  _id: string;
  planName?: string;
  price?: number;
  billingCycle?: string;
  title?: string;
  packageIncludes?: string;
  isActive?: boolean;
}

interface PlansApiResponse {
  success: boolean;
  message?: string;
  data?: {
    plans?: SubscriptionPlanApiItem[];
  };
}

interface SubscriptionCheckoutPayload {
  planId: string;
  startDate: string;
}

interface SubscriptionCheckoutResponse {
  success: boolean;
  message?: string;
  data?: {
    url?: string;
  };
}

const headerClasses = [
  'bg-[#3683E2]',
  'bg-[#004EAF]',
  'bg-[#002A5D]',
];

const gbpFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const getApiBaseUrl = (): string => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error('API base URL is not configured');
  }

  return apiBaseUrl.replace(/\/+$/, '');
};

const readApiErrorMessage = async (
  response: Response,
  fallbackMessage = 'Failed to load subscription plans.',
): Promise<string> => {
  const data = await response.json().catch(() => null);

  if (typeof data?.message === 'string' && data.message.trim()) {
    return data.message;
  }

  return fallbackMessage;
};

const fetchSubscriptionPlans = async (): Promise<SubscriptionPlanApiItem[]> => {
  const response = await fetch(`${getApiBaseUrl()}/plans`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await readApiErrorMessage(response));
  }

  const data: PlansApiResponse = await response.json();
  const plans = data.data?.plans ?? [];
  return plans.filter((plan) => plan.isActive === true);
};

const getPackageItems = (packageIncludes?: string): string[] => {
  if (!packageIncludes?.trim()) {
    return ['Package information will be available soon.'];
  }

  return packageIncludes
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const formatPlanPrice = (price?: number, billingCycle?: string): string => {
  const cycle = billingCycle?.trim();
  const formattedPrice = gbpFormatter.format(price ?? 0);

  return cycle ? `${formattedPrice} ${cycle}` : formattedPrice;
};

const SubscriptionPlanSkeleton = ({ index }: { index: number }) => (
  <motion.article
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.08 }}
    className="overflow-hidden rounded-[12px] border border-[#E5EBF4] bg-white shadow-[0_10px_25px_rgba(16,45,86,0.13)]"
  >
    <div className={cn('px-4 py-3.5 text-center sm:py-3', headerClasses[index % headerClasses.length])}>
      <div className="mx-auto h-7 w-40 animate-pulse rounded bg-white/35" />
    </div>

    <div className="px-4 pb-5 pt-4 text-center sm:px-5">
      <div className="mx-auto h-9 w-36 animate-pulse rounded bg-[#E4EBF5]" />
      <div className="mx-auto mt-4 h-4 w-full max-w-[240px] animate-pulse rounded bg-[#EEF3FA]" />
      <div className="mx-auto mt-3 h-4 w-10/12 animate-pulse rounded bg-[#EEF3FA]" />
      <div className="mx-auto mt-3 h-4 w-8/12 animate-pulse rounded bg-[#EEF3FA]" />
      <div className="mt-5 h-12 w-full animate-pulse rounded-[10px] bg-[#DCE7F5]" />
    </div>
  </motion.article>
);

export default function SubscriptionPlans() {
  const { data: session, status: sessionStatus } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanApiItem | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>();
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => startOfDay(new Date()));
  const today = useMemo(() => startOfDay(new Date()), []);
  const calendarStartMonth = useMemo(() => new Date(today.getFullYear() - 5, 0, 1), [today]);
  const calendarEndMonth = useMemo(() => new Date(today.getFullYear() + 15, 11, 31), [today]);
  const lastNavigableMonth = useMemo(
    () => new Date(calendarEndMonth.getFullYear(), calendarEndMonth.getMonth(), 1),
    [calendarEndMonth]
  );
  const monthLabels = useMemo(
    () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    []
  );
  const yearOptions = useMemo(() => {
    const startYear = calendarStartMonth.getFullYear();
    const endYear = calendarEndMonth.getFullYear();
    return Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);
  }, [calendarEndMonth, calendarStartMonth]);

  const {
    data: subscriptionPlans = [],
    isLoading,
    isError,
    error,
  } = useQuery<SubscriptionPlanApiItem[], Error>({
    queryKey: ['subscription-plans'],
    queryFn: fetchSubscriptionPlans,
  });

  const checkoutMutation = useMutation<SubscriptionCheckoutResponse, Error, SubscriptionCheckoutPayload>({
    mutationFn: async ({ planId, startDate }) => {
      if (!session?.accessToken) {
        throw new Error('Please login first to continue payment.');
      }

      const response = await fetch(`${getApiBaseUrl()}/subscriptions/buy/${encodeURIComponent(planId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ startDate }),
      });

      if (!response.ok) {
        throw new Error(await readApiErrorMessage(response, 'Failed to create checkout session.'));
      }

      return response.json();
    },
    onSuccess: (data) => {
      const checkoutUrl = data?.data?.url;

      if (!checkoutUrl) {
        toast.error('Checkout URL missing. Please try again.');
        return;
      }

      window.location.href = checkoutUrl;
    },
    onError: (error) => {
      toast.error(error.message || 'Something went wrong while starting payment.');
    },
  });

  const handleOpenSubscribeModal = (plan: SubscriptionPlanApiItem) => {
    setSelectedPlan(plan);
    setSelectedStartDate(undefined);
    setCalendarMonth(today);
  };

  const handleModalOpenChange = (open: boolean) => {
    if (!open && !checkoutMutation.isPending) {
      setSelectedPlan(null);
      setSelectedStartDate(undefined);
    }
  };

  const handleContinueToCheckout = () => {
    if (!selectedPlan?._id) {
      toast.error('Please choose a subscription plan.');
      return;
    }

    if (!selectedStartDate) {
      toast.error('Please select subscription start date.');
      return;
    }

    if (sessionStatus !== 'authenticated' || !session?.accessToken) {
      toast.error('Please login first to continue payment.');
      return;
    }

    checkoutMutation.mutate({
      planId: selectedPlan._id,
      startDate: format(selectedStartDate, 'yyyy-MM-dd'),
    });
  };

  const previousMonth = addMonths(calendarMonth, -1);
  const nextMonth = addMonths(calendarMonth, 1);
  const isPreviousDisabled = previousMonth < calendarStartMonth;
  const isNextDisabled = nextMonth > lastNavigableMonth;

  const handleMonthSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextMonthValue = Number(event.target.value);
    setCalendarMonth(new Date(calendarMonth.getFullYear(), nextMonthValue, 1));
  };

  const handleYearSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextYearValue = Number(event.target.value);
    setCalendarMonth(new Date(nextYearValue, calendarMonth.getMonth(), 1));
  };

  return (
    <>
      <div className="grid gap-4 sm:gap-5 md:grid-cols-3 md:gap-6 lg:px-10">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <SubscriptionPlanSkeleton key={idx} index={idx} />
          ))
        ) : isError ? (
          <div className="montserrat rounded-[12px] border border-red-100 bg-red-50 px-5 py-6 text-center text-red-600 md:col-span-3">
            {error?.message || 'Failed to load subscription plans.'}
          </div>
        ) : subscriptionPlans.length === 0 ? (
          <div className="montserrat rounded-[12px] border border-[#E5EBF4] bg-white px-5 py-6 text-center text-[#5D6676] md:col-span-3">
            No subscription plans found right now.
          </div>
        ) : (
          subscriptionPlans.map((plan, idx) => (
            <motion.article
              key={plan._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -6 }}
              className="overflow-hidden rounded-[12px] border border-[#E5EBF4] bg-white shadow-[0_10px_25px_rgba(16,45,86,0.13)] transition-shadow duration-300 hover:shadow-[0_16px_32px_rgba(8,51,114,0.2)]"
            >
              <div className={cn('px-4 py-3.5 text-center sm:py-3', headerClasses[idx % headerClasses.length])}>
                <h3 className="montserrat text-[20px] font-bold leading-tight text-white sm:text-[22px] md:text-[24px]">
                  {plan.planName || 'Subscription Plan'}
                </h3>
              </div>

              <div className="px-4 pb-5 pt-4 text-center sm:px-5">
                <p className="montserrat text-[28px] font-semibold leading-tight text-[#131313] sm:text-[30px] md:text-[32px]">
                  {formatPlanPrice(plan.price, plan.billingCycle)}
                </p>
                <p className="montserrat mt-2 min-h-11 text-[14px] leading-5 text-[#373E49] sm:mt-3 sm:text-[16px]">
                  {plan.title || 'Subscription benefits for regular journey payments.'}
                </p>

                <div className="montserrat mt-4 space-y-2 text-left text-[14px] text-[#373E49] sm:text-[15px]">
                  {getPackageItems(plan.packageIncludes).map((item) => (
                    <p key={item}>• {item}</p>
                  ))}
                </div>

                <Button
                  onClick={() => handleOpenSubscribeModal(plan)}
                  disabled={plan.isActive === false}
                  className="montserrat mt-4 h-11 w-full cursor-pointer rounded-[10px] bg-[#0A4EA5] text-[15px] font-semibold text-white duration-300 hover:bg-[#0B4593] disabled:cursor-not-allowed disabled:bg-[#AEB9C8] disabled:text-[#F7F9FC] disabled:opacity-100 disabled:hover:bg-[#AEB9C8] sm:mt-5 sm:h-12 sm:text-[16px]"
                >
                  {plan.isActive === false ? 'Unavailable' : 'Subscribe Now'}
                </Button>
              </div>
            </motion.article>
          ))
        )}
      </div>

      <Dialog open={Boolean(selectedPlan)} onOpenChange={handleModalOpenChange}>
        <DialogContent className="max-h-[calc(100vh-2rem)] w-full overflow-y-auto border border-[#DCE6F3] bg-white p-0 ">
          <div className="overflow-hidden rounded-xl">
            <DialogHeader className="bg-[#F8FBFF] px-5 pb-4 pt-5 text-left sm:px-6">
              <div className="flex size-11 items-center justify-center rounded-full bg-[#E5F0FF] text-[#004EAF]">
                <CalendarDays size={22} />
              </div>
              <DialogTitle className="montserrat text-[22px] font-semibold text-[#243042] sm:text-[24px]">
                Select Start Date
              </DialogTitle>
              <DialogDescription className="montserrat text-[14px] leading-5 text-[#5D6676]">
                Choose when your {selectedPlan?.planName || 'subscription'} plan should start.
              </DialogDescription>
            </DialogHeader>

            <div className="px-5 py-5 sm:px-6">
              <div className="rounded-[10px] border border-[#DCE6F3] bg-[#F8FBFF] px-4 py-3">
                <p className="montserrat text-[13px] font-medium text-[#6A7280]">Selected plan</p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="montserrat text-[18px] font-semibold text-[#243042]">
                    {selectedPlan?.planName || 'Subscription Plan'}
                  </p>
                  <p className="montserrat shrink-0 text-[16px] font-semibold text-[#004EAF]">
                    {formatPlanPrice(selectedPlan?.price, selectedPlan?.billingCycle)}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-[10px] border border-[#E4EAF4] bg-white p-3 shadow-[0_12px_26px_rgba(10,78,165,0.12)]">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setCalendarMonth(previousMonth)}
                    disabled={isPreviousDisabled}
                    aria-label="Previous month"
                    className="flex size-8 items-center justify-center rounded-[8px] border border-[#DDE7F4] bg-white text-[#0A4EA5] transition-colors hover:bg-[#EDF4FD] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="size-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <select
                      value={calendarMonth.getMonth()}
                      onChange={handleMonthSelectChange}
                      className="montserrat h-8 rounded-[7px] border border-[#D8E2F1] bg-white px-2 text-[14px] font-semibold text-[#0B4FA8] outline-none focus:border-[#0A4EA5]/50"
                    >
                      {monthLabels.map((monthLabel, index) => (
                        <option key={monthLabel} value={index}>
                          {monthLabel}
                        </option>
                      ))}
                    </select>

                    <select
                      value={calendarMonth.getFullYear()}
                      onChange={handleYearSelectChange}
                      className="montserrat h-8 rounded-[7px] border border-[#D8E2F1] bg-white px-2 text-[14px] font-semibold text-[#0B4FA8] outline-none focus:border-[#0A4EA5]/50"
                    >
                      {yearOptions.map((yearOption) => (
                        <option key={yearOption} value={yearOption}>
                          {yearOption}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCalendarMonth(nextMonth)}
                    disabled={isNextDisabled}
                    aria-label="Next month"
                    className="flex size-8 items-center justify-center rounded-[8px] border border-[#DDE7F4] bg-white text-[#0A4EA5] transition-colors hover:bg-[#EDF4FD] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>

                <Calendar
                  mode="single"
                  selected={selectedStartDate}
                  month={calendarMonth}
                  onMonthChange={setCalendarMonth}
                  hideNavigation
                  startMonth={calendarStartMonth}
                  endMonth={calendarEndMonth}
                  disabled={{ before: today }}
                  weekStartsOn={6}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedStartDate(date);
                    }
                  }}
                  classNames={{
                    month_caption: 'hidden',
                    nav: 'hidden',
                    weekdays: 'mt-1 grid grid-cols-7 gap-1',
                    weekday: 'text-center text-[12px] font-medium text-[#6F7A8B]',
                    weeks: 'mt-1 flex flex-col gap-1',
                    week: 'grid grid-cols-7 gap-1',
                    day: 'size-9 rounded-[7px] bg-[#EAF2FB] p-0 text-[#5278A6] transition-none hover:bg-[#EAF2FB] hover:text-[#5278A6]',
                    day_button:
                      'size-9 cursor-pointer rounded-[7px] border-0 bg-transparent p-0 text-[15px] font-semibold transition-none hover:bg-transparent hover:text-inherit focus:bg-transparent focus:text-inherit',
                    selected:
                      '!bg-[#0A4EA5] !text-white hover:!bg-[#0A4EA5] hover:!text-white [&>button]:!text-white [&>button:hover]:!bg-transparent [&>button:hover]:!text-white',
                    today:
                      'bg-[#DCEBFB] text-[#0A4EA5] hover:bg-[#DCEBFB] hover:text-[#0A4EA5] [&>button]:text-[#0A4EA5]',
                    outside:
                      'bg-[#F6F8FC] text-[#B2BED0] hover:bg-[#F6F8FC] hover:text-[#B2BED0] [&>button]:text-[#B2BED0]',
                    disabled:
                      'bg-[#F6F8FC] text-[#B2BED0] opacity-60 hover:bg-[#F6F8FC] hover:text-[#B2BED0] [&>button]:cursor-not-allowed [&>button]:text-[#B2BED0]',
                  }}
                  className="mx-auto w-full p-0"
                />
              </div>

              <div className="montserrat mt-4 rounded-[8px] bg-[#F8FBFF] px-4 py-3 text-center text-[14px] text-[#4E5968]">
                Start date:{' '}
                <span className="font-semibold text-[#004EAF]">
                  {selectedStartDate ? format(selectedStartDate, 'dd/MM/yyyy') : 'Select a date'}
                </span>
              </div>

              <Button
                onClick={handleContinueToCheckout}
                disabled={!selectedStartDate || checkoutMutation.isPending || sessionStatus === 'loading'}
                className="montserrat mt-4 h-11 w-full cursor-pointer rounded-[10px] bg-[#0A4EA5] text-[15px] font-semibold text-white duration-300 hover:bg-[#0B4593] disabled:cursor-not-allowed disabled:bg-[#AEB9C8] disabled:text-[#F7F9FC] disabled:opacity-100 disabled:hover:bg-[#AEB9C8] sm:h-12 sm:text-[16px]"
              >
                {checkoutMutation.isPending ? 'Processing...' : 'Continue'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
