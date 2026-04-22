"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, X, Phone, MapPin } from "lucide-react";
import Image from "next/image";

const stats = [
  { title: "TOTAL RECEIPTS", value: "84", bg: "bg-[#EAECEF]", textColor: "text-[#A53200]", titleColor: "text-gray-500", active: false },
  { title: "SCANNED RECEIPTS", value: "1,200", bg: "bg-[#A53200]", textColor: "text-white", titleColor: "text-white/80", active: true },
  { title: "SENT RECEIPTS", value: "12", bg: "bg-[#EAECEF]", textColor: "text-[#A53200]", titleColor: "text-gray-500", active: false },
];

type Receipt = {
  id: string;
  userName: string;
  userEmail: string;
  merchant: string;
  merchantId: string;
  merchantPhone: string;
  merchantRegistered: string;
  amount: string;
  date: string;
  fullDate: string;
  transactionId: string;
  status: string;
  lineItems: { name: string; description: string; price: string; qty: number }[];
  subtotal: string;
  tax: string;
};

const receipts: Receipt[] = [
  {
    id: "#RT-90124", userName: "James Wilson", userEmail: "james@freshmarket.co", merchant: "Fresh Market Co.",
    merchantId: "#M-88312", merchantPhone: "+1 (555) 942-0129", merchantRegistered: "12 Oct, 2023",
    amount: "$142.50", date: "Oct 24, 09:12 AM", fullDate: "OCT 24, 2023 - 09:12 AM", transactionId: "#TRX-99021-X",
    status: "Scanned",
    lineItems: [
      { name: "Organic Produce Bundle", description: "Weekly subscription, Tier 1", price: "$80.50", qty: 1 },
      { name: "Fresh Dairy Pack", description: "Premium Milk & Cheese Set", price: "$42.00", qty: 1 },
      { name: "Delivery Fee", description: "Express same-day delivery", price: "$20.00", qty: 1 },
    ],
    subtotal: "$142.50", tax: "$0.00",
  },
  {
    id: "#RT-90123", userName: "Maria Alvez", userEmail: "maria@luxewellness.com", merchant: "Luxe Wellness",
    merchantId: "#M-90245", merchantPhone: "+1 (555) 210-4422", merchantRegistered: "15 Nov, 2023",
    amount: "$89.00", date: "Oct 24, 08:45 AM", fullDate: "OCT 24, 2023 - 08:45 AM", transactionId: "#TRX-88310-Y",
    status: "Sent",
    lineItems: [
      { name: "Aromatherapy Kit", description: "Essential Oils & Diffuser", price: "$65.00", qty: 1 },
      { name: "Wellness Journal", description: "Hardcover, Guided Daily", price: "$24.00", qty: 1 },
    ],
    subtotal: "$89.00", tax: "$0.00",
  },
  {
    id: "#RT-90119", userName: "David Kim", userEmail: "david@urbangear.io", merchant: "Urban Gear Tech",
    merchantId: "#M-90104", merchantPhone: "+1 (555) 338-9900", merchantRegistered: "20 Oct, 2023",
    amount: "$1,240.99", date: "Oct 23, 05:20 PM", fullDate: "OCT 23, 2023 - 05:20 PM", transactionId: "#TRX-99021-X",
    status: "Scanned",
    lineItems: [
      { name: "Bespoke Design System Consulting", description: "Tier 2 Audit + Implementation", price: "$850.00", qty: 1 },
      { name: "Annual Hosting License", description: "Enterprise Cloud Cluster", price: "$350.00", qty: 1 },
      { name: "Premium Support Add-on", description: "24/7 Slack Connect", price: "$40.50", qty: 1 },
    ],
    subtotal: "$1,240.50", tax: "$0.00",
  },
  {
    id: "#RT-90115", userName: "Sarah Chen", userEmail: "sarah@organicbites.co", merchant: "Organic Bites",
    merchantId: "#M-90511", merchantPhone: "+1 (555) 774-3310", merchantRegistered: "18 Sep, 2023",
    amount: "$32.12", date: "Oct 23, 04:11 PM", fullDate: "OCT 23, 2023 - 04:11 PM", transactionId: "#TRX-77201-Z",
    status: "Scanned",
    lineItems: [
      { name: "Vegan Snack Box", description: "Assorted organic snacks", price: "$22.12", qty: 1 },
      { name: "Herbal Tea Bundle", description: "Chamomile & Green Tea set", price: "$10.00", qty: 1 },
    ],
    subtotal: "$32.12", tax: "$0.00",
  },
  {
    id: "#RT-90123", userName: "Maria Alvez", userEmail: "maria@luxewellness.com", merchant: "Luxe Wellness",
    merchantId: "#M-90245", merchantPhone: "+1 (555) 210-4422", merchantRegistered: "15 Nov, 2023",
    amount: "$89.00", date: "Oct 24, 08:45 AM", fullDate: "OCT 24, 2023 - 08:45 AM", transactionId: "#TRX-88310-Y",
    status: "Sent",
    lineItems: [
      { name: "Aromatherapy Kit", description: "Essential Oils & Diffuser", price: "$65.00", qty: 1 },
      { name: "Wellness Journal", description: "Hardcover, Guided Daily", price: "$24.00", qty: 1 },
    ],
    subtotal: "$89.00", tax: "$0.00",
  },
  {
    id: "#RT-90119", userName: "David Kim", userEmail: "david@urbangear.io", merchant: "Urban Gear Tech",
    merchantId: "#M-90104", merchantPhone: "+1 (555) 338-9900", merchantRegistered: "20 Oct, 2023",
    amount: "$1,240.99", date: "Oct 23, 05:20 PM", fullDate: "OCT 23, 2023 - 05:20 PM", transactionId: "#TRX-99021-X",
    status: "Scanned",
    lineItems: [
      { name: "Bespoke Design System Consulting", description: "Tier 2 Audit + Implementation", price: "$850.00", qty: 1 },
      { name: "Annual Hosting License", description: "Enterprise Cloud Cluster", price: "$350.00", qty: 1 },
      { name: "Premium Support Add-on", description: "24/7 Slack Connect", price: "$40.50", qty: 1 },
    ],
    subtotal: "$1,240.50", tax: "$0.00",
  },
  {
    id: "#RT-90115", userName: "Sarah Chen", userEmail: "sarah@organicbites.co", merchant: "Organic Bites",
    merchantId: "#M-90511", merchantPhone: "+1 (555) 774-3310", merchantRegistered: "18 Sep, 2023",
    amount: "$32.12", date: "Oct 23, 04:11 PM", fullDate: "OCT 23, 2023 - 04:11 PM", transactionId: "#TRX-77201-Z",
    status: "Scanned",
    lineItems: [
      { name: "Vegan Snack Box", description: "Assorted organic snacks", price: "$22.12", qty: 1 },
      { name: "Herbal Tea Bundle", description: "Chamomile & Green Tea set", price: "$10.00", qty: 1 },
    ],
    subtotal: "$32.12", tax: "$0.00",
  },
  {
    id: "#RT-90115", userName: "Sarah Chen", userEmail: "sarah@organicbites.co", merchant: "Organic Bites",
    merchantId: "#M-90511", merchantPhone: "+1 (555) 774-3310", merchantRegistered: "18 Sep, 2023",
    amount: "$32.12", date: "Oct 23, 04:11 PM", fullDate: "OCT 23, 2023 - 04:11 PM", transactionId: "#TRX-77201-Z",
    status: "Scanned",
    lineItems: [
      { name: "Vegan Snack Box", description: "Assorted organic snacks", price: "$22.12", qty: 1 },
      { name: "Herbal Tea Bundle", description: "Chamomile & Green Tea set", price: "$10.00", qty: 1 },
    ],
    subtotal: "$32.12", tax: "$0.00",
  },
  {
    id: "#RT-90115", userName: "Sarah Chen", userEmail: "sarah@organicbites.co", merchant: "Organic Bites",
    merchantId: "#M-90511", merchantPhone: "+1 (555) 774-3310", merchantRegistered: "18 Sep, 2023",
    amount: "$32.12", date: "Oct 23, 04:11 PM", fullDate: "OCT 23, 2023 - 04:11 PM", transactionId: "#TRX-77201-Z",
    status: "Scanned",
    lineItems: [
      { name: "Vegan Snack Box", description: "Assorted organic snacks", price: "$22.12", qty: 1 },
      { name: "Herbal Tea Bundle", description: "Chamomile & Green Tea set", price: "$10.00", qty: 1 },
    ],
    subtotal: "$32.12", tax: "$0.00",
  },
];

