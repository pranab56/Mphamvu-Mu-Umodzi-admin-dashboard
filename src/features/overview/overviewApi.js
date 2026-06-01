import { baseApi } from "../../utils/apiBaseQuery";


export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({


    getContributionTrends: builder.query({
      query: () => ({
        url: "/dashboard/contribution-trends",
        method: "GET",
      }),
      providesTags: ["overview"],
    }),

    getMembershipGrowth: builder.query({
      query: () => ({
        url: "/dashboard/membership-growth",
        method: "GET",
      }),
      providesTags: ["overview"],
    }),

    getRecentEvents: builder.query({
      query: () => ({
        url: "/events/resent",
        method: "GET",
      }),
      providesTags: ["overview"],
    }),

    overviewState: builder.query({
      query: () => ({
        url: "/dashboard/admin-stats",
        method: "GET",
      }),
      providesTags: ["overview"],
    }),

  }),
});

// Export hooks
export const {
  useGetContributionTrendsQuery,
  useGetMembershipGrowthQuery,
  useGetRecentEventsQuery,
  useOverviewStateQuery,
} = authApi;
