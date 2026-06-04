"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Search, ChevronLeft, ChevronRight, Loader2, CalendarX } from "lucide-react";
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
import { useGetAllEventsQuery, useDeleteEventMutation } from "@/features/event/eventApi";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

interface EventSectionProps {
  title: string;
  type: "active" | "completed";
}

interface Event {
  _id: string;
  name: string;
  eventType: string;
  eventTypeId: string;
  description: string;
  minContribution: number;
  targetContribution: number;
  eventDeadline: string;
  banner: string;
  createdAt: string;
  updatedAt: string;
  totalContributions?: number;
  beneficiary: {
    name: string;
    email: string;
    relationship: string;
    contactNumber: string;
    countryCode: string;
    address: string;
    image: string;
    fundsReason: string;
  };
}

export function EventSection({ title, type }: EventSectionProps) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  
  const { data: eventsResponse, isLoading } = useGetAllEventsQuery({ status: type, page });
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const meta = eventsResponse?.meta;

  const filteredEvents = useMemo(() => {
    const events = (eventsResponse?.data as Event[]) || [];
    if (!searchTerm) return events;
    return events.filter((e: Event) => 
      e.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      e.eventType?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [eventsResponse?.data, searchTerm]);

  const handleDelete = async (id: string) => {
    try {
      await deleteEvent({ id }).unwrap();
      toast.success("Event deleted successfully");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to delete event");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (meta?.totalPage || 1)) {
      setPage(newPage);
    }
  };

  return (
    <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-gray-900">{title}</h2>
        {isLoading && <Loader2 className="w-5 h-5 animate-spin text-[#8B2F0E]" />}
      </div>
      
      {/* Search Bar */}
      <div className="relative mb-8 w-full">
        <Input 
          placeholder="Search event..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-12 pl-12 rounded-sm bg-neutral-100 border-none text-sm placeholder:text-gray-400 focus-visible:ring-0"
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#8B2F0E]" />
            <p className="text-gray-400 font-medium">Loading {type} events...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-[#E5D5C9]/30 text-gray-500 font-normal text-sm">
              <tr>
                <th className="px-6 py-4 font-normal rounded-l-xl">Event Name</th>
                <th className="px-6 py-4 font-normal">Type</th>
                {type === "active" && <th className="px-6 py-4 font-normal text-center">Target Amount</th>}
                <th className="px-6 py-4 font-normal text-center">Participation</th>
                <th className="px-6 py-4 font-normal text-center">{type === "active" ? "Deadline" : "Completed Date"}</th>
                <th className="px-6 py-4 font-normal rounded-r-xl text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredEvents.map((event: Event) => (
                <tr key={event._id} className="group hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="text-gray-800 font-medium text-base">{event.name}</span>
                      <span className="text-xs text-gray-400 mt-1">
                        Created {event.createdAt ? format(new Date(event.createdAt), "MMM d, yyyy") : "Recently"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-gray-500 text-sm">
                    <span className="px-3 py-1 bg-gray-50 rounded-full border border-gray-100">{event.eventType}</span>
                  </td>
                  {type === "active" && (
                    <td className="px-6 py-6 text-center font-bold text-[#8B2F0E]">
                      $ {event.targetContribution?.toLocaleString()}
                    </td>
                  )}
                  <td className="px-6 py-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-semibold text-gray-800">
                        {/* Dummy calculation if needed, or mapping from API if available */}
                        {event.totalContributions || 0}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">Members</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center font-normal text-gray-500 text-sm">
                     {format(new Date(type === "active" ? (event.eventDeadline || event.createdAt) : (event.updatedAt || event.createdAt)), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-6 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full">
                          <MoreVertical className="h-4 w-4 text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl p-2 border shadow-xl min-w-[140px] border-gray-100">
                        <DropdownMenuItem 
                          onClick={() => router.push(`/events/${event._id}`)}
                          className="rounded-lg cursor-pointer hover:bg-gray-50 px-4 py-2.5 font-medium transition-colors"
                        >
                          View Details
                        </DropdownMenuItem>
                        {type === "active" && (
                          <AddEventSheet 
                            mode="edit"
                            initialData={event}
                            trigger={
                              <DropdownMenuItem 
                                onSelect={(e) => e.preventDefault()}
                                className="rounded-lg cursor-pointer hover:bg-gray-50 px-4 py-2.5 font-medium hover:text-primary transition-colors"
                              >
                                Edit Event
                              </DropdownMenuItem>
                            }
                          />
                        )}
                        <ActionModal 
                          type="delete"
                          isLoading={isDeleting}
                          onConfirm={() => handleDelete(event._id)}
                          trigger={
                            <DropdownMenuItem 
                              onSelect={(e) => e.preventDefault()}
                              className="rounded-lg cursor-pointer hover:bg-gray-50 px-4 py-2.5 font-medium text-red-500 hover:text-red-600 outline-none transition-colors"
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
        ) : (
          <div className="flex flex-col items-center justify-center p-20 gap-4 text-gray-400">
            <CalendarX className="w-12 h-12 opacity-20" />
            <p className="font-medium text-lg">No {type} events found.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!searchTerm && meta && meta.total > 0 && (
        <div className="flex justify-between items-center mt-10">
          <p className="text-sm text-gray-400 font-medium">
            Showing {(page - 1) * meta.limit + 1} - {Math.min(page * meta.limit, meta.total)} of {meta.total} events
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="h-10 w-10 p-0 rounded-full bg-gray-100/50 hover:bg-gray-200"
            >
              <ChevronLeft className="h-5 w-5 text-gray-400" />
            </Button>
            
            {/* Simple range pagination */}
            {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant="ghost"
                onClick={() => setPage(p)}
                className={`h-10 w-10 p-0 rounded-full text-base transition-all ${
                  p === page ? "bg-[#8B2F0E] text-white hover:bg-[#8B2F0E] shadow-sm transform scale-110" : "text-gray-400 hover:bg-gray-100"
                }`}
              >
                {p}
              </Button>
            ))}

            <Button 
              variant="ghost" 
              disabled={page === meta.totalPage}
              onClick={() => handlePageChange(page + 1)}
              className="h-10 w-10 p-0 rounded-full bg-gray-100/50 hover:bg-gray-200"
            >
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
