"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddMemberForm() {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-6">
        <h3 className="text-[#8B2F0E] font-medium text-lg">Member Details</h3>
        
        <div className="border border-gray-100 shadow-sm bg-gray-100 p-4 space-y-6 rounded-xl">
          <div className="space-y-2">
          <Label htmlFor="fullname" className="text-sm font-medium text-gray-700">Full Name</Label>
          <Input 
            id="fullname" 
            placeholder="Enter the full name of member" 
            className="bg-gray-100/80 border-none bg-white rounded-lg py-5 px-4 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-brand-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
          <Input 
            id="email" 
            type="email"
            placeholder="Enter the full name of member" 
            className="bg-gray-100/80 border-none bg-white rounded-lg py-5 px-4 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-brand-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
          <Select>
            <SelectTrigger id="phone" className="bg-gray-100/80 w-full bg-white border-none rounded-lg py-5 px-4 text-gray-400 focus:ring-1 focus:ring-brand-primary h-auto">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="type1">Type 1</SelectItem>
              <SelectItem value="type2">Type 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 mt-auto">
        <Button variant="outline" className="bg-gray-100 border-none rounded-lg px-10 py-5 text-gray-600 font-medium hover:bg-gray-200">
          Cancel
        </Button>
        <Button className="bg-[#8B2F0E] hover:bg-[#70260B] text-white rounded-lg px-10 py-5  font-medium shadow-md">
          Add
        </Button>
      </div>
    </div>
  );
}
