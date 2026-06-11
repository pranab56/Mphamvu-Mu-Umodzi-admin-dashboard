"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllEventsQuery } from "@/features/event/eventApi";
import {
  useGetEventReportsQuery,
  useGetMasterMembersReportsQuery,
  useGetSuspendMemberReportsQuery,
} from "@/features/reports/reportsApi";
import { baseURL } from "@/utils/BaseURL";
import { getToken } from "@/utils/storage";
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  Search,
  Users,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

// ── Types ─────────────────────────────────────────────────────────────────────

interface EventRecord {
  memberId: string;
  name: string;
  email: string;
  phone: string;
  amountPaid: number;
  penaltyApplied: number;
  paymentDate: string;
  status: string;
}

interface MasterMemberRecord {
  memberId: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  totalPaid: number;
  pendingBalance: number;
}

interface SuspendedMemberRecord {
  memberId: string;
  name: string;
  phone: string;
  email: string;
  amountOwed: number;
  eventsOwed: string;
  eventsCount: number;
  reactivationFee: number;
  totalBalance: number;
  suspendedAt: string;
}

interface EventItem {
  _id: string;
  name: string;
  status?: string;
  eventDeadline?: string;
  eventType?: string;
  type?: string;
}

// ── Utilities ─────────────────────────────────────────────────────────────────

const downloadReport = async (path: string, filename: string) => {
  const toastId = toast.loading("Preparing download...");
  try {
    const token = getToken();
    const res = await fetch(`${baseURL}/api/v1${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Export failed");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Download started", { id: toastId });
  } catch {
    toast.error("Export failed. Please try again.", { id: toastId });
  }
};

const openPrintWindow = (title: string, tableHTML: string) => {
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: sans-serif; font-size: 12px; padding: 20px; }
          h2 { margin-bottom: 12px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background: #f5f5f5; font-weight: 600; text-transform: uppercase; font-size: 11px; }
          tr:nth-child(even) { background: #fafafa; }
        </style>
      </head>
      <body><h2>${title}</h2>${tableHTML}</body>
    </html>
  `);
  w.document.close();
  w.print();
};

// ── Shared UI ─────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  const colorMap: Record<string, string> = {
    paid: "bg-green-50 text-green-700 border-green-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    active: "bg-green-50 text-green-700 border-green-200",
    suspended: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <Badge
      variant="outline"
      className={`text-[11px] font-medium capitalize ${colorMap[s] || "bg-gray-50 text-gray-600 border-gray-200"}`}
    >
      {status || "—"}
    </Badge>
  );
}

function ExportButtons({
  onExport,
  onPrint,
  disabled,
}: {
  onExport: (type: string) => void;
  onPrint: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap shrink-0">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onExport("xlsx")}
        disabled={disabled}
        className="gap-1.5 h-9 text-xs border-gray-200 hover:bg-gray-50 rounded-lg"
      >
        <FileSpreadsheet className="w-3.5 h-3.5 text-green-600" />
        Excel
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onExport("csv")}
        disabled={disabled}
        className="gap-1.5 h-9 text-xs border-gray-200 hover:bg-gray-50 rounded-lg"
      >
        <Download className="w-3.5 h-3.5 text-blue-600" />
        CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onExport("pdf")}
        disabled={disabled}
        className="gap-1.5 h-9 text-xs border-gray-200 hover:bg-gray-50 rounded-lg"
      >
        <FileText className="w-3.5 h-3.5 text-red-600" />
        PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onPrint}
        className="gap-1.5 h-9 text-xs border-gray-200 hover:bg-gray-50 rounded-lg"
      >
        <Printer className="w-3.5 h-3.5 text-gray-500" />
        Print
      </Button>
    </div>
  );
}

function TableSkeleton({ cols }: { cols: number }) {
  return (
    <tbody>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="border-b border-gray-50">
          {[...Array(cols)].map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-3.5 bg-gray-100 rounded animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <tbody>
      <tr>
        <td colSpan={99} className="py-16 text-center text-sm text-gray-400 font-normal">
          {message}
        </td>
      </tr>
    </tbody>
  );
}

const TH = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
    {children}
  </th>
);

