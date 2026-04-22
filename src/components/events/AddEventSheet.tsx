"use client";

import React, { useState } from "react";
import { Plus, Image as ImageIcon, Calendar as CalendarIcon, MapPin, Upload } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const eventSchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  eventType: z.string().min(1, "Please select an event type"),
  description: z.string().min(1, "Description is required"),
  minContribution: z.string().min(1, "Minimum contribution is required"),
  deadline: z.date({ message: "A deadline is required" }),
  coverImage: z.any().optional(),
  beneficiaryName: z.string().min(1, "Beneficiary name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  address: z.string().min(1, "Address is required"),
  profileImage: z.any().optional(),
  documents: z.any().optional(),
  fundReason: z.string().min(1, "Fund reason is required"),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface AddEventSheetProps {
  trigger?: React.ReactNode;
  mode?: "add" | "edit";
  initialData?: Partial<EventFormValues>;
}

export function AddEventSheet({ trigger, mode = "add", initialData }: AddEventSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData || {
      relationship: "member",
    }
  });

  const onSubmit = (data: EventFormValues) => {
    console.log(`${isEdit ? "Update" : "Create"} Event Data:`, data);
    setIsOpen(false);
    reset();
  };

  const coverImage = watch("coverImage");
  const profileImage = watch("profileImage");
  const documents = watch("documents");

  // Helper to generate preview URL
  const getPreview = (files: FileList | string | null | undefined) => {
    if (!files || (files instanceof FileList && files.length === 0)) return null;
    try {
      if (files instanceof FileList) {
        return URL.createObjectURL(files[0]);
      }
      return files; // Assume it's a string URL
    } catch {
      return null;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button className="bg-[#8B2F0E] hover:bg-[#70260B] text-white rounded-xl px-10 py-6 flex items-center gap-2 text-sm font-medium shadow-md transition-all active:scale-95">
            <Plus className="w-5 h-5 stroke-[3px]" />
            Create Event
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="sm:max-w-[700px] p-0 border-l-0 bg-[#F9FAFB]">
        <ScrollArea className="h-full">
          <form onSubmit={handleSubmit(onSubmit)} className="p-8">
            <SheetHeader className="mb-8 p-0">
              <SheetTitle className="text-2xl font-medium text-gray-900">
                {isEdit ? "Edit Event" : "Create a New Event"}
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-10">
              {/* Event Details Section */}
              <section className="space-y-6">
                <h3 className="text-xl font-medium text-[#8B2F0E] tracking-tight">Event Details</h3>
                <div className="grid grid-cols-1 gap-6 border p-5 rounded-lg bg-gray-100 border-gray-300">
                  <div className="space-y-2">
                    <Label className="text-sm font-normal text-gray-700">Event Name</Label>
                    <Input
                      {...register("eventName")}
                      placeholder="Enter the event name"
                      className={cn("h-12 bg-white border-gray-200 rounded-xl", errors.eventName && "border-red-500")}
                    />
                    {errors.eventName && <p className="text-red-500 text-xs mt-1">{errors.eventName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-normal text-gray-700">Event Type</Label>
                    <Controller
                      name="eventType"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={cn("h-12 w-full py-6 bg-white border-gray-200 rounded-xl", errors.eventType && "border-red-500")}>
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="funeral">Funeral</SelectItem>
                            <SelectItem value="legal">Legal Fees</SelectItem>
                            <SelectItem value="fundraiser">Fundraiser</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.eventType && <p className="text-red-500 text-xs mt-1">{errors.eventType.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-normal text-gray-700">Cover Image</Label>
                    <div
                      onClick={() => document.getElementById("cover-upload")?.click()}
                      className={cn(
                        "border-2 border-dashed border-gray-200 rounded-2xl bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group relative overflow-hidden h-48",
                        errors.coverImage && "border-red-500 bg-red-50/10"
                      )}
                    >
                      <input
                        type="file"
                        id="cover-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setValue("coverImage", e.target.files)}
                      />
                      {getPreview(coverImage) ? (
                        <div className="relative w-full h-full group">
                          <Image
                            src={getPreview(coverImage)!}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-sm font-medium">Change Image</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                          <span className="text-xs text-gray-400">Click to upload cover image</span>
                        </div>
                      )}
                    </div>
                    {errors.coverImage && <p className="text-red-500 text-xs mt-1">{errors.coverImage.message?.toString()}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-normal text-gray-700">Description</Label>
                    <Textarea
                      {...register("description")}
                      placeholder="Enter event description"
                      className={cn("min-h-[120px] bg-white border-gray-200 rounded-xl py-4 resize-none", errors.description && "border-red-500")}
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-normal text-gray-700">Min Contribution</Label>
                      <Input
                        {...register("minContribution")}
                        placeholder="e.g., $ 30"
                        className={cn("h-12 bg-white border-gray-200 rounded-xl", errors.minContribution && "border-red-500")}
                      />
                      {errors.minContribution && <p className="text-red-500 text-xs mt-1">{errors.minContribution.message}</p>}
                    </div>
                    <div className="space-y-2 font-poppins">
                      <Label className="text-sm font-normal text-gray-700 font-inter">Event Deadline</Label>
                      <Controller
                        name="deadline"
                        control={control}
                        render={({ field }) => (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className={cn(
                                  "w-full h-12 px-4 text-left font-normal bg-white border-gray-200 rounded-xl justify-between flex items-center",
                                  !field.value && "text-muted-foreground",
                                  errors.deadline && "border-red-500"
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick event deadline</span>}
                                <CalendarIcon className="h-5 w-5 text-gray-400" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-xl overflow-hidden" align="end">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        )}
                      />
                      {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline.message}</p>}
                    </div>
                  </div>
                </div>
              </section>

              {/* Beneficiary Details Section */}
              <section className="space-y-6">
                <h3 className="text-xl font-medium text-[#8B2F0E] tracking-tight">Beneficiary Details</h3>
                <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-normal text-gray-700">Full Name</Label>
                      <Input
                        {...register("beneficiaryName")}
                        placeholder="Enter full name"
                        className={cn("h-12 bg-white border-gray-200 rounded-xl", errors.beneficiaryName && "border-red-500")}
                      />
                      {errors.beneficiaryName && <p className="text-red-500 text-xs mt-1">{errors.beneficiaryName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-normal text-gray-700">Relationship</Label>
                      <Controller
                        name="relationship"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={cn("h-12 w-full py-6 bg-white border-gray-200 rounded-xl", errors.relationship && "border-red-500")}>
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="member">Member</SelectItem>
                              <SelectItem value="spouse">Spouse</SelectItem>
                              <SelectItem value="child">Child</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.relationship && <p className="text-red-500 text-xs mt-1">{errors.relationship.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-normal text-gray-700">Contact Number</Label>
                      <Input
                        {...register("contactNumber")}
                        placeholder="Enter contact number"
                        className={cn("h-12 bg-white border-gray-200 rounded-xl", errors.contactNumber && "border-red-500")}
                      />
                      {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-normal text-gray-700">Address</Label>
                      <div className="relative">
                        <Input
                          {...register("address")}
                          placeholder="Enter address"
                          className={cn("h-12 pr-12 bg-white border-gray-200 rounded-xl", errors.address && "border-red-500")}
                        />
                        <MapPin className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
                      </div>
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-normal text-gray-700">Profile Image</Label>
                      <div
                        onClick={() => document.getElementById("profile-upload")?.click()}
                        className={cn(
                          "border border-dashed border-gray-200 rounded-xl bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 h-32 relative overflow-hidden",
                          errors.profileImage && "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]"
                        )}
                      >
                        <input
                          type="file"
                          id="profile-upload"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => setValue("profileImage", e.target.files)}
                        />
                        {getPreview(profileImage) ? (
                          <div className="relative w-full h-full group">
                            <Image
                              src={getPreview(profileImage)!}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Upload className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-gray-400" />
                            <span className="text-xs text-gray-400">Upload profile</span>
                          </>
                        )}
                      </div>
                      {errors.profileImage && <p className="text-red-500 text-xs mt-1">{errors.profileImage.message?.toString()}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-normal text-gray-700">Documents</Label>
                      <div
                        onClick={() => document.getElementById("doc-upload")?.click()}
                        className={cn(
                          "border border-dashed border-gray-200 rounded-xl bg-white p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 h-32",
                          errors.documents && "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]"
                        )}
                      >
                        <input
                          type="file"
                          id="doc-upload"
                          className="hidden"
                          onChange={(e) => setValue("documents", e.target.files)}
                        />
                        <Upload className={cn("w-5 h-5 text-gray-400", documents?.[0] && "text-primary")} />
                        <span className="text-xs text-gray-400 text-center font-medium">
                          {documents?.[0] ? `${documents.length} file(s) selected` : "Upload documents or photos"}
                        </span>
                      </div>
                      {errors.documents && <p className="text-red-500 text-xs mt-1">{errors.documents.message?.toString()}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-normal text-gray-700">Fund&apos;s Reason</Label>
                    <Textarea
                      {...register("fundReason")}
                      placeholder="Enter reason for the fund"
                      className={cn("min-h-[100px] bg-white border-gray-200 rounded-xl py-4 resize-none", errors.fundReason && "border-red-500")}
                    />
                    {errors.fundReason && <p className="text-red-500 text-xs mt-1">{errors.fundReason.message}</p>}
                  </div>
                </div>
              </section>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 py-8">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="h-12 px-8 rounded-xl text-gray-500 font-medium hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-12 px-10 rounded-xl bg-[#8B2F0E] hover:bg-[#70260B] text-white font-medium shadow-lg active:scale-95"
                >
                  {isEdit ? "Save Changes" : "Add Event"}
                </Button>
              </div>
            </div>
          </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
