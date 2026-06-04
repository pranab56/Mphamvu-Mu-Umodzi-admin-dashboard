"use client";

import { Calendar, DollarSign, Users, Loader2 } from "lucide-react";
import { useGetEventAnalysisQuery } from "@/features/event/eventApi";

export function EventStats() {
  const { data: analysisResponse, isLoading } = useGetEventAnalysisQuery(undefined);
  const data = analysisResponse?.data;

  const stats = [
    {
      label: "Active Events",
      value: data?.activeEvents?.toString() || "0",
      icon: Calendar,
      iconColor: "text-blue-500",
      bgColor: "bg-[#DBEAFE]/50",
    },
    {
      label: "Expected Total",
      value: `$ ${data?.expectedTotal?.toLocaleString() || "0"}`,
      icon: DollarSign,
      iconColor: "text-green-500",
      bgColor: "bg-[#DCFCE7]/50",
    },
    {
      label: "Avg Participation",
      value: `${data?.avgParticipation || 0}%`,
      icon: Users,
      iconColor: "text-green-600",
      bgColor: "bg-[#DCFCE7]/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="p-6 flex items-center border-none shadow-[0_10px_40px_rgb(0,0,0,0.01)] gap-6 rounded-xl bg-white min-h-[120px]">
          <div className={`${stat.bgColor} p-4 rounded-xl flex items-center justify-center`}>
            {isLoading ? (
              <Loader2 className={`w-6 h-6 animate-spin ${stat.iconColor}`} />
            ) : (
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            )}
          </div>
          <div>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-6 w-16 bg-gray-100 animate-pulse rounded" />
                <div className="h-4 w-24 bg-gray-50 animate-pulse rounded" />
              </div>
            ) : (
              <>
                <p className="text-2xl font-normal text-gray-900 leading-none">{stat.value}</p>
                <p className="text-sm font-normal text-gray-500 mt-2">{stat.label}</p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
