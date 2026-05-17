"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Lottery", href: "/lottery" },
  { label: "Insurance", href: "/insurance" },
  { label: "Journey Plan", href: "/journey" },
  { label: "About", href: "/about" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href.includes("#")) return false;
  return pathname.startsWith(href);
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed left-0 top-0 z-50 w-full px-3 pt-4 md:px-5">
      <div className="container mx-auto rounded-[12px]   p-px shadow-[0_20px_45px_rgba(0,75,170,0.25)]">
        <nav className="flex h-20 items-center justify-between rounded-[12px] bg-white px-4 backdrop-blur-xl md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-12.5 w-40 md:h-14 md:w-45.5">
              <Image
                src="/logo.png"
                alt="logo"
                width={1000}
                height={1000}
                className="h-full w-full object-cover"
              />
            </div>
          </Link>

          <div className="hidden items-center gap-2 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "relative rounded-full montserrat  px-4 py-2 text-base font-medium text-[#6D7A8B] transition-all duration-300 hover:text-[#005cc8]",
                    active && " text-[#005cc8] shadow-inner"
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute inset-x-3 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-[#005cc8] transition-transform duration-300",
                      active && "scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Button variant="secondary" className="h-11 montserrat rounded-[12px] bg-white px-6 text-sm font-semibold text-[#005ce6] shadow-md hover:bg-[#f6f9ff]">
              Login
            </Button>
            <Button className="h-11 montserrat rounded-[12px] bg-[#004EB0] px-6 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#004EB0]/90">
              Signup
            </Button>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-11 rounded-full border border-[#d7e4ff] bg-white text-[#005cc8] shadow-sm hover:bg-[#eef5ff] lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[86%] max-w-90 border-l border-[#d9e6ff] bg-linear-to-b from-[#f6faff] via-white to-[#f1f8ff] p-0"
            >

              <div className="flex flex-col gap-2 px-4 py-5">
                {NAV_ITEMS.map((item) => {
                  const active = isActivePath(pathname, item.href);

                  return (
                    <SheetClose asChild key={item.label}>
                      <Link
                        href={item.href}
                        className={cn(
                          "montserrat rounded-xl border border-transparent px-4 py-3 text-base font-semibold text-[#4f5f77] transition-all hover:border-[#d9e9ff] hover:bg-white hover:text-[#005cc8]",
                          active && "border-[#d6e7ff] bg-white text-[#005cc8] shadow-sm"
                        )}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  );
                })}
              </div>

              <div className="mt-auto grid gap-3 px-4 pb-6">
                <SheetClose asChild>
                  <Button variant="secondary" className="h-11 rounded-full bg-white text-[#005ce6] shadow-md hover:bg-[#f5f9ff] ">
                    Login
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button className="h-11 rounded-full bg-[#004EB0] text-white shadow-md hover:bg-[#004EB0]/90">
                    Signup
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}
