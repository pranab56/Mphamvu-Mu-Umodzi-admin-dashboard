"use client";

import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportStats } from "@/components/reports/ReportStats";
import { RevenueChart } from "@/components/reports/RevenueChart";
import { EventTypeChart } from "@/components/reports/EventTypeChart";
import { TopEventsChart } from "@/components/reports/TopEventsChart";
import { UrgentRequestList } from "@/components/reports/UrgentRequestList";

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium text-gray-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-base text-gray-500 mt-1 font-normal">Financial and contribution insights</p>
        </div>
        
        <Button className="bg-[#8B2F0E] hover:bg-[#70260B] text-white rounded-full px-8 h-12 flex items-center gap-2 text-sm font-medium shadow-md transition-all active:scale-95">
          <Download className="w-4 h-4" />
          Export All
        </Button>
      </div>

      {/* Summary Cards */}
      <ReportStats />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <EventTypeChart />
        </div>
      </div>

      {/* Top Events Chart */}
      <TopEventsChart />

      {/* Urgent Requests Section */}
      <UrgentRequestList />
    </div>
  );
}