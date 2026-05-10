"use client";

import { useState } from "react";
import { MemberHeader } from "@/components/members/MemberHeader";
import { MemberStats } from "@/components/members/MemberStats";
import { MemberSearch } from "@/components/members/MemberSearch";
import { MemberTable } from "@/components/members/MemberTable";

import { cn } from "@/lib/utils";
import { DependentTable } from "@/components/members/DependentTable";

export default function MembersPage() {
    const [activeTab, setActiveTab] = useState<"members" | "dependents">("dependents");

    return (
        <div className="">
            {/* Page Header */}
            <MemberHeader />

            {/* Statistics Cards */}
            <MemberStats />

            {/* Tabs Switcher */}
            <div className="flex items-center gap-2 bg-[#E5E7EB]/40 p-1.5 rounded-lg w-fit mb-8">
                <button
                    onClick={() => setActiveTab("members")}
                    className={cn(
                        "px-8 py-2.5 rounded-sm text-base font-normal cursor-pointer transition-all duration-200",
                        activeTab === "members"
                            ? "bg-[#8B2F0E] text-white shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                    )}
                >
                    Members
                </button>
                <button
                    onClick={() => setActiveTab("dependents")}
                    className={cn(
                        "px-8 py-2.5 rounded-sm text-base font-normal cursor-pointer transition-all duration-200",
                        activeTab === "dependents"
                            ? "bg-[#8B2F0E] text-white shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                    )}
                >
                    Dependents Information
                </button>
            </div>

            {/* Content Section */}
            <div className="">
                {/* Search Bar */}
                <MemberSearch />

                {/* Data Table */}
                {activeTab === "members" ? <MemberTable /> : <DependentTable />}
            </div>
        </div>
    )
}
