"use client";

import React from "react";
import { Calendar, Users, DollarSign, TrendingUp } from "lucide-react";

const stats = [
  {
    label: "Events This Year",
    value: "18",
    icon: <Calendar className="w-5 h-5 text-orange-500" />,
    iconBg: "bg-orange-50",
  },
  {
    label: "Active Members",
    value: "245",
    icon: <Users className="w-5 h-5 text-blue-500" />,
    iconBg: "bg-blue-50",
  },
  {
    label: "Total Revenue",
    value: "$ 548.5K",
    icon: <DollarSign className="w-5 h-5 text-green-600" />,
    iconBg: "bg-green-50",
  },
  {
    label: "Avg. Contribution",
    value: "$ 2,238",
    icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
    iconBg: "bg-emerald-50",
  },
];

export function ReportStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)]"
        >
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-4", stat.iconBg)}>
            {stat.icon}
          </div>
          <div className="text-2xl font-medium text-gray-900 mb-1">{stat.value}</div>
          <div className="text-sm font-normal text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

import { cn } from "@/lib/utils";
