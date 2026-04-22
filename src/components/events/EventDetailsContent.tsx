"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, FileText, MapPin, Phone, Mail, Edit2 } from "lucide-react";
import { ActionModal } from "../members/ActionModals";

export function EventDetailsContent() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Image */}
      <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-sm">
        <Image
          src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070"
          alt="Event Hero"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="">
        {/* Title Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-medium text-gray-900">Support for Banda Family</h2>
            <Badge className="bg-[#DCFCE7] text-[#16A34A] border-none shadow-none px-4 py-1 rounded-sm text-sm font-normal">
              Active
            </Badge>
          </div>
          <Badge className="bg-[#FFF7ED] text-[#9A3412] border-none shadow-none px-4 py-1 rounded-sm text-sm font-normal">
            Member Funeral
          </Badge>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-4xl font-normal">
          Our fellow member&apos;s family is going through a difficult time. We are coming together to provide support during this period of mourning.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Min Contribution", value: "$ 30.00", icon: "$" },
            { label: "Targeted Amount", value: "$ 2,130.00", icon: "$" },
            { label: "Created on", value: "April 1, 2026", icon: "calendar" },
            { label: "Deadline", value: "April 10, 2026", icon: "calendar" },
          ].map((stat, i) => (
            <div key={i} className="bg-neutral-50/80 p-5 rounded-lg border border-neutral-100/50">
              <div className="flex items-center gap-2 mb-2">
                {stat.icon === "$" ? (
                  <span className="text-gray-400 font-normal text-lg">$</span>
                ) : (
                  <Clock className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-sm text-gray-400 font-normal">{stat.label}</span>
              </div>
              <p className="text-xl font-medium text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Warning Box */}
        <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg p-6 mb-10 flex items-start gap-4">
          <div className="bg-[#EF4444] p-2 rounded-lg mt-1">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="text-[#991B1B] font-medium text-lg">Only 1 days remaining</h4>
            <p className="text-[#B91C1C] text-sm mt-1 opacity-70 font-normal">
              Make your payment within 7 days to skip a $5 penalty. Missed payments and penalty fee will be added to your due balance.
            </p>
          </div>
        </div>

        {/* Participation Section */}
        <div className="bg-neutral-50/50 rounded-lg p-6 border border-neutral-100/50 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium tracking-tight">Community Participation</span>
              <span className="text-gray-900 font-medium">94%</span>
            </div>
            <Progress value={94} className="h-2.5 bg-gray-200" />
            <p className="text-xs text-gray-400 font-normal">38 of 45 members paid</p>
          </div>

          <div className="pt-2 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-normal">Total Contributed Balance</span>
              <span className="text-2xl font-normal text-[#16A34A]">$ 1,135.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-normal">Total Beneficiary Share Balance (90% of total balance)</span>
              <span className="text-2xl font-normal text-[#9A3412]">$ 1,021.50</span>
            </div>
          </div>
        </div>
      </div>

      {/* Beneficiary Details Section */}
      <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)]">
        <h3 className="text-xl font-medium text-gray-900 mb-8 tracking-tight font-poppins">Beneficiary Details</h3>

        <div className="bg-neutral-50/50 rounded-lg p-8 border border-neutral-100/50 flex flex-col lg:flex-row gap-10 items-start justify-between">
          <div className="flex gap-6 items-start">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-sm shrink-0">
              <Image
                src="https://avatar.iran.liara.run/public/boy?username=John"
                alt="Beneficiary"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-2xl font-medium text-gray-900">John Banda</h4>
                  <Badge variant="secondary" className="text-[#B45309] font-normal px-0 py-0 hover:bg-transparent">
                    Member
                  </Badge>
                </div>
                <div className="flex flex-col gap-2.5 mt-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm font-normal">
                    <Mail className="w-4 h-4" /> john.banda@email.com
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm font-normal">
                    <Phone className="w-4 h-4" /> +265 999 123 456
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm font-normal tracking-wide">
                    <MapPin className="w-4 h-4" /> Lilongwe, Malawi
                  </div>
                  <div className="flex items-center gap-2 text-primary font-medium text-sm mt-1 cursor-pointer hover:underline underline-offset-4 decoration-2">
                    <FileText className="w-4 h-4" /> NID.pdf
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:max-w-md space-y-4">
            <div className="flex items-center gap-2 text-orange-700 text-sm font-medium justify-end lg:justify-end">
              <CheckCircle2 className="w-4 h-4 fill-orange-700 text-white" />
              Verified Beneficiary
            </div>
            <p className="text-gray-500 text-sm leading-relaxed text-right font-normal">
              This fund is being raised to support funeral expenses and assist the family during this difficult time. Contributions will help cover burial costs and provide immediate financial relief to the beneficiary.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-center lg:justify-end gap-4 mt-12">
          <Button variant="outline" className="h-12 px-20  rounded-full border-gray-200 text-gray-600 gap-2 font-medium hover:bg-gray-50 transition-all flex items-center">
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
          <ActionModal
            type="markComplete"
            trigger={
              <Button className="h-12 px-10 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white font-medium shadow-sm transition-all active:scale-95">
                Mark as Completed
              </Button>
            }
          />
          <ActionModal
            type="closeEvent"
            trigger={<Button className="h-12 px-10 rounded-full bg-[#8B2F0E] hover:bg-[#70260B] text-white font-medium shadow-sm transition-all active:scale-95">
              Close Event
            </Button>}
          />
          <ActionModal
            type="delete"
            key={""}
            trigger={
              <Button className="h-12 px-10 rounded-full bg-[#EF4444] hover:bg-[#DC2626] text-white font-medium shadow-sm transition-all active:scale-95">
                Delete
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
