"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, Ban, ChevronLeft, ChevronRight, Users } from "lucide-react";
import Image from "next/image";

const initialUsers = [
  { id: 1, name: "Eleanor Shellstrop", email: "eleanor@observatory.io", joined: "Oct 12, 2023", receipts: "1,248", status: "Active" },
  { id: 2, name: "Chidi Anagonye", email: "chidi.a@philosophy.com", joined: "Nov 04, 2023", receipts: "842", status: "Active" },
  { id: 3, name: "Tahani Al-Jamil", email: "tahani@gala.co.uk", joined: "Dec 20, 2023", receipts: "3,901", status: "Blocked" },
  { id: 4, name: "Chidi Anagonye", email: "chidi.a@philosophy.com", joined: "Nov 04, 2023", receipts: "842", status: "Active" },
  { id: 5, name: "Tahani Al-Jamil", email: "tahani@gala.co.uk", joined: "Dec 20, 2023", receipts: "3,901", status: "Blocked" },
  { id: 6, name: "Jason Mendoza", email: "jason.dj@duval.com", joined: "Jan 15, 2024", receipts: "512", status: "Active" },
  { id: 7, name: "Jason Mendoza", email: "jason.dj@duval.com", joined: "Jan 15, 2024", receipts: "512", status: "Active" },
  { id: 8, name: "Tahani Al-Jamil", email: "tahani@gala.co.uk", joined: "Dec 20, 2023", receipts: "3,901", status: "Blocked" },
];

