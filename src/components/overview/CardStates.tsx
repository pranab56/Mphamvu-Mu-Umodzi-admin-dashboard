"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Users, Calendar, DollarSign, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { title: "Total Members", value: "245", icon: Users, color: "text-[#22C55E]", iconBg: "bg-[#DCFCE7]" },
  { title: "Active Events", value: "12", icon: Calendar, color: "text-[#2563EB]", iconBg: "bg-[#DBEAFE]" },
  { title: "total Collected", value: "$125,450", icon: DollarSign, color: "text-[#16A34A]", iconBg: "bg-[#DCFCE7]" },
  { title: "Pending Payments", value: "$ 18,200", icon: AlertCircle, color: "text-[#CA8A04]", iconBg: "bg-[#FEF9C3]" },
];

export default function CardStates() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          <Card className="rounded-xl border-none shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] h-full p-6 bg-white overflow-hidden">
            <CardContent className="p-0 flex flex-col gap-4">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.iconBg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-[#1A1C1F]">
                  {stat.value}
                </p>
                <p className="text-[14px] font-semibold text-gray-500">
                  {stat.title}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
