"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  useCreateEventTypesMutation,
  useDeleteEventTypeMutation,
  useGetAllEventTypesQuery
} from "@/features/event/eventTypesApi";
import { Loader2, Send, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface EventTypeItem {
  _id: string;
  name: string;
}

const PRESET_COLORS = [
  "bg-[#FFF7ED] text-[#EA580C] border-[#FFEDD5]",
  "bg-[#EFF6FF] text-[#2563EB] border-[#DBEAFE]",
  "bg-[#ECFEFF] text-[#0891B2] border-[#CFFAFE]",
  "bg-[#F0FDF4] text-[#16A34A] border-[#DCFCE7]",
];

export function EventTypes() {
  const { data: eventTypesResponse, isLoading: isFetching } = useGetAllEventTypesQuery(undefined);
  const [createEventType, { isLoading: isCreating }] = useCreateEventTypesMutation();
  const [deleteEventType, { isLoading: isDeleting }] = useDeleteEventTypeMutation();

  const [inputValue, setInputValue] = useState("");

  const types = eventTypesResponse?.data || [];

  const handleAdd = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isCreating) return;

    if (types.some((t: EventTypeItem) => t.name.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Event type already exists");
      return;
    }

    try {
      await createEventType({ data: { name: trimmed } }).unwrap();
      toast.success("Event type added successfully");
      setInputValue("");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to add event type");
    }
  };

  const handleDelete = async (id: string) => {
    if (isDeleting) return;
    try {
      await deleteEventType({ id }).unwrap();
      toast.success("Event type deleted successfully");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to delete event type");
    }
  };

  return (
    <div className=" p-6 rounded-xl bg-white border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)]">
      <h2 className="text-xl font-medium text-gray-900 mb-1">Event Types</h2>
      <p className="text-sm text-gray-400 mb-6 font-normal">Manage event categories</p>

      <div className="relative mb-6">
        <Input
          placeholder="Enter event type"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          disabled={isCreating}
          className="h-14 pl-6 pr-16 rounded-2xl bg-neutral-100/50 border-none text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:bg-neutral-100 transition-all font-normal"
        />
        <div
          onClick={handleAdd}
          className="absolute right-4 cursor-pointer top-1/2 -translate-y-1/2 p-2 flex items-center justify-center hover:bg-neutral-200 rounded-full transition-colors group"
        >
          {isCreating ? (
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          ) : (
            <Send className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors opacity-60 group-hover:opacity-100" />
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {isFetching ? (
          <div className="flex items-center gap-2 text-gray-400 py-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading types...</span>
          </div>
        ) : types.length > 0 ? (
          types.map((type: EventTypeItem, index: number) => (
            <Badge
              key={type._id}
              className={`${PRESET_COLORS[index % PRESET_COLORS.length]} pl-5 pr-3 py-2 rounded-xl border font-normal flex items-center gap-2 text-sm shadow-none hover:opacity-90 transition-opacity cursor-default`}
            >
              <span className="select-none">{type.name}</span>
              <button
                type="button"
                onClick={() => handleDelete(type._id)}
                className="p-1 rounded-full cursor-pointer hover:bg-black/5 transition-colors group disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </Badge>
          ))
        ) : (
          <p className="text-sm text-gray-400 py-4">No event types found.</p>
        )}
      </div>
    </div>
  );
}

