"use client";

import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentStats } from "@/components/payments/PaymentStats";
import { PaymentTable } from "@/components/payments/PaymentTable";
import { ActionModal } from "@/components/members/ActionModals";

export default function PaymentsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium text-gray-900 tracking-tight">Payment Tracking</h1>
          <p className="text-base text-gray-500 mt-1 font-normal">Monitor all member payments</p>
        </div>
        
        <ActionModal 
          type="export"
          trigger={
            <Button className="bg-[#8B2F0E] hover:bg-[#70260B] text-white rounded-full px-8 h-12 flex items-center gap-2 text-sm font-medium shadow-md transition-all active:scale-95">
              <Download className="w-4 h-4" />
              Export
            </Button>
          }
           onConfirm={() => console.log("Exporting...")}
        />
      </div>

      {/* Stats Cards */}
      <PaymentStats />

      {/* Main Table Content */}
      <PaymentTable />
    </div>
  );
}