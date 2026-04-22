"use client";

import { useState } from "react";
import { Send, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const PRESET_COLORS = [
  "bg-[#FFF7ED] text-[#EA580C] border-[#FFEDD5]",
  "bg-[#EFF6FF] text-[#2563EB] border-[#DBEAFE]",
  "bg-[#ECFEFF] text-[#0891B2] border-[#CFFAFE]",
  "bg-[#F0FDF4] text-[#16A34A] border-[#DCFCE7]",
];

export function EventTypes() {
  const [types, setTypes] = useState([
    { label: "Member Funeral", color: PRESET_COLORS[0] },
    { label: "Dependent Funeral", color: PRESET_COLORS[1] },
    { label: "Legal Fees", color: PRESET_COLORS[2] },
    { label: "Fundraiser", color: PRESET_COLORS[3] },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (types.some(t => t.label.toLowerCase() === trimmed.toLowerCase())) {
      setInputValue("");
      return;
    }

    setTypes([
      ...types,
      {
        label: trimmed,
        color: PRESET_COLORS[types.length % PRESET_COLORS.length],
      }
    ]);
    setInputValue("");
  };

  const handleDelete = (label: string) => {
    setTypes(types.filter((t) => t.label !== label));
  };

  return (
    <div className=" p-6 rounded-xl bg-white border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)]">
      <h2 className="text-xl font-medium text-gray-900 mb-1">Event Types</h2>
      <p className="text-sm text-gray-400 mb-6 font-normal">Type to search events</p>

      <div className="relative mb-6">
        <Input
          placeholder="Enter event type"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="h-14 pl-6 pr-16 rounded-2xl bg-neutral-100/50 border-none text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:bg-neutral-100 transition-all font-normal"
        />
        <div
          onClick={handleAdd}
          className="absolute right-4 cursor-pointer top-1/2 -translate-y-1/2 p-2 flex items-center justify-center hover:bg-neutral-200 rounded-full transition-colors group"
        >
          <Send className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors opacity-60 group-hover:opacity-100" />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {types.map((type) => (
          <Badge
            key={type.label}
            className={`${type.color} pl-5 pr-3 py-2 rounded-xl border font-normal flex items-center gap-2 text-sm shadow-none hover:opacity-90 transition-opacity cursor-default`}
          >
            <span className="select-none">{type.label}</span>
            <button
              type="button"
              onClick={() => handleDelete(type.label)}
              className="p-1 rounded-full cursor-pointer hover:bg-black/5 transition-colors group"
            >
              <X className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
            </button>
          </Badge>
        ))}

      </div>
    </div>
  );
}

