"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function MemberSearch() {
  return (
    <div className="bg-white p-4 rounded-xl mb-8 border border-gray-100">
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search members by name or ID..."
          className="pl-12 pr-4 py-6 w-full bg-[#E5E7EB]/50 border-none rounded-xl text-gray-700 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-[#8B2F0E]/20"
        />
      </div>
    </div>
  );
}

