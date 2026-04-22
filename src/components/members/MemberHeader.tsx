"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AddMemberForm } from "./AddMemberForm";

export function MemberHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-medium text-gray-900 tracking-tight">Member Management</h1>
        <p className="text-base text-gray-500 mt-1">458 total members</p>
      </div>
      
      <Sheet>
        <SheetTrigger asChild>
          <Button className="bg-primary hover:bg-primary/90 transition-colors text-white rounded-full px-10 py-6 flex items-center gap-2 text-sm font-medium">
            <Plus className="w-5 h-5 stroke-[3px]" />
            Add New Member
          </Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto p-6">
          <SheetHeader className="p-0">
            <SheetTitle className="text-2xl font-medium text-gray-900">Add New Member</SheetTitle>
          </SheetHeader>
          <AddMemberForm />
        </SheetContent>
      </Sheet>
    </div>
  );
}

