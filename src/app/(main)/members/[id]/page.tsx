"use client";

import { MemberDetailInfo } from "@/components/members/MemberDetailInfo";
import { MemberDetailTabs } from "@/components/members/MemberDetailTabs";
import { Button } from "@/components/ui/button";
import { ActionModal } from "@/components/members/ActionModals";
import { useParams } from "next/navigation";
import { useGetUserByIdQuery, useUpdateStatusMutation, useUpdateSuspendedMutation } from "@/features/members/membersApi";
import { toast } from "react-hot-toast";

export default function MemberDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { data: userResponse } = useGetUserByIdQuery({ id });
  const [updateStatus, { isLoading: isStatusUpdating }] = useUpdateStatusMutation();
  const [updateSuspension, { isLoading: isSuspensionUpdating }] = useUpdateSuspendedMutation();

  const user = userResponse?.data;
  const isSuspended = user?.isSuspended;
  const isBlocked = user?.status === "blocked";

  const handleActivate = async () => {
    try {
      if (isSuspended) {
        await updateSuspension({ id, data: { action: "unsuspend" } }).unwrap();
      } else if (isBlocked) {
        await updateStatus({ id, data: { status: "active" } }).unwrap();
      } else {
        // Just as fallback
        await updateStatus({ id, data: { status: "active" } }).unwrap();
      }
      toast.success("User activated successfully");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to activate user");
    }
  };

  const handleSuspend = async () => {
    try {
      await updateSuspension({ id, data: { action: "suspend" } }).unwrap();
      toast.success("User suspended successfully");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to suspend user");
    }
  };

  const handleBlock = async () => {
    try {
      await updateStatus({ id, data: { status: "blocked" } }).unwrap();
      toast.success("User blocked successfully");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to block user");
    }
  };

  return (
    <div className="space-y-10">
      {/* Information Section */}
      <MemberDetailInfo userId={id} userName={user?.name} />

      {/* Tabs / Contributions List */}
      <MemberDetailTabs userId={id} userData={user} />

      {/* Action Footer */}
      <div className="fixed bottom-12 right-12 flex items-center gap-4 z-50">
        {(isSuspended || isBlocked) ? (
          <ActionModal
            type="activate"
            isLoading={isStatusUpdating || isSuspensionUpdating}
            onConfirm={handleActivate}
            trigger={
              <Button
                variant="outline"
                className="bg-white border-[#2ECC71] text-[#2ECC71] hover:bg-[#2ECC71] hover:text-white font-medium rounded-full px-12 py-6 transition-all duration-300 shadow-lg hover:shadow-[#2ECC71]/20 text-lg active:scale-95"
              >
                Activate
              </Button>
            }
          />
        ) : (
          <ActionModal
            type="suspend"
            isLoading={isSuspensionUpdating}
            onConfirm={handleSuspend}
            trigger={
              <Button
                className="bg-[#E74C3C] hover:bg-[#C0392B] text-white font-medium rounded-full px-12 py-6 transition-all duration-300 shadow-xl hover:shadow-[#E74C3C]/30 text-lg border-2 border-[#E74C3C] active:scale-95"
              >
                Suspend
              </Button>
            }
          />
        )}
        
        {!isBlocked && (
          <ActionModal
            type="suspend" // Re-using suspend logic style for Block
            isLoading={isStatusUpdating}
            onConfirm={handleBlock}
            trigger={
              <Button
                variant="outline"
                className="bg-white border-gray-400 text-gray-500 hover:bg-gray-500 hover:text-white font-medium rounded-full px-12 py-6 transition-all duration-300 shadow-lg text-lg active:scale-95"
              >
                Block
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}