"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  CheckCheck,
  Package,
  UserPlus,
  AlertTriangle,
  ShieldCheck,
  Megaphone,
  Clock,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { 
  useGetNotificationsQuery, 
  useReadAllNotificationsMutation, 
  useReadSingleNotificationMutation 
} from "@/features/notification/notificationPageApi";
import { formatDistanceToNow } from "date-fns";

// ─── Category Config ──────────────────────────────────────────────────────────

const categoryConfig: Record<string, {
  icon: React.ElementType;
  bg: string;
  iconColor: string;
  label: string;
}> = {
  ORDER: { icon: Package, bg: "bg-orange-100", iconColor: "text-[#A53200]", label: "Order" },
  DRIVER: { icon: UserPlus, bg: "bg-blue-100", iconColor: "text-blue-600", label: "Driver" },
  ALERT: { icon: AlertTriangle, bg: "bg-red-100", iconColor: "text-red-500", label: "Alert" },
  SYSTEM: { icon: ShieldCheck, bg: "bg-green-100", iconColor: "text-green-600", label: "System" },
  PROMO: { icon: Megaphone, bg: "bg-purple-100", iconColor: "text-purple-600", label: "Promo" },
};

interface Notification {
  _id: string;
  title: string;
  message: string;
  read: boolean;
  type: string;
  createdAt: string;
}

export default function NotificationPage() {
  const [currentPage, setCurrentPage] = useState(1);
  
  // API Hooks
  const { data: response, isLoading } = useGetNotificationsQuery({ page: currentPage });
  const [readAll] = useReadAllNotificationsMutation();
  const [readSingle] = useReadSingleNotificationMutation();

  const notifications = (response?.data?.result as Notification[]) || [];
  const unreadCount = response?.data?.unreadCount || 0;
  const meta = response?.meta;

  const handleMarkAllRead = async () => {
    try {
      await readAll({}).unwrap();
      toast.success("All notifications marked as read");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to mark all as read");
    }
  };

  const handleMarkRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    try {
      await readSingle({ id }).unwrap();
    } catch (err) {
      console.error("Failed to mark read:", err);
    }
  };

  if (isLoading && currentPage === 1) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-10 h-10 text-[#A53200] animate-spin" />
        <p className="mt-4 text-gray-500 font-medium">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#2C2E33]">Notifications</h1>
          <p className="text-gray-500 mt-1.5 text-xs sm:text-sm">
            {unreadCount > 0 ? (
              <span>You have <span className="text-[#A53200] font-semibold">{unreadCount} unread</span> notifications.</span>
            ) : (
              "You're all caught up!"
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="flex-1 sm:flex-none h-10 sm:h-11 px-4 sm:px-6 rounded-lg border-gray-200 text-xs sm:text-sm font-medium text-[#2C2E33] hover:bg-gray-50 cursor-pointer disabled:opacity-40"
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
        </div>
      </div>

      {/* ── Notification List ── */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          {notifications.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 sm:py-32 text-center px-6"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" />
              </div>
              <p className="text-base sm:text-lg font-medium text-gray-400">No notifications found</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 font-normal">Check back later for updates</p>
            </motion.div>
          ) : (
            notifications.map((notif: Notification, index: number) => {
              const cfg = categoryConfig[notif.type] || categoryConfig.SYSTEM;
              const Icon = cfg.icon;

              return (
                <motion.div
                  key={notif._id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.02 }}
                  onClick={() => handleMarkRead(notif._id, notif.read)}
                  className={cn(
                    "flex items-start gap-3 sm:gap-4 px-4 sm:px-6 py-5 border-b border-gray-50 last:border-none cursor-pointer transition-colors group relative",
                    !notif.read ? "bg-[#FFF9F6]" : "bg-white hover:bg-gray-50"
                  )}
                >
                  {/* Category Indicator Line */}
                  {!notif.read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#A53200]" />
                  )}

                  {/* Icon */}
                  <div className={cn("w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 mt-0.5", cfg.bg)}>
                    <Icon className={cn("w-5 h-5", cfg.iconColor)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-6 sm:pr-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-full">
                        <div className="flex items-center gap-2">
                          <p className={cn("text-[13px] sm:text-sm text-[#2C2E33] truncate", !notif.read ? "font-bold" : "font-semibold")}>
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-[#A53200] shrink-0" />
                          )}
                        </div>
                        <p className="text-xs sm:text-[13px] text-gray-500 mt-1 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-3 mt-3">
                      <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider", cfg.bg, cfg.iconColor)}>
                        {cfg.label}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-400 font-medium">
                        <Clock className="w-3 h-3" />
                        {notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }) : ""}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* ── Pagination ── */}
      {meta && meta.totalPage > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="rounded-lg h-9"
          >
            Previous
          </Button>
          <span className="text-sm font-medium text-gray-500 mx-4">
            Page {currentPage} of {meta.totalPage}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === meta.totalPage}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="rounded-lg h-9"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
