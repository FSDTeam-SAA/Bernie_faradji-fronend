"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  HandCoins,
  ClipboardList,
  ShoppingBasket,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Tokens",
    href: "/dashboard/tokens",
    icon: HandCoins,
  },
  {
    name: "Journey Plan",
    href: "/dashboard/journey-plan",
    icon: ClipboardList,
  },
  {
    name: "Subscription",
    href: "/dashboard/subscription",
    icon: ShoppingBasket,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {!isMobileMenuOpen && (
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-lg bg-[#0F3D61] text-white shadow-lg"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:static top-0 left-0 z-50 h-screen w-72! bg-white border-r transition-transform duration-300 flex flex-col",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="relative flex items-center justify-center py-6 border-b">
          <Image
            src="/logo.png"
            alt="Logo"
            width={140}
            height={60}
            className="object-contain"
          />

          {/* Close Button */}
          {isMobileMenuOpen && (
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2"
            >
              <X className="h-6 w-6 text-black" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-[8px] px-4 py-3 text-sm transition-all duration-200",
                  isActive
                    ? "bg-[#004EAF] text-white font-semibold shadow-md"
                    : "text-[#555] hover:bg-gray-100"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-white" : "text-[#777]"
                  )}
                />

                <span
                  className={cn(
                    "text-[18px] montserrat",
                    isActive ? "font-medium" : "font-normal"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-6">
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-500 hover:bg-red-50 transition-all duration-200">
            <LogOut className="h-5 w-5" />
            <span className="text-[15px] font-medium">Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
}