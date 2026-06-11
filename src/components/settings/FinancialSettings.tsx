"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetContributionConfigQuery, useUpdateContributionConfigMutation } from "@/features/settings/contributionApi";
import { Banknote, Clock, Loader2, PieChart } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export function FinancialSettings() {
  const [penaltyEnabled, setPenaltyEnabled] = useState(true);
  const { data: configData, isLoading } = useGetContributionConfigQuery(undefined);
  const [updateContributionConfig] = useUpdateContributionConfigMutation();
  const [updatingField, setUpdatingField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    platformFee: 0,
    beneficiaryShare: 0,
    contributionDeadline: 0,
    penaltyAmount: 0,
    reactivationAmount: 0
  });

  useEffect(() => {
    if (configData?.data) {
      const data = configData.data;
      setFormData({
        platformFee: data.platformFee || 0,
        beneficiaryShare: data.beneficiaryShare || 0,
        contributionDeadline: data.contributionDeadline || 0,
        penaltyAmount: data.penaltyAmount || 0,
        reactivationAmount: data.reactivationAmount || 0
      });
      setPenaltyEnabled(data.penaltyAmount > 0);
    }
  }, [configData]);

  const handleUpdate = async (field: keyof typeof formData, value: number) => {
    try {
      setUpdatingField(field);
      const updatedData = {
        ...formData,
        [field]: value,
      };

      // Ensure specific fields stay within valid ranges if needed
      if (field === "platformFee") {
        updatedData.beneficiaryShare = 100 - value;
      } else if (field === "beneficiaryShare") {
        updatedData.platformFee = 100 - value;
      }

      await updateContributionConfig({ data: updatedData }).unwrap();
      toast.success("Settings updated successfully");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to update settings");
    } finally {
      setUpdatingField(null);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, [field]: numValue }));
  };

  if (isLoading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#A53200]" />
        <p className="text-gray-500 text-sm font-medium">Fetching settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900">Financial & Contribution Rule Settings</h2>
        <p className="text-sm text-gray-500 font-normal mt-1">Manage contribution rules, fees and penalties.</p>
      </div>

      <div className="space-y-4">
        {/* Platform Fee */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)] flex items-start gap-5 group">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <PieChart className="w-6 h-6 text-[#A53200]" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h4 className="text-base font-medium text-gray-900">Platform Fee (%)</h4>
              <p className="text-xs text-gray-500 font-normal mt-1">Percentage retained by the platform</p>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={formData.platformFee}
                onChange={(e) => handleInputChange("platformFee", e.target.value)}
                className="flex-1 h-12 px-5 bg-neutral-100 rounded-lg border-none text-sm font-normal text-gray-600 focus-visible:ring-1 focus-visible:ring-[#8B2F0E]/20"
              />
              <Button
                onClick={() => handleUpdate("platformFee", formData.platformFee)}
                disabled={updatingField === "platformFee"}
                className="bg-[#8B2F0E] hover:bg-[#70260B] text-white px-8 h-12 rounded-lg text-xs font-medium transition-all active:scale-95 shadow-md min-w-[100px]"
              >
                {updatingField === "platformFee" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>
        </div>

        {/* Beneficiary Share */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)] flex items-start gap-5">
          <div className="w-12 h-12 rounded-full bg-orange-700 flex items-center justify-center shrink-0">
            <PieChart className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h4 className="text-base font-medium text-gray-900">Beneficiary Share (%)</h4>
              <p className="text-xs text-gray-500 font-normal mt-1">Automatically calculated based on platform fee</p>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={formData.beneficiaryShare}
                onChange={(e) => handleInputChange("beneficiaryShare", e.target.value)}
                className="flex-1 h-12 px-5 bg-neutral-100 rounded-lg border-none text-sm font-normal text-gray-600 focus-visible:ring-1 focus-visible:ring-[#8B2F0E]/20"
              />
              <Button
                onClick={() => handleUpdate("beneficiaryShare", formData.beneficiaryShare)}
                disabled={updatingField === "beneficiaryShare"}
                className="bg-[#8B2F0E] hover:bg-[#70260B] text-white px-8 h-12 rounded-lg text-xs font-medium transition-all active:scale-95 shadow-md min-w-[100px]"
              >
                {updatingField === "beneficiaryShare" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>
        </div>

        {/* Contribution Deadline */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)] flex items-start gap-5">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-[#A53200]" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h4 className="text-base font-medium text-gray-900">Contribution Deadline (Days)</h4>
              <p className="text-xs text-gray-500 font-normal mt-1">Time allowed for members to complete payment</p>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={formData.contributionDeadline}
                onChange={(e) => handleInputChange("contributionDeadline", e.target.value)}
                className="flex-1 h-12 px-5 bg-neutral-100 rounded-lg border-none text-sm font-normal text-gray-600 focus-visible:ring-1 focus-visible:ring-[#8B2F0E]/20"
              />
              <Button
                onClick={() => handleUpdate("contributionDeadline", formData.contributionDeadline)}
                disabled={updatingField === "contributionDeadline"}
                className="bg-[#8B2F0E] hover:bg-[#70260B] text-white px-8 h-12 rounded-lg text-xs font-medium transition-all active:scale-95 shadow-md min-w-[100px]"
              >
                {updatingField === "contributionDeadline" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>
        </div>

        {/* Penalty Amount */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)] flex items-start gap-5">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <Banknote className="w-6 h-6 text-[#A53200]" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium text-gray-900">Penalty Amount</h4>
                <p className="text-xs text-gray-500 font-normal mt-1">Applied after deadline is missed</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <Input
                  type="number"
                  value={formData.penaltyAmount}
                  onChange={(e) => handleInputChange("penaltyAmount", e.target.value)}
                  disabled={!penaltyEnabled}
                  className="w-full h-12 pl-10 pr-5 bg-neutral-100 rounded-lg border-none text-sm font-normal text-gray-600 focus-visible:ring-1 focus-visible:ring-[#8B2F0E]/20 disabled:opacity-50"
                />
              </div>
              <Button
                onClick={() => handleUpdate("penaltyAmount", formData.penaltyAmount)}
                disabled={updatingField === "penaltyAmount" || !penaltyEnabled}
                className="bg-[#8B2F0E] hover:bg-[#70260B] text-white px-8 h-12 rounded-lg text-xs font-medium transition-all active:scale-95 shadow-md min-w-[100px]"
              >
                {updatingField === "penaltyAmount" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>
        </div>

        {/* Reactivation Amount */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)] flex items-start gap-5">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <Banknote className="w-6 h-6 text-[#A53200]" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium text-gray-900">Reactivation Amount</h4>
                <p className="text-xs text-gray-500 font-normal mt-1">Amount to be paid to reactivate account</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <Input
                  type="number"
                  value={formData.reactivationAmount}
                  onChange={(e) => handleInputChange("reactivationAmount", e.target.value)}
                  className="w-full h-12 pl-10 pr-5 bg-neutral-100 rounded-lg border-none text-sm font-normal text-gray-600 focus-visible:ring-1 focus-visible:ring-[#8B2F0E]/20"
                />
              </div>
              <Button
                onClick={() => handleUpdate("reactivationAmount", formData.reactivationAmount)}
                disabled={updatingField === "reactivationAmount"}
                className="bg-[#8B2F0E] hover:bg-[#70260B] text-white px-8 h-12 rounded-lg text-xs font-medium transition-all active:scale-95 shadow-md min-w-[100px]"
              >
                {updatingField === "reactivationAmount" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
