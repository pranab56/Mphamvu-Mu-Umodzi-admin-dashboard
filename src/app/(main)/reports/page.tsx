"use client";

import { UrgentRequestDrawer } from "@/components/reports/UrgentRequestList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileSpreadsheet, FileText, Search } from "lucide-react";

import React from "react";

import { Badge } from "@/components/ui/badge";
import { useGetEventReportsQuery, useLazyGetSingleEventReportsQuery } from "@/features/reports/reportsApi";
import { useDownloadPDF } from "@/hooks/useDownloadPDF";
import { useDownloadXlShit } from "@/hooks/useDownloadXlShit";
import toast from "react-hot-toast";

interface Report {
  _id: string;
  name: string;
  description: string;
  isReply: boolean;
  eventType: string;
  eventDate: string;
  createdBy?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  createdAt: string;
}

export default function UrgentRequestsPage() {

  const [searchTerm, setSearchTerm] = React.useState("");
  const { data: reportsData, isLoading } = useGetEventReportsQuery({ page: 1 });
  const [getSingleReport] = useLazyGetSingleEventReportsQuery();
  const { downloadExcel } = useDownloadXlShit();
  const { downloadPDF } = useDownloadPDF();

  const reports = (reportsData?.data as Report[]) || [];
  const meta = reportsData?.meta;

  const filteredReports = reports.filter((report: Report) =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (report.createdBy?.name && report.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const fetchFullDetails = async () => {
    const toastId = toast.loading("Preparing data with member details...");
    try {
      const fullDetails = await Promise.all(
        filteredReports.map(async (report) => {
          const { data } = await getSingleReport({ id: report._id }).unwrap();
          return data as Report;
        })
      );
      return fullDetails;
    } catch (error) {
      toast.error("Failed to fetch some member details", { id: toastId });
      return filteredReports; // Fallback to basic info
    }
  };

  const handleDownloadExcel = async () => {
    const dataWithDetails = await fetchFullDetails();
    const data = dataWithDetails.map((report) => ({
      "Event Name": report.name,
      "Event Type": report.eventType,
      "Description": report.description,
      "Event Date": report.eventDate ? new Date(report.eventDate).toLocaleDateString() : "N/A",
      "Member Name": report.createdBy?.name || "N/A",
      "Member Email": report.createdBy?.email || "N/A",
      "Member Phone": report.createdBy?.phone || "N/A",
      "Member Address": report.createdBy?.address || "N/A",
      "Reply Status": report.isReply ? "Replied" : "Pending",
      "Created At": new Date(report.createdAt).toLocaleDateString(),
    }));
    downloadExcel(data, "Urgent_Event_Requests.xlsx");
  };

  const handleDownloadPDF = async () => {
    const dataWithDetails = await fetchFullDetails();
    const data = dataWithDetails.map((report) => ({
      "Event": report.name,
      "Type": report.eventType,
      "Member": report.createdBy?.name || "N/A",
      "Email": report.createdBy?.email || "N/A",
      "Phone": report.createdBy?.phone || "N/A",
      "Date": report.eventDate ? new Date(report.eventDate).toLocaleDateString() : "N/A",
      "Status": report.isReply ? "Replied" : "Pending",
    }));
    downloadPDF(data, "Urgent_Event_Requests.pdf", "Urgent Event Request List (with Member Details)");
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="flex items-start gap-4 mb-10">
        <div className='flex items-center justify-between w-full'>
          <h1 className="text-3xl font-medium text-gray-900 tracking-tight leading-none">Urgent Event Request List</h1>
          <p className="text-sm text-gray-500 mt-2 font-normal">
            {isLoading ? "Loading..." : `${meta?.total || 0} items`}
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)] p-8 space-y-8">
        {/* Search Bar and Download Buttons */}
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative w-full">
            <Input
              placeholder="Search here..."
              className="h-14 pl-12 rounded-xl bg-neutral-100 border-none text-sm placeholder:text-gray-400 focus-visible:ring-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
          <div className="flex gap-3 shrink-0 w-full lg:w-auto">
            <Button
              onClick={handleDownloadExcel}
              className="flex-1 lg:flex-none h-14 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all active:scale-95 flex items-center gap-2"
            >
              <FileSpreadsheet className="w-5 h-5" />
              Download XL
            </Button>
            <Button
              onClick={handleDownloadPDF}
              className="flex-1 lg:flex-none h-14 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-all active:scale-95 flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8B2F0E]"></div>
              <p className="text-gray-500 text-sm">Fetching requests...</p>
            </div>
          ) : filteredReports.length > 0 ? (
            filteredReports.map((report: Report) => (
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
