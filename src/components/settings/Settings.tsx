"use client";

import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FinancialSettings } from "./FinancialSettings";
import { NotificationSettings } from "./NotificationSettings";
import { RolesSettings } from "./RolesSettings";

const legalDocs = [
  { id: 1, title: "FAQ's", updated: "2024-01-20", route: "/settings/faq" },
  { id: 2, title: "Terms of Service", updated: "2024-02-15", route: "/settings/terms" },
  { id: 3, title: "Privacy Policy", updated: "2024-02-15", route: "/settings/privacy" },
  { id: 4, title: "About Us", updated: "2024-02-18", route: "/settings/about" },
];

type SettingsTab = "Financial & Contribution Rules" | "Notifications" | "Legal Documents" | "Roles & Permissions";

function SettingsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  
  const mapParamToTab = (param: string | null): SettingsTab => {
    switch(param) {
      case "notifications": return "Notifications";
      case "legal": return "Legal Documents";
      case "roles": return "Roles & Permissions";
      default: return "Financial & Contribution Rules";
    }
  };

  const activeTab = mapParamToTab(tabParam);

  const setActiveTab = (tab: SettingsTab) => {
    const param = tab === "Notifications" ? "notifications" : 
                  tab === "Legal Documents" ? "legal" : 
                  tab === "Roles & Permissions" ? "roles" : "financial";
    router.replace(`?tab=${param}`);
  };

  return (
    <div className="w-full py-6 pb-20">
      <div className="w-full flex flex-col gap-10">
        {/* Header */}
        <div>
          <h1 className="text-[32px] font-medium text-gray-900 tracking-tight">Settings</h1>
          <p className="text-base text-gray-500 font-normal mt-2">Review, verify and manage merchant registrations across the ecosystem.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-[#EAECEF] rounded-full p-1.5 w-fit">
          {(["Financial & Contribution Rules", "Notifications", "Legal Documents", "Roles & Permissions"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative px-6 py-2.5 rounded-full text-[13px] font-medium transition-all cursor-pointer z-10",
                activeTab === tab ? "text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="settingsTabBubble"
                  className="absolute inset-0 bg-[#8B2F0E] rounded-full -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "Financial & Contribution Rules" && <FinancialSettings />}
            {activeTab === "Notifications" && <NotificationSettings />}
            {activeTab === "Roles & Permissions" && <RolesSettings />}
            {activeTab === "Legal Documents" && (
              <div className="flex flex-col gap-4">
                <div className="bg-white border border-gray-100 rounded-2xl px-8 py-6 shadow-sm mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Legal Documents</h2>
                  <p className="text-sm text-gray-500 font-normal mt-1">Modify or update terms of service, privacy policies, and other legal documents</p>
                </div>
                {legalDocs.map((doc) => (
                  <div key={doc.id} onClick={() => router.push(doc.route)} className="bg-white cursor-pointer border border-gray-100 rounded-2xl px-8 py-6 flex items-center justify-between shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-50 transition-colors">
                        <FileText className="w-5 h-5 text-gray-400 group-hover:text-[#8B2F0E]" />
                      </div>
                      <div>
                        <p className="text-base font-medium text-gray-900">{doc.title}</p>
                        <p className="text-xs text-gray-400 font-normal mt-1">Last updated: {doc.updated}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

export default function Settings() {
  return (
    <Suspense fallback={null}>
      <SettingsInner />
    </Suspense>
  );
}
