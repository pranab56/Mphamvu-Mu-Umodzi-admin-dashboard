"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { month: "Oct", revenue: 80000, members: 110000 },
  { month: "Nov", revenue: 85000, members: 115000 },
  { month: "Dec", revenue: 90000, members: 118000 },
  { month: "Jan", revenue: 88000, members: 122000 },
  { month: "Feb", revenue: 92000, members: 125000 },
  { month: "Mar", revenue: 85000, members: 130000 },
  { month: "Apr", revenue: 120000, members: 138000 },
];

export function RevenueChart() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)] h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-medium text-gray-900 tracking-tight">Revenue & Membership Trends</h3>
        <button className="text-[#16A34A] text-sm font-medium hover:underline">View Details</button>
      </div>
      
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              domain={[0, 140000]}
              ticks={[0, 35000, 70000, 105000, 140000]}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              name="Revenue"
              stroke="#22C55E" 
              strokeWidth={2}
              dot={{ r: 0 }}
              activeDot={{ r: 6, fill: '#22C55E' }}
            />
            <Line 
              type="monotone" 
              dataKey="members" 
              name="Members"
              stroke="#2563EB" 
              strokeWidth={2}
              dot={{ r: 0 }}
              activeDot={{ r: 6, fill: '#2563EB' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
