"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useGetUrgentRequestsQuery, useGetSingleEventReportsQuery, useReplyEventReportsMutation } from "@/features/reports/reportsApi";
import { Calendar as CalendarIcon, FileText, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import toast from 'react-hot-toast';


interface EventReport {
  _id: string;
  name: string;
  eventType: string;
  description: string;
  eventDate: string;
  document: string[];
  status: string;
  isReply: boolean;
  reply: string;
  createdAt: string;
}

export function UrgentRequestList() {
  const router = useRouter();
  const { data: reportsData, isLoading } = useGetUrgentRequestsQuery({ page: 1 });
  const reports: EventReport[] = reportsData?.data || [];

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)] h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)] space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium text-red-600 tracking-tight">Urgent Event Request List</h3>
        <button
          onClick={() => router.push("/reports/urgent-requests")}
          className="text-gray-400 cursor-pointer text-sm font-medium hover:text-[#8B2F0E] hover:underline"
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {reports.length > 0 ? (
          reports.map((report) => (
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
                <p className="text-sm text-gray-500 font-normal leading-relaxed line-clamp-1">
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
          <div className="text-center py-10 text-gray-500">No urgent requests found.</div>
        )}
      </div>
    </div>
  );
}

export function UrgentRequestDrawer({ reportId, children }: { reportId: string, children: React.ReactNode }) {
  const { data: singleReportData, isLoading } = useGetSingleEventReportsQuery({ id: reportId });
  const [replyReport, { isLoading: isReplying }] = useReplyEventReportsMutation();
  const [replyMessage, setReplyMessage] = React.useState("");

  const report = singleReportData?.data;

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    try {
      await replyReport({
        id: reportId,
        data: { reply: replyMessage }
      }).unwrap();
      toast.success("Reply sent successfully");
      setReplyMessage("");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to send reply");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="sm:max-w-[540px] p-0 bg-white border-l-0">
        <ScrollArea className="h-full px-8 py-10">
          <SheetHeader className="mb-10 p-0 text-left">
            <SheetTitle className="text-2xl font-medium text-gray-900 tracking-tight">Event Details</SheetTitle>
          </SheetHeader>

          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : report ? (
            <div className="space-y-10">
              {/* Event Info */}
              <section className="space-y-6">
                <h3 className="text-sm font-medium text-orange-800 tracking-wide uppercase">Event Details</h3>
                <div className="bg-[#F3EBE5]/40 rounded-2xl p-6 border border-[#F3EBE5]/50 space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="text-xl font-medium text-gray-900">{report.name}</h4>
                    <Badge className="bg-[#FFF7ED] text-[#9A3412] hover:bg-[#FFF7ED] shadow-none border-none px-3 py-1 rounded-sm text-xs font-normal">
                      {report.eventType}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed font-normal">
                    {report.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Created on", value: formatDate(report.createdAt) },
                      { label: "Event Date", value: formatDate(report.eventDate) }
                    ].map((item, i) => (
                      <div key={i} className="bg-white/80 p-4 rounded-xl border border-white space-y-1.5 shadow-[0_2px_10px_rgb(0,0,0,0.01)]">
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-normal">
                          <CalendarIcon className="w-3.5 h-3.5" />
                          {item.label}
                        </div>
                        <div className="text-sm font-medium text-gray-800">{item.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <div className="text-[11px] text-gray-400 font-normal">Documents</div>
                    <div className="flex flex-wrap gap-2">
                      {report.document?.map((doc: string, i: number) => (
                        <a
                          key={i}
                          href={`${process.env.NEXT_PUBLIC_BASE_URL}${doc}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg border border-white cursor-pointer hover:bg-white transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-red-500 fill-red-50" />
                          <span className="text-xs text-gray-600 font-medium">{doc.split('/').pop()}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Member Info */}
              <section className="space-y-6">
                <h3 className="text-sm font-medium text-orange-800 tracking-wide uppercase">Member Details</h3>
                <div className="bg-neutral-50/50 rounded-2xl p-6 border border-neutral-100 flex items-start gap-5">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                    <Image
                      src={report.createdBy?.image || "/default-avatar.png"}
                      alt="Member"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-medium text-gray-900">{report.createdBy?.name || "Unknown Member"}</span>
                        <span className="text-[10px] text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
                          {report.createdBy?.role || "MEMBER"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 font-normal">{report.createdBy?.email}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-600 font-normal">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {report.createdBy?.phone || "N/A"}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 font-normal">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {report.createdBy?.address || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Message Input / Reply Display */}
              <section className="bg-[#F3EBE5]/40 rounded-2xl p-6 border border-[#F3EBE5]/50 space-y-4">
                <div className="text-[11px] text-gray-400 font-normal">Reply Message</div>
                {report.isReply ? (
                  <div className="bg-white p-4 rounded-xl border border-white text-sm text-gray-700">
                    <p className="font-medium text-gray-900 mb-1">Admin Reply:</p>
                    {report.reply}
                  </div>
                ) : (
                  <>
                    <Textarea
                      placeholder="Send message to the member about this urgent event..."
                      className="min-h-[100px] bg-white border-white rounded-xl py-4 resize-none shadow-sm focus-visible:ring-primary/20"
                      value={replyMessage}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReplyMessage(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleReply}
                        disabled={isReplying}
                        className="bg-[#8B2F0E] hover:bg-[#70260B] text-white px-8 h-10 rounded-lg text-sm font-medium shadow-md transition-all active:scale-95"
                      >
                        {isReplying ? "Sending..." : "Send"}
                      </Button>
                    </div>
                  </>
                )}
              </section>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">Failed to load report details.</div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