const TD = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-4 py-3 text-sm text-gray-700 ${className}`}>{children}</td>
);

// ── A. Event Contribution Report ──────────────────────────────────────────────

function EventCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-3 animate-pulse">
      <div className="h-4 bg-gray-100 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-3 bg-gray-100 rounded w-1/3" />
      <div className="h-9 bg-gray-100 rounded-xl mt-2" />
    </div>
  );
}

function EventContributionReport() {
  const tableRef = useRef<HTMLTableElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(t);
  }, [search]);

  const { data: activeEventsData, isLoading: loadingActive } = useGetAllEventsQuery({ status: "active", page: 1 });
  const { data: completedEventsData, isLoading: loadingCompleted } = useGetAllEventsQuery({ status: "completed", page: 1 });

  const events: EventItem[] = [
    ...(activeEventsData?.data || []),
    ...(completedEventsData?.data || []),
  ];
  const isLoadingEvents = loadingActive || loadingCompleted;

  const { data: reportData, isLoading: isLoadingReport } = useGetEventReportsQuery(
    {
      page,
      eventId: selectedEvent?._id,
      searchTerm: debouncedSearch,
      status: statusFilter === "all" ? "" : statusFilter,
    },
    { skip: !selectedEvent }
  );

  const records: EventRecord[] = reportData?.data || [];

  const handleBack = () => {
    setSelectedEvent(null);
    setSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  const handleExport = (type: string) => {
    downloadReport(
      `/event-reports/event/${selectedEvent!._id}/export?type=${type}`,
      `${selectedEvent!.name}-contribution.${type}`
    );
  };

  const handlePrint = () => {
    if (tableRef.current) {
      openPrintWindow(
        `Event Contribution Report — ${selectedEvent?.name}`,
        tableRef.current.outerHTML
      );
    }
  };

  // ── Step 1: Events grid ────────────────────────────────────────────────────
  if (!selectedEvent) {
    return (
      <div className="space-y-5">
        <p className="text-sm text-gray-500 font-normal">
          Select an event below to view its contribution report.
        </p>

        {isLoadingEvents ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
        ) : events.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">No events found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => {
              const isActive = (event.status || "").toLowerCase() === "active";
              const deadline = event.eventDeadline
                ? new Date(event.eventDeadline).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
                : null;

              return (
                <div
                  key={event._id}
                  className="rounded-2xl border border-gray-100 bg-white p-5 flex flex-col gap-4 shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgb(0,0,0,0.08)] hover:border-[#F3EBE5] transition-all"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                      {event.name}
                    </h4>
                    <Badge
                      variant="outline"
                      className={`shrink-0 text-[10px] font-medium capitalize ${isActive
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-gray-50 text-gray-500 border-gray-200"
                        }`}
                    >
                      {event.status || "—"}
                    </Badge>
                  </div>

                  {/* Meta */}
                  <div className="space-y-1.5">
                    {event.eventType || event.type ? (
                      <p className="text-xs text-gray-400 font-normal">
                        Type: {event.eventType || event.type}
                      </p>
                    ) : null}
                    {deadline && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span>Deadline: {deadline}</span>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <Button
                    onClick={() => setSelectedEvent(event)}
                    className="mt-auto h-9 rounded-xl bg-[#8B2F0E] hover:bg-[#70260B] text-white text-xs font-medium shadow-sm active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Users className="w-3.5 h-3.5" />
                    View Contribution Report
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ── Step 2: Contribution report table ─────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#8B2F0E] transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="w-px h-4 bg-gray-200" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{selectedEvent.name}</h3>
          </div>
          {!isLoadingReport && (
            <div className="flex items-center gap-1.5 bg-[#F3EBE5]/60 px-2.5 py-1 rounded-lg">
              <Users className="w-3.5 h-3.5 text-[#8B2F0E]" />
              <span className="text-xs font-semibold text-[#8B2F0E]">
                {records.length} contributor{records.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
        <ExportButtons
          onExport={handleExport}
          onPrint={handlePrint}
          disabled={records.length === 0}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 h-10 bg-white border-gray-200 rounded-xl text-sm"
          />
        </div>
        <Select onValueChange={(v) => { setStatusFilter(v); setPage(1); }} value={statusFilter}>
          <SelectTrigger className="w-full py-5 sm:w-[150px] h-10 bg-white border-gray-200 rounded-xl text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl ">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <TH>Member ID</TH>
                <TH>Name</TH>
                <TH>Email</TH>
                <TH>Phone</TH>
                <TH>Amount Paid</TH>
                <TH>Penalty</TH>
                <TH>Payment Date</TH>
                <TH>Status</TH>
              </tr>
            </thead>
            {isLoadingReport ? (
              <TableSkeleton cols={8} />
            ) : records.length === 0 ? (
              <EmptyState message="No contribution records found for this event." />
            ) : (
              <tbody>
                {records.map((r, i) => (
                  <tr
                    key={`${r.email}-${i}`}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <TD className="font-mono text-xs text-gray-500">{r.memberId}</TD>
                    <TD className="font-medium text-gray-800">{r.name}</TD>
                    <TD className="text-gray-500">{r.email}</TD>
                    <TD className="text-gray-500">{r.phone}</TD>
                    <TD className="font-medium">{r.amountPaid > 0 ? `$${r.amountPaid}` : "—"}</TD>
                    <TD>{r.penaltyApplied > 0 ? `$${r.penaltyApplied}` : "—"}</TD>
                    <TD className="text-gray-500">{r.paymentDate}</TD>
                    <TD><StatusBadge status={r.status} /></TD>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

// ── B. Master Member List Report ──────────────────────────────────────────────

function MasterMemberReport() {
  const tableRef = useRef<HTMLTableElement>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data: reportData, isLoading } = useGetMasterMembersReportsQuery({ page });

  const allRecords: MasterMemberRecord[] = reportData?.data?.data || [];
  const meta = reportData?.data?.meta;

  const filtered = allRecords.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      r.name?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.phone?.includes(search);
    const matchStatus =
      statusFilter === "all" || r.status?.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleExport = (type: string) => {
    downloadReport(
      `/event-reports/get-master-members-report/export?type=${type}`,
      `master-member-list.${type}`
    );
  };

  const handlePrint = () => {
    if (tableRef.current) {
      openPrintWindow("Master Member List Report", tableRef.current.outerHTML);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 min-w-0 max-w-xs">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Search name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-white border-gray-200 rounded-xl text-sm"
            />
          </div>
          <Select onValueChange={setStatusFilter} value={statusFilter}>
            <SelectTrigger className="w-full sm:w-[150px] h-10 bg-white border-gray-200 rounded-xl text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ExportButtons onExport={handleExport} onPrint={handlePrint} />
      </div>

      <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <TH>Member ID</TH>
                <TH>Name</TH>
                <TH>Email</TH>
                <TH>Phone</TH>
                <TH>Status</TH>
                <TH>Total Paid</TH>
                <TH>Pending Balance</TH>
              </tr>
            </thead>
            {isLoading ? (
              <TableSkeleton cols={7} />
            ) : filtered.length === 0 ? (
              <EmptyState message="No members found." />
            ) : (
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={`${r.email}-${i}`} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <TD className="font-mono text-xs text-gray-500">{r.memberId}</TD>
                    <TD className="font-medium text-gray-800">{r.name}</TD>
                    <TD className="text-gray-500">{r.email}</TD>
                    <TD className="text-gray-500">{r.phone}</TD>
                    <TD><StatusBadge status={r.status} /></TD>
                    <TD className="font-medium">{r.totalPaid > 0 ? `$${r.totalPaid}` : "—"}</TD>
                    <TD>
                      {r.pendingBalance > 0 ? (
                        <span className="text-red-600 font-semibold">${r.pendingBalance}</span>
                      ) : "—"}
                    </TD>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.totalPage > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white">
            <span className="text-xs text-gray-500">
              Page {page} of {meta.totalPage} &middot; {meta.total} total
            </span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="h-8 w-8 p-0 rounded-lg"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={page === meta.totalPage}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 w-8 p-0 rounded-lg"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── C. Suspended Members Report ───────────────────────────────────────────────

function SuspendedMembersReport() {
  const tableRef = useRef<HTMLTableElement>(null);
  const [search, setSearch] = useState("");

  const { data: reportData, isLoading } = useGetSuspendMemberReportsQuery(undefined);

  const allRecords: SuspendedMemberRecord[] = reportData?.data || [];

  const filtered = allRecords.filter((r) => {
    const q = search.toLowerCase();
    return (
      !search ||
      r.name?.toLowerCase().includes(q) ||
      r.phone?.includes(search) ||
      r.email?.toLowerCase().includes(q)
    );
  });

  const handleExport = (type: string) => {
    downloadReport(
      `/event-reports/get-suspended-members-report/export?type=${type}`,
      `suspended-members-report.${type}`
    );
  };

  const handlePrint = () => {
    if (tableRef.current) {
      openPrintWindow("Suspended Members Report", tableRef.current.outerHTML);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative min-w-0 max-w-xs w-full sm:w-auto">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="Search name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 bg-white border-gray-200 rounded-xl text-sm"
          />
        </div>
        <ExportButtons onExport={handleExport} onPrint={handlePrint} />
      </div>

      <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <TH>Member ID</TH>
                <TH>Name</TH>
                <TH>Phone</TH>
                <TH>Amount Owed</TH>
                <TH>Events Owed</TH>
                <TH>Reinstatement Fee</TH>
                <TH>Total Balance</TH>
                <TH>Suspended At</TH>
              </tr>
            </thead>
            {isLoading ? (
              <TableSkeleton cols={8} />
            ) : filtered.length === 0 ? (
              <EmptyState message="No suspended members found." />
            ) : (
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={`${r.phone}-${i}`} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <TD className="font-mono text-xs text-gray-500">{r.memberId}</TD>
                    <TD className="font-medium text-gray-800">{r.name}</TD>
                    <TD className="text-gray-500">{r.phone}</TD>
                    <TD className="font-medium">{r.amountOwed > 0 ? `$${r.amountOwed}` : "—"}</TD>
                    <TD className="text-gray-500">{r.eventsOwed || "—"}</TD>
                    <TD className="font-medium">{r.reactivationFee > 0 ? `$${r.reactivationFee}` : "—"}</TD>
                    <TD>
                      {r.totalBalance > 0 ? (
                        <span className="text-red-600 font-semibold">${r.totalBalance}</span>
                      ) : "—"}
                    </TD>
                    <TD className="text-gray-500">{r.suspendedAt}</TD>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function ReportsMain() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-medium text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-1 font-normal">
          Generate, filter, and export detailed reports for events, members, and finances.
        </p>
      </div>

      <Tabs defaultValue="event-contribution" className="space-y-6">
        <TabsList className="bg-gray-100/80 p-1 rounded-xl h-auto gap-1">
          <TabsTrigger
            value="event-contribution"
            className="rounded-lg text-sm font-medium px-5 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#8B2F0E] transition-all"
          >
            Event Contribution
          </TabsTrigger>
          <TabsTrigger
            value="master-members"
            className="rounded-lg text-sm font-medium px-5 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#8B2F0E] transition-all"
          >
            Master Member List
          </TabsTrigger>
          <TabsTrigger
            value="suspended-members"
            className="rounded-lg text-sm font-medium px-5 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#8B2F0E] transition-all"
          >
            Suspended Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="event-contribution" className="mt-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)] p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900">Event Contribution Report</h2>
              <p className="text-xs text-gray-400 mt-0.5 font-normal">
                Select an event to view all member contributions — who paid, how much, and when.
              </p>
            </div>
            <EventContributionReport />
          </div>
        </TabsContent>

        <TabsContent value="master-members" className="mt-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)] p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900">Master Member List</h2>
              <p className="text-xs text-gray-400 mt-0.5 font-normal">
                Complete list of all registered MMU members with their status and balance.
              </p>
            </div>
            <MasterMemberReport />
          </div>
        </TabsContent>

        <TabsContent value="suspended-members" className="mt-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)] p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900">Suspended Members Report</h2>
              <p className="text-xs text-gray-400 mt-0.5 font-normal">
                All suspended members with outstanding balances and reinstatement requirements.
              </p>
            </div>
            <SuspendedMembersReport />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
