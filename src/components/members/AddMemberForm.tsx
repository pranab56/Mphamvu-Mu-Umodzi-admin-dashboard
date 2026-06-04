"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateUserMutation } from "@/features/members/membersApi";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export function AddMemberForm() {
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "",
  });

  const handlePhoneChange = (value: string, data: { dialCode: string }) => {
    setFormData((prev) => ({
      ...prev,
      phone: value.slice(data.dialCode.length),
      countryCode: `+${data.dialCode}`
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await createUser({ data: formData }).unwrap();
      toast.success("Member added successfully");
      // Reset form or close sheet? Usually the parent handles closing, 
      // but we can reset the state.
      setFormData({ name: "", email: "", phone: "", countryCode: "" });
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to add member");
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="space-y-6">
        <h3 className="text-[#8B2F0E] font-medium text-lg">Member Details</h3>
        
        <div className="border border-gray-100 shadow-sm bg-gray-100 p-6 space-y-6 rounded-xl">
          <div className="space-y-2">
            <Label htmlFor="fullname" className="text-sm font-medium text-gray-700">Full Name</Label>
            <Input 
              id="fullname" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter the full name of member" 
              className="bg-white border-none rounded-lg py-5 px-4 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#8B2F0E]/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
            <Input 
              id="email" 
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter the email address" 
              className="bg-white border-none rounded-lg py-5 px-4 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#8B2F0E]/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
            <PhoneInput
              country={"mw"} // Default to Malawi or any common country for this app
              value={formData.countryCode + formData.phone}
              onChange={handlePhoneChange}
              inputStyle={{
                width: "100%",
                height: "44px",
                borderRadius: "8px",
                border: "none",
                fontSize: "14px",
                backgroundColor: "white",
              }}
              buttonStyle={{
                backgroundColor: "transparent",
                border: "none",
                borderRadius: "8px 0 0 8px",
              }}
              containerStyle={{
                width: "100%",
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 mt-auto">
        <Button variant="outline" className="bg-gray-100 border-none rounded-lg px-10 py-5 text-gray-600 font-medium hover:bg-gray-200">
          Cancel
        </Button>
        <Button 
          disabled={isLoading}
          onClick={handleSubmit}
          className="bg-[#8B2F0E] hover:bg-[#70260B] text-white rounded-lg px-10 py-5 font-medium shadow-md transition-all active:scale-95"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
        </Button>
      </div>

      <style jsx global>{`
        .react-tel-input .form-control {
          background: white !important;
          border: none !important;
          height: 48px !important;
          width: 100% !important;
          border-radius: 8px !important;
        }
        .react-tel-input .flag-dropdown {
          background: transparent !important;
          border: none !important;
          border-radius: 8px 0 0 8px !important;
        }
        .react-tel-input .selected-flag:hover {
          background: #f3f4f6 !important;
        }
      `}</style>
    </div>
  );
}
