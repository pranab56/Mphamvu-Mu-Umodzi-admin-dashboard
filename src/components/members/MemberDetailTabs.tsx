"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Clock, AlertTriangle, Loader2, Ban } from "lucide-react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { 
  useGetCompleteContributionQuery, 
  useGetInPendingContributionQuery, 
  useGetTotalDueQuery 
} from "@/features/members/membersApi";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface UserData {
  name?: string;
  email?: string;
  image?: string;
  status?: string;
  isSuspended?: boolean;
  contributedEvents?: number;
  contributedBalance?: number;
}

interface CompletedContribution {
  _id?: string;
  contributionId?: string;
  eventName?: string;
  eventType?: string;
  amount?: number;
  updatedAt?: string;
}

interface PendingContribution {
  contributionId?: string;
  eventName?: string;
  eventType?: string;
  totalDue?: number;
  deadline?: string;
}

interface DueContribution {
  contributionId?: string;
  eventName?: string;
  totalDue?: number;
  deadline?: string;
  minContribution?: number;
  penaltyFee?: number;
}

interface MemberDetailTabsProps {
  userId: string;
  userData?: UserData;
}

export function MemberDetailTabs({ userId, userData }: MemberDetailTabsProps) {
  const { data: completedResponse, isLoading: isCompletedLoading } = useGetCompleteContributionQuery({ userId });
  const { data: pendingResponse, isLoading: isPendingLoading } = useGetInPendingContributionQuery({ userId });
  const { data: totalDueResponse, isLoading: isTotalDueLoading } = useGetTotalDueQuery({ userId });

  const completedContributions = completedResponse?.data || [];
  const pendingContributions = pendingResponse?.data || [];
  const outstandingDues = totalDueResponse?.data?.breakdown || [];
  const dueSummary = totalDueResponse?.data?.summary;

  const isSuspended = userData?.isSuspended;
  const status = isSuspended ? "Suspended" : ((userData?.status?.charAt(0).toUpperCase() ?? "") + (userData?.status?.slice(1) ?? "") || "Active");

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Active": return "bg-[#DCFCE7] text-[#22C55E]";
      case "Suspended": return "bg-red-50 text-red-500";
      case "Blocked": return "bg-gray-100 text-gray-500";
      default: return "bg-[#FEF9C3] text-[#A16207]";
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 relative overflow-hidden group">
        <div className="flex items-center gap-8 relative z-10">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-sm">
            <Image
              src={userData?.image || "/member_avatar.png"}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-medium text-[#1A1C21]">{userData?.name || "Loading..."}</h2>
              <Badge className={cn("border-none px-4 py-1.5 rounded-sm text-xs font-normal flex items-center gap-1.5", getStatusStyles(status))}>
                {status === "Active" ? <CheckCircle2 className="w-2 h-2" /> : status === "Suspended" ? <AlertTriangle className="w-2 h-2" /> : <Ban className="w-2 h-2" />}
                {status}
              </Badge>
            </div>
            <p className="text-lg text-gray-400 font-normal">{userData?.email || "..."}</p>
          </div>
        </div>

        <div className="bg-[#E5D5C9]/30 rounded-xl flex items-center border border-gray-100 self-stretch xl:self-auto overflow-hidden">
          <div className="px-8 py-4 flex items-center gap-6 border-r border-[#E5D5C9]/50">
            <span className="text-gray-500 font-normal text-lg whitespace-nowrap">Contributed Events</span>
            <span className="text-2xl font-bold text-[#8B2F0E]">{userData?.contributedEvents || 0}</span>
          </div>
          <div className="px-8 py-4 flex items-center gap-6">
            <span className="text-gray-500 font-normal text-lg whitespace-nowrap">Contributed Balance</span>
            <span className="text-2xl font-bold text-[#8B2F0E]">$ {userData?.contributedBalance?.toFixed(2) || "0.00"}</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="completed" className="w-full mt-12 pb-24">
        <TabsList className="bg-transparent border-none p-0 h-auto gap-12 mb-8 flex-wrap">
          <TabsTrigger
            value="completed"
            className="data-[state=active]:border-b-3 data-[state=active]:border-[#8B2F0E] rounded-none bg-transparent px-0 pb-2.5 pt-0 text-base font-normal data-[state=active]:text-[#8B2F0E] text-gray-400 !shadow-none !border-x-0 !border-t-0 cursor-pointer"
          >
            Completed Contributions
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="data-[state=active]:border-b-3 data-[state=active]:border-[#8B2F0E] rounded-none bg-transparent px-0 pb-2.5 pt-0 text-base font-normal data-[state=active]:text-[#8B2F0E] text-gray-400 !shadow-none !border-x-0 !border-t-0 cursor-pointer"
          >
            Pending Contributions
          </TabsTrigger>
          <TabsTrigger
            value="total-dues"
            className="data-[state=active]:border-b-3 data-[state=active]:border-[#8B2F0E] rounded-none bg-transparent px-0 pb-2.5 pt-0 text-base font-normal data-[state=active]:text-[#8B2F0E] text-gray-400 !shadow-none !border-x-0 !border-t-0 cursor-pointer"
          >
            Total Dues (included penalty)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="completed" className="space-y-6 outline-none">
          {isCompletedLoading ? (
            <LoadingState />
          ) : completedContributions.length > 0 ? (
            completedContributions.map((item: CompletedContribution) => (
              <div key={item._id || item.contributionId} className="bg-white/80 border border-gray-100 p-6 rounded-xl flex justify-between items-center group hover:bg-white hover:shadow-sm transition-all duration-200">
                <div className="flex gap-6">
                  <div className="mt-1 w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-medium text-gray-800">{item.eventName}</h4>
                    <p className="text-base text-gray-500 font-normal">{item.eventType}</p>
                    <p className="text-sm text-gray-400 mt-3 font-normal">Completed on {item.updatedAt ? format(new Date(item.updatedAt), "MMM d, yyyy") : "Recently"}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-4">
                  <span className="text-2xl font-bold text-gray-800 tracking-tighter">$ {item.amount?.toFixed(2) || "0.00"}</span>
                  <span className="bg-[#DCFCE7] text-[#22C55E] px-4 py-1 rounded text-xs font-bold uppercase">Paid</span>
                </div>
              </div>
            ))
          ) : (
            <EmptyState 
              image="/images/notFound/success.png"
              title="No Completed Contributions"
              description="This user has not registered any payment. Nothing is completed at the moment."
            />
          )}
        </TabsContent>

        <TabsContent value="pending" className="outline-none space-y-6">
          {isPendingLoading ? (
            <LoadingState />
          ) : pendingContributions.length > 0 ? (
            pendingContributions.map((item: PendingContribution) => (
              <div key={item.contributionId} className="bg-white/80 border border-gray-100 p-6 rounded-xl flex justify-between items-center group hover:bg-white hover:shadow-sm transition-all duration-200">
                <div className="flex gap-6">
                  <div className="mt-1 w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-medium text-gray-800">{item.eventName}</h4>
                    <p className="text-base text-gray-500 font-normal">{item.eventType}</p>
                    <p className="text-sm text-gray-400 mt-3 font-normal">Deadline {item.deadline ? format(new Date(item.deadline), "MMM d, yyyy") : "N/A"}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-4">
                  <span className="text-2xl font-bold text-gray-800 tracking-tighter">$ {item.totalDue?.toFixed(2) || "0.00"}</span>
                  <span className="bg-[#FEF9C3] text-[#A16207] px-4 py-1 rounded text-xs font-bold uppercase tracking-widest shadow-sm">Unpaid</span>
                </div>
              </div>
            ))
          ) : (
            <EmptyState 
              image="/images/notFound/warning.png"
              title="No Pending Contributions"
              description="This user has completed all required contributions. Nothing is pending at the moment."
            />
          )}
        </TabsContent>

        <TabsContent value="total-dues" className="outline-none space-y-6">
          {isTotalDueLoading ? (
            <LoadingState />
          ) : outstandingDues.length > 0 ? (
            <div className="space-y-6">
              {outstandingDues.map((item: DueContribution) => (
                <div key={item.contributionId} className="bg-white/80 border border-gray-100 p-6 rounded-xl group hover:bg-white hover:shadow-sm transition-all duration-200">
                  <div className="flex justify-between">
                    <div className="flex gap-6">
                      <div className="mt-1 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xl font-medium text-gray-800 tracking-tight">{item.eventName}</h4>
                        <p className="text-sm text-gray-400 mt-2 font-normal">Deadline Passed: {item.deadline ? format(new Date(item.deadline), "MMMM d, yyyy") : "N/A"}</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-red-500 tracking-tighter">$ {item.totalDue?.toFixed(2)}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-dashed border-gray-100 italic">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Base: ${item.minContribution}</span>
                      <span>Penalty: ${item.penaltyFee}</span>
                    </div>
                  </div>
                </div>
              ))}

              {dueSummary && (
                <div className="bg-[#8B2F0E] text-white p-8 rounded-2xl shadow-xl shadow-[#8B2F0E]/10">
                  <h5 className="text-lg font-medium opacity-80 mb-6 uppercase tracking-widest">Dues Summary</h5>
                  <div className="space-y-4">
                    <div className="flex justify-between text-xl font-normal border-b border-white/10 pb-4">
                      <span>Total Event Dues</span>
                      <span>$ {dueSummary.totalEventDues?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-normal border-b border-white/10 pb-4">
                      <span>Penalty Fees</span>
                      <span>$ {dueSummary.totalPenaltyFee?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-6">
                      <span className="text-2xl font-bold uppercase tracking-tight">Grand Total</span>
                      <span className="text-4xl font-extrabold tracking-tighter">$ {dueSummary.grandTotal?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <EmptyState 
              image="/images/notFound/error.png"
              title="No Outstanding Dues"
              description="All dues have been cleared. The user has no remaining balance."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="py-20 flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-[#8B2F0E]" />
      <span className="text-gray-400 font-medium">Loading contribution records...</span>
    </div>
  );
}

function EmptyState({ image, title, description }: { image: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10">
      <div className="relative w-64 h-64 mb-6 opacity-80">
        <Image src={image} alt={title} fill className="object-contain" />
      </div>
      <h3 className="text-2xl font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mt-3 text-base leading-relaxed">
        {description}
      </p>
    </div>
  );
}

