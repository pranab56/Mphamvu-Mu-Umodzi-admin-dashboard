"use client";

import { useGetPendingDependentsQuery, useUpdateStatusDependentsMutation } from "@/features/members/dependentsApi";
import { cn } from "@/lib/utils";
import { Check, ChevronLeft, ChevronRight, Clock, ExternalLink, FileText, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { baseURL } from '../../utils/BaseURL';
import { ActionModal } from "./ActionModals";

interface DependentTableProps {
  searchTerm?: string;
}

interface Dependent {
  _id: string;
  name: string;
  countryCode: string;
  phoneNumber: string;
  relationship: string;
  status: string;
  document: string[];
  userId: string | { _id: string; name: string };
}

export function DependentTable({ searchTerm = "" }: DependentTableProps) {
  const [page, setPage] = useState(1);
  const { data: dependentsResponse, isLoading } = useGetPendingDependentsQuery({ page });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateStatusDependentsMutation();

  const meta = dependentsResponse?.meta;

  const filteredDependents = useMemo(() => {
    const dependents = (dependentsResponse?.data as Dependent[]) || [];
    if (!searchTerm) return dependents;
    return dependents.filter((item: Dependent) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.relationship?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof item.userId === "object" ? item.userId.name : "Member").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [dependentsResponse?.data, searchTerm]);

  const handleStatusUpdate = async (id: string, status: "approved" | "rejected") => {
    try {
      await updateStatus({ id, data: { status } }).unwrap();
      toast.success(`Dependent ${status} successfully`);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || `Failed to ${status} dependent`);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (meta?.totalPage || 1)) {
      setPage(newPage);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm">
        <Loader2 className="w-10 h-10 animate-spin text-[#8B2F0E]" />
        <p className="text-gray-500 mt-4 font-medium">Fetching dependents...</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl shadow-sm border border-gray-100">
      <div className="overflow-x-auto mobile-scroll-container">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#E5D5C9] text-gray-700">
              <th className="px-6 py-5 font-medium text-sm">Member Info</th>
              <th className="px-6 py-5 font-medium text-sm">Dependent Name</th>
              <th className="px-6 py-5 font-medium text-sm">Contact</th>
              <th className="px-6 py-5 font-medium text-sm">Relationship</th>
              <th className="px-6 py-5 font-medium text-sm">Documents</th>
              <th className="px-6 py-5 font-medium text-sm">Status</th>
              <th className="px-6 py-5 font-medium text-sm text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredDependents.length > 0 ? (
              filteredDependents.map((item: Dependent) => (
                <tr key={item._id} className="hover:bg-gray-50/50 transition-all duration-200">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 text-lg">
                        {typeof item.userId === "object" ? item.userId.name : "Member"}
                      </span>
                      <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-bold">
                        ID: {typeof item.userId === "object" ? item.userId._id?.slice(-6) : item.userId?.slice(-6)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-gray-900 font-medium text-lg">{item.name}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-gray-700 font-medium">{item.countryCode} {item.phoneNumber}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-gray-900 font-medium capitalize">{item.relationship}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-2">
                      {item.document?.map((doc: string, idx: number) => (
                        <a
                          key={idx}
                          href={baseURL + doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 w-fit hover:bg-gray-100 transition-colors group"
                        >
                          <div className="bg-red-50 p-1 rounded group-hover:bg-red-100 transition-colors">
                            <FileText className="w-4 h-4 text-red-500" />
                          </div>
                          <span className="text-sm text-gray-600 font-medium truncate max-w-[100px]">Doc {idx + 1}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                        </a>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className={cn(
                      "flex items-center gap-2 font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full w-fit",
                      item.status === "pending" ? "bg-yellow-50 text-yellow-600" :
                        item.status === "approved" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    )}>
                      {item.status === "pending" && <Clock className="w-4 h-4" />}
                      {item.status === "approved" && <Check className="w-4 h-4" />}
                      {item.status}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-3">
                      <ActionModal
                        type="activate" // UI-wise fits Approve
                        isLoading={isUpdating}
                        onConfirm={() => handleStatusUpdate(item._id, "approved")}
                        trigger={
                          <button
                            disabled={isUpdating || item.status !== "pending"}
                            className="px-5 py-2 rounded-lg border border-green-200 bg-green-50 text-green-600 text-sm font-bold hover:bg-green-600 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
                          >
                            Approve
                          </button>
                        }
                      />
                      <ActionModal
                        type="suspend" // UI-wise fits Reject
                        isLoading={isUpdating}
                        onConfirm={() => handleStatusUpdate(item._id, "rejected")}
                        trigger={
                          <button
                            disabled={isUpdating || item.status !== "pending"}
                            className="px-5 py-2 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-bold hover:bg-red-600 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
                          >
                            Reject
                          </button>
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center text-gray-500 font-medium">
                  {searchTerm ? "No dependents match your search." : "No pending dependents found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Container */}
      {!searchTerm && (
        <div className="flex flex-col md:flex-row justify-between items-center bg-[#E5D5C9] px-6 py-6 rounded-b-2xl border-t border-gray-100 gap-4">
          <p className="text-sm font-bold text-gray-600">
            Showing {(page - 1) * (meta?.limit || 10) + 1} - {Math.min(page * (meta?.limit || 10), meta?.total || 0)} of {meta?.total || 0} records
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
