"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Store,
  X,
  Tag,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react";

type Redemption = {
  id: number;
  userInitials: string;
  userName: string;
  userEmail: string;
  initialsColor: string;
  merchant: string;
  merchantIcon: string;
  offerName: string;
  offerRef: string;
  date: string;
  status: "Used" | "Pending";
};

const redemptions: Redemption[] = [
  { id: 1, userInitials: "JD", userName: "Julianna Doe", userEmail: "julianna.d@example.com", initialsColor: "bg-[#D1ECE3] text-[#059669]", merchant: "The Botanical Shop", merchantIcon: "🌿", offerName: "Free Orchid with Purchase", offerRef: "#ORD-9921", date: "Oct 24, 2023", status: "Used" },
  { id: 2, userInitials: "MS", userName: "Marcus Sterling", userEmail: "m.sterling@domain.com", initialsColor: "bg-[#D1ECE3] text-[#059669]", merchant: "Urban Jungle", merchantIcon: "🌱", offerName: "20% Off Succulents", offerRef: "#OFF-4410", date: "Oct 24, 2023", status: "Pending" },
  { id: 3, userInitials: "AL", userName: "Aria Luna", userEmail: "aluna@studio.io", initialsColor: "bg-[#D1ECE3] text-[#059669]", merchant: "Petals & Props", merchantIcon: "🌸", offerName: "Autumn Bouquet Special", offerRef: "#SEA-2281", date: "Oct 24, 2023", status: "Used" },
  { id: 4, userInitials: "FK", userName: "Felix Klein", userEmail: "felix.k@tech.com", initialsColor: "bg-[#D1ECE3] text-[#059669]", merchant: "Greenhouse Central", merchantIcon: "🏡", offerName: "New Joiner Credit ($10)", offerRef: "#CRD-0012", date: "Oct 24, 2023", status: "Pending" },
  { id: 5, userInitials: "SB", userName: "Sofia Bell", userEmail: "sofia.b@mail.com", initialsColor: "bg-[#D1ECE3] text-[#059669]", merchant: "The Botanical Shop", merchantIcon: "🌿", offerName: "Free Orchid with Purchase", offerRef: "#ORD-9930", date: "Oct 23, 2023", status: "Used" },
];

