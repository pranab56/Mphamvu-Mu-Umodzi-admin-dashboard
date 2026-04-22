"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  ClipboardList,
  BadgeCheck,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  LayoutGrid,
  Phone,
  Globe,
  MapPin,
} from "lucide-react";

const stats = [
  { title: "TOTAL NETWORK", value: "1,248", icon: Store, iconBg: "bg-[#D1ECE3]", iconColor: "text-[#059669]" },
  { title: "AWAITING REVIEW", value: "14", icon: ClipboardList, iconBg: "bg-[#FDF0D5]", iconColor: "text-[#D97706]" },
  { title: "APPROVED THIS WEEK", value: "32", icon: BadgeCheck, iconBg: "bg-[#D6EBF8]", iconColor: "text-[#A53200]" },
  { title: "REJECTION RATE", value: "4.2%", icon: XCircle, iconBg: "bg-[#FDE2E4]", iconColor: "text-[#E11D48]" },
];

const tabs = [
  { id: "all", label: "All Merchants" },
  { id: "pending", label: "Pending Approvals", badge: 14 },
  { id: "active", label: "Active" },
  { id: "rejected", label: "Rejected" },
];

type Merchant = {
  id: number;
  name: string;
  mid: string;
  avatar: string;
  avatarBg: string;
  category: string;
  location: string;
  date: string;
  status: string;
  phone: string;
  socialLink: string;
  description: string;
  ownerName: string;
  ownerRole: string;
  ownerEmail: string;
};

const initialMerchants: Merchant[] = [
  { id: 1, name: "Bistro Terra", mid: "#M-90245", avatar: "BT", avatarBg: "bg-[#D1ECE3] text-[#059669]", category: "Food & Beverage", location: "San Francisco, CA", date: "Oct 24, 2023", status: "Pending", phone: "+1 (555) 942-0129", socialLink: "facebook.com/spicybitesbd", description: "A food & beverage brand offering tasty meals and drinks with quality and hygiene.", ownerName: "Eleanor Shellstrop", ownerRole: "Owner", ownerEmail: "eleanor@observatory.io" },
  { id: 2, name: "Vogue Threads", mid: "#M-88312", avatar: "VT", avatarBg: "bg-[#111827] text-[#F59E0B]", category: "Retail", location: "New York, NY", date: "Oct 22, 2023", status: "Active", phone: "+1 (555) 210-4422", socialLink: "instagram.com/voguethreads", description: "Premium fashion retail brand offering curated collections for the modern wardrobe.", ownerName: "Chidi Anagonye", ownerRole: "Director", ownerEmail: "chidi@philosophy.com" },
  { id: 3, name: "Urban Roast", mid: "#M-90104", avatar: "UR", avatarBg: "bg-[#E2E8F0] text-[#64748B]", category: "Food & Beverage", location: "Portland, OR", date: "Oct 21, 2023", status: "Rejected", phone: "+1 (555) 338-9900", socialLink: "urbanroast.com", description: "Artisan coffee and specialty roasts from ethically sourced beans worldwide.", ownerName: "Tahani Al-Jamil", ownerRole: "CEO", ownerEmail: "tahani@gala.co.uk" },
  { id: 4, name: "Luxe Grooming", mid: "#M-90511", avatar: "LG", avatarBg: "bg-[#D1ECE3] text-[#059669]", category: "Health & Beauty", location: "Austin, TX", date: "Oct 20, 2023", status: "Pending", phone: "+1 (555) 774-3310", socialLink: "luxegrooming.io", description: "High-end grooming and personal care products for premium lifestyle customers.", ownerName: "Jason Mendoza", ownerRole: "Founder", ownerEmail: "jason@duval.com" },
  { id: 5, name: "Nature's Spoon", mid: "#M-90662", avatar: "NS", avatarBg: "bg-[#D1ECE3] text-[#059669]", category: "Organic Retail", location: "Seattle, WA", date: "Oct 19, 2023", status: "Active", phone: "+1 (555) 501-8823", socialLink: "naturesspoon.co", description: "Organic and plant-based food products for health-conscious consumers.", ownerName: "Simone Leclerc", ownerRole: "Owner", ownerEmail: "simone@nspoon.co" },
];

const defaultGenres = ["Fantasy", "Romance", "Sci-Fi", "Thriller", "Action", "Drama", "Comedy", "Horror", "Adventure", "Mystery", "Romance", "Fantasy"];

