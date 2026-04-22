"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const roles = [
  "Super Admin",
  "Event Manager",
  "Analytics Specialist",
  "Support Manager",
  "Content Moderator",
];

const modules = [
  "Members",
  "Events",
  "Payments",
  "Reports",
  "Settings",
];

export function RolesSettings() {
  const [selectedRole, setSelectedRole] = useState("Super Admin");

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Role & Permission Editor</h2>
          <p className="text-sm text-gray-500 font-normal mt-1">Configure module access permissions for different roles</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="bg-gray-200/50 text-gray-600 hover:bg-gray-200 px-6 rounded-lg text-xs font-medium h-10">
            Grant All Permissions
          </Button>
          <Button variant="ghost" className="bg-gray-200/50 text-gray-600 hover:bg-gray-200 px-6 rounded-lg text-xs font-medium h-10">
            Revoke All Permissions
          </Button>
          <Button className="bg-[#8B2F0E] hover:bg-[#70260B] text-white px-8 rounded-lg text-xs font-medium h-10 shadow-sm transition-all active:scale-95">
            Save Changes
          </Button>
        </div>
      </div>

      {/* Role Selector */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)] mb-8">
        <label className="text-xs font-normal text-gray-500 mb-4 block uppercase tracking-wider">Select Role</label>
        <div className="flex flex-wrap gap-3">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={cn(
                "px-6 py-2.5 rounded-lg text-sm font-normal transition-all",
                selectedRole === role 
                  ? "bg-[#8B2F0E] text-white shadow-md shadow-[#8B2F0E]/20" 
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              )}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Permission Table */}
      <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)]">
        <div className="grid grid-cols-2 pb-6 border-b border-gray-100">
           <span className="text-sm font-medium text-gray-900 tracking-tight">Module</span>
           <span className="text-sm font-medium text-gray-900 tracking-tight">All Settings Permission</span>
        </div>
        <div className="divide-y divide-gray-50">
          {modules.map((module) => (
            <div key={module} className="grid grid-cols-2 py-6 items-center">
              <span className="text-base font-normal text-gray-600">{module}</span>
              <Checkbox 
                defaultChecked={selectedRole === "Super Admin" || module === "Settings"}
                className="w-5 h-5 rounded border-gray-300 data-[state=checked]:bg-[#8B2F0E] data-[state=checked]:border-[#8B2F0E]" 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
