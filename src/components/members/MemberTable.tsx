"use client";

import { useState, useMemo } from "react";
import { Eye, CheckCircle2, AlertTriangle, Ban, Info, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useGetAllUsersQuery } from "@/features/members/membersApi";
import { format } from "date-fns";

interface Member {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  countryCode?: string;
  createdAt?: string;
  contributedBalance?: number;
  contributedEvents?: number;
  status: string;
  isSuspended?: boolean;
}

interface MemberTableProps {
  searchTerm?: string;
}

export function MemberTable({ searchTerm = "" }: MemberTableProps) {
  const [page, setPage] = useState(1);
  const { data: usersResponse, isLoading } = useGetAllUsersQuery({ page });

  const meta = usersResponse?.meta;

  const filteredMembers = useMemo(() => {
    const members: Member[] = usersResponse?.data || [];
    if (!searchTerm) return members;
    return members.filter((member: Member) => 
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member._id?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [usersResponse?.data, searchTerm]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (meta?.totalPage || 1)) {
      setPage(newPage);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm">
        <Loader2 className="w-10 h-10 animate-spin text-[#8B2F0E]" />
        <p className="text-gray-500 mt-4 font-medium">Fetching members...</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl shadow-sm border border-gray-100">
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
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member: Member) => (
                <tr key={member._id} className="hover:bg-gray-50/50 transition-all duration-200">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 text-lg">{member.name}</span>
                      <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-bold">
                        ID: {member._id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-gray-700 font-medium">{member.countryCode} {member.phone}</span>
                      <span className="text-xs text-gray-400 mt-1">
                        Joined {member.createdAt ? format(new Date(member.createdAt), "MMM d, yyyy") : "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-gray-900 font-medium">$ {member.contributedBalance?.toFixed(2) || "0.00"}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-gray-900 font-medium">{member.contributedEvents || 0}</span>
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={member.status} isSuspended={member.isSuspended} />
                  </td>
                  <td className="px-6 py-5 text-center">
                    <Link 
                      href={`/members/${member._id}`} 
                      className="p-3 hover:bg-orange-50 cursor-pointer rounded-full transition-all inline-block text-[#8B2F0E] hover:text-[#70260B] border border-transparent hover:border-orange-100 shadow-sm"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-gray-500 font-medium">
                  {searchTerm ? "No members match your search." : "No members found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Container */}
      {!searchTerm && (
        <div className="flex flex-col md:flex-row justify-between items-center bg-[#E5D5C9] px-6 py-6 rounded-b-2xl border-t border-gray-100 gap-4">
          <p className="text-sm font-medium text-gray-600">
            Showing {(page - 1) * (meta?.limit || 10) + 1} - {Math.min(page * (meta?.limit || 10), meta?.total || 0)} of {meta?.total || 0} users
          </p>

          <div className="flex items-center gap-2">
            <button 
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-[#8B2F0E] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: meta?.totalPage || 1 }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold shadow-sm transition-all cursor-pointer",
                  p === page
                    ? "bg-[#8B2F0E] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                )}
              >
                {p}
              </button>
            ))}

            <button 
              disabled={page === (meta?.totalPage || 1)}
              onClick={() => handlePageChange(page + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-[#8B2F0E] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status, isSuspended }: { status: string; isSuspended?: boolean }) {
  const displayStatus = isSuspended ? "Suspended" : (status.charAt(0).toUpperCase() + status.slice(1));

  const styles: Record<string, { color: string; icon: React.ElementType }> = {
    Active: { color: "text-[#22C55E]", icon: CheckCircle2 },
    Blocked: { color: "text-[#EF4444]", icon: Ban },
    Suspended: { color: "text-[#EF4444]", icon: AlertTriangle },
    Pending: { color: "text-[#EAB308]", icon: Info },
  };

  const config = styles[displayStatus] || styles.Active;
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-2 font-semibold text-sm", config.color)}>
      <Icon className="w-5 h-5" />
      {displayStatus}
    </div>
  );
}

