"use client";

import { MoreVertical } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

const events = [
  {
    name: "Support for Banda Family",
    date: "Apr 2, 2026",
    type: "Funeral",
    collected: "$ 9,250",
    participation: "100%",
    completed: "Apr 10, 2026",
  },
  {
    name: "Support for Banda Family",
    date: "Apr 2, 2026",
    type: "Funeral",
    collected: "$ 9,250",
    participation: "100%",
    completed: "Apr 10, 2026",
  },
  {
    name: "Support for Banda Family",
    date: "Apr 2, 2026",
    type: "Funeral",
    collected: "$ 9,250",
    participation: "100%",
    completed: "Apr 10, 2026",
  },
  {
    name: "Support for Banda Family",
    date: "Apr 2, 2026",
    type: "Funeral",
    collected: "$ 9,250",
    participation: "100%",
    completed: "Apr 10, 2026",
  },
];

export default function RecentEvents() {
  return (
    <div className="bg-white rounded-xl shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] overflow-hidden mt-8">
      <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
        <h3 className="text-xl font-bold text-[#1A1C1F]">Recent Events</h3>
        <Link href="/events" className="text-[14px] font-bold text-[#16A34A] hover:underline">
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#DED2CD]">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="py-4 text-[#1A1C1F] font-bold">Event Name</TableHead>
              <TableHead className="py-4 text-[#1A1C1F] font-bold">Type</TableHead>
              <TableHead className="py-4 text-[#1A1C1F] font-bold">Total Collected</TableHead>
              <TableHead className="py-4 text-[#1A1C1F] font-bold">Participation</TableHead>
              <TableHead className="py-4 text-[#1A1C1F] font-bold">Completed</TableHead>
              <TableHead className="py-4 text-[#1A1C1F] font-bold text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event, i) => (
              <TableRow key={i} className="hover:bg-gray-50/50 border-b border-gray-100">
                <TableCell className="py-4 flex flex-col gap-0.5">
                  <span className="font-bold text-[#1A1C1F]">{event.name}</span>
                  <span className="text-xs text-gray-500 font-medium">Created {event.date}</span>
                </TableCell>
                <TableCell className="py-4 text-gray-500 font-semibold">{event.type}</TableCell>
                <TableCell className="py-4 text-[#1A1C1F] font-bold">{event.collected}</TableCell>
                <TableCell className="py-4 text-[#1A1C1F] font-bold">{event.participation}</TableCell>
                <TableCell className="py-4 text-gray-500 font-semibold">{event.completed}</TableCell>
                <TableCell className="py-4 text-right pr-6">
                  <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