export default function MerchantsManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"All" | "Active" | "Pending" | "Rejected">("All");

  // Merchant Detail Modal
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);

  // Genre List Modal
  const [showGenreModal, setShowGenreModal] = useState(false);
  const [genres, setGenres] = useState<string[]>(defaultGenres);
  const [genreInput, setGenreInput] = useState("");

  const handleAddGenre = () => {
    const trimmed = genreInput.trim();
    if (trimmed) {
      setGenres((prev) => [...prev, trimmed]);
      setGenreInput("");
    }
  };

  const handleRemoveGenre = (index: number) => {
    setGenres((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full py-6 pb-5">
      <div className="w-full flex flex-col gap-8">

        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-[24px] sm:text-[28px] font-extrabold text-[#111827]">Merchants Management</h1>
            <p className="text-[13px] sm:text-[14px] font-medium text-gray-500 mt-1">Review, verify and manage merchant registrations across the ecosystem.</p>
          </div>
          <button
            onClick={() => setShowGenreModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#A53200] text-[#A53200] font-bold text-[13px] hover:bg-[#A53200]/5 transition-colors cursor-pointer shadow-sm w-fit"
          >
            <LayoutGrid className="w-4 h-4" />
            Genre List
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-[#F6F8F9] rounded-2xl p-6 flex items-center gap-5 shadow-sm border border-gray-100/50">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${stat.iconBg}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-gray-500 tracking-widest uppercase">{stat.title}</span>
                <span className="text-[28px] font-extrabold text-[#A53200] leading-tight mt-1">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs Row */}
        <div className="flex items-center gap-6 sm:gap-8 border-b border-gray-200 mt-2 px-2 overflow-x-auto no-scrollbar whitespace-nowrap">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative pb-4 px-1 flex items-center gap-2 text-[14px] transition-colors cursor-pointer ${isActive ? "text-[#A53200] font-bold" : "text-gray-500 hover:text-gray-700 font-normal"
                  }`}
              >
                {tab.label}
                {tab.badge && (
                  <span className="flex items-center justify-center bg-[#D92D20] text-white text-[10px] w-5 h-5 rounded-full font-bold">
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A53200]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Main Table Card */}
        <div className="bg-[#F0F2F5]/40 border border-gray-200/50 rounded-[28px] p-6 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="flex flex-col gap-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-2 gap-2">
              <h2 className="text-[18px] font-bold text-gray-900">Queue Overview</h2>
              <div className="flex items-center gap-2 text-[12px] font-medium text-gray-500">
                Sorted by: <span className="font-bold text-gray-800 cursor-pointer flex items-center gap-1">Registration Date (Newest) <ChevronRight className="w-3 h-3 rotate-90" /></span>
              </div>
            </div>

            <div className="flex flex-col xl:flex-row justify-between items-center gap-4">
              <div className="relative w-full xl:max-w-xl flex items-center">
                <Search className="absolute left-4 w-4 h-4 text-gray-400" strokeWidth={3} />
                <input
                  type="text"
                  placeholder="Search here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-[#EAECEF] rounded-full text-[13px] font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A53200]/30"
                />
              </div>

              {/* Animated Filter Tabs */}
              <div className="flex items-center p-1 bg-[#EAECEF] rounded-full relative z-0 overflow-x-auto max-w-full no-scrollbar">
                {(["All", "Active", "Pending", "Rejected"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFilterMode(mode)}
                    className={`relative px-4 sm:px-6 py-1.5 rounded-full text-[12px] font-bold transition-colors cursor-pointer z-10 whitespace-nowrap ${filterMode === mode ? "text-gray-800" : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    {filterMode === mode && (
                      <motion.div
                        layoutId="merchantFilterBubble"
                        className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-transparent rounded-t-2xl overflow-hidden mt-4">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[900px]">
                {/* Table Header */}
                <div className="grid grid-cols-12 bg-[#E1E4E8] px-8 py-4 text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                  <div className="col-span-3">Merchant Name</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Location</div>
                  <div className="col-span-2">Registration Date</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1">Actions</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-gray-100/50">
                  {initialMerchants.map((merchant) => (
                    <div key={merchant.id} className="grid grid-cols-12 px-8 py-5 items-center hover:bg-gray-50 transition-colors">
                      <div className="col-span-3 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px] flex-shrink-0 ${merchant.avatarBg}`}>
                          {merchant.avatar}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-gray-900 leading-tight">{merchant.name}</span>
                          <span className="text-[12px] text-gray-500 font-medium leading-tight">ID: {merchant.mid}</span>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <div className="inline-block bg-[#EAECEF] px-3 py-1 rounded-full">
                          <span className="text-[11px] font-bold text-gray-600 block max-w-[80px] truncate text-center">
                            {merchant.category}
                          </span>
                        </div>
                      </div>

                      <div className="col-span-2 text-[13px] text-gray-600 font-medium pr-4">
                        {merchant.location}
                      </div>

                      <div className="col-span-2 text-[13px] text-gray-600 font-medium">
                        {merchant.date}
                      </div>

                      <div className="col-span-2 flex items-center">
                        <span className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-full ${merchant.status === "Active" ? "bg-[#D1F4D9] text-[#059669]" :
                            merchant.status === "Pending" ? "bg-[#FDEED5] text-[#D97706]" : "bg-[#FCE2E4] text-[#E11D48]"
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${merchant.status === "Active" ? "bg-[#059669]" :
                              merchant.status === "Pending" ? "bg-[#D97706]" : "bg-[#E11D48]"
                            }`} />
                          {merchant.status}
                        </span>
                      </div>

                      <div className="col-span-1 flex items-center gap-2">
                        <button className="w-7 h-7 rounded-full bg-[#D1F4D9] hover:bg-[#BCE8C6] text-[#059669] flex items-center justify-center transition-colors cursor-pointer">
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        </button>
                        <button className="w-7 h-7 rounded-full bg-[#FCE2E4] hover:bg-[#F8D2D5] text-[#E11D48] flex items-center justify-center transition-colors cursor-pointer">
                          <X className="w-3.5 h-3.5" strokeWidth={3} />
                        </button>
                        <button
                          onClick={() => setSelectedMerchant(merchant)}
                          className="h-7 px-3 rounded-full bg-[#E4F0FB] hover:bg-[#D4E6F8] text-[#A53200] font-bold text-[10px] transition-colors cursor-pointer ml-1"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pagination footer */}
            <div className="px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200/50 bg-[#E6E8EA]/40">
              <span className="text-[12px] text-gray-500 font-medium text-center sm:text-left">Showing <strong className="font-bold text-gray-700">1 - 5</strong> of 1,135 merchants</span>
              <div className="flex items-center gap-1.5">
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#EAECEF] hover:bg-gray-200 text-gray-500 shadow-sm cursor-pointer transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#A53200] text-white font-bold text-[12px] shadow-sm">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 font-bold text-[12px] shadow-sm hover:bg-gray-50">2</button>
                <button className="hidden sm:flex w-8 h-8 items-center justify-center rounded-full bg-white text-gray-600 font-bold text-[12px] shadow-sm hover:bg-gray-50">3</button>
                <span className="text-gray-400 px-1 font-bold">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 font-bold text-[12px] shadow-sm hover:bg-gray-50">321</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#EAECEF] hover:bg-gray-200 text-gray-500 shadow-sm cursor-pointer transition-colors"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Merchant Detail Modal ── */}
      <AnimatePresence>
        {selectedMerchant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMerchant(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-xl overflow-hidden border border-gray-100 max-h-[90vh] overflow-y-auto"
            >
              {/* Close */}
              <button
                onClick={() => setSelectedMerchant(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer z-20"
              >
                <X className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
              </button>

              {/* Modal Header */}
              <div className="p-5 sm:p-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                <div className="flex flex-col gap-6">
                  {/* Merchant Info */}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-[15px] flex-shrink-0 ${selectedMerchant.avatarBg}`}>
                      {selectedMerchant.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[16px] sm:text-[18px] font-bold text-gray-900 truncate">{selectedMerchant.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${selectedMerchant.status === "Active" ? "bg-green-100 text-green-700" :
                            selectedMerchant.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                          }`}>
                          + {selectedMerchant.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[12px] text-gray-500 font-medium">
                        <Phone className="w-3 h-3" />
                        {selectedMerchant.phone}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium overflow-hidden">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">Registered in {selectedMerchant.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Owner Info */}
                  <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3">
                    <div className="w-9 h-9 rounded-full bg-[#D6EBF8] flex items-center justify-center text-[#A53200] font-bold text-[12px] flex-shrink-0">
                      {selectedMerchant.ownerName.charAt(0)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-bold text-gray-900 leading-tight truncate">{selectedMerchant.ownerName}</span>
                      <span className="text-[11px] text-[#A53200] font-bold leading-tight">{selectedMerchant.ownerRole}</span>
                      <span className="text-[11px] text-gray-400 leading-tight truncate">{selectedMerchant.ownerEmail}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="p-5 sm:p-6 pt-6">
                <p className="text-[11px] font-extrabold text-gray-500 tracking-widest uppercase mb-4">Business Information</p>
                <div className="bg-gray-50 rounded-2xl p-5 space-y-4 border border-gray-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[13px]">
                    <span className="text-gray-500 font-medium">Business Type</span>
                    <span className="font-bold text-gray-800">{selectedMerchant.category}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[13px]">
                    <span className="text-gray-500 font-medium">Address</span>
                    <span className="font-bold text-gray-800 text-left sm:text-right sm:max-w-[240px] leading-snug">{selectedMerchant.location}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[13px]">
                    <span className="text-gray-500 font-medium flex items-center gap-1"><Globe className="w-3 h-3" /> Social Link</span>
                    <span className="font-bold text-[#A53200] text-left sm:text-right text-[12px] break-all">{selectedMerchant.socialLink}</span>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-[11px] font-bold text-gray-500 mb-2">Business Description</p>
                    <p className="text-[13px] text-gray-700 font-medium leading-relaxed">{selectedMerchant.description}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-[12px] font-bold text-[#A53200] mb-3">Trade License</p>
                    <div className="w-32 h-24 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center p-3">
                      <span className="text-[10px] text-amber-700 font-bold text-center leading-tight">Trade License Document</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="p-5 sm:p-6 pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setSelectedMerchant(null)}
                  className="flex-1 py-3 rounded-xl border-2 border-[#E11D48] text-[#E11D48] font-bold text-[14px] hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Reject
                </button>
                <button
                  onClick={() => setSelectedMerchant(null)}
                  className="flex-1 py-3 rounded-xl bg-[#A53200] text-white font-bold text-[14px] hover:bg-[#007BB5] transition-colors cursor-pointer shadow-lg shadow-[#A53200]/20"
                >
                  Accept
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Genre List Modal ── */}
      <AnimatePresence>
        {showGenreModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGenreModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 p-5 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Close */}
              <button
                onClick={() => setShowGenreModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
              </button>

              <h3 className="text-[12px] sm:text-[14px] font-medium text-gray-800 tracking-widest uppercase mb-6 pr-8">Manage Business Genres</h3>

              {/* Input */}
              <div className="bg-gray-50 p-4 rounded-2xl mb-6">
                <label className="block text-[12px] font-bold text-gray-600 mb-2">Add New Genre</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter genre name.."
                    value={genreInput}
                    onChange={(e) => setGenreInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleAddGenre(); }}
                    className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A53200]/30"
                  />
                  <button
                    onClick={handleAddGenre}
                    className="px-4 py-2.5 bg-[#A53200] text-white font-bold text-[13px] rounded-xl hover:bg-[#007BB5] transition-colors cursor-pointer shadow-sm shadow-[#A53200]/20"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Genre Tags */}
              <div>
                <p className="text-[12px] font-bold text-gray-600 mb-3 flex items-center justify-between">
                  Existing Genres
                  <span className="text-[10px] text-gray-400 font-medium tracking-normal">{genres.length} items</span>
                </p>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1 pb-2 custom-scrollbar">
                  <AnimatePresence>
                    {genres.map((genre, index) => (
                      <motion.div
                        key={`${genre}-${index}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-[#A53200]/30 text-[#A53200] rounded-full text-[12px] font-bold bg-white shadow-sm"
                      >
                        {genre}
                        <button
                          onClick={() => handleRemoveGenre(index)}
                          className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-[#A53200]/10 transition-colors cursor-pointer"
                        >
                          <X className="w-2.5 h-2.5" strokeWidth={3} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button
                  onClick={() => setShowGenreModal(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-[14px] hover:bg-gray-200 transition-colors cursor-pointer order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowGenreModal(false)}
                  className="flex-1 py-3 rounded-xl bg-[#A53200] text-white font-bold text-[14px] hover:bg-[#007BB5] transition-colors cursor-pointer shadow-lg shadow-[#A53200]/20 order-1 sm:order-2"
                >
                  Save All Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
