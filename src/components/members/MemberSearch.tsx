"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MemberSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function MemberSearch({ value, onChange }: MemberSearchProps) {
  return (
    <div className="bg-white p-4 rounded-xl mb-8 border border-gray-100">
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search here..."
          className="pl-12 pr-4 py-8 w-full bg-[#E5E7EB]/50 border-none rounded-xl text-gray-700 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-[#8B2F0E]/20 text-lg font-normal"
        />
      </div>
    </div>
  );
}

