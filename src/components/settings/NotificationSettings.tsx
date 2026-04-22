"use client";

import React from "react";
import { Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const notifications = [
  {
    title: "Payment Reminder",
    description: "Notify members before deadline",
  },
  {
    title: "Penalty alert",
    description: "Notify when penalty is applied",
  },
  {
    title: "Suspension Waring",
    description: "Alert before account suspension",
  },
  {
    title: "Event Announcement",
    description: "Notify about new events",
  },
];

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900">Notification Settings</h2>
        <p className="text-sm text-gray-500 font-normal mt-1">Control alerts and communication preferences.</p>
      </div>

      <div className="space-y-4">
        {notifications.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)] flex items-center justify-between group">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-[#8B2F0E]" />
              </div>
              <div>
                <h4 className="text-base font-medium text-gray-900">{item.title}</h4>
                <p className="text-xs text-gray-500 font-normal mt-1">{item.description}</p>
              </div>
            </div>
            <Switch 
              defaultChecked 
              className="data-[state=checked]:bg-[#8B2F0E]" 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
