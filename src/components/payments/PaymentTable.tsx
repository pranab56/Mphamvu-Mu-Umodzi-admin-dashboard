"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetPaymentsQuery } from "@/features/payments/paymentsApi";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  Search,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Payment {
  type: string;
  contributionId: string;
  memberId: string;
  name: string;
  phone: string;
  email: string;
  eventName: string;
  amount: number;
  penaltyApplied: number;
  totalPaid: number;
  date: string;
  status: string;
}

// ── Status Config ──────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; badge: string; icon: React.ElementType }
> = {
  paid: {
    label: "Paid",
    badge: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle2,
  },
  pending_review: {
    label: "Pending Review",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  pending: {
    label: "Pending",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  missing: {
    label: "Missing",
    badge: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
  late: {
    label: "Late",
    badge: "bg-orange-50 text-orange-700 border-orange-200",
    icon: AlertCircle,
  },
  reinstatement_fee_paid: {
    label: "Reinstatement Fee",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    icon: CheckCircle2,
  },
};

const STATUS_FILTERS = [
  { key: "", label: "All Payments" },
  { key: "paid", label: "Paid" },
  { key: "pending_review", label: "Pending Review" },
  { key: "missing", label: "Missing" },
  { key: "late", label: "Late" },
  { key: "reinstatement_fee_paid", label: "Reinstatement Fee" },
] as const;

// ── Helpers ────────────────────────────────────────────────────────────────────

function getPageNumbers(current: number, total: number): number[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(1, current - 2);
  const end = Math.min(total, start + 4);
  const adj = Math.max(1, end - 4);
  return Array.from({ length: end - adj + 1 }, (_, i) => adj + i);
}

// ── StatusBadge ────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  // Normalize: "Paid" → "paid", "Pending Review" → "pending_review"
  const key = (status || "").toLowerCase().replace(/\s+/g, "_");
  const cfg = STATUS_CONFIG[key] ?? {
    label: status,
    badge: "bg-gray-50 text-gray-600 border-gray-200",
    icon: AlertTriangle,
  };
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap",
        cfg.badge
      )}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {cfg.label}
    </span>
  );
}

// ── MemberInitials ─────────────────────────────────────────────────────────────

function MemberInitials({ name, size = 34 }: { name: string; size?: number }) {
  return (
    <div
      className="rounded-full bg-[#E5D5C9] flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <span
        className="font-bold text-[#8B2F0E]"
        style={{ fontSize: size * 0.375 }}
      >
        {name?.charAt(0)?.toUpperCase() ?? "?"}
      </span>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function PaymentTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  // Debounce search → server-side
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const { data, isLoading, isFetching } = useGetPaymentsQuery({
    searchTerm: debouncedSearch,
    status: statusFilter,
    page,
  });

  const payments: Payment[] = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, limit: 10, total: 0, totalPage: 1 };

  const pageNumbers = getPageNumbers(meta.page, meta.totalPage);
  const startItem = (meta.page - 1) * meta.limit + 1;
  const endItem = Math.min(meta.page * meta.limit, meta.total);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.04)] overflow-hidden">

      {/* ── Toolbar ── */}
      <div className="p-4 md:p-6 border-b border-gray-100 space-y-4">
        <div className="relative">
          <Input
            placeholder="Search by name, email, event..."
            className="h-11 pl-10 rounded-xl bg-gray-50 border border-gray-200 text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#8B2F0E]/30 focus-visible:border-[#8B2F0E]/40"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => { setStatusFilter(f.key); setPage(1); }}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border cursor-pointer",
                statusFilter === f.key
                  ? "bg-[#8B2F0E] text-white border-[#8B2F0E] shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#8B2F0E]/40 hover:text-[#8B2F0E]"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[820px]">
          <thead>
            <tr className="bg-[#F8F4F2] text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <th className="px-5 py-4">Member ID</th>
              <th className="px-5 py-4">Member</th>
              <th className="px-5 py-4">Event</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Amount</th>
              <th className="px-5 py-4">Penalty</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading || isFetching ? (
              <tr>
                <td colSpan={7} className="py-24 text-center">
                  <Loader2 className="w-7 h-7 animate-spin text-[#8B2F0E] mx-auto" />
                  <p className="text-xs text-gray-400 mt-3">Loading payments…</p>
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-24 text-center">
                  <AlertCircle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-400">No payments found</p>
                  {(searchTerm || statusFilter) && (
                    <p className="text-xs text-gray-400 mt-1">
                      Try adjusting your search or filter
                    </p>
                  )}
                </td>
              </tr>
            ) : (
              payments.map((payment, i) => (
                <tr
                  key={`${payment.contributionId}-${i}`}
                  className="hover:bg-[#FDFAF9] transition-colors"
                >
                  {/* Member ID */}
                  <td className="px-5 py-4">
                    <span className="inline-block bg-[#F3EBE5] text-[#8B2F0E] text-xs font-bold px-2.5 py-1 rounded-lg tracking-wide">
                      {payment.memberId || "—"}
                    </span>
                  </td>

                  {/* Member */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <MemberInitials name={payment.name} size={34} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 leading-tight truncate max-w-[130px]">
                          {payment.name || "—"}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[130px]">
                          {payment.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Event */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-800 leading-tight max-w-[150px] truncate">
                      {payment.eventName || "—"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 capitalize">{payment.type}</p>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {payment.date
                      ? format(new Date(payment.date), "MMM dd, yyyy")
                      : "—"}
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-gray-900 whitespace-nowrap">
                      MK {payment.amount?.toLocaleString() ?? "0"}
                    </p>
                    {payment.totalPaid !== payment.amount && (
                      <p className="text-xs text-gray-400 mt-0.5 whitespace-nowrap">
                        Total: MK {payment.totalPaid?.toLocaleString()}
                      </p>
                    )}
                  </td>

                  {/* Penalty */}
                  <td className="px-5 py-4">
                    {payment.penaltyApplied > 0 ? (
                      <span className="text-sm font-semibold text-orange-600 whitespace-nowrap">
                        +MK {payment.penaltyApplied?.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge status={payment.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {meta.total > 0 && (
        <div className="border-t border-gray-100 px-4 md:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {startItem}–{endItem}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">{meta.total}</span>{" "}
            payments
          </p>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg border border-gray-200 hover:bg-gray-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={meta.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {pageNumbers.map((p) => (
              <Button
                key={p}
                variant="ghost"
                onClick={() => setPage(p)}
                className={cn(
                  "h-9 w-9 p-0 rounded-lg text-sm font-medium",
                  p === meta.page
                    ? "bg-[#8B2F0E] text-white hover:bg-[#70260B] shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 border border-gray-200"
                )}
              >
                {p}
              </Button>
            ))}

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg border border-gray-200 hover:bg-gray-50"
              onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
              disabled={meta.page >= meta.totalPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
