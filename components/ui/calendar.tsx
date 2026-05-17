'use client';

import * as React from 'react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';

import { cn } from '@/lib/utils';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-2', className)}
      classNames={{
        ...defaultClassNames,
        months: cn('montserrat', defaultClassNames.months),
        month: cn('space-y-2', defaultClassNames.month),
        month_caption: cn(
          'relative flex items-center justify-center pb-1',
          defaultClassNames.month_caption
        ),
        caption_label: cn('text-[12px] font-semibold text-[#0B4FA8]', defaultClassNames.caption_label),
        nav: cn(
          'absolute inset-x-0 top-0 flex items-center justify-between px-1',
          defaultClassNames.nav
        ),
        button_previous: cn(
          'size-5 rounded-[3px] border border-[#E2EAF5] bg-white p-0 text-[#0A4EA5] hover:bg-[#EAF2FB]',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          'size-5 rounded-[3px] border border-[#E2EAF5] bg-white p-0 text-[#0A4EA5] hover:bg-[#EAF2FB]',
          defaultClassNames.button_next
        ),
        month_grid: cn('w-full border-collapse', defaultClassNames.month_grid),
        weekdays: cn('grid grid-cols-7 gap-1', defaultClassNames.weekdays),
        weekday: cn(
          'text-center text-[10px] font-medium text-[#6F7A8B]',
          defaultClassNames.weekday
        ),
        weeks: cn('mt-1 flex flex-col gap-1', defaultClassNames.weeks),
        week: cn('grid grid-cols-7 gap-1', defaultClassNames.week),
        day: cn(
          'size-6 rounded-[3px] bg-[#EAF2FB] p-0 text-[#5278A6] transition-colors',
          defaultClassNames.day
        ),
        day_button: cn(
          'size-6 cursor-pointer rounded-[3px] border-0 bg-transparent p-0 text-[10px] font-semibold hover:bg-[#DCEBFB] hover:text-[#0A4EA5]',
          defaultClassNames.day_button
        ),
        selected: cn(
          'bg-[#0A4EA5] text-white hover:bg-[#0A4EA5] hover:text-white [&>button]:text-white [&>button:hover]:bg-[#0A4EA5]',
          defaultClassNames.selected
        ),
        today: cn(
          'bg-[#DCEBFB] text-[#0A4EA5] [&>button]:text-[#0A4EA5]',
          defaultClassNames.today
        ),
        outside: cn(
          'bg-[#F6F8FC] text-[#B2BED0] [&>button]:text-[#B2BED0]',
          defaultClassNames.outside
        ),
        disabled: cn(
          'bg-[#F6F8FC] text-[#B2BED0] opacity-60 [&>button]:cursor-not-allowed [&>button]:text-[#B2BED0]',
          defaultClassNames.disabled
        ),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      {...props}
    />
  );
}

export { Calendar };
