"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface MemberDetailInfoProps {
  userId: string;
  userName?: string;
}

export function MemberDetailInfo({ userId: _userId, userName }: MemberDetailInfoProps) {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex items-center gap-6">
        <Link href="/members" className="hover:bg-gray-100 p-2 rounded-full transition-all active:scale-90">
          <ArrowLeft className="w-8 h-8 text-gray-700" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1C21] tracking-tight">Member Information</h1>
          <p className="text-base text-gray-500 mt-0.5">{userName || "Loading..."}&apos;s Details</p>
        </div>
      </div>
    </div>
  );
}
