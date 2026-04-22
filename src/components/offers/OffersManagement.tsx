"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Tag,
  Calendar,
  CheckCheck,
  Percent,
  Store,
} from "lucide-react";

type Offer = {
  id: number;
  merchantName: string;
  merchantCategory: string;
  status: "Active" | "Expired";
  endsIn: string;
  redeemed: string;
  discount: string;
  expiryDate: string;
  title: string;
  description: string;
  bgColor: string;
};

const offers: Offer[] = [
  { id: 1, merchantName: "Zara", merchantCategory: "Fashion", status: "Active", endsIn: "4 Days", redeemed: "1.2k Redeemed", discount: "10% Off", expiryDate: "Oct 31, 2023", title: "Exclusive Partner Offer", description: "Get 10% off your next purchase.", bgColor: "#4A5568" },
  { id: 2, merchantName: "Zara", merchantCategory: "Fashion", status: "Expired", endsIn: "4 Days", redeemed: "8.9k Redeemed", discount: "10% Off", expiryDate: "Oct 31, 2023", title: "Exclusive Partner Offer", description: "Get 10% off your next purchase.", bgColor: "#718096" },
  { id: 3, merchantName: "Zara", merchantCategory: "Fashion", status: "Expired", endsIn: "4 Days", redeemed: "8.9k Redeemed", discount: "10% Off", expiryDate: "Oct 31, 2023", title: "Exclusive Partner Offer", description: "Get 10% off your next purchase.", bgColor: "#2D3748" },
  { id: 4, merchantName: "Zara", merchantCategory: "Fashion", status: "Active", endsIn: "4 Days", redeemed: "1.2k Redeemed", discount: "10% Off", expiryDate: "Oct 31, 2023", title: "Exclusive Partner Offer", description: "Get 10% off your next purchase.", bgColor: "#4A5568" },
  { id: 5, merchantName: "Zara", merchantCategory: "Fashion", status: "Expired", endsIn: "4 Days", redeemed: "8.9k Redeemed", discount: "10% Off", expiryDate: "Oct 31, 2023", title: "Exclusive Partner Offer", description: "Get 10% off your next purchase.", bgColor: "#718096" },
  { id: 6, merchantName: "Zara", merchantCategory: "Fashion", status: "Expired", endsIn: "4 Days", redeemed: "8.9k Redeemed", discount: "10% Off", expiryDate: "Oct 31, 2023", title: "Exclusive Partner Offer", description: "Get 10% off your next purchase.", bgColor: "#2D3748" },
];

function OfferCard({ offer }: { offer: Offer }) {
  const isActive = offer.status === "Active";

  return (
    <div
      className="bg-white rounded-[20px] overflow-hidden border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow flex flex-col"
    >
      {/* Card Image / Hero */}
      <div className="relative h-[160px] overflow-hidden" style={{ background: offer.bgColor }}>
        {/* Clothing rack background illustration */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="flex gap-3 items-end">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-0.5 h-16 bg-white/60" />
                <div className="w-12 h-14 rounded-sm border border-white/40 bg-white/10" />
              </div>
            ))}
          </div>
        </div>

        {/* Status badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[10px] font-bold tracking-wider uppercase ${isActive ? "bg-[#059669]" : "bg-gray-500"}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          {offer.status}
        </div>

        {/* Merchant info + Ends in badge */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md">
              <Store className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-white font-bold text-[15px] leading-tight drop-shadow">{offer.merchantName}</p>
              <p className="text-white/80 text-[11px] font-medium drop-shadow">{offer.merchantCategory}</p>
            </div>
          </div>
          <div className="bg-[#E11D48] text-white text-[11px] font-bold px-4 py-1.5 rounded-full shadow-md">
            Ends in {offer.endsIn}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Redeemed count */}
        <div className="flex items-center gap-1.5 text-[12px] text-gray-500 font-medium">
          {isActive
            ? <Tag className="w-3.5 h-3.5 text-gray-400" strokeWidth={2} />
            : <CheckCheck className="w-3.5 h-3.5 text-[#A53200]" strokeWidth={2} />
          }
          {offer.redeemed}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#EBF5FB] rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Percent className="w-4 h-4 text-[#A53200]" strokeWidth={2.5} />
            </div>
            <p className="text-[9px] font-extrabold text-gray-400 tracking-widest uppercase">Discount Percentage</p>
            <p className="text-[13px] font-bold text-gray-800 mt-0.5">{offer.discount}</p>
          </div>
          <div className="bg-[#EBF5FB] rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Calendar className="w-4 h-4 text-[#A53200]" strokeWidth={2.5} />
            </div>
            <p className="text-[9px] font-extrabold text-gray-400 tracking-widest uppercase">Expiry Date</p>
            <p className="text-[13px] font-bold text-gray-800 mt-0.5">{offer.expiryDate}</p>
          </div>
        </div>

        {/* Offer description */}
        <div className="mt-1">
          <p className="text-[13px] font-bold text-[#A53200]">{offer.title}</p>
          <p className="text-[12px] text-gray-500 font-medium mt-0.5">{offer.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function OffersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"All" | "Active" | "Expired">("All");

  const filtered = offers.filter((o) => {
    const matchSearch = o.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterMode === "All" || o.status === filterMode;
    return matchSearch && matchFilter;
  });

  return (
    <div className="w-full py-6 pb-10">
      <div className="w-full flex flex-col gap-6">

        {/* Header */}
        <div>
          <h1 className="text-[28px] font-extrabold text-[#111827]">Offer Management</h1>
          <p className="text-[14px] font-medium text-gray-500 mt-1">Review offers of all merchants across the ecosystem.</p>
        </div>

        {/* Search & Filter Container */}
        <div className="bg-[#EAECEF] rounded-[24px] px-5 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-gray-400" strokeWidth={3} />
            <input
              type="text"
              placeholder="Search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-transparent rounded-full text-[13px] font-medium text-gray-700 placeholder-gray-400 focus:outline-none"
            />
          </div>

          {/* Animated Filter Tabs */}
          <div className="flex items-center p-1 bg-[#DCDFE3] rounded-full shrink-0 relative z-0">
            {(["All", "Active", "Expired"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`relative px-6 py-1.5 rounded-full text-[12px] font-bold transition-colors cursor-pointer z-10 ${filterMode === mode ? "text-gray-800" : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {filterMode === mode && (
                  <motion.div
                    layoutId="offerFilterBubble"
                    className="absolute inset-0 bg-[#A53200] rounded-full shadow-sm -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className={filterMode === mode ? "text-white" : ""}>{mode}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Offer Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-[12px] text-gray-500 font-medium">
            Showing <strong className="font-bold text-gray-700">1 - {filtered.length}</strong> of 1,135 offers
          </span>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-400 border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#A53200] text-white font-bold text-[12px] shadow-sm cursor-pointer">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 font-bold text-[12px] shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 font-bold text-[12px] shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50">3</button>
            <span className="text-gray-400 px-1 font-bold">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 font-bold text-[12px] shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50">321</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-400 border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