export default function RedemptionsManagement() {
  const [filterMode, setFilterMode] = useState<"All Status" | "Used" | "Pending">("All Status");
  const [selectedRedemption, setSelectedRedemption] = useState<Redemption | null>(null);

  const filtered = redemptions.filter((r) => {
    if (filterMode === "All Status") return true;
    return r.status === filterMode;
  });

  return (
    <div className="w-full py-6 pb-10">
      <div className="w-full flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-[28px] font-extrabold text-[#111827]">Redemptions History</h1>
          <p className="text-[14px] font-medium text-gray-500 mt-1">Manage and track user activity across all merchant locations in real-time.</p>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#EAECEF] rounded-3xl p-7 flex flex-col gap-3 border border-gray-200/60">
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-extrabold text-gray-500 tracking-widest uppercase">Total Redemptions</p>
              <TrendingUp className="w-5 h-5 text-[#A53200]" strokeWidth={2.5} />
            </div>
            <p className="text-[36px] font-extrabold text-[#A53200] leading-none">12,482</p>
          </div>

          <div
            className="col-span-1 md:col-span-2 rounded-3xl p-7 flex flex-col justify-center text-white shadow-xl shadow-[#A53200]/20 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #A53200 0%, #00C2FF 100%)" }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4" />
            <div className="relative z-10">
              <h2 className="text-[20px] font-bold leading-tight">Merchant Peak Performance</h2>
              <p className="text-[13px] text-white/90 font-medium mt-2 max-w-md leading-relaxed">
                The &quot;Evergreen Collection&quot; offer at Bloom &amp; Co. has reached peak redemption capacity today.
              </p>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-[#F0F2F5]/50 border border-gray-200/50 rounded-[28px] p-5 shadow-sm">
          {/* Animated Filter Tabs */}
          <div className="flex items-center p-1 bg-[#EAECEF] rounded-full relative z-0 w-fit mb-5">
            {(["All Status", "Used", "Pending"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`relative px-6 py-2 rounded-full text-[11px] font-bold transition-colors cursor-pointer z-10 ${filterMode === mode ? "text-gray-800" : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {filterMode === mode && (
                  <motion.div
                    layoutId="redemptionFilterBubble"
                    className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                {mode.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-[20px] overflow-hidden border border-gray-100">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[750px]">
                <div className="grid grid-cols-12 px-6 py-4 text-[10px] font-extrabold text-gray-400 tracking-widest uppercase border-b border-gray-100">
                  <div className="col-span-3">User</div>
                  <div className="col-span-2">Merchant</div>
                  <div className="col-span-4">Offer Details</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-1">Status</div>
                </div>

                <div className="divide-y divide-gray-100">
                  {filtered.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => setSelectedRedemption(r)}
                      className="grid grid-cols-12 px-6 py-5 items-center hover:bg-[#F0F7FF] transition-colors cursor-pointer"
                    >
                      <div className="col-span-3 flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[12px] flex-shrink-0 ${r.initialsColor}`}>
                          {r.userInitials}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-gray-900 leading-tight">{r.userName}</p>
                          <p className="text-[11px] text-gray-400 font-medium leading-tight">{r.userEmail}</p>
                        </div>
                      </div>

                      <div className="col-span-2 flex items-center gap-2">
                        <span className="text-lg">{r.merchantIcon}</span>
                        <span className="text-[13px] font-bold text-gray-800 leading-tight">{r.merchant}</span>
                      </div>

                      <div className="col-span-4 pr-4">
                        <p className="text-[13px] font-bold text-gray-800 leading-tight">{r.offerName}</p>
                        <p className="text-[11px] text-gray-400 font-medium">Ref: {r.offerRef}</p>
                      </div>

                      <div className="col-span-2 text-[12px] text-gray-500 font-medium">{r.date}</div>

                      <div className="col-span-1">
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full w-fit ${r.status === "Used" ? "bg-[#D1F4D9] text-[#059669]" : "bg-gray-100 text-gray-500"
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${r.status === "Used" ? "bg-[#059669]" : "bg-gray-400"}`} />
                          {r.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="bg-[#E6E8EA]/40 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200/50">
              <span className="text-[12px] text-gray-500 font-medium text-center sm:text-left">
                Showing <strong className="font-bold text-gray-700">1 - {filtered.length}</strong> of 1,135 redemptions
              </span>
              <div className="flex items-center gap-1.5">
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-400 shadow-sm cursor-pointer hover:bg-gray-50 border border-gray-200"><ChevronLeft className="w-4 h-4" /></button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#A53200] text-white font-bold text-[12px] shadow-sm">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 font-bold text-[12px] shadow-sm hover:bg-gray-50 border border-gray-200">2</button>
                <button className="hidden sm:flex w-8 h-8 items-center justify-center rounded-full bg-white text-gray-600 font-bold text-[12px] shadow-sm hover:bg-gray-50 border border-gray-200">3</button>
                <span className="text-gray-400 px-1 font-bold">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 font-bold text-[12px] shadow-sm hover:bg-gray-50 border border-gray-200">321</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-400 shadow-sm hover:bg-gray-50 border border-gray-200"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Redemption Detail Modal ── */}
      <AnimatePresence>
        {selectedRedemption && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRedemption(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setSelectedRedemption(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
              </button>

              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-[16px] flex-shrink-0 ${selectedRedemption.initialsColor}`}>
                    {selectedRedemption.userInitials}
                  </div>
                  <div>
                    <p className="text-[17px] font-extrabold text-gray-900">{selectedRedemption.userName}</p>
                    <p className="text-[12px] text-gray-400 font-medium">{selectedRedemption.userEmail}</p>
                  </div>
                  <span className={`ml-auto shrink-0 px-3 py-1.5 text-[10px] font-bold rounded-full flex items-center gap-1.5 ${selectedRedemption.status === "Used" ? "bg-[#D1F4D9] text-[#059669]" : "bg-gray-100 text-gray-500"
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedRedemption.status === "Used" ? "bg-[#059669]" : "bg-gray-400"}`} />
                    {selectedRedemption.status}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#EBF5FB] rounded-xl p-4">
                    <Store className="w-5 h-5 text-[#A53200] mb-2" strokeWidth={2} />
                    <p className="text-[9px] font-extrabold text-gray-400 tracking-widest uppercase">Merchant</p>
                    <p className="text-[13px] font-bold text-gray-900 mt-1 flex items-center gap-1.5">
                      <span>{selectedRedemption.merchantIcon}</span>
                      {selectedRedemption.merchant}
                    </p>
                  </div>
                  <div className="bg-[#EBF5FB] rounded-xl p-4">
                    <Calendar className="w-5 h-5 text-[#A53200] mb-2" strokeWidth={2} />
                    <p className="text-[9px] font-extrabold text-gray-400 tracking-widest uppercase">Date</p>
                    <p className="text-[13px] font-bold text-gray-900 mt-1">{selectedRedemption.date}</p>
                  </div>
                  <div className="col-span-2 bg-[#EBF5FB] rounded-xl p-4">
                    <Tag className="w-5 h-5 text-[#A53200] mb-2" strokeWidth={2} />
                    <p className="text-[9px] font-extrabold text-gray-400 tracking-widest uppercase">Offer Details</p>
                    <p className="text-[14px] font-bold text-gray-900 mt-1">{selectedRedemption.offerName}</p>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">Ref: {selectedRedemption.offerRef}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-100">
                  <div className="flex items-center gap-2">
                    {selectedRedemption.status === "Used"
                      ? <CheckCircle2 className="w-5 h-5 text-[#059669]" strokeWidth={2} />
                      : <Clock className="w-5 h-5 text-gray-400" strokeWidth={2} />
                    }
                    <span className="text-[13px] font-bold text-gray-700">Redemption {selectedRedemption.status}</span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400">{selectedRedemption.date}</span>
                </div>


              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