export default function ReceiptsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"All" | "Scanned" | "Sent">("All");
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  return (
    <div className="w-full py-6 pb-10">
      <div className="w-full flex flex-col gap-8">

        {/* Header */}
        <div>
          <h1 className="text-[28px] font-extrabold text-[#111827]">Receipts Management</h1>
          <p className="text-[14px] font-medium text-gray-500 mt-1">Review transaction proof documents.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {stats.map((s, i) => (
            <div key={i} className={`rounded-3xl px-8 py-7 flex flex-col gap-2 ${s.bg} ${s.active ? "shadow-xl shadow-[#A53200]/20" : "border border-gray-200/60"}`}>
              <span className={`text-xs font-bold tracking-widest ${s.titleColor}`}>{s.title}</span>
              <span className={`text-[36px] font-extrabold leading-none ${s.textColor}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div className="bg-[#F0F2F5]/50 border border-gray-200/50 rounded-[28px] p-5 shadow-sm">
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 px-2">
            <div className="relative w-full max-w-xl flex items-center">
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
            <div className="flex items-center p-1 bg-[#EAECEF] rounded-full shrink-0 relative z-0">
              {(["All", "Scanned", "Sent"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`relative px-5 py-1.5 rounded-full text-[12px] font-bold transition-colors cursor-pointer z-10 ${filterMode === mode ? "text-gray-800" : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {filterMode === mode && (
                    <motion.div
                      layoutId="receiptFilterBubble"
                      className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-[20px] overflow-hidden border border-gray-100">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Table Header */}
                <div className="grid grid-cols-12 bg-[#E6E8EA] px-6 py-4 text-[10px] font-extrabold text-gray-500 tracking-widest uppercase">
                  <div className="col-span-2">Receipt ID</div>
                  <div className="col-span-2">User Name</div>
                  <div className="col-span-3">Merchant</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-2">Created Date</div>
                  <div className="col-span-1">Status</div>
                </div>

                {/* Table Rows – clickable */}
                <div className="divide-y divide-gray-100">
                  {receipts.map((r, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedReceipt(r)}
                      className="grid grid-cols-12 px-6 py-4 items-center hover:bg-[#F0F7FF] transition-colors cursor-pointer"
                    >
                      <div className="col-span-2 text-[13px] font-bold text-gray-700">{r.id}</div>

                      <div className="col-span-2 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 relative overflow-hidden flex-shrink-0">
                          <Image src="/images/auth/image.png" alt="Avatar" fill className="object-cover" />
                        </div>
                        <span className="text-[13px] font-bold text-gray-900 leading-tight">{r.userName}</span>
                      </div>

                      <div className="col-span-3 text-[13px] text-gray-600 font-medium pr-4">{r.merchant}</div>
                      <div className="col-span-2 text-[13px] font-bold text-[#A53200]">{r.amount}</div>
                      <div className="col-span-2 text-[12px] text-gray-500 font-medium leading-tight">{r.date}</div>

                      <div className="col-span-1">
                        <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg tracking-wider uppercase ${r.status === "Sent" ? "bg-[#D1F4D9] text-[#059669]" : "bg-[#FDF0D5] text-[#D97706]"
                          }`}>
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
                Showing <strong className="font-bold text-gray-700">1 - 9</strong> of 1,135 receipts
              </span>
              <div className="flex items-center gap-1.5">
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-400 shadow-sm cursor-pointer hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#A53200] text-white font-bold text-[12px] shadow-sm">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 font-bold text-[12px] shadow-sm hover:bg-gray-50">2</button>
                <button className="hidden sm:flex w-8 h-8 items-center justify-center rounded-full bg-white text-gray-600 font-bold text-[12px] shadow-sm hover:bg-gray-50">3</button>
                <span className="text-gray-400 px-1 font-bold">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 font-bold text-[12px] shadow-sm hover:bg-gray-50">321</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-400 shadow-sm hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Receipt Detail Modal ── */}
      <AnimatePresence>
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReceipt(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative bg-white rounded-[20px] shadow-2xl w-full max-w-lg border border-gray-100 overflow-hidden"
            >
              {/* Close */}
              <button
                onClick={() => setSelectedReceipt(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
              </button>

              {/* Modal Header – Merchant + Owner */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 p-5 pb-4 border-b border-gray-100">
                {/* Merchant */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#D6EBF8] flex items-center justify-center font-bold text-[#A53200] text-[14px] flex-shrink-0">
                    {selectedReceipt.merchant.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-gray-900 leading-tight">{selectedReceipt.merchant}</p>
                    <p className="text-[11px] text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" /> {selectedReceipt.merchantPhone}
                    </p>
                    <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Registered in {selectedReceipt.merchantRegistered}
                    </p>
                  </div>
                </div>

                {/* Owner / User */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5 shrink-0">
                  <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden relative flex-shrink-0">
                    <Image src="/images/auth/image.png" alt="user" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-gray-900 leading-tight">{selectedReceipt.userName}</p>
                    <p className="text-[11px] text-gray-400 font-medium">{selectedReceipt.userEmail}</p>
                  </div>
                </div>
              </div>

              {/* Amount Hero */}
              <div className="text-center py-6 px-5 relative">
                <span className={`absolute top-4 right-5 text-[10px] font-extrabold tracking-widest px-3 py-1 rounded-full uppercase ${selectedReceipt.status === "Sent" ? "bg-[#D1F4D9] text-[#059669]" : "bg-[#FDF0D5] text-[#D97706]"
                  }`}>
                  {selectedReceipt.status}
                </span>
                <p className="text-[32px] font-bold text-gray-900">{selectedReceipt.amount}</p>
                <p className="text-[11px] font-bold text-gray-400 tracking-widest mt-1">TRANSACTION SUCCESSFUL</p>
                <p className="text-[12px] text-gray-500 font-medium mt-2">{selectedReceipt.fullDate}</p>
                <p className="text-[11px] text-gray-400 font-bold">ID: {selectedReceipt.transactionId}</p>
              </div>

              {/* Purchase Breakdown */}
              <div className="px-5 pb-5">
                <p className="text-[10px] font-extrabold text-gray-400 tracking-widest uppercase mb-3">Purchase Breakdown</p>
                <div className="space-y-3">
                  {selectedReceipt.lineItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-4">
                      <div>
                        <p className="text-[13px] font-bold text-gray-800 leading-tight">{item.name}</p>
                        <p className="text-[11px] text-gray-400 font-medium">{item.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[13px] font-bold text-gray-800">{item.price}</p>
                        <p className="text-[10px] text-gray-400 font-medium">Qty: {item.qty}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 mt-4 pt-3 space-y-1">
                  <div className="flex justify-between text-[12px] text-gray-500 font-medium">
                    <span>Subtotal</span>
                    <span>{selectedReceipt.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-[12px] text-gray-500 font-medium">
                    <span>Tax (0%)</span>
                    <span>{selectedReceipt.tax}</span>
                  </div>
                  <div className="flex justify-between text-[15px] font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                    <span>Total Paid</span>
                    <span>{selectedReceipt.amount}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {
                selectedReceipt.status === "Sent" && (
                  <div className="px-5 pb-5 flex gap-3">
                    <button
                      onClick={() => setSelectedReceipt(null)}
                      className="flex-1 py-2 rounded-xl border-2 border-[#E11D48] text-[#E11D48] font-bold text-[14px] hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => setSelectedReceipt(null)}
                      className="flex-1 py-2 rounded-xl bg-[#A53200] text-white font-bold text-[14px] hover:bg-[#007BB5] transition-colors cursor-pointer shadow-lg shadow-[#A53200]/20"
                    >
                      Accept
                    </button>
                  </div>
                )
              }
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
