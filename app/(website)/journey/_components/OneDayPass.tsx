'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { addDays, addMonths, differenceInCalendarDays, format, startOfDay } from 'date-fns';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Circle, CircleAlert, CarFront } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import JourneyCategoriesSkeleton from './JourneyCategoriesSkeleton';

interface CategoryApiItem {
  _id: string;
  name?: string;
  shortDetails?: string;
  rateActual?: number;
  rateDiscounted?: number;
  icon?: string;
}

interface CategoriesApiResponse {
  success: boolean;
  message?: string;
  data?: {
    categories?: CategoryApiItem[];
  };
}

type JourneyOption = {
  id: string;
  title: string;
  description: string;
  priceValue: number;
  oldPrice: string | null;
  save: string | null;
  price: string;
  icon: string | null;
};

interface JourneyCheckoutPayload {
  categoryId: string;
  vehicleNumber: string;
  preferredDate: string;
}

interface JourneyCheckoutResponse {
  success: boolean;
  message?: string;
  data?: {
    url?: string;
  };
}

interface JourneySettingsApiResponse {
  success: boolean;
  message?: string;
  data?: {
    lateFee?: number;
  };
}

const gbpFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const getApiBaseUrl = (): string => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error('API base URL is not configured');
  }

  return apiBaseUrl.replace(/\/+$/, '');
};

const readApiErrorMessage = async (response: Response, fallbackMessage: string): Promise<string> => {
  const data = await response.json().catch(() => null);
  if (typeof data?.message === 'string' && data.message.trim()) {
    return data.message;
  }

  return fallbackMessage;
};

