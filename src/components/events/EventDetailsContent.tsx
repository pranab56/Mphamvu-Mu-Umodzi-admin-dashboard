"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useDeleteEventMutation, useGetSingleEventQuery, useUpdateStatusMutation } from "@/features/event/eventApi";
import { cn } from "@/lib/utils";
import { baseURL } from "@/utils/BaseURL";
import { differenceInDays, format } from "date-fns";
import { Calendar, CheckCircle2, Clock, Edit2, FileText, Loader2, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ActionModal } from "../members/ActionModals";
import { AddEventSheet } from "./AddEventSheet";

interface EventDetailsContentProps {
  eventId: string;
}

export function EventDetailsContent({ eventId }: EventDetailsContentProps) {
  const router = useRouter();
  const { data: eventResponse, isLoading } = useGetSingleEventQuery({ id: eventId });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateStatusMutation();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const event = eventResponse?.data;
  const beneficiary = event?.beneficiary;


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4 min-h-[600px]">
        <Loader2 className="w-12 h-12 animate-spin text-[#8B2F0E]" />
        <p className="text-gray-400 font-medium text-lg">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4 min-h-[600px] text-gray-400 font-medium">
        <p>Event not found.</p>
        <Button onClick={() => router.back()} variant="ghost">Go Back</Button>
      </div>
    );
  }

  const handleStatusUpdate = async (status: string) => {
    try {
      await updateStatus({ id: eventId, data: { status } }).unwrap();
      toast.success(`Event status updated to ${status}`);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEvent({ id: eventId }).unwrap();
      toast.success("Event deleted successfully");
      router.push("/events");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to delete event");
    }
  };

  const daysRemaining = event.eventDeadline
    ? Math.max(0, differenceInDays(new Date(event.eventDeadline), new Date()))
    : 0;


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Image */}
      <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-lg border border-gray-100">
        <Image
          src={event.banner ? (event.banner.startsWith("http") ? event.banner : `${baseURL}${event.banner}`) : "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070"}
          alt={event.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        {/* Title Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-medium text-gray-900 tracking-tight">{event.name}</h2>
            <Badge className={cn(
              "border-none shadow-none px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest",
              event.status === "active" ? "bg-green-100 text-green-700" :
                event.status === "completed" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
            )}>
              {event.status}
            </Badge>
          </div>
          <Badge className="bg-[#FFF7ED] text-[#9A3412] border border-[#FFEDD5] shadow-none px-5 py-1.5 rounded-full text-sm font-medium">
            {event.eventType}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-4xl font-normal">
          {event.description}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Min Contribution", value: `$ ${event.minContribution?.toLocaleString()}`, icon: "$" },
            { label: "Target Amount", value: `$ ${event.targetContribution?.toLocaleString()}`, icon: "$" },
            { label: "Created on", value: event.createdAt ? format(new Date(event.createdAt), "MMM d, yyyy") : "N/A", icon: "calendar" },
            { label: "Deadline", value: event.eventDeadline ? format(new Date(event.eventDeadline), "MMM d, yyyy") : "N/A", icon: "calendar" },
          ].map((stat, i) => (
            <div key={i} className="bg-neutral-50/80 p-6 rounded-xl border border-neutral-100/50 shadow-sm transition-all hover:bg-white hover:shadow-md">
              <div className="flex items-center gap-2 mb-3">
                {stat.icon === "$" ? (
                  <div className="w-8 h-8 rounded-full bg-[#8B2F0E]/5 flex items-center justify-center text-[#8B2F0E] font-bold">$</div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                    <Calendar className="w-4 h-4" />
                  </div>
                )}
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Warning Box */}
        {event.status === "active" && (
          <div className={cn(
            "rounded-xl p-6 mb-10 flex items-start gap-5 shadow-sm border",
            daysRemaining <= 3 ? "bg-red-50 border-red-100" : "bg-orange-50 border-orange-100"
          )}>
            <div className={cn("p-2.5 rounded-lg mt-1 shadow-sm", daysRemaining <= 3 ? "bg-red-500" : "bg-orange-500")}>
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className={cn("font-bold text-lg", daysRemaining <= 3 ? "text-red-700" : "text-orange-700")}>
                {daysRemaining} days remaining till deadline
              </h4>
              <p className={cn("text-sm mt-1.5 opacity-80 font-medium", daysRemaining <= 3 ? "text-red-800" : "text-orange-800")}>
                Members are encouraged to contribute before the deadline of {event.eventDeadline ? format(new Date(event.eventDeadline), "PPPP") : "N/A"}.
              </p>
            </div>
          </div>
        )}

        {/* Participation Section */}
        <div className="bg-white rounded-2xl p-8 border border-neutral-100 shadow-sm space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-1 block">Community Progress</span>
                <span className="text-3xl font-bold text-gray-900">{event?.participationPercentage}%</span>
              </div>
              <p className="text-sm text-gray-400 font-medium">{event?.paidMembers}{event?.participantsCount} of {event?.totalMembers} members participated</p>
            </div>
            <Progress value={event?.participationPercentage} className="h-3 bg-gray-100 text-[#8B2F0E]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-gray-50">
            <div className="p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-2">Total Contributions</span>
              <span className="text-3xl font-bold text-[#16A34A]">$ {event.totalCollected?.toLocaleString() || "0.00"}</span>
            </div>
            <div className="p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-2">Beneficiary Share ({event?.beneficiarySharePercent}%)</span>
              <span className="text-3xl font-bold text-[#8B2F0E]">$ {((event.beneficiaryShareAmount || 0) * 0.9).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Beneficiary Details Section */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 className="text-2xl font-medium text-gray-900 mb-8 tracking-tight font-poppins">Beneficiary Details</h3>

        <div className="bg-neutral-50/50 rounded-2xl p-10 border border-neutral-100 flex flex-col lg:flex-row gap-12 items-start justify-between shadow-inner">
          <div className="flex gap-8 items-start w-full">
            <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-lg shrink-0 -rotate-3 hover:rotate-0 transition-transform duration-500">
              <Image
                src={baseURL + "/" + beneficiary?.image || "https://avatar.iran.liara.run/public/boy?username=John"}
                alt={beneficiary?.name || "Beneficiary"}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6 w-full">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-3xl font-poppins font-semibold text-gray-900">{beneficiary?.name}</h4>
                  <Badge className="bg-white text-[#B45309] border border-[#FFEDD5] font-bold px-3 py-1 rounded-lg">
                    {beneficiary?.relationship}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 mt-6">
                  <div className="flex items-center gap-3 text-gray-500 font-medium">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm"><Mail className="w-4 h-4" /></div>
                    {beneficiary?.email}
                  </div>
                  <div className="flex items-center gap-3 text-gray-500 font-medium">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm"><Phone className="w-4 h-4" /></div>
                    {beneficiary?.countryCode} {beneficiary?.contactNumber}
                  </div>
                  <div className="flex items-center gap-3 text-gray-500 font-medium">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm"><MapPin className="w-4 h-4" /></div>
                    {beneficiary?.address}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-8">
                  {beneficiary?.documents?.map((doc: string, idx: number) => (
                    <a
                      key={idx}
                      href={doc.startsWith("http") ? doc : `${baseURL}${doc}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl border border-gray-100 text-sm font-bold text-gray-700 hover:bg-gray-100 hover:text-primary transition-all shadow-sm"
                    >
                      <FileText className="w-4 h-4" />
                      Document {idx + 1}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:max-w-md w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-green-600 text-sm font-bold mb-4">
              <CheckCircle2 className="w-5 h-5 fill-green-600 text-white" />
              Verified Beneficiary
            </div>
            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Case Reason</h5>
            <p className="text-gray-600 text-sm leading-relaxed font-medium bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
              &quot;{beneficiary?.fundsReason || "No details provided."}&quot;
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-center lg:justify-end gap-5 mt-16 pt-8 border-t border-gray-50">
          <AddEventSheet
            mode="edit"
            initialData={event}
            trigger={
              <Button variant="outline" className="h-14 px-10 rounded-xl border-gray-200 text-gray-600 gap-2 font-bold hover:bg-gray-50 transition-all flex items-center shadow-sm">
                <Edit2 className="w-5 h-5" />
                Edit Event
              </Button>
            }
          />

          <ActionModal
            type="markComplete"
            isLoading={isUpdating}
            onConfirm={() => handleStatusUpdate("completed")}
            trigger={
              <Button
                disabled={event.status === "completed"}
                className="h-14 px-10 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-600/20 transition-all active:scale-95 disabled:opacity-50"
              >
                Mark as Completed
              </Button>
            }
          />

          <ActionModal
            type="closeEvent"
            isLoading={isUpdating}
            onConfirm={() => handleStatusUpdate("inactive")}
            trigger={
              <Button
                disabled={event.status !== "active"}
                className="h-14 px-10 rounded-xl bg-[#8B2F0E] hover:bg-[#70260B] text-white font-bold shadow-lg shadow-[#8B2F0E]/20 transition-all active:scale-95 disabled:opacity-50"
              >
                Close Event
              </Button>
            }
          />

          <ActionModal
            type="delete"
            isLoading={isDeleting}
            onConfirm={handleDelete}
            trigger={
              <Button className="h-14 px-10 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/20 transition-all active:scale-95">
                Delete Event
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
