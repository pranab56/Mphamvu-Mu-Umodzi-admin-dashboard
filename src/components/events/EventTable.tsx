"use client";

import { useRouter } from "next/navigation";
import { MoreVertical, Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ActionModal } from "../members/ActionModals";
import { AddEventSheet } from "./AddEventSheet";

interface EventItem {
  id: string;
  name: string;
  date: string;
  type: string;
  targetAmount?: string;
  collected?: string;
  participation: string;
  deadline?: string;
  completedAt?: string;
}

interface EventSectionProps {
  title: string;
  events: EventItem[];
  type: "active" | "completed";
}

export function EventSection({ title, events, type }: EventSectionProps) {
  const isActive = type === "active";
  const router = useRouter();

  return (
    <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)]">
      <h2 className="text-xl font-medium text-gray-900 mb-6">{title}</h2>
      
      {/* Search Bar */}
      <div className="relative mb-8 w-full">
        <Input 
          placeholder="Search event..." 
          className="h-12 pl-12 rounded-sm bg-neutral-100 border-none text-sm placeholder:text-gray-400 focus-visible:ring-0"
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#E5D5C9]/30 text-gray-500 font-normal text-sm">
            <tr>
              <th className="px-6 py-4 font-normal rounded-l-xl">Event Name</th>
              <th className="px-6 py-4 font-normal">Type</th>
              {isActive && <th className="px-6 py-4 font-normal text-center">Targeted Amount</th>}
              <th className="px-6 py-4 font-normal text-center">Total Collected</th>
              <th className="px-6 py-4 font-normal text-center">Participation</th>
              <th className="px-6 py-4 font-normal text-center">{isActive ? "Deadline" : "Completed"}</th>
              <th className="px-6 py-4 font-normal rounded-r-xl text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {events.map((event) => (
              <tr key={event.id} className="group hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-6">
                  <div className="flex flex-col">
                    <span className="text-gray-800 font-normal text-base">{event.name}</span>
                    <span className="text-xs text-gray-400 mt-1">Created {event.date}</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-gray-500 text-sm">{event.type}</td>
                {isActive && (
                  <td className="px-6 py-6 text-center font-normal text-gray-800">
                    {event.targetAmount}
                  </td>
                )}
                <td className="px-6 py-6 text-center font-normal text-gray-800">
                  {event.collected}
                </td>
                <td className="px-6 py-6 text-center font-normal text-gray-800">
                   {event.participation}
                </td>
                <td className="px-6 py-6 text-center font-normal text-gray-500 text-sm">
                   {isActive ? event.deadline : event.completedAt}
                </td>
                <td className="px-6 py-6 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full">
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl p-2 border-none shadow-xl min-w-[120px]">
                      <DropdownMenuItem 
                        onClick={() => router.push(`/events/${event.id}`)}
                        className="rounded-lg cursor-pointer hover:bg-gray-50 px-4 py-2 font-normal"
                      >
                        View
                      </DropdownMenuItem>
                      {isActive && (
                        <AddEventSheet 
                          mode="edit"
                          initialData={{
                            eventName: event.name,
                            eventType: event.type.toLowerCase(),
                          }}
                          trigger={
                            <DropdownMenuItem 
                              onSelect={(e) => e.preventDefault()}
                              className="rounded-lg cursor-pointer hover:bg-gray-50 px-4 py-2 font-normal hover:text-primary"
                            >
                              Edit
                            </DropdownMenuItem>
                          }
                        />
                      )}
                      <ActionModal 
                        type="delete"
                        trigger={
                          <DropdownMenuItem 
                            onSelect={(e) => e.preventDefault()}
                            className="rounded-lg cursor-pointer hover:bg-gray-50 px-4 py-2 font-normal text-red-500 hover:text-red-600 outline-none"
                          >
                            Delete
                          </DropdownMenuItem>
                        }
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-10">
        <p className="text-sm text-gray-400 font-normal">Showing 1 - {events.length} of 42 events</p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="h-10 w-10 p-0 rounded-full bg-gray-100/50 hover:bg-gray-200">
            <ChevronLeft className="h-5 w-5 text-gray-400" />
          </Button>
          {[1, 2, 3, "...", 15].map((page, i) => (
            <Button
              key={i}
              variant="ghost"
              className={`h-10 w-10 p-0 rounded-full text-base ${
                page === 1 ? "bg-[#8B2F0E] text-white hover:bg-[#8B2F0E]" : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              {page}
            </Button>
          ))}
          <Button variant="ghost" className="h-10 w-10 p-0 rounded-full bg-gray-100/50 hover:bg-gray-200">
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Button>
        </div>
      </div>
    </div>
  );
}
