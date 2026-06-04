"use client";

import React, { useState, useEffect } from "react";
import { Bell, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useGetNotificationConfigQuery, useUpdateNotificationConfigMutation } from "@/features/settings/notificationApi";
import { toast } from "react-hot-toast";

const notificationDefinition = [
  {
    key: "payment",
    title: "Payment Reminder",
    description: "Notify members before deadline",
  },
  {
    key: "penalty",
    title: "Penalty alert",
    description: "Notify when penalty is applied",
  },
  {
    key: "suspension",
    title: "Suspension Warning",
    description: "Alert before account suspension",
  },
  {
    key: "event",
    title: "Event Announcement",
    description: "Notify about new events",
  },
];

export function NotificationSettings() {
  const { data: configData, isLoading } = useGetNotificationConfigQuery(undefined);
  const [updateConfig] = useUpdateNotificationConfigMutation();
  const [updatingField, setUpdatingField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    payment: false,
    penalty: false,
    suspension: false,
    event: false,
  });

  useEffect(() => {
    if (configData?.data) {
      const data = configData.data;
      setFormData({
        payment: !!data.payment,
        penalty: !!data.penalty,
        suspension: !!data.suspension,
        event: !!data.event,
      });
    }
  }, [configData]);

  const handleToggle = async (key: string, checked: boolean) => {
    try {
      setUpdatingField(key);
      const updatedData = {
        ...formData,
        [key]: checked,
      };

      await updateConfig({ data: updatedData }).unwrap();
      setFormData(updatedData);
      toast.success("Notification updated successfully");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to update notification");
    } finally {
      setUpdatingField(null);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#A53200]" />
        <p className="text-gray-500 text-sm font-medium">Fetching config...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900">Notification Settings</h2>
        <p className="text-sm text-gray-500 font-normal mt-1">Control alerts and communication preferences.</p>
      </div>

      <div className="space-y-4">
        {notificationDefinition.map((item) => (
          <div key={item.key} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)] flex items-center justify-between group">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-[#8B2F0E]" />
              </div>
              <div>
                <h4 className="text-base font-medium text-gray-900">{item.title}</h4>
                <p className="text-xs text-gray-500 font-normal mt-1">{item.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {updatingField === item.key && <Loader2 className="w-4 h-4 animate-spin text-[#8B2F0E]" />}
              <Switch 
                checked={formData[item.key as keyof typeof formData]} 
                onCheckedChange={(checked) => handleToggle(item.key, checked)}
                disabled={!!updatingField}
                className="data-[state=checked]:bg-[#8B2F0E]" 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
