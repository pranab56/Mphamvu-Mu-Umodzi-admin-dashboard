"use client";

import { Calendar, DollarSign, Users } from "lucide-react";

export function EventStats() {
  const stats = [
    {
      label: "Active Events",
      value: "12",
      icon: Calendar,
      iconColor: "text-blue-500",
      bgColor: "bg-[#DBEAFE]/50",
    },
    {
      label: "Expected Total",
      value: "$ 29.4k",
      icon: DollarSign,
      iconColor: "text-green-500",
      bgColor: "bg-[#DCFCE7]/50",
    },
    {
      label: "Avg Participation",
      value: "45%",
      icon: Users,
      iconColor: "text-green-600",
      bgColor: "bg-[#DCFCE7]/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="p-6 flex  border-none shadow-[0_10px_40px_rgb(0,0,0,0.01)]  gap-6 rounded-xl bg-white">
          <div className={`${stat.bgColor} p-4 rounded-xl flex items-center justify-center`}>
            <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
          </div>
          <div>
            <p className="text-2xl font-normal text-gray-900 leading-none">{stat.value}</p>
            <p className="text-sm font-normal text-gray-500 mt-2">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
