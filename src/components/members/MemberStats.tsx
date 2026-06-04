"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Ban, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetUserAnalyticsCardQuery } from "@/features/members/membersApi";

export function MemberStats() {
  const { data: analyticsData, isLoading } = useGetUserAnalyticsCardQuery(undefined);

  const stats = [
    {
      title: "Active Users",
      value: analyticsData?.data?.totalActiveUsers ?? "0",
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Suspended",
      value: analyticsData?.data?.totalSuspendedUsers ?? "0",
      icon: AlertTriangle,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      title: "Blocked",
      value: analyticsData?.data?.totalBlockedUsers ?? "0",
      icon: Ban,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 mt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-gray-300" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 mt-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-lg overflow-hidden bg-white">
          <CardContent className="px-6 py-6 flex items-center gap-6">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-4xl font-medium text-[#1A1C21] leading-tight tracking-tight">{stat.value}</p>
              <p className="text-base font-normal text-gray-500 mt-1">{stat.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

