"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Ban, CheckCircle2, Trash2, Upload, LogOut } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ActionModalProps {
  trigger: ReactNode;
  type: "suspend" | "activate" | "delete" | "markComplete" | "closeEvent" | "export" | "logout";
  onConfirm?: () => void;
}

export function ActionModal({ trigger, type, onConfirm }: ActionModalProps) {
  const configs = {
    suspend: {
      icon: <Ban className="w-8 h-8 text-[#E74C3C]" />,
      iconBg: "bg-red-50",
      title: "Suspend User Account?",
      titleColor: "text-[#8B2F0E]",
      description: "Are you sure you want to suspend this user? They will no longer be able to access their account until reactivated.",
      cancelText: "NO",
      confirmText: "YES",
      confirmBg: "bg-[#E74C3C] hover:bg-[#C0392B]",
    },
    activate: {
      icon: <CheckCircle2 className="w-8 h-8 text-[#2ECC71]" />,
      iconBg: "bg-green-50",
      title: "Activate User Account?",
      titleColor: "text-[#2ECC71]",
      description: "Are you sure you want to activate this user? They will regain access to all features and services.",
      cancelText: "NO",
      confirmText: "YES",
      confirmBg: "bg-[#2ECC71] hover:bg-[#27AE60]",
    },
    delete: {
      icon: <Trash2 className="w-8 h-8 text-[#E74C3C]" />,
      iconBg: "bg-red-50",
      title: "Delete This Event?",
      titleColor: "text-[#E74C3C]",
      description: "This action cannot be undone. All event data, contributions, and records will be permanently removed. Are you sure you want to continue?",
      cancelText: "Cancel",
      confirmText: "Delete",
      confirmBg: "bg-[#E74C3C] hover:bg-[#C0392B]",
    },
    markComplete: {
      icon: <CheckCircle2 className="w-8 h-8 text-[#219653]" />,
      iconBg: "bg-[#DCFCE7]",
      title: "Mark Event as Completed?",
      titleColor: "text-[#219653]",
      description: "This will close the event and finalize all contributions. No further payments will be accepted.",
      cancelText: "NO",
      confirmText: "YES",
      confirmBg: "bg-[#219653] hover:bg-[#1C7C45]",
    },
    closeEvent: {
      icon: <CheckCircle2 className="w-8 h-8 text-[#8B2F0E]" />,
      iconBg: "bg-[#FFF7ED]",
      title: "Close This Event?",
      titleColor: "text-[#8B2F0E]",
      description: "This will stop all contributions and archive the event. You won't be able to receive funds.",
      cancelText: "NO",
      confirmText: "YES",
      confirmBg: "bg-[#8B2F0E] hover:bg-[#70260B]",
    },
    export: {
      icon: <Upload className="w-8 h-8 text-[#8B2F0E]" />,
      iconBg: "bg-[#FFF7ED]",
      title: "Export Payment History?",
      titleColor: "text-[#8B2F0E]",
      description: "You're about to export all transaction records from the system. This file will include payment details such as amount, date, user information, and status. Do you want to continue?",
      cancelText: "NO",
      confirmText: "YES",
      confirmBg: "bg-[#8B2F0E] hover:bg-[#70260B]",
    },
    logout: {
      icon: <LogOut className="w-8 h-8 text-[#8B2F0E]" />,
      iconBg: "bg-[#F3EBE5]",
      title: "Logout!",
      titleColor: "text-[#8B2F0E]",
      description: "Are you sure you want to log out?",
      cancelText: "NO",
      confirmText: "YES",
      confirmBg: "bg-[#D12B1E] hover:bg-[#B02419]",
    },
  };

  const current = configs[type];

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-[440px] p-10 rounded-[32px] border-none shadow-2xl bg-white flex flex-col items-center text-center">
        <AlertDialogHeader className="items-center">
          <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-6", current.iconBg)}>
            {current.icon}
          </div>
          <AlertDialogTitle className={cn("text-xl font-medium mb-3", current.titleColor)}>
            {current.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-500 text-[13px] leading-relaxed mb-8 max-w-[320px]">
            {current.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row items-center justify-center gap-4 w-full sm:justify-center">
          <AlertDialogCancel className="h-11 px-10 rounded-lg border border-gray-200 text-gray-500 font-medium bg-white hover:bg-gray-50 m-0 min-w-[124px]">
            {current.cancelText}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className={cn(
              "h-11 px-10 rounded-lg font-medium text-white shadow-sm transition-all active:scale-95 m-0 min-w-[124px]",
              current.confirmBg
            )}
          >
            {current.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
