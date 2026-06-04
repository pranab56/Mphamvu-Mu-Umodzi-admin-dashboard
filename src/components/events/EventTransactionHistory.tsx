"use client";

import { useMemo, useState } from "react";
import { Search, CheckCircle2, ChevronLeft, ChevronRight, Loader2, History } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEventTransectionQuery } from "@/features/event/eventApi";
import { format } from "date-fns";
import Image from "next/image";
import { baseURL } from "@/utils/BaseURL";
import { cn } from "@/lib/utils";

interface EventTransactionHistoryProps {
  eventId: string;
}

interface Transaction {
  _id: string;
  amount: number;
  createdAt: string;
  stripePaymentIntentId?: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

export function EventTransactionHistory({ eventId }: EventTransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  
  const { data: transactionResponse, isLoading } = useEventTransectionQuery({ 
    userId: eventId, 
    page 
  });
  
  const meta = transactionResponse?.meta;

  const filteredTransactions = useMemo(() => {
    const transactions = (transactionResponse?.data as Transaction[]) || [];
    if (!searchTerm) return transactions;
    return transactions.filter((tnx: Transaction) => 
      tnx.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tnx.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tnx._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tnx.stripePaymentIntentId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transactionResponse?.data, searchTerm]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (meta?.totalPage || 1)) {
      setPage(newPage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative w-full">
        <Input
          placeholder="Search by member name, email or transaction ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-14 pl-12 rounded-xl bg-neutral-100 border-none text-sm placeholder:text-gray-400 focus-visible:ring-0"
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
      </div>

      {/* Table Container */}
      <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm min-h-[500px] flex flex-col bg-white">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#8B2F0E]" />
            <p className="text-gray-400 font-medium animate-pulse">Fetching event transactions...</p>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <>
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#E5D5C9]/40 text-gray-600">
                <tr>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">Tnx ID</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">Member</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTransactions.map((tnx: Transaction, index: number) => (
                  <tr key={tnx._id || index} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="px-6 py-5 text-sm text-gray-500 font-medium">
                      <span className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold text-gray-400">
                        {tnx._id?.slice(-8).toUpperCase() || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100">
                          <Image
                            src={tnx.userId?.image ? (tnx.userId.image.startsWith("http") ? tnx.userId.image : `${baseURL}${tnx.userId.image}`) : "https://avatar.iran.liara.run/public/boy"}
                            alt={tnx.userId?.name || "Member"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-900 font-bold text-sm tracking-tight">{tnx.userId?.name || "Unknown"}</span>
                          <span className="text-[10px] text-gray-400 font-medium">{tnx.userId?.email || "No email"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900 font-black">$ {tnx.amount?.toLocaleString()}</span>
                        <span className="text-[10px] text-gray-400 font-medium">Contribution</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-500 font-medium">
                      {tnx.createdAt ? format(new Date(tnx.createdAt), "MMM d, yyyy") : "N/A"}
                      <span className="block text-[10px] text-gray-400 font-normal">{tnx.createdAt ? format(new Date(tnx.createdAt), "hh:mm a") : ""}</span>
                    </td>
                    <td className="px-6 py-5">
                      <Badge className="bg-green-50 text-green-600 hover:bg-green-100 border-none px-3 py-1.5 rounded-full gap-1.5 font-black text-[10px] uppercase tracking-wider flex items-center w-fit shadow-none">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Footer */}
            {meta && meta.totalPage > 1 && !searchTerm && (
              <div className="bg-[#E5D5C9]/40 px-6 py-4 flex items-center justify-between mt-auto border-t border-gray-100">
                <p className="text-sm text-gray-500 font-bold tracking-tight">
                  Showing <span className="text-gray-900">{(page - 1) * meta.limit + 1}</span> - <span className="text-gray-900">{Math.min(page * meta.limit, meta.total)}</span> of <span className="text-gray-900">{meta.total}</span> histories
                </p>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="h-9 w-9 p-0 rounded-full bg-white/50 hover:bg-white text-gray-400 shadow-sm disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: Math.min(3, meta.totalPage) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={cn(
                          "h-9 w-9 p-0 rounded-full font-bold text-sm shadow-md transition-all active:scale-90",
                          page === pageNum ? "bg-[#8B2F0E] text-white hover:bg-[#70260B]" : "bg-white text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  {meta.totalPage > 3 && <span className="text-gray-400 px-1 font-bold">...</span>}
                  
                  <Button 
                    variant="ghost" 
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === meta.totalPage}
                    className="h-9 w-9 p-0 rounded-full bg-white/50 hover:bg-white text-gray-400 shadow-sm disabled:opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 gap-4 text-gray-400">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-2">
              <History className="w-8 h-8 opacity-20" />
            </div>
            <p className="font-bold text-xl text-gray-500">No transactions yet</p>
            <p className="text-sm font-medium text-gray-400 max-w-xs text-center">
              Contribution records for this event will appear here once members start donating.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
