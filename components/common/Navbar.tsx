

"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Menu, LogOut, LayoutDashboard } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

type NavItem = {
  label: string;
  href: string;
};

type UserMeResponse = {
  status?: boolean;
  success?: boolean;
  message?: string;
  data?: {
    profileImage?: string;
  };
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Lottery", href: "/lottery" },
  { label: "Insurance", href: "/insurance" },
  { label: "Journey Plan", href: "/journey" },
  { label: "About", href: "/about" },
];

function isActivePath(pathname: string, href: string) {
  const [normalizedHref] = href.split("#");
  if (normalizedHref === "/") return pathname === "/";
  return pathname.startsWith(normalizedHref);
}

const isAbsoluteUrl = (value: string) =>
  /^https?:\/\//i.test(value) ||
  value.startsWith("data:") ||
  value.startsWith("blob:");

const getInitials = (name?: string) =>
  name
    ?.trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const apiBaseUrl = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ?? "",
    []
  );
  const [failedAvatarSrc, setFailedAvatarSrc] = useState<string | null>(null);

  const user = session?.user;
  const accessToken = session?.accessToken;

  const { data: profileResponse } = useQuery<UserMeResponse>({
    queryKey: ["navbar-user-profile", accessToken],
    enabled: isLoggedIn && Boolean(accessToken) && Boolean(apiBaseUrl),
    queryFn: async () => {
      const res = await fetch(`${apiBaseUrl}/user/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const response = (await res.json().catch(() => ({}))) as UserMeResponse;

      if (!res.ok || response.status === false || response.success === false) {
        return {};
      }

      return response;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const profileImageFromApi = profileResponse?.data?.profileImage?.trim() || "";
  const rawAvatarSrc = profileImageFromApi || user?.profileImage || user?.image || "";
  const avatarSrc = useMemo(() => {
    if (!rawAvatarSrc) return "";
    if (isAbsoluteUrl(rawAvatarSrc)) return rawAvatarSrc;
    if (rawAvatarSrc.startsWith("/") && apiBaseUrl) return `${apiBaseUrl}${rawAvatarSrc}`;
    return rawAvatarSrc;
  }, [apiBaseUrl, rawAvatarSrc]);
  const avatarInitials = getInitials(user?.name);
  const showAvatarImage = Boolean(avatarSrc) && failedAvatarSrc !== avatarSrc;

  return (
    <header className="fixed left-0 top-0 z-50 w-full px-3 pt-4 md:px-5">
      <div className="container mx-auto rounded-[12px] p-px">
        <nav className="flex h-20 items-center justify-between rounded-[12px] bg-[#E8EDFF] px-4 backdrop-blur-xl md:px-6">
          
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "relative rounded-full montserrat px-4 py-2 text-base font-medium text-[#6D7A8B] transition-all duration-300 hover:text-[#005cc8]",
                    active && "text-[#005cc8] shadow-inner"
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

          {/* Desktop Right Side - Auth */}
          <div className="hidden items-center gap-3 lg:flex">
            {!isLoggedIn ? (
              <>
                <Button
                  asChild
                  variant="secondary"
                  className="h-11 montserrat rounded-[12px] hover:-translate-y-0.5 bg-white px-6 text-sm font-semibold text-[#005ce6] shadow-md hover:bg-[#f6f9ff]"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="h-11 montserrat rounded-[12px] bg-[#004EB0] px-6 text-sm font-semibold text-white shadow-md hover:bg-[#004EB0]/90"
                >
                  <Link href="/signup">Signup</Link>
                </Button>
              </>
            ) : (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-11 w-11 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[#eaf1ff] shadow-md transition-all hover:ring-2 hover:ring-[#005cc8]/30">
                    <Avatar className="h-full w-full">
                      {showAvatarImage ? (
                        <AvatarImage
                          src={avatarSrc}
                          alt={user?.name || "User"}
                          onError={() => setFailedAvatarSrc(avatarSrc)}
                        />
                      ) : null}
                      <AvatarFallback className="montserrat bg-[#eaf1ff] text-sm font-semibold text-[#005cc8]">
                        {avatarInitials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer flex items-center gap-2">
                      <LayoutDashboard className="size-4 montserrat" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="cursor-pointer text-red-600 focus:text-red-600 flex items-center gap-2"
                  >
                    <LogOut className="size-4" />
                    Logout 
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu */}
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

              {/* Mobile Auth Section */}
              <div className="mt-auto px-4 pb-6">
                {!isLoggedIn ? (
                  <div className="grid gap-3">
                    <SheetClose asChild>
                      <Link href="/login">
                        <Button
                          variant="secondary"
                          className="h-11 w-full rounded-full bg-white text-[#005ce6] shadow-md"
                        >
                          Login
                        </Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/signup">
                        <Button className="h-11 w-full rounded-full bg-[#004EB0] text-white">
                          Signup
                        </Button>
                      </Link>
                    </SheetClose>
                  </div>
                ) : (
                  <div className="space-y-3 ">
                    <SheetClose asChild>
                      <Link href="/dashboard">
                        <Button
                          variant="secondary"
                          className="h-11 w-full justify-start gap-2 rounded-full montserrat"
                        >
                          <LayoutDashboard className="size-5" />
                          Dashboard
                        </Button>
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        variant="destructive"
                        className="h-11 w-full gap-2 rounded-full"
                      >
                        <LogOut className="size-5" />
                        Logout
                      </Button>
                    </SheetClose>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}
