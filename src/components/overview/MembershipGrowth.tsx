"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface MembershipGrowthData {
  month: string;
  year: number;
  totalMembers: number;
  newMembers: number;
}

interface MembershipGrowthProps {
  data?: MembershipGrowthData[];
  isLoading: boolean;
}

export default function MembershipGrowth({ data, isLoading }: MembershipGrowthProps) {
  const chartData = data?.map(item => ({
    month: item.month,
    members: item.totalMembers
  })) || [];

  if (isLoading) {
    return (
      <Card className="rounded-xl border-none shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] bg-white h-full p-2">
        <CardHeader className="pb-8">
          <CardTitle className="text-xl font-bold text-[#1A1C1F]">Membership Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A53200]"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="rounded-xl border-none shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] bg-white h-full p-2">
      <CardHeader className="pb-8">
        <CardTitle className="text-xl font-bold text-[#1A1C1F]">Membership Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
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
