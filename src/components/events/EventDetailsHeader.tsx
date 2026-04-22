"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function EventDetailsHeader() {
  const router = useRouter();

  return (
    <div className="flex items-start gap-4 mb-8">
      <button 
        onClick={() => router.back()}
        className="mt-1 p-2 hover:bg-gray-100 cursor-pointer rounded-full transition-colors active:scale-95 text-gray-500"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <div>
        <h1 className="text-2xl font-medium text-gray-900 tracking-tight">Event Information</h1>
        <p className="text-sm text-gray-500 mt-1 font-normal">Support for Banda Family event details</p>
      </div>
    </div>
  );
}
