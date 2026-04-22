"use client";

import CardStates from "./CardStates";
import ContributionTrends from "./ContributionTrends";
import MembershipGrowth from "./MembershipGrowth";
import RecentEvents from "./RecentEvents";

export default function Overview() {
  return (
    <div className="py-6 space-y-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-4xl font-bold text-[#1A1C1F]">Dashboard Overview</h1>
          <p className="text-lg text-gray-400 mt-1 font-semibold">Real-time metrics from the Verdant network.</p>
        </div>
      </div>

      {/* ── Row 1: Stat Cards ── */}
      <CardStates />

      {/* ── Row 2: Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ContributionTrends />
        <MembershipGrowth />
      </div>

      {/* ── Row 3: Recent Events Table ── */}
      <RecentEvents />

    </div>
  );
}
