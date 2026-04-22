"use client";

import { Eye, CheckCircle2, AlertTriangle, Ban, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";


const members = [
  { id: "MMU-2024-0234", name: "John Banda", contact: "+265 991 234 567", joined: "Jan 15, 2024", balance: 450.00, events: 12, status: "Active" },
  { id: "MMU-2024-0234", name: "John Banda", contact: "+265 991 234 567", joined: "Jan 15, 2024", balance: 450.00, events: 12, status: "Inactive" },
  { id: "MMU-2024-0234", name: "John Banda", contact: "+265 991 234 567", joined: "Jan 15, 2024", balance: 0.00, events: 0, status: "Active" },
  { id: "MMU-2024-0234", name: "John Banda", contact: "+265 991 234 567", joined: "Jan 15, 2024", balance: 450.00, events: 12, status: "Active" },
  { id: "MMU-2024-0234", name: "John Banda", contact: "+265 991 234 567", joined: "Jan 15, 2024", balance: 450.00, events: 12, status: "Suspended" },
  { id: "MMU-2024-0234", name: "John Banda", contact: "+265 991 234 567", joined: "Jan 15, 2024", balance: 450.00, events: 12, status: "Active" },
  { id: "MMU-2024-0234", name: "John Banda", contact: "+265 991 234 567", joined: "Jan 15, 2024", balance: 450.00, events: 12, status: "Suspended" },
  { id: "MMU-2024-0234", name: "John Banda", contact: "+265 991 234 567", joined: "Jan 15, 2024", balance: 450.00, events: 12, status: "Active" },
  { id: "MMU-2024-0234", name: "John Banda", contact: "+265 991 234 567", joined: "Jan 15, 2024", balance: 450.00, events: 12, status: "Warning" },
  { id: "MMU-2024-0234", name: "John Banda", contact: "+265 991 234 567", joined: "Jan 15, 2024", balance: 450.00, events: 12, status: "Warning" },
];

export function MemberTable() {
  return (
    <div className="w-full overflow-hidden rounded-xl">
      <div className="overflow-x-auto mobile-scroll-container">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#E5D5C9] text-gray-700">
              <th className="px-6 py-5 font-medium text-sm">Member</th>
              <th className="px-6 py-5 font-medium text-sm">Contact</th>
              <th className="px-6 py-5 font-medium text-sm">Contributed Balance</th>
              <th className="px-6 py-5 font-medium text-sm">Contributed Events</th>
              <th className="px-6 py-5 font-medium text-sm">Status</th>
              <th className="px-6 py-5 font-medium text-sm text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {members.map((member, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="font-normal text-gray-900 text-lg">{member.name}</span>
                    <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{member.id}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-normal">{member.contact}</span>
                    <span className="text-xs text-gray-500 mt-1">Joined {member.joined}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-gray-900 font-normal">$ {member.balance.toFixed(2)}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-gray-900 font-normal">{member.events}</span>
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={member.status} />
                </td>
                <td className="px-6 py-5 text-center">
                  <Link href={`/members/${member.id}`} className="p-3 hover:bg-gray-100 cursor-pointer rounded-full transition-colors inline-block text-gray-400 hover:text-gray-600 border border-transparent hover:border-gray-200">
                    <Eye className="w-5 h-5" />
                  </Link>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#E5D5C9] px-6 py-6 rounded-b-2xl border-t border-gray-100 gap-4">
        <p className="text-sm font-normal text-gray-600">
          Showing 1 - 10 of 842 users
        </p>

        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-gray-600 shadow-sm transition-colors cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
          </button>

          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full text-sm font-normal shadow-sm transition-all cursor-pointer",
                page === 1
                  ? "bg-[#8B2F0E] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              )}
            >
              {page}
            </button>
          ))}

          <span className="px-2 text-gray-400 font-normal">...</span>

          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-600 font-normal shadow-sm hover:bg-gray-50 cursor-pointer">
            25
          </button>

          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-gray-600 shadow-sm transition-colors cursor-pointer">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { color: string; icon: React.ElementType }> = {
    Active: { color: "text-[#22C55E]", icon: CheckCircle2 },
    Inactive: { color: "text-[#6B7280]", icon: Info },
    Suspended: { color: "text-[#EF4444]", icon: Ban },
    Warning: { color: "text-[#EAB308]", icon: AlertTriangle },
  };

  const config = styles[status] || styles.Active;
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-2 font-normal text-sm", config.color)}>
      <Icon className="w-5 h-5" />
      {status}
    </div>
  );
}