export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"All" | "Active" | "Inactive">("All");
  const [selectedUser, setSelectedUser] = useState<typeof initialUsers[0] | null>(null);
  const [userToBlock, setUserToBlock] = useState<typeof initialUsers[0] | null>(null);

  // Stats data
  const userStats = {
    received: 5,
    scanned: 12,
    redeemed: 14,
  };

  const handleBlockUser = () => {
    // normally call api, closing for now
    setSelectedUser(null);
    setUserToBlock(null);
  };

  return (
    <div className="w-full py-6 pb-10">
      <div className="w-full flex flex-col gap-6">

        {/* Header Texts */}
        <div className="mb-2">
          <h1 className="text-[28px] font-bold text-[#111827]">User Management</h1>
          <p className="text-[14px] font-medium text-gray-500 mt-1">Monitor and manage access for all observatory personnel and participants.</p>
        </div>

        {/* Top Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="col-span-1 bg-[#E6FBFF73] border border-gray-300 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center min-h-[160px]">
            <Users className="absolute right-10  w-36 h-36 text-gray-300 opacity-50" />
            <div className="relative z-10 space-y-2">
              <p className="text-sm font-bold text-[#A53200] tracking-widest uppercase">Total Users</p>
              <p className="text-[32px] font-bold text-[#111827] leading-none">12,842</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-span-1 md:col-span-2 bg-[#00A5DA] rounded-3xl p-8 flex flex-col justify-between text-white shadow-xl shadow-[#A53200]/20">
            <div>
              <h2 className="text-[20px] font-bold">Platform Engagement</h2>
              <p className="text-[13px] text-white/90 font-medium mt-1 w-full max-w-lg leading-relaxed">
                84% of active users scanned at least one receipt in the last 7 days. Your observatory is thriving.
              </p>
            </div>

            <div className="flex gap-4 mt-6">
              <div className="bg-white/10 px-5 py-3 rounded-full flex flex-col justify-center">
                <span className="text-[10px] text-white/80 font-bold">Active Today</span>
                <span className="text-lg font-bold">1,402</span>
              </div>
              <div className="bg-white/10 px-5 py-3 rounded-full flex flex-col justify-center">
                <span className="text-[10px] text-white/80 font-bold">New Receipts</span>
                <span className="text-lg font-bold">4,891</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-[#EAECEF] rounded-[24px] p-2 md:p-3 mt-2">
          <div className="w-full flex flex-col lg:flex-row justify-between items-center px-2 sm:px-4 py-3 gap-4">
            <div className="relative w-full lg:max-w-sm flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-gray-400" strokeWidth={3} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-[#E2E4E7] rounded-full text-[13px] font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A53200]/30"
              />
            </div>

            <div className="flex items-center p-1 bg-[#E2E4E7] rounded-full relative z-0 overflow-x-auto max-w-full">
              {(["All", "Active", "Inactive"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`relative px-4 sm:px-6 py-1.5 rounded-full text-[12px] font-bold transition-colors cursor-pointer z-10 whitespace-nowrap ${
                    filterMode === mode ? "text-gray-800" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {filterMode === mode && (
                    <motion.div
                      layoutId="userFilterBubble"
                      className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[24px] mt-4 pb-2 shadow-sm border border-gray-100 overflow-hidden">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Table Header */}
                <div className="grid grid-cols-12 bg-[#E6E8EA] px-8 py-4 text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                  <div className="col-span-4">User Details</div>
                  <div className="col-span-3">Joined Date</div>
                  <div className="col-span-2">Receipts</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-gray-100">
                  {initialUsers.map((user) => (
                    <div key={user.id} className="grid grid-cols-12 px-8 py-5 items-center hover:bg-gray-50 transition-colors">
                      <div className="col-span-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 relative">
                          <Image src="/images/auth/image.png" alt="Avatar" fill className="object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-gray-900 leading-tight">{user.name}</span>
                          <span className="text-[12px] text-gray-500 font-medium leading-tight">{user.email}</span>
                        </div>
                      </div>
                      <div className="col-span-3 text-[13px] text-gray-600 font-medium">
                        {user.joined}
                      </div>
                      <div className="col-span-2 text-[13px] font-bold text-gray-800">
                        {user.receipts}
                      </div>
                      <div className="col-span-2">
                        <span className={`px-3 py-1 text-[11px] font-bold rounded-full ${user.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}>
                          {user.status}
                        </span>
                      </div>
                      <div className="col-span-1 flex items-center justify-end gap-3 cursor-pointer">
                        <button onClick={() => setSelectedUser(user)} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                          <Eye className="w-5 h-5" strokeWidth={2} />
                        </button>
                        <button 
                          disabled={user.status === "Blocked"}
                          onClick={() => setUserToBlock(user)}
                          className={`transition-colors cursor-pointer ${
                            user.status === "Blocked" 
                            ? "text-gray-300 cursor-not-allowed" 
                            : "text-red-400 hover:text-red-600"
                          }`}
                        >
                          <Ban className="w-5 h-5" strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pagination footer */}
            <div className="bg-[#E6E8EA] px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200/50">
              <span className="text-[12px] text-gray-500 font-medium text-center sm:text-left">Showing <strong className="font-bold text-gray-700">1 - 8</strong> of 12,842 users</span>
              <div className="flex items-center gap-1.5">
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-400 shadow-sm cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
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

        {/* User Detail Modal */}
        <AnimatePresence>
          {selectedUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedUser(null)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-[#F4F4F4] rounded-[24px] shadow-2xl w-full max-w-2xl overflow-hidden p-8 py-6 border border-white"
                style={{
                  // creating slight glossy overlay feel over F4F4F4 matches image
                }}
              >
                {/* Modal Info Bar */}
                <div className="bg-[#EFEEED] border border-[#A53200]/30 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 relative">
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-14 h-14 rounded-full bg-gray-300 relative overflow-hidden flex-shrink-0">
                      <Image src="/images/auth/image.png" alt="Avatar" fill className="object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3">
                        <span className="text-[16px] font-bold text-gray-900 leading-tight">{selectedUser.name}</span>
                        <span className={`px-2.5 py-0.5 leading-tight text-[10px] font-bold rounded-full ${selectedUser.status === "Active" ? "bg-green-200/50 text-green-700" : "bg-red-200/50 text-red-700"}`}>{selectedUser.status}</span>
                      </div>
                      <span className="text-[12px] text-gray-500 font-medium">{selectedUser.email}</span>
                      <span className="text-[11px] text-gray-400 font-medium mt-0.5">Joined in {selectedUser.joined.split(',')[0]} {selectedUser.joined.split(',')[1]}</span>
                    </div>
                  </div>

                  {/* Stats side in Modal */}
                  <div className="flex flex-col gap-2 w-full md:w-auto md:min-w-[180px] border-l-0 md:border-l border-[#A53200]/20 md:pl-6 leading-none py-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-gray-600 font-medium">Received Receipts</span>
                      <span className="text-gray-900 font-bold">{userStats.received}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-gray-600 font-medium">Scanned Receipts</span>
                      <span className="text-gray-900 font-bold">{userStats.scanned}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-gray-600 font-medium">Redeemed Offers</span>
                      <span className="text-gray-900 font-bold">{userStats.redeemed}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-[16px] font-bold text-gray-800 mb-4">Related Merchants</h3>
                  <div className="flex flex-wrap gap-4">
                    {/* Fake merchant logos */}
                    <div className="w-12 h-12 rounded-full bg-[#006241] border border-gray-200 flex items-center justify-center shadow-sm text-[8px] text-white font-bold select-none">Sbucks</div>
                    <div className="w-12 h-12 rounded-full bg-[#E31937] border border-gray-200 flex items-center justify-center shadow-sm text-white select-none">
                      {/* Simple T outline */}
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M4 6V11H10V18H14V11H20V6H4Z" /></svg>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm select-none">
                      <div className="flex flex-col"><div className="w-2 h-2 bg-[#0055B8]"></div><div className="w-2 h-2 bg-[#0055B8] mt-1 ml-2"></div></div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm font-bold text-[18px] select-none">3</div>
                    <div className="w-12 h-12 rounded-full bg-black border border-gray-200 flex items-center justify-center shadow-sm select-none">
                      <span className="text-emerald-500 font-extrabold text-[9px] leading-tight text-center">Uber<br /><span className="text-white relative -top-1">Eats</span></span>
                    </div>

                    <div className="w-full h-0"></div>

                    <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm font-bold text-[#E51937] select-none">sky</div>
                    <div className="w-12 h-12 rounded-full bg-[#00A1D6] border border-gray-200 flex items-center justify-center shadow-sm text-white font-bold text-[10px] select-none">TUI</div>
                    <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm text-[#7D0C15] font-extrabold text-[10px] select-none">PRET</div>
                  </div>
                </div>

                <div className="mt-12 flex justify-end gap-3 w-full">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="flex-1 md:flex-none px-6 py-2.5 rounded-lg bg-[#EAECEF] text-gray-700 font-bold text-[13px] hover:bg-gray-300 transition-colors shadow-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={selectedUser.status === "Blocked"}
                    onClick={() => setUserToBlock(selectedUser)}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-[13px] transition-colors shadow-sm ${selectedUser.status === "Blocked"
                      ? "bg-[#CBE4F1] text-white cursor-not-allowed border-none shadow-none"
                      : "bg-[#D92D20] hover:bg-[#B42217] text-white cursor-pointer"
                      }`}
                  >
                    <Ban className={`w-4 h-4 ${selectedUser.status === "Blocked" ? "opacity-70" : ""}`} strokeWidth={2.5} />
                    Block
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Block Confirmation Modal */}
        <AnimatePresence>
          {userToBlock && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setUserToBlock(null)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden p-8 flex flex-col items-center text-center border border-gray-100"
              >
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
                  <Ban className="w-8 h-8 text-[#D92D20]" strokeWidth={2.5} />
                </div>
                
                <h3 className="text-[20px] font-bold text-gray-900 mb-2">Block User?</h3>
                <p className="text-[14px] text-gray-500 font-medium mb-8">
                  Are you sure you want to block <span className="font-bold text-gray-700">{userToBlock.name}</span>? This action will restrict their access to the platform.
                </p>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setUserToBlock(null)}
                    className="flex-1 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-[14px] hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBlockUser}
                    className="flex-1 px-6 py-3 rounded-xl bg-[#D92D20] text-white font-bold text-[14px] hover:bg-[#B42217] transition-colors shadow-lg shadow-red-200 cursor-pointer"
                  >
                    Confirm Block
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
