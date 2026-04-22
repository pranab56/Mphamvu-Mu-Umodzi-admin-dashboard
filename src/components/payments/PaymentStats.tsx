"use client";

import React from "react";

const stats = [
  {
    label: "Total Collected",
    value: "$ 125,450",
    subtext: "This month",
  },
  {
    label: "Pending Payments",
    value: "$ 18,200",
    subtext: "42 members",
  },
  {
    label: "Overdue Payments",
    value: "$ 3,450",
    subtext: "8 members",
  },
];

export function PaymentStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)] hover:shadow-md transition-shadow"
        >
          <div className="text-3xl font-medium text-gray-900 mb-3">{stat.value}</div>
          <div className="text-sm font-normal text-gray-500 mb-1">{stat.label}</div>
          <div className="text-xs font-normal text-gray-400">{stat.subtext}</div>
        </div>
      ))}
    </div>
  );
}
