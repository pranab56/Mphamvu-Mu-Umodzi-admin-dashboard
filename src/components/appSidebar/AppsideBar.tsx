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
import { cn } from "@/lib/utils";
import {
  Calendar,
  LayoutGrid,
  LogOut,
  MessageCircle,
  Settings,
  Users,
  DollarSign,
  FileText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ActionModal } from "../members/ActionModals";

const navigationItems = [
  { name: "Dashboard", path: "/", icon: LayoutGrid },
  { name: "Members", path: "/members", icon: Users },
  { name: "Events", path: "/events", icon: Calendar },
  { name: "Payments", path: "/payments", icon: DollarSign },
  { name: "Reports", path: "/reports", icon: FileText },
  { name: "Communication", path: "/communication", icon: MessageCircle },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function AppSideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    setOpenMobile(false);
    router.push("/auth/login");
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0 border-none bg-[#E5E7EB]">
      <SidebarContent
        className="flex flex-col h-full bg-[#E5E7EB]"
      >
        {/* ── Logo & Title ── */}
        <SidebarHeader className="px-6 pt-12 pb-8 flex flex-col items-center">
          <Link href="/" className="flex flex-col items-center justify-center w-full" onClick={() => setOpenMobile(false)}>
            <div className={cn("relative flex justify-center w-full mb-4", isCollapsed ? "h-12" : "h-20")}>
              <Image
                src="/icons/logo.png"
                width={80}
                height={80}
                alt="MMU"
                className="object-contain"
                priority
              />
            </div>
            {!isCollapsed && (
              <div className="text-center w-full flex flex-col items-center">
                <h1 className="text-3xl font-black text-[#1A1C1F] mb-1">MMU</h1>
                <h2 className="text-xl font-bold text-[#1A1C1F] tracking-tight mb-0.5 whitespace-nowrap leading-tight">Admin Dashboard</h2>
                <p className="text-[13px] text-gray-500 font-medium whitespace-nowrap">Receipt Observatory</p>
              </div>
            )}
          </Link>
        </SidebarHeader>

        {/* ── Navigation List ── */}
        <div className="flex-1 overflow-y-auto px-6 custom-scrollbar lg:py-4">
          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5">
                {navigationItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.name}
                        className={cn(
                          "h-12 px-5 transition-all duration-200 group relative flex items-center gap-4",
                          active
                            ? "bg-[#A53200] text-white rounded-full hover:bg-[#A53200] hover:text-white"
                            : "text-[#585E69] hover:bg-white/50 hover:text-[#1A1C1F] rounded-full"
                        )}
                      >
                        <Link href={item.path} className="flex items-center w-full" onClick={() => setOpenMobile(false)}>
                          <item.icon className={cn("w-[22px] h-[22px]", active ? "text-white" : "text-[#585E69]")} />
                          {!isCollapsed && (
                            <span className={cn("text-[16px]", active ? "font-bold" : "font-semibold")}>
                              {item.name}
                            </span>
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

        {/* ── Footer / Logout ── */}
        <SidebarFooter className="p-6 mt-auto flex flex-col items-center bg-transparent">
          <div className="w-full h-px bg-gray-300/60 mb-6" />
          
          <ActionModal
            type="logout"
            onConfirm={handleLogout}
            trigger={
              <button
                className={cn(
                  "w-full h-12 border border-[#D92D20] cursor-pointer text-[#D12B1E] rounded-xl flex items-center justify-center gap-2 transition-colors duration-200 group hover:bg-[#D92D20]/5 mb-4 bg-transparent",
                  isCollapsed && "px-2"
                )}
              >
                <LogOut className="w-[20px] h-[20px] text-[#D12B1E] transform rotate-180" />
                {!isCollapsed && (
                  <span className="font-bold text-[16px]">Logout</span>
                )}
              </button>
            }
          />
          
          {!isCollapsed && (
            <p className="text-[14px] text-gray-500 font-semibold tracking-wide">
              Copyright@app
            </p>
          )}
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
