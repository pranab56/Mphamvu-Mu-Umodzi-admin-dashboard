"use client";

import React, { useState, useEffect } from "react";
import { Plus, Image as ImageIcon, Calendar as CalendarIcon, MapPin, Upload, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "react-hot-toast";

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
import { useGetAllEventTypesQuery } from "@/features/event/eventTypesApi";
import { useCreateEventMutation, useUpdateEventMutation } from "@/features/event/eventApi";

const eventSchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  eventTypeId: z.string().min(1, "Please select an event type"),
  description: z.string().min(1, "Description is required"),
  minContribution: z.string().min(1, "Minimum contribution is required"),
  targetContribution: z.string().min(1, "Target contribution is required"),
  deadline: z.date({ message: "A deadline is required" }),
  coverImage: z.any().optional(),
  beneficiaryName: z.string().min(1, "Beneficiary name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  countryCode: z.string().min(1, "Country code is required"),
  address: z.string().min(1, "Address is required"),
  profileImage: z.any().optional(),
  documents: z.any().optional(),
  fundReason: z.string().min(1, "Fund reason is required"),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventType {
  _id: string;
  name: string;
}

interface AddEventSheetProps {
  trigger?: React.ReactNode;
  mode?: "add" | "edit";
  initialData?: {
    _id: string;
    name: string;
    eventTypeId: string;
    description: string;
    minContribution: number;
    targetContribution: number;
    eventDeadline: string;
    banner: string;
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
  };
}

export function AddEventSheet({ trigger, mode = "add", initialData }: AddEventSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isEdit = mode === "edit";

  const { data: eventTypesResponse } = useGetAllEventTypesQuery(undefined);
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();

  const eventTypes = eventTypesResponse?.data || [];

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
    defaultValues: {
      relationship: "User",
      countryCode: "+880",
    }
  });

  // Populate data when editing
  useEffect(() => {
    if (isEdit && initialData) {
      reset({
        eventName: initialData.name,
        eventTypeId: initialData.eventTypeId,
        description: initialData.description,
        minContribution: initialData.minContribution?.toString(),
        targetContribution: initialData.targetContribution?.toString(),
        deadline: initialData.eventDeadline ? new Date(initialData.eventDeadline) : new Date(),
        beneficiaryName: initialData.beneficiary?.name,
        relationship: initialData.beneficiary?.relationship || "User",
        email: initialData.beneficiary?.email,
        contactNumber: initialData.beneficiary?.contactNumber,
        countryCode: initialData.beneficiary?.countryCode || "+880",
        address: initialData.beneficiary?.address,
        fundReason: initialData.beneficiary?.fundsReason,
        coverImage: initialData.banner,
        profileImage: initialData.beneficiary?.image,
      });
    }
  }, [isEdit, initialData, reset]);

  const onSubmit = async (data: EventFormValues) => {
    try {
      const formData = new FormData();
      
      const eventPayload = {
        name: data.eventName,
        eventTypeId: data.eventTypeId,
        description: data.description,
        minContribution: Number(data.minContribution),
        targetContribution: Number(data.targetContribution),
        eventDeadline: data.deadline.toISOString(),
        beneficiary: {
          name: data.beneficiaryName,
          email: data.email,
          relationship: data.relationship,
          contactNumber: data.contactNumber,
          countryCode: data.countryCode,
          address: data.address,
          image: typeof data.profileImage === "string" ? data.profileImage : "",
          documents: [], // Handle if needed
          fundsReason: data.fundReason,
        }
      };

      formData.append("data", JSON.stringify(eventPayload));
      
      // Append banner file if present and it's a FileList (new upload)
      if (data.coverImage instanceof FileList && data.coverImage[0]) {
        formData.append("banner", data.coverImage[0]);
      }

      if (isEdit && initialData) {
        await updateEvent({ data: formData, id: initialData._id }).unwrap();
        toast.success("Event updated successfully");
      } else if (!isEdit) {
        await createEvent({ data: formData }).unwrap();
        toast.success("Event created successfully");
      }

      setIsOpen(false);
      reset();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || `Failed to ${isEdit ? "update" : "create"} event`);
    }
  };

  const coverImage = watch("coverImage");
  const profileImage = watch("profileImage");
  const documents = watch("documents");

  const getPreview = (files: FileList | string | null | undefined) => {
    if (!files) return null;
    if (typeof files === "string") return files;
    if (files instanceof FileList && files.length > 0) {
      try {
        return URL.createObjectURL(files[0]);
      } catch {
        return null;
      }
    }
    return null;
  };

  const isLoading = isCreating || isUpdating;

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
                <div className="grid grid-cols-1 gap-6 border p-5 rounded-lg bg-gray-100 border-gray-300 shadow-sm">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Event Name</Label>
                    <Input
                      {...register("eventName")}
                      placeholder="Enter the event name"
                      className={cn("h-12 bg-white border-gray-200 rounded-xl", errors.eventName && "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]")}
                    />
                    {errors.eventName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.eventName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Event Type</Label>
                    <Controller
                      name="eventTypeId"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={cn("h-12 w-full py-6 bg-white border-gray-200 rounded-xl shadow-sm", errors.eventTypeId && "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]")}>
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                            {eventTypes.map((type: EventType) => (
                              <SelectItem key={type._id} value={type._id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.eventTypeId && <p className="text-red-500 text-xs mt-1 font-medium">{errors.eventTypeId.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Cover Image (Banner)</Label>
                    <div
                      onClick={() => document.getElementById("cover-upload")?.click()}
                      className={cn(
                        "border-2 border-dashed border-gray-200 rounded-2xl bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all group relative overflow-hidden h-48 shadow-sm",
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
                          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                            <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                          </div>
                          <span className="text-xs text-gray-400 font-medium">Click to upload cover image</span>
                        </div>
                      )}
                    </div>
                    {errors.coverImage && <p className="text-red-500 text-xs mt-1 font-medium">{errors.coverImage.message?.toString()}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Description</Label>
                    <div className="relative">
                      <Textarea
                        {...register("description")}
                        placeholder="Enter event description"
                        className={cn("min-h-[120px] bg-white border-gray-200 rounded-xl py-4 resize-none shadow-sm", errors.description && "border-red-500")}
                      />
                    </div>
                    {errors.description && <p className="text-red-500 text-xs mt-1 font-medium">{errors.description.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Min Contribution</Label>
                      <Input
                        {...register("minContribution")}
                        type="number"
                        placeholder="e.g., 30"
                        className={cn("h-12 bg-white border-gray-200 rounded-xl shadow-sm", errors.minContribution && "border-red-500")}
                      />
                      {errors.minContribution && <p className="text-red-500 text-xs mt-1 font-medium">{errors.minContribution.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Target Contribution</Label>
                      <Input
                        {...register("targetContribution")}
                        type="number"
                        placeholder="e.g., 1000"
                        className={cn("h-12 bg-white border-gray-200 rounded-xl shadow-sm", errors.targetContribution && "border-red-500")}
                      />
                      {errors.targetContribution && <p className="text-red-500 text-xs mt-1 font-medium">{errors.targetContribution.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2 font-poppins">
                    <Label className="text-sm font-medium text-gray-700 font-inter">Event Deadline</Label>
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
                                "w-full h-12 px-4 text-left font-normal bg-white border-gray-200 rounded-xl justify-between flex items-center shadow-sm",
                                !field.value && "text-muted-foreground",
                                errors.deadline && "border-red-500"
                              )}
                            >
                              <span className="font-medium">
                                {field.value ? format(field.value, "PPP") : "Pick event deadline"}
                              </span>
                              <CalendarIcon className="h-5 w-5 text-gray-400" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 rounded-2xl overflow-hidden shadow-2xl border-none" align="end">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="bg-white"
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.deadline && <p className="text-red-500 text-xs mt-1 font-medium">{errors.deadline.message}</p>}
                  </div>
                </div>
              </section>

              {/* Beneficiary Details Section */}
              <section className="space-y-6">
                <h3 className="text-xl font-medium text-[#8B2F0E] tracking-tight">Beneficiary Details</h3>
                <div className="bg-primary/5 p-8 rounded-2xl border border-primary/20 space-y-8 shadow-sm">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                      <Input
                        {...register("beneficiaryName")}
                        placeholder="Enter full name"
                        className={cn("h-12 bg-white border-gray-200 rounded-xl shadow-sm", errors.beneficiaryName && "border-red-500")}
                      />
                      {errors.beneficiaryName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.beneficiaryName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Relationship</Label>
                      <Controller
                        name="relationship"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={cn("h-12 w-full py-6 bg-white border-gray-200 rounded-xl shadow-sm", errors.relationship && "border-red-500")}>
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="Member">Member</SelectItem>
                              <SelectItem value="Spouse">Spouse</SelectItem>
                              <SelectItem value="Child">Child</SelectItem>
                              <SelectItem value="User">User</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.relationship && <p className="text-red-500 text-xs mt-1 font-medium">{errors.relationship.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                      <Input
                        {...register("email")}
                        placeholder="Enter email address"
                        className={cn("h-12 bg-white border-gray-200 rounded-xl shadow-sm", errors.email && "border-red-500")}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Contact Number</Label>
                      <Input
                        {...register("contactNumber")}
                        placeholder="Enter contact number"
                        className={cn("h-12 bg-white border-gray-200 rounded-xl shadow-sm", errors.contactNumber && "border-red-500")}
                      />
                      {errors.contactNumber && <p className="text-red-500 text-xs mt-1 font-medium">{errors.contactNumber.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Country Code</Label>
                      <Input
                        {...register("countryCode")}
                        placeholder="+880"
                        className={cn("h-12 bg-white border-gray-200 rounded-xl shadow-sm", errors.countryCode && "border-red-500")}
                      />
                      {errors.countryCode && <p className="text-red-500 text-xs mt-1 font-medium">{errors.countryCode.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Address</Label>
                      <div className="relative">
                        <Input
                          {...register("address")}
                          placeholder="Enter address"
                          className={cn("h-12 pr-12 bg-white border-gray-200 rounded-xl shadow-sm", errors.address && "border-red-500")}
                        />
                        <MapPin className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
                      </div>
                      {errors.address && <p className="text-red-500 text-xs mt-1 font-medium">{errors.address.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Beneficiary Image</Label>
                      <div
                        onClick={() => document.getElementById("profile-upload")?.click()}
                        className={cn(
                          "border border-dashed border-gray-200 rounded-xl bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 h-32 relative overflow-hidden transition-all shadow-sm",
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
                              alt="Profile"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Upload className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <Upload className="w-5 h-5 text-gray-400" />
                            <span className="text-xs text-gray-400 font-medium">Upload profile</span>
                          </div>
                        )}
                      </div>
                      {errors.profileImage && <p className="text-red-500 text-xs mt-1 font-medium">{errors.profileImage.message?.toString()}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Verification Documents</Label>
                      <div
                        onClick={() => document.getElementById("doc-upload")?.click()}
                        className={cn(
                          "border border-dashed border-gray-200 rounded-xl bg-white p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 h-32 transition-all shadow-sm",
                          errors.documents && "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]"
                        )}
                      >
                        <input
                          type="file"
                          id="doc-upload"
                          multiple
                          className="hidden"
                          onChange={(e) => setValue("documents", e.target.files)}
                        />
                        <Upload className={cn("w-5 h-5 text-gray-400 transition-colors", documents?.[0] && "text-primary")} />
                        <span className="text-xs text-gray-400 text-center font-medium px-2">
                          {documents?.[0] ? `${documents.length} file(s) selected` : "Upload NID, medical papers etc."}
                        </span>
                      </div>
                      {errors.documents && <p className="text-red-500 text-xs mt-1 font-medium">{errors.documents.message?.toString()}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Reason for Funds</Label>
                    <Textarea
                      {...register("fundReason")}
                      placeholder="Explain why the funds are required..."
                      className={cn("min-h-[100px] bg-white border-gray-200 rounded-xl py-4 resize-none shadow-sm", errors.fundReason && "border-red-500")}
                    />
                    {errors.fundReason && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fundReason.message}</p>}
                  </div>
                </div>
              </section>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 py-8 border-t border-gray-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="h-12 px-8 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition-all"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 px-12 rounded-xl bg-[#8B2F0E] hover:bg-[#70260B] text-white font-bold shadow-lg shadow-[#8B2F0E]/20 active:scale-95 transition-all flex items-center gap-2 min-w-[160px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    isEdit ? "Save Changes" : "Create Event"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
