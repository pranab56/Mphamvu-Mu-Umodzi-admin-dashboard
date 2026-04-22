"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Ban } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    title: "Active Members",
    value: "238",
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-100",
  },
  {
    title: "Warnings",
    value: "5",
    icon: AlertTriangle,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-100",
  },
  {
    title: "Suspended",
    value: "2",
    icon: Ban,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-100",
  },
];

export function MemberStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 mt-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-lg overflow-hidden bg-white">
          <CardContent className="px-6 py-0 flex items-center gap-6">
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

