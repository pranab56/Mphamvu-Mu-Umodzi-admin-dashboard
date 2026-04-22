"use client";

import {
  Bell,
  ChevronRight,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { ActionModal } from "../members/ActionModals";

const routeTitleMap: Record<string, string> = {
  "": "Dashboard",
  "notification": "Notifications",
  "users-management": "Users Management",
  "merchants": "Merchants",
  "receipts": "Receipts",
  "offers": "Offers",
  "redemptions": "Redemptions",
  "settings": "Settings",
  "faq": "FAQ's",
  "terms": "Terms of Service",
  "privacy": "Privacy Policy",
  "about": "About Us",
};

export default function MyNavber() {
  const pathname = usePathname();
  const router = useRouter();

  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    const filteredParts = parts.filter(p => !p.startsWith('('));

    const crumbs = [{ label: "Home Page", href: "/" }];
    let currentPath = "";

    filteredParts.forEach((part) => {
      currentPath += `/${part}`;
      const label = routeTitleMap[part] || part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " ");
      crumbs.push({ label, href: currentPath });
    });

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="flex h-16 md:h-20 items-center justify-between gap-3 md:gap-4 bg-[#E4E6E9] px-4 md:px-8 w-full shrink-0 border-b border-gray-200/50">

      {/* ── Sidebar Trigger (Mobile/Tablet) ── */}
      <div className="lg:hidden flex items-center">
        <SidebarTrigger className="w-10 h-10 bg-white" />
      </div>

      {/* ── Breadcrumbs ── */}
      <div className="hidden lg:flex items-center gap-2 text-[#737780]">
        {breadcrumbs.map((crumb, i) => (
          <div key={`${crumb.label}-${i}`} className="flex items-center gap-2">
            {i === breadcrumbs.length - 1 ? (
              <span className="text-sm font-semibold text-[#2C2E33]">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-sm hover:text-[#2C2E33] transition-colors cursor-pointer"
              >
                {crumb.label}
              </Link>
            )}
            {i < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4" />}
          </div>
        ))}
      </div>

      {/* ── Right Section ── */}
      <div className="flex items-center gap-5 md:gap-7 ml-auto sm:ml-0 shrink-0">

        {/* Notification Bell */}
        <Link href="/notification" className="flex items-center">
          <button className="relative flex items-center justify-center cursor-pointer transition-colors group outline-none">
            <Bell className="w-[22px] h-[22px] text-[#4B5563] group-hover:text-[#A53200] transition-colors stroke-[2]" />
            <span className="absolute -top-0.5 right-0.5 w-[7px] h-[7px] bg-[#FF4500] rounded-full" />
          </button>
        </Link>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-300"></div>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3.5 cursor-pointer group outline-none pl-1">
              <div className="hidden sm:flex flex-col items-end justify-center">
                <p className="text-[14px] font-bold text-gray-900 leading-tight mb-0.5">Admin Portfolio</p>
                <p className="text-[12px] font-medium text-gray-500 leading-tight">Observatory Lead</p>
              </div>
              <div className="relative w-10 h-10 rounded-full bg-[#E5E7EB] ring-2 ring-[#A53200] ring-offset-2 ring-offset-[#E4E6E9] shadow-sm flex items-center justify-center overflow-hidden transition-transform group-active:scale-95">
                <Image src="/images/auth/image.png" alt="Profile" fill className="object-cover" />
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={15}
            className="w-56 bg-white border border-gray-200 rounded-xl p-1 shadow-xl relative overflow-hidden"
          >
            <DropdownMenuItem asChild className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors focus:bg-gray-100 outline-none rounded-lg mb-1">
              <Link href="/profile">
                <span className="text-[14px] font-medium text-gray-700">My Profile</span>
              </Link>
            </DropdownMenuItem>
            <div className="h-px bg-gray-200 w-full my-1" />
            
            <ActionModal 
              type="logout"
              onConfirm={() => router.push("/auth/login")}
              trigger={
                <DropdownMenuItem 
                  onSelect={(e) => e.preventDefault()}
                  className="flex items-center px-4 py-3 cursor-pointer hover:bg-red-50 transition-colors focus:bg-red-50 outline-none rounded-lg text-red-600"
                >
                  <span className="text-[14px] font-medium">Logout</span>
                </DropdownMenuItem>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
