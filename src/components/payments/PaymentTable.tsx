"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetPaymentsQuery } from "@/features/payments/paymentsApi";
import { format } from "date-fns";
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, Search, XCircle } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { baseURL } from '../../utils/BaseURL';

interface Transaction {
  _id: string;
  amount: number;
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    image: string | null;
  };
  eventId: {
    _id: string;
    name: string;
    eventType: string;
  };
  contributionId?: {
    status: string;
  };
}

export function PaymentTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGetPaymentsQuery({ searchTerm, page });

  const transactions = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, limit: 10, total: 0, totalPage: 1 };

  const startItem = (meta.page - 1) * meta.limit + 1;
  const endItem = Math.min(meta.page * meta.limit, meta.total);

  // Build an array of page numbers to display
  const pageNumbers = Array.from({ length: meta.totalPage }, (_, i) => i + 1);

  const shortenId = (id: string) =>
    id ? `#${id.slice(-8).toUpperCase()}` : "—";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)] p-8">
      {/* Search Bar */}
      <div className="relative mb-8 w-full">
        <Input
          placeholder="Search by member name, ID or event name..."
          className="h-14 pl-12 rounded-sm bg-neutral-100 border-none text-sm placeholder:text-gray-400 focus-visible:ring-0"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#E5D5C9]/40 text-gray-500 font-normal text-sm">
            <tr>
              <th className="px-6 py-4 font-normal rounded-l-xl">Txn ID</th>
              <th className="px-6 py-4 font-normal">Member</th>
              <th className="px-6 py-4 font-normal">Event</th>
              <th className="px-6 py-4 font-normal">Amount</th>
              <th className="px-6 py-4 font-normal">Date</th>
              <th className="px-6 py-4 font-normal rounded-r-xl">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {isLoading || isFetching ? (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#8B2F0E] mx-auto" />
                  <p className="text-sm text-gray-400 mt-3">Loading transactions…</p>
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <p className="text-sm text-gray-400">No transactions found.</p>
                </td>
              </tr>
            ) : (
              transactions.map((txn: Transaction) => {
                const status = txn.contributionId?.status ?? "unknown";
                const isCompleted = status === "paid";

                return (
                  <tr key={txn._id} className="group hover:bg-neutral-50 transition-colors">
                    {/* Txn ID */}
                    <td className="px-6 py-6 text-sm text-gray-500 font-normal">
                      {shortenId(txn._id)}
                    </td>

                    {/* Member */}
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        {txn.userId?.image ? (
                          <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={`${baseURL + txn.userId.image}`}
                              alt={txn.userId?.name || "Member"}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#E5D5C9] flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-[#8B2F0E]">
                              {txn.userId?.name?.charAt(0) ?? "?"}
                            </span>
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-gray-800 font-normal text-base">
                            {txn.userId?.name ?? "—"}
                          </span>
                          <span className="text-xs text-gray-400 mt-0.5">
                            {txn.userId?.email ?? "—"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Event */}
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-gray-700 text-sm font-normal">
                          {txn.eventId?.name ?? "—"}
                        </span>
                        {txn.eventId?.eventType && (
                          <span className="text-xs text-gray-400 mt-0.5">
                            {txn.eventId.eventType}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-6 font-normal text-gray-900 text-base">
                      $ {txn.amount?.toLocaleString() ?? "0"}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-6 text-sm text-gray-400 font-normal">
                      {txn.createdAt
                        ? format(new Date(txn.createdAt), "MMM dd, yyyy")
                        : "—"}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-6">
                      {isCompleted ? (
                        <Badge className="bg-[#DCFCE7] text-[#219653] hover:bg-[#DCFCE7] border-none px-4 py-1.5 rounded-full gap-1.5 font-normal text-xs flex items-center w-fit shadow-none">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Paid
                        </Badge>
                      ) : (
                        <Badge className="bg-[#FEF2F2] text-[#EF4444] hover:bg-[#FEF2F2] border-none px-4 py-1.5 rounded-full gap-1.5 font-normal text-xs flex items-center w-fit shadow-none">
                          <XCircle className="w-3.5 h-3.5" />
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="bg-[#E5D5C9]/40 mt-10 rounded-xl px-6 py-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 font-normal">
          {meta.total === 0
            ? "No records found"
            : `Showing ${startItem} - ${endItem} of ${meta.total} transactions`}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="h-10 w-10 p-0 rounded-full bg-white/50 hover:bg-white"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={meta.page <= 1}
          >
            <ChevronLeft className="h-5 w-5 text-gray-400" />
          </Button>

          {pageNumbers.map((p) => (
            <Button
              key={p}
              variant="ghost"
              onClick={() => setPage(p)}
              className={`h-10 w-10 p-0 rounded-full text-base font-medium transition-colors ${p === meta.page
                  ? "bg-[#8B2F0E] text-white hover:bg-[#70260B]"
                  : "text-gray-400 hover:bg-white/50"
                }`}
            >
              {p}
            </Button>
          ))}

          <Button
            variant="ghost"
            className="h-10 w-10 p-0 rounded-full bg-white/50 hover:bg-white"
            onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
            disabled={meta.page >= meta.totalPage}
          >
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Button>
        </div>
      </div>
    </div>
  );
}
