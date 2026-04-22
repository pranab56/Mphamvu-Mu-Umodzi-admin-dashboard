"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { name: "Support for Banda", amount: 12500 },
  { name: "Chirwa Legal", amount: 12500 },
  { name: "Mwale Support", amount: 9800 },
  { name: "Tembo Fundraiser", amount: 7500 },
  { name: "Phiri Community", amount: 8800 },
];

export function TopEventsChart() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)] h-[400px] flex flex-col">
      <h3 className="text-lg font-medium text-gray-900 tracking-tight mb-8">Top Contributing Events</h3>
      
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            barSize={32}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
            <XAxis 
              type="number" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              domain={[0, 14000]}
              ticks={[0, 3500, 7000, 10500, 14000]}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#4B5563', fontSize: 11 }}
              width={140}
            />
            <Tooltip 
              cursor={{ fill: '#F9FAFB' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="amount" fill="#8B2F0E" radius={[0, 8, 8, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#8B2F0E" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