const fetchJourneyCategories = async (): Promise<CategoryApiItem[]> => {
  const response = await fetch(`${getApiBaseUrl()}/categories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await readApiErrorMessage(response, 'Something went wrong while fetching journey categories.'));
  }

  const data: CategoriesApiResponse = await response.json();
  return data.data?.categories ?? [];
};

const fetchLateFeeSetting = async (): Promise<number> => {
  const response = await fetch(`${getApiBaseUrl()}/journeys/settings`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await readApiErrorMessage(response, 'Something went wrong while fetching journey settings.'));
  }

  const data: JourneySettingsApiResponse = await response.json();
  const lateFee = data.data?.lateFee;

  if (typeof lateFee !== 'number' || Number.isNaN(lateFee) || lateFee < 0) {
    return 0;
  }

  return lateFee;
};

const formatPrice = (value?: number): string => gbpFormatter.format(value ?? 0);

const formatVehicleNumber = (value: string): string =>
  value.toUpperCase().replace(/[^A-Z0-9\s]/g, '').replace(/\s+/g, ' ');

const isValidVehicleNumber = (value: string): boolean => {
  const compactValue = value.replace(/\s/g, '');
  return /^[A-Z0-9]{2,8}$/.test(compactValue);
};

const getSaveLabel = (actual?: number, discounted?: number): string | null => {
  if (typeof actual !== 'number' || typeof discounted !== 'number' || actual <= 0 || discounted >= actual) {
    return null;
  }

  const savedPercentage = Math.round(((actual - discounted) / actual) * 100);
  return savedPercentage > 0 ? `SAVE ${savedPercentage}%` : null;
};

const mapCategoryToJourneyOption = (category: CategoryApiItem): JourneyOption => {
  const actualRate = typeof category.rateActual === 'number' ? category.rateActual : 0;
  const discountedRate = typeof category.rateDiscounted === 'number' ? category.rateDiscounted : actualRate;

  return {
    id: category._id,
    title: category.name?.trim() || 'Journey Charge',
    description: category.shortDetails?.trim() || 'No description available for this category.',
    priceValue: discountedRate,
    oldPrice: discountedRate < actualRate ? formatPrice(actualRate) : null,
    save: getSaveLabel(actualRate, discountedRate),
    price: formatPrice(discountedRate),
    icon: category.icon?.trim() || null,
  };
};

export default function OneDayPass() {
  const { data: session, status: sessionStatus } = useSession();
  const [selectedJourney, setSelectedJourney] = useState<string | null>(null);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => startOfDay(new Date()));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useQuery<CategoryApiItem[], Error>({
    queryKey: ['journey-categories'],
    queryFn: fetchJourneyCategories,
  });

  const { data: configuredLateFee = 0 } = useQuery<number, Error>({
    queryKey: ['journey-settings-late-fee'],
    queryFn: fetchLateFeeSetting,
  });

  const journeyOptions = useMemo(
    () => categories.map(mapCategoryToJourneyOption),
    [categories]
  );

  const activeJourney = useMemo(() => {
    if (!journeyOptions.length) {
      return undefined;
    }

    if (!selectedJourney) {
      return journeyOptions[0];
    }

    return journeyOptions.find((option) => option.id === selectedJourney) ?? journeyOptions[0];
  }, [journeyOptions, selectedJourney]);
  const activeJourneyId = activeJourney?.id ?? '';

  const formattedDate = useMemo(
    () => (selectedDate ? format(selectedDate, 'dd/MM/yy') : ''),
    [selectedDate]
  );
  const today = useMemo(() => startOfDay(new Date()), []);
  const yesterday = useMemo(() => addDays(today, -1), [today]);
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
  const normalizedVehicleNumber = vehicleNumber.trim().replace(/\s+/g, ' ');
  const isVehicleNumberValid = isValidVehicleNumber(normalizedVehicleNumber);
  const shouldShowVehicleNumberError = vehicleNumber.trim().length > 0 && !isVehicleNumberValid;
  const selectedJourneyDate = useMemo(
    () => (selectedDate ? startOfDay(selectedDate) : null),
    [selectedDate]
  );
  const daysFromToday = useMemo(
    () => (selectedJourneyDate ? differenceInCalendarDays(selectedJourneyDate, today) : null),
    [selectedJourneyDate, today]
  );
  const hasLateFee = daysFromToday !== null && daysFromToday < 0;
  const lateFeeAmount = hasLateFee ? configuredLateFee : 0;
  const basePriceValue = activeJourney?.priceValue ?? 0;
  const totalDueValue = basePriceValue + lateFeeAmount;
  const summaryTitle = activeJourney?.title ?? 'Journey';
  const summaryPrice = activeJourney ? formatPrice(basePriceValue) : '--';
  const summaryLateFee = formatPrice(lateFeeAmount);
  const totalDuePrice = activeJourney ? formatPrice(totalDueValue) : '--';
  const canProceedToCheckout =
    !!activeJourney &&
    !!selectedDate &&
    isVehicleNumberValid &&
    !isCategoriesLoading &&
    !isCategoriesError;

  const checkoutMutation = useMutation<JourneyCheckoutResponse, Error, JourneyCheckoutPayload>({
    mutationFn: async (payload) => {
      if (!session?.accessToken) {
        throw new Error('Please login first to continue payment.');
      }

      const response = await fetch(`${getApiBaseUrl()}/journeys/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(payload),
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

  const handleProceedToPayment = () => {
    if (!activeJourney) {
      toast.error('Please choose a journey category.');
      return;
    }

    if (!normalizedVehicleNumber) {
      toast.error('Please enter vehicle registration number.');
      return;
    }

    if (!isVehicleNumberValid) {
      toast.error('Please enter a valid vehicle registration number.');
      return;
    }

    if (!selectedDate) {
      toast.error('Please select your preferred journey date.');
      return;
    }

    if (sessionStatus !== 'authenticated' || !session?.accessToken) {
      toast.error('Please login first to continue payment.');
      return;
    }

    checkoutMutation.mutate({
      categoryId: activeJourney.id,
      vehicleNumber: normalizedVehicleNumber,
      preferredDate: format(selectedDate, 'yyyy-MM-dd'),
    });
  };

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

  const openCalendar = () => {
    setCalendarMonth(startOfDay(selectedDate ?? today));
    setIsCalendarOpen(true);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1fr)_400px]">
      <motion.section
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true, amount: 0.2 }}
        className="min-w-0 rounded-[14px] border border-[#E3EBF6] bg-white p-4 shadow-[0_14px_36px_rgba(10,78,165,0.08)] sm:p-5 md:rounded-[10px] md:p-6"
      >
        <div className="space-y-4">
          <h3 className="montserrat flex items-center gap-2 text-[20px] font-semibold text-[#004EAF] sm:text-[22px] md:text-[24px]">
            <CarFront className="size-5 sm:size-6" />
            Vehicle Details
          </h3>

          <div>
            <label className="montserrat text-[14px] text-[#595959] sm:text-[15px] md:text-[16px]">
              Vehicle registration number (VRN)
            </label>
            <div className="relative mt-1.5">
              <input
                type="text"
                placeholder="E.G. LN24 DRV"
                value={vehicleNumber}
                onChange={(event) => setVehicleNumber(formatVehicleNumber(event.target.value))}
                maxLength={9}
                aria-invalid={shouldShowVehicleNumberError}
                className={cn(
                  'montserrat h-11 w-full rounded-[8px] border bg-[#F7F9FB] px-3 text-[15px] text-[#5d5959] outline-none transition-all placeholder:text-[#A1ACBC] focus:bg-white sm:h-12 sm:text-[16px]',
                  shouldShowVehicleNumberError
                    ? 'border-red-300 focus:border-red-400'
                    : 'border-[#D8E2F1] focus:border-[#0A4EA5]/55'
                )}
              />
            </div>
            {shouldShowVehicleNumberError ? (
              <p className="montserrat mt-1.5 text-[12px] text-red-500 sm:text-[13px]">
                Enter a valid VRN using 2 to 8 letters or numbers.
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="preferred-date" className="montserrat text-[14px] text-[#595959] sm:text-[15px] md:text-[16px]">
              Enter Preferred Date
            </label>
            <input
              id="preferred-date"
              type="text"
              value={formattedDate}
              placeholder="DD/MM/YY"
              readOnly
              onClick={openCalendar}
              onFocus={openCalendar}
              className="montserrat mt-1.5 h-11 w-full cursor-pointer rounded-[8px] border border-[#D8E2F1] bg-[#F7F9FB] px-3 text-[15px] text-[#5d5959] outline-none transition-all placeholder:text-[#A1ACBC] focus:border-[#0A4EA5]/55 focus:bg-white sm:h-12 sm:text-[16px]"
            />
          </div>

          <div ref={datePickerRef}>
            <p className="montserrat text-[13px] text-[#0B4FA8] sm:text-[14px]">Select a Date</p>
            {isCalendarOpen && (
              <div className="mt-2 w-full max-w-[320px] rounded-[10px] border border-[#E4EAF4] bg-white p-3 shadow-[0_12px_26px_rgba(10,78,165,0.12)]">
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
                  selected={selectedDate}
                  month={calendarMonth}
                  onMonthChange={setCalendarMonth}
                  defaultMonth={selectedDate ?? today}
                  hideNavigation
                  startMonth={calendarStartMonth}
                  endMonth={calendarEndMonth}
                  disabled={{ before: yesterday }}
                  weekStartsOn={6}
                  onSelect={(date) => {
                    if (!date) {
                      return;
                    }

                    setSelectedDate(date);
                    setIsCalendarOpen(false);
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
          <h4 className="montserrat flex items-center gap-2 text-[20px] font-semibold text-[#004EAF] sm:text-[22px] md:text-[24px]">
            <CarFront className="size-5 sm:size-6" />
            Choose Your Preferred Journey
          </h4>

          {isCategoriesLoading ? (
            <JourneyCategoriesSkeleton />
          ) : journeyOptions.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {journeyOptions.map((option, idx) => {
                const isActive = activeJourneyId === option.id;

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
                      'rounded-[10px] cursor-pointer border p-3.5 text-left transition-all duration-300',
                      isActive
                        ? 'border-[#A6CFFF] bg-[#F8FBFF] shadow-[0_10px_20px_rgba(9,78,165,0.14)]'
                        : 'border-[#DCE6F3] bg-white hover:border-[#BED3F1]'
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="flex size-8 items-center justify-center rounded-[8px] bg-[#F0F5FD] p-1 text-[#2F2F2F]">
                     <CarFront className="size-6 text-[#0A4EA5]" />
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

                    <p className="montserrat text-[18px] font-bold text-[#2B2B2B] sm:text-[20px] md:text-[24px]">
                      {option.title}
                    </p>
                    <p className="montserrat mt-2 min-h-10 text-[13px] leading-5 text-[#747474] sm:mt-3 sm:text-[14px] sm:leading-4">
                      {option.description}
                    </p>

                    <div className="mt-2 flex min-h-7 items-center gap-1 text-[14px] sm:text-[16px]">
                      {option.oldPrice ? (
                        <span className="montserrat text-[#9F9F9F] line-through">{option.oldPrice}</span>
                      ) : null}
                      {option.save ? (
                        <span className="montserrat rounded-[4px] bg-[#E6EDF7] p-1 font-semibold text-[#004EAF]">
                          {option.save}
                        </span>
                      ) : null}
                    </div>
                    <p className="montserrat mt-1 text-[22px] font-semibold text-[#004EAF] sm:text-[24px]">
                      {option.price}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          ) : (
            <div className="montserrat mt-4 rounded-[10px] border border-[#DCE6F3] bg-white px-4 py-5 text-[14px] text-[#5D6676]">
              {isCategoriesError
                ? categoriesError?.message || 'Failed to load categories.'
                : 'No journey categories found right now.'}
            </div>
          )}
        </motion.div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true, amount: 0.3 }}
        className="relative w-full overflow-hidden rounded-[12px] border border-[#D8E5F5] bg-[#F4F7FC] p-4 shadow-[0_18px_45px_rgba(10,78,165,0.12)] sm:p-5 lg:sticky lg:top-28"
      >
        <div className="absolute -right-12 -top-12 size-[120px] rounded-full bg-[#0A4EA5]/8 blur-2xl"></div>

        <div className="relative">
          <p className="montserrat text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6B7D98]">
            Checkout
          </p>
          <h5 className="montserrat mt-1 text-[22px] font-semibold leading-tight text-[#1F2F46] sm:text-[24px]">
            Payment Summary
          </h5>
        </div>

        <div className="relative mt-5 rounded-[10px] border border-[#D7E4F4] bg-white p-4">
          <div className="montserrat flex items-start justify-between gap-4 text-[13px] text-[#5B6B82]">
            <span>Selected pass</span>
            <span className="max-w-[180px] text-right font-semibold text-[#143D73]">{summaryTitle} (1 Day)</span>
          </div>

          <div className="montserrat mt-3 flex items-center justify-between gap-4 text-[14px] text-[#5B6B82]">
            <span>Base price</span>
            <span className="font-semibold text-[#143D73]">{summaryPrice}</span>
          </div>

          {selectedDate ? (
            <div className="montserrat mt-3 flex items-center justify-between gap-4 text-[14px] text-[#5B6B82]">
              <span>Journey date</span>
              <span className="font-semibold text-[#143D73]">{formattedDate}</span>
            </div>
          ) : null}
        </div>

        {hasLateFee ? (
          <div className="montserrat mt-3 flex items-center justify-between rounded-[10px] border border-red-100 bg-red-50 px-4 py-3 text-[15px]">
            <span className="flex items-center gap-2">
              <CircleAlert className="size-4 text-red-500" />
              <p className="text-red-500">Late Fee</p>
            </span>
            <span className="font-semibold text-red-500">{summaryLateFee}</span>
          </div>
        ) : null}

        <div className="montserrat mt-5 rounded-[10px] bg-[#0A4EA5] px-4 py-4 text-white">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[15px] font-semibold uppercase tracking-[0.08em] text-white/80">Total Due</span>
            <span className="text-[34px] font-semibold leading-none sm:text-[40px]">{totalDuePrice}</span>
          </div>
        </div>

        <Button
          onClick={handleProceedToPayment}
          disabled={!canProceedToCheckout || checkoutMutation.isPending || sessionStatus === 'loading'}
          className={`montserrat mt-4 h-12 w-full rounded-[8px] text-[15px] font-semibold text-white sm:text-[16px] ${
            !canProceedToCheckout || checkoutMutation.isPending || sessionStatus === 'loading'
              ? 'cursor-not-allowed bg-gray-400 text-black/50'
              : 'cursor-pointer bg-[#004EB0] shadow-[0_12px_24px_rgba(0,78,176,0.26)] hover:bg-[#004EB0]/90'
          }`}
        >
          {checkoutMutation.isPending ? 'Processing...' : 'Proceed to Secure Payment'}
        </Button>
      </motion.section>
    </div>
  );
}
