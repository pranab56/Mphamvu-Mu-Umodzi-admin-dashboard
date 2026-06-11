"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useGetMyProfileQuery } from "@/features/profile/profileApi";
import { cn } from "@/lib/utils";
import {
  Calendar,
  DollarSign,
  FileText,
  LayoutGrid,
  LogOut,
  MessageCircle,
  Settings,
  Users
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { removeToken } from "../../utils/storage";
import { ActionModal } from "../members/ActionModals";

const navigationItems = [
  { name: "Dashboard", path: "/", icon: LayoutGrid },
  { name: "Members", path: "/members", icon: Users },
  { name: "Events", path: "/events", icon: Calendar },
  { name: "Payments", path: "/payments", icon: DollarSign },
  { name: "Requests", path: "/requests", icon: FileText },
  { name: "Reports", path: "/reports", icon: FileText },
  { name: "Communication", path: "/communication", icon: MessageCircle },
  { name: "Settings", path: "/settings", icon: Settings },
];

interface PagePermission {
  name: string;
  access: boolean;
}

export default function AppSideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile, isMobile } = useSidebar();
  const [isExiting, setIsExiting] = React.useState(false);

  const { data: profileResponse } = useGetMyProfileQuery({});
  const user = profileResponse?.data;

  const filteredItems = navigationItems.filter((item) => {
    if (user?.role === "SUPER_ADMIN") return true;
    const permission = user?.pageAccess?.find(
      (p: PagePermission) => p.name.toLowerCase() === item.name.toLowerCase()
    );
    return permission ? permission.access : false;
  });

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const handleLogout = async () => {
    setIsExiting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setOpenMobile(false);
    removeToken();
    router.replace("/auth/login");
  };

  const handleNavClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r-0 border-none"
    >
      <SidebarContent className="flex flex-col h-full bg-[#1A1C21] overflow-hidden">

        {/* ── Logo ── */}
        <SidebarHeader className="px-6 pt-8 pb-6 shrink-0">
          <Link
            href="/"
            onClick={handleNavClick}
            className="flex flex-col items-center gap-3 w-full"
          >
            <div className="relative w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center overflow-hidden shadow-lg">
              <Image
                src="/icons/logo.png"
                width={52}
                height={52}
                alt="MMU"
                className="object-contain"
                priority
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black text-white tracking-tight leading-none">MMU</h1>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5 tracking-widest uppercase">
                Admin Dashboard
              </p>
            </div>
          </Link>
        </SidebarHeader>

        {/* ── Divider ── */}
        <div className="mx-6 h-px bg-white/10 shrink-0" />

        {/* ── Navigation ── */}
        <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
          <SidebarGroup className="p-0">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-3">
              Navigation
            </p>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {filteredItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.name}
                        className={cn(
                          "h-11 px-3 rounded-xl transition-all duration-150 group relative flex items-center gap-3",
                          active
                            ? "bg-[#A53200] text-white hover:bg-[#A53200] hover:text-white shadow-lg shadow-[#A53200]/30"
                            : "text-gray-400 hover:bg-white/8 hover:text-white"
                        )}
                      >
                        <Link
                          href={item.path}
                          className="flex items-center w-full gap-3"
                          onClick={handleNavClick}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                            active
                              ? "bg-white/20"
                              : "bg-white/5 group-hover:bg-white/10"
                          )}>
                            <item.icon className={cn(
                              "w-4 h-4",
                              active ? "text-white" : "text-gray-400 group-hover:text-white"
                            )} />
                          </div>
                          <span className={cn(
                            "text-[14px] font-medium truncate",
                            active ? "text-white font-semibold" : "text-gray-400 group-hover:text-white"
                          )}>
                            {item.name}
                          </span>
                          {active && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* ── Divider ── */}
        <div className="mx-6 h-px bg-white/10 shrink-0" />

        {/* ── Footer / Logout ── */}
        <SidebarFooter className="px-3 py-4 shrink-0">
          <ActionModal
            type="logout"
            onConfirm={handleLogout}
            isLoading={isExiting}
            trigger={
              <button
                className="w-full h-11 cursor-pointer text-red-400 rounded-xl flex items-center gap-3 px-3 transition-all duration-150 hover:bg-red-500/10 group"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/10 group-hover:bg-red-500/20 shrink-0 transition-colors">
                  <LogOut className="w-4 h-4 text-red-400 transform rotate-180" />
                </div>
                <span className="text-[14px] font-medium">Logout</span>
              </button>
            }
          />
          <p className="text-[11px] text-gray-600 text-center mt-3 font-medium">
            © 2026 MMU · All rights reserved
          </p>
        </SidebarFooter>

      </SidebarContent>
    </Sidebar>
  );
}
