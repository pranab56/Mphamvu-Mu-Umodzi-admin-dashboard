"use client";

import CardStates from "./CardStates";
import ContributionTrends from "./ContributionTrends";
import MembershipGrowth from "./MembershipGrowth";
import RecentEvents from "./RecentEvents";
import { useGetRecentEventsQuery, useOverviewStateQuery , useGetMembershipGrowthQuery, useGetContributionTrendsQuery } from "@/features/overview/overviewApi";

export default function Overview() {
  const { data: overviewStateData, isLoading: isOverviewStateLoading} = useOverviewStateQuery(undefined);

  const {data: recentEventsData, isLoading: isRecentEventsLoading} = useGetRecentEventsQuery(undefined);

  const {data: membershipGrowthData, isLoading: isMembershipGrowthLoading} = useGetMembershipGrowthQuery(undefined);

  const {data: contributionTrendsData, isLoading: isContributionTrendsLoading} = useGetContributionTrendsQuery(undefined);

  
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
      <CardStates data={overviewStateData?.data} isLoading={isOverviewStateLoading} />

      {/* ── Row 2: Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ContributionTrends data={contributionTrendsData?.data} isLoading={isContributionTrendsLoading} />
        <MembershipGrowth data={membershipGrowthData?.data} isLoading={isMembershipGrowthLoading} />
      </div>

      {/* ── Row 3: Recent Events Table ── */}
      <RecentEvents data={recentEventsData?.data} isLoading={isRecentEventsLoading} />

    </div>
  );
}
