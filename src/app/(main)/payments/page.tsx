"use client";

import { PaymentTable } from "@/components/payments/PaymentTable";

export default function PaymentsPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-900 tracking-tight">
          Payment Tracking
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1 font-normal">
          Monitor and manage all member contribution payments
        </p>
      </div>
      <PaymentTable />
    </div>
  );
}
