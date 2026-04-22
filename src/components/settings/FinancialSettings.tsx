"use client";

import React, { useState } from "react";
import { PieChart, Clock, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export function FinancialSettings() {
  const [penaltyEnabled, setPenaltyEnabled] = useState(true);

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900">Financial & Contribution Rule Settings</h2>
        <p className="text-sm text-gray-500 font-normal mt-1">Manage contribution rules, fees and penalties.</p>
      </div>

      <div className="space-y-4">
        {/* Platform Fee */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)] flex items-start gap-5 group">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
             <PieChart className="w-6 h-6 text-[#A53200]" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h4 className="text-base font-medium text-gray-900">Platform Fee (%)</h4>
              <p className="text-xs text-gray-500 font-normal mt-1">Percentage retained by the platform</p>
            </div>
            <div className="flex items-center gap-3">
               <Input 
                 defaultValue="10%" 
                 className="flex-1 h-12 px-5 bg-neutral-100 rounded-lg border-none text-sm font-normal text-gray-600 focus-visible:ring-1 focus-visible:ring-[#8B2F0E]/20"
               />
               <Button className="bg-[#8B2F0E] hover:bg-[#70260B] text-white px-8 h-12 rounded-lg text-xs font-medium transition-all active:scale-95 shadow-md">
                 Save
               </Button>
            </div>
          </div>
        </div>

        {/* Beneficiary Share */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)] flex items-start gap-5">
          <div className="w-12 h-12 rounded-full bg-orange-700 flex items-center justify-center shrink-0">
             <PieChart className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h4 className="text-base font-medium text-gray-900">Beneficiary Share (%)</h4>
              <p className="text-xs text-gray-500 font-normal mt-1">Automatically calculated</p>
            </div>
            <div className="flex items-center gap-3">
               <Input 
                 defaultValue="90%" 
                 className="flex-1 h-12 px-5 bg-neutral-100 rounded-lg border-none text-sm font-normal text-gray-600 focus-visible:ring-1 focus-visible:ring-[#8B2F0E]/20"
               />
               <Button className="bg-[#8B2F0E] hover:bg-[#70260B] text-white px-8 h-12 rounded-lg text-xs font-medium transition-all active:scale-95 shadow-md">
                 Save
               </Button>
            </div>
          </div>
        </div>

        {/* Contribution Deadline */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)] flex items-start gap-5">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
             <Clock className="w-6 h-6 text-[#A53200]" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h4 className="text-base font-medium text-gray-900">Contribution Deadline</h4>
              <p className="text-xs text-gray-500 font-normal mt-1">Time allowed for members to complete payment</p>
            </div>
            <div className="flex items-center gap-3">
               <Input 
                 defaultValue="7 days" 
                 className="flex-1 h-12 px-5 bg-neutral-100 rounded-lg border-none text-sm font-normal text-gray-600 focus-visible:ring-1 focus-visible:ring-[#8B2F0E]/20"
               />
               <Button className="bg-[#8B2F0E] hover:bg-[#70260B] text-white px-8 h-12 rounded-lg text-xs font-medium transition-all active:scale-95 shadow-md">
                 Save
               </Button>
            </div>
          </div>
        </div>

        {/* Penalty Amount */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)] flex items-start gap-5">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
             <Banknote className="w-6 h-6 text-[#A53200]" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium text-gray-900">Penalty Amount</h4>
                <p className="text-xs text-gray-500 font-normal mt-1">Applied after deadline is missed</p>
              </div>
              <Switch 
                checked={penaltyEnabled} 
                onCheckedChange={setPenaltyEnabled}
                className="data-[state=checked]:bg-[#8B2F0E]" 
              />
            </div>
            <div className="flex items-center gap-3">
               <Input 
                 defaultValue="$5.00"
                 placeholder="$" 
                 className="flex-1 h-12 px-5 bg-neutral-100 rounded-lg border-none text-sm font-normal text-gray-600 focus-visible:ring-1 focus-visible:ring-[#8B2F0E]/20"
               />
               <Button className="bg-[#8B2F0E] hover:bg-[#70260B] text-white px-8 h-12 rounded-lg text-xs font-medium transition-all active:scale-95 shadow-md">
                 Save
               </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
