"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface ContributionTrend {
  month: string;
  year: number;
  total: number;
  count: number;
}

interface ContributionTrendsProps {
  data?: ContributionTrend[];
  isLoading: boolean;
}

export default function ContributionTrends({ data, isLoading }: ContributionTrendsProps) {
  const chartData = data?.map(item => ({
    month: item.month,
    amount: item.total
  })) || [];

  if (isLoading) {
    return (
      <Card className="rounded-xl border-none shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] bg-white h-full p-2">
        <CardHeader className="pb-4 sm:pb-8">
          <CardTitle className="text-xl font-bold text-[#1A1C1F]">Contribution Trends</CardTitle>
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
        <CardTitle className="text-xl font-bold text-[#1A1C1F]">Contribution Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
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
                cursor={{ fill: '#F8FAFC' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar 
                dataKey="amount" 
                fill="#A53200" 
                radius={[4, 4, 0, 0]} 
                barSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
