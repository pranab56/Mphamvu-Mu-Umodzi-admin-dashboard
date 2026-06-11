import type { Metadata } from "next";
import type { CSSProperties } from "react";
// import { Geist, Geist_Mono } from "next/font/google";
import OptimusSidebar from "@/components/appSidebar/AppsideBar";
import Header from "@/components/header/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import "../globals.css";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "RIZIPT Receipt Scanner Admin Dashboard",
  description: "RIZIPT Receipt Scanner Admin Dashboard for Future Pharmacy",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <SidebarProvider
        defaultOpen={true}
        style={{ "--sidebar-width": "260px" } as CSSProperties}
      >
        <OptimusSidebar />
        <SidebarInset className="bg-gray-100 flex flex-col overflow-hidden h-svh min-w-0">
          <Header />
          <main className="flex-1 p-4 md:p-8 overflow-y-auto min-w-0 flex flex-col">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
