"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUpdateMemberByAdminMutation } from "@/features/createAdmin/createAdminApi";
import { useGetAllUsersQuery, useUpdateStatusMutation } from "@/features/members/membersApi";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  Eye,
  Loader2,
  UserX
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface Member {
  _id: string;
  memberId?: string;
  name?: string;
  email?: string;
  phone?: string;
  countryCode?: string;
  image?: string;
  address?: string;
  createdAt?: string;
  contributedBalance?: number;
  contributedEvents?: number;
  status: string;
  isSuspended?: boolean;
  isDeleted?: boolean;
}

interface MemberTableProps {
  searchTerm?: string;
}

interface EditFormState {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  address: string;
  status: string;
}

const STATUS_FILTERS = [
  { key: "all", label: "All Members" },
  { key: "active", label: "Active" },
  { key: "suspended", label: "Suspended" },
  { key: "blocked", label: "Removed" },
] as const;

function getMemberStatus(member: Member): string {
  if (member.isSuspended) return "suspended";
  return member.status || "active";
}

export function MemberTable({ searchTerm = "" }: MemberTableProps) {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: usersResponse, isLoading, refetch } = useGetAllUsersQuery({ page });
  const [updateMember, { isLoading: isUpdatingDetails }] = useUpdateMemberByAdminMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateStatusMutation();

  const isUpdating = isUpdatingDetails || isUpdatingStatus;

  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [formData, setFormData] = useState<EditFormState>({
    name: "",
    email: "",
    phone: "",
    countryCode: "",
    address: "",
    status: "active",
  });
  const [updateError, setUpdateError] = useState<string | null>(null);

  const meta = usersResponse?.meta;

  const filteredMembers = useMemo(() => {
    const members: Member[] = usersResponse?.data || [];

    const byStatus = statusFilter === "all"
      ? members
      : members.filter((m) => getMemberStatus(m) === statusFilter);

    if (!searchTerm) return byStatus;

    const q = searchTerm.toLowerCase();
    return byStatus.filter(
      (m) =>
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.phone?.includes(q) ||
        m._id?.toLowerCase().includes(q) ||
        m.memberId?.toLowerCase().includes(q)
    );
  }, [usersResponse?.data, statusFilter, searchTerm]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (meta?.totalPage || 1)) {
      setPage(newPage);
    }
  };

  const handleEditClick = (member: Member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || "",
      email: member.email || "",
      phone: member.phone || "",
      countryCode: member.countryCode || "",
      address: member.address || "",
      status: getMemberStatus(member),
    });
    setUpdateError(null);
    setIsSheetOpen(true);
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
    setEditingMember(null);
    setUpdateError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    setUpdateError(null);

    try {
      // Update member details

      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("countryCode", formData.countryCode);
      data.append("status", formData.status);
      await updateMember({
        id: editingMember._id,
        data: data
      }).unwrap();
      await refetch();
      handleSheetClose();
    } catch (error) {
      setUpdateError("Failed to update member. Please try again.");
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
    <>
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => { setStatusFilter(f.key); setPage(1); }}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all border cursor-pointer",
              statusFilter === f.key
                ? "bg-[#8B2F0E] text-white border-[#8B2F0E] shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#8B2F0E] hover:text-[#8B2F0E]"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="w-full overflow-hidden rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto mobile-scroll-container">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#E5D5C9] text-gray-700">
                <th className="px-5 py-4 font-medium text-sm whitespace-nowrap">Member ID</th>
                <th className="px-5 py-4 font-medium text-sm">Name</th>
                <th className="px-5 py-4 font-medium text-sm">Email</th>
                <th className="px-5 py-4 font-medium text-sm whitespace-nowrap">Phone Number</th>
                <th className="px-5 py-4 font-medium text-sm">Status</th>
                <th className="px-5 py-4 font-medium text-sm">Balance</th>
                <th className="px-5 py-4 font-medium text-sm whitespace-nowrap">Events</th>
                <th className="px-5 py-4 font-medium text-sm text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member: Member) => (
                  <tr
                    key={member._id}
                    className="hover:bg-gray-50/50 transition-all duration-200"
                  >
                    {/* Member ID */}
                    <td className="px-5 py-4">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded">
                        {member.memberId || member._id.slice(-6).toUpperCase()}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="px-5 py-4">
                      <span className="font-medium text-gray-900">{member.name || "—"}</span>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4">
                      <span className="text-gray-600 text-sm">{member.email || "—"}</span>
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-4">
                      <span className="text-gray-700 text-sm whitespace-nowrap">
                        {member.countryCode && member.phone
                          ? `${member.countryCode} ${member.phone}`
                          : member.phone || "—"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={getMemberStatus(member)} />
                    </td>

                    {/* Balance */}
                    <td className="px-5 py-4">
                      <span className="font-semibold text-gray-900">
                        ${(member.contributedBalance ?? 0).toFixed(2)}
                      </span>
                    </td>

                    {/* Events */}
                    <td className="px-5 py-4">
                      <span className="text-gray-700 font-medium">
                        {member.contributedEvents ?? 0}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <Link
                          href={`/members/${member._id}`}
                          className="p-2.5 hover:bg-orange-50 cursor-pointer rounded-full transition-all inline-flex text-[#8B2F0E] hover:text-[#70260B] border border-transparent hover:border-orange-100 shadow-sm"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleEditClick(member)}
                          className="p-2.5 hover:bg-orange-50 cursor-pointer rounded-full transition-all inline-flex text-[#8B2F0E] hover:text-[#70260B] border border-transparent hover:border-orange-100 shadow-sm"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center text-gray-500 font-medium">
                    {searchTerm || statusFilter !== "all"
                      ? "No members match your filter."
                      : "No members found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!searchTerm && (
          <div className="flex flex-col md:flex-row justify-between items-center bg-[#E5D5C9] px-6 py-5 rounded-b-xl border-t border-gray-100 gap-4">
            <p className="text-sm font-medium text-gray-600">
              Showing {(page - 1) * (meta?.limit || 10) + 1}–
              {Math.min(page * (meta?.limit || 10), meta?.total || 0)} of{" "}
              {meta?.total || 0} members
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-[#8B2F0E] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: meta?.totalPage || 1 }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={cn(
                    "w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold shadow-sm transition-all cursor-pointer",
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
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-[#8B2F0E] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Member Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={handleSheetClose}>
        <SheetContent className="w-full sm:max-w-[500px] overflow-y-auto p-6">
          <SheetHeader className="mb-6 pb-4 border-b border-gray-100 p-0">
            <SheetTitle className="text-xl font-bold text-[#1A1C21] p-0">
              Edit Member
            </SheetTitle>
            {editingMember && (
              <p className="text-sm text-gray-500 mt-0.5">
                ID:{" "}
                <span className="font-mono font-semibold text-gray-700">
                  {editingMember.memberId || editingMember._id.slice(-6).toUpperCase()}
                </span>
              </p>
            )}
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal Info Section */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Personal Information
              </p>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Enter full name"
                    className="h-10 border-gray-200 focus-visible:ring-[#8B2F0E]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    placeholder="Enter email address"
                    className="h-10 border-gray-200 focus-visible:ring-[#8B2F0E]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="countryCode" className="text-sm font-medium text-gray-700">
                      Code
                    </Label>
                    <Input
                      id="countryCode"
                      value={formData.countryCode}
                      onChange={(e) => setFormData((p) => ({ ...p, countryCode: e.target.value }))}
                      placeholder="+1"
                      className="h-10 border-gray-200 focus-visible:ring-[#8B2F0E]"
                    />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="Enter phone number"
                      className="h-10 border-gray-200 focus-visible:ring-[#8B2F0E]"
                    />
                  </div>
                </div>


              </div>
            </div>

            {/* Status Section */}
            <div>
              <p className="text-xs font-semibold w-full text-gray-400 uppercase tracking-widest mb-3">
                Account Status
              </p>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData((p) => ({ ...p, status: v }))}
              >
                <SelectTrigger className="h-10 border-gray-200 w-full py-5 focus:ring-[#8B2F0E]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {updateError && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md border border-red-100">
                {updateError}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={handleSheetClose}
                className="flex-1 h-10 border-gray-200 cursor-pointer"
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-10 bg-[#8B2F0E] hover:bg-[#70260B] text-white cursor-pointer"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    active: { label: "Active", color: "text-[#22C55E] bg-green-50", icon: CheckCircle2 },
    suspended: { label: "Suspended", color: "text-[#F59E0B] bg-amber-50", icon: AlertTriangle },
    blocked: { label: "Removed", color: "text-[#EF4444] bg-red-50", icon: UserX },
    reinstatement_pending: { label: "Reinstatement Pending", color: "text-[#6366F1] bg-indigo-50", icon: Clock },
  };

  const config = map[status] ?? map.active;
  const Icon = config.icon;

  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-xs whitespace-nowrap", config.color)}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </div>
  );
}
