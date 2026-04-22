"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { month: "Jan", members: 220 },
  { month: "Feb", members: 232 },
  { month: "Mar", members: 238 },
  { month: "Apr", members: 248 },
];

export default function MembershipGrowth() {
  return (
    <Card className="rounded-xl border-none shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] bg-white h-full p-2">
      <CardHeader className="pb-8">
        <CardTitle className="text-xl font-bold text-[#1A1C1F]">Membership Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis 
                dataKey="month" 
                axisLine={true} 
                tickLine={true} 
                tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis 
                axisLine={true} 
                tickLine={true} 
                tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 500 }}
                ticks={[0, 65, 130, 195, 260]}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="members" 
                stroke="#A53200" 
                strokeWidth={2} 
                dot={{ fill: "#A53200", r: 4 }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
