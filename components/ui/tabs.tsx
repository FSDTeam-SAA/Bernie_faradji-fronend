"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-12 w-full items-center rounded-[8px] border border-[#8EA3C4] bg-white p-1",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "montserrat inline-flex flex-1 cursor-pointer items-center justify-center rounded-[6px] px-3 py-2 text-[15px] font-medium text-[#49566B] transition-all duration-300 outline-none hover:text-[#0A4EA5] focus-visible:ring-2 focus-visible:ring-[#0A4EA5]/35 data-[state=active]:bg-[#0A4EA5] data-[state=active]:font-semibold data-[state=active]:text-white data-[state=active]:shadow-[0_8px_20px_rgba(10,78,165,0.28)]",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "mt-8 outline-none data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95",
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
