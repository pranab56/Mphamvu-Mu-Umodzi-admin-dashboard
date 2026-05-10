"use client";

import { FileText, X, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const dependents = [
  {
    memberId: "MMU-2024-0234",
    memberName: "John Banda",
    dependentName: "Tendal Mbeki",
    contact: "+213 45 4 5545",
    relationship: "Son",
    documents: ["NID.pdf", "NID.pdf"],
    status: "Pending",
  },
  {
    memberId: "MMU-2024-0234",
    memberName: "John Banda",
    dependentName: "Tendal Mbeki",
    contact: "+213 45 4 5545",
    relationship: "Son",
    documents: ["NID.pdf", "NID.pdf"],
    status: "Pending",
  },
  {
    memberId: "MMU-2024-0234",
    memberName: "John Banda",
    dependentName: "Tendal Mbeki",
    contact: "+213 45 4 5545",
    relationship: "Son",
    documents: ["NID.pdf", "NID.pdf"],
    status: "Pending",
  },
  {
    memberId: "MMU-2024-0234",
    memberName: "John Banda",
    dependentName: "Tendal Mbeki",
    contact: "+213 45 4 5545",
    relationship: "Son",
    documents: ["NID.pdf", "NID.pdf"],
    status: "Pending",
  },
  {
    memberId: "MMU-2024-0234",
    memberName: "John Banda",
    dependentName: "Tendal Mbeki",
    contact: "+213 45 4 5545",
    relationship: "Son",
    documents: ["NID.pdf", "NID.pdf"],
    status: "Pending",
  },
  {
    memberId: "MMU-2024-0234",
    memberName: "John Banda",
    dependentName: "Tendal Mbeki",
    contact: "+213 45 4 5545",
    relationship: "Son",
    documents: ["NID.pdf", "NID.pdf"],
    status: "Pending",
  },
  {
    memberId: "MMU-2024-0234",
    memberName: "John Banda",
    dependentName: "Tendal Mbeki",
    contact: "+213 45 4 5545",
    relationship: "Son",
    documents: ["NID.pdf", "NID.pdf"],
    status: "Pending",
  },
];

export function DependentTable() {
  return (
    <div className="w-full overflow-hidden rounded-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#E5D5C9] text-gray-700">
              <th className="px-6 py-5 font-medium text-sm">Member Name</th>
              <th className="px-6 py-5 font-medium text-sm">Dependent Name</th>
              <th className="px-6 py-5 font-medium text-sm">Contact</th>
              <th className="px-6 py-5 font-medium text-sm">Relationship</th>
              <th className="px-6 py-5 font-medium text-sm">Documents</th>
              <th className="px-6 py-5 font-medium text-sm">Status</th>
              <th className="px-6 py-5 font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {dependents.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="font-normal text-gray-900 text-lg">{item.memberName}</span>
                    <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{item.memberId}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-gray-900 font-normal text-lg">{item.dependentName}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-gray-900 font-normal">{item.contact}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-gray-900 font-normal">{item.relationship}</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-2">
                    {item.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-100 w-fit">
                        <div className="bg-red-50 p-1 rounded">
                          <FileText className="w-4 h-4 text-red-500" />
                        </div>
                        <span className="text-sm text-gray-600 font-normal">{doc}</span>
                        <X className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-600" />
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-yellow-600 font-normal text-sm bg-yellow-50/50 px-3 py-1.5 rounded-full w-fit">
                    <Clock className="w-4 h-4" />
                    {item.status}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 rounded-lg border border-green-200 bg-green-50 text-green-600 text-sm font-medium hover:bg-green-100 transition-colors">
                      Approved
                    </button>
                    <button className="px-4 py-2 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors">
                      Rejected
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination component (matching MemberTable style) */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#E5D5C9] px-6 py-6 rounded-b-2xl border-t border-gray-100 gap-4 mt-0">
        <p className="text-sm font-normal text-gray-600">
          Showing 1 - 10 of 842 users
        </p>

        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-gray-600 shadow-sm transition-colors cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
          </button>

          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full text-sm font-normal shadow-sm transition-all cursor-pointer",
                page === 1
                  ? "bg-[#8B2F0E] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              )}
            >
              {page}
            </button>
          ))}

          <span className="px-2 text-gray-400 font-normal">...</span>

          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-600 font-normal shadow-sm hover:bg-gray-50 cursor-pointer">
            25
          </button>

          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-gray-600 shadow-sm transition-colors cursor-pointer">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
