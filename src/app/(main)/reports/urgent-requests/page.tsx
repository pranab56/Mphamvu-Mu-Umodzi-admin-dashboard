"use client";

import React from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UrgentRequestDrawer } from "@/components/reports/UrgentRequestList";

import { useGetEventReportsQuery } from "@/features/reports/reportsApi";
import { Badge } from "@/components/ui/badge";

export default function UrgentRequestsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState("");
  const { data: reportsData, isLoading } = useGetEventReportsQuery({ page: 1 });
  
  const reports = reportsData?.data || [];
  const meta = reportsData?.meta;

  const filteredReports = reports.filter((report: any) => 
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="flex items-start gap-4 mb-10">
        <button 
          onClick={() => router.back()}
          className="mt-1 p-2 hover:bg-gray-100 cursor-pointer rounded-full transition-colors active:scale-95 text-gray-500"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-medium text-gray-900 tracking-tight leading-none">Urgent Event Request List</h1>
          <p className="text-sm text-gray-500 mt-2 font-normal">
            {isLoading ? "Loading..." : `${meta?.total || 0} items`}
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)] p-8 space-y-8">
        {/* Search Bar */}
        <div className="relative w-full">
          <Input 
            placeholder="Search here..." 
            className="h-14 pl-12 rounded-xl bg-neutral-100 border-none text-sm placeholder:text-gray-400 focus-visible:ring-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8B2F0E]"></div>
              <p className="text-gray-500 text-sm">Fetching requests...</p>
            </div>
          ) : filteredReports.length > 0 ? (
            filteredReports.map((report: any) => (
              <div 
                key={report._id} 
                className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-xl bg-[#F3EBE5]/30 border border-[#F3EBE5] gap-4"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-medium text-gray-900">{report.name}</h4>
                    {report.isReply && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100 text-[10px] h-5">Replied</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 font-normal leading-relaxed line-clamp-2">
                    {report.description}
                  </p>
                </div>
                
                <UrgentRequestDrawer reportId={report._id}>
                  <Button className="h-10 px-8 rounded-lg bg-[#8B2F0E] hover:bg-[#70260B] text-white font-medium text-sm transition-all active:scale-95 shrink-0">
                    view
                  </Button>
                </UrgentRequestDrawer>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-500">
              {searchTerm ? `No requests matching "${searchTerm}"` : "No urgent requests found."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
