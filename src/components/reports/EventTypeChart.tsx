"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { name: "Funeral", value: 45, color: "#16A34A" },
  { name: "Fundraiser", value: 30, color: "#2563EB" },
  { name: "Legal Support", value: 20, color: "#D97706" },
  { name: "Other", value: 5, color: "#8B5CF6" },
];

export function EventTypeChart() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)] h-[400px] flex flex-col">
      <h3 className="text-lg font-medium text-gray-900 tracking-tight mb-8">Event Type Distribution</h3>
      
      <div className="flex-1 w-full flex items-center justify-between gap-4">
        <div className="flex-1 h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-1/2 space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between group cursor-default">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-normal text-gray-600 group-hover:text-gray-900 transition-colors">
                   {item.name}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
