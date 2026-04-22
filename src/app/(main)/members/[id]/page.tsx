"use client";

import { MemberDetailInfo } from "@/components/members/MemberDetailInfo";
import { MemberDetailTabs } from "@/components/members/MemberDetailTabs";
import { Button } from "@/components/ui/button";
import { ActionModal } from "@/components/members/ActionModals";


export default function MemberDetailsPage() {
  return (
    <div className="space-y-10">
      {/* Information Section */}
      <MemberDetailInfo />

      {/* Tabs / Contributions List */}
      <MemberDetailTabs />

      {/* Action Footer */}
      <div className="fixed bottom-12 right-12 flex items-center gap-4">
        <ActionModal
          type="activate"
          trigger={
            <Button
              variant="outline"
              className="bg-white border-[#2ECC71] text-[#2ECC71] hover:bg-[#2ECC71] hover:text-white font-medium rounded-full px-12 py-6 transition-all duration-300 shadow-lg hover:shadow-[#2ECC71]/20 text-lg"
            >
              Activate
            </Button>
          }
        />
        <ActionModal
          type="suspend"
          trigger={
            <Button
              className="bg-[#E74C3C] hover:bg-[#C0392B] text-white font-medium rounded-full px-12 py-6 transition-all duration-300 shadow-xl hover:shadow-[#E74C3C]/30 text-lg border-2 border-[#E74C3C]"
            >
              Suspend
            </Button>
          }
        />
      </div>

    </div>
  );
}