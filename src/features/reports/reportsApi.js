import { baseApi } from "../../utils/apiBaseQuery";


export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ── Urgent Requests (from members to admin) ──────────────────────────────
    getUrgentRequests: builder.query({
      query: ({ page }) => ({
        url: `/event-reports?page=${page}`,
        method: "GET",
      }),
      providesTags: ["reports"],
    }),

    getSingleEventReports: builder.query({
      query: ({ id }) => ({
        url: `/event-reports/${id}`,
        method: "GET",
      }),
      providesTags: ["reports"],
    }),

    replyEventReports: builder.mutation({
      query: ({ id, data }) => ({
        url: `/event-reports/reply/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["reports"],
    }),

    deleteUrgentRequest: builder.mutation({
      query: ({ id }) => ({
        url: `/event-reports/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["reports"],
    }),

    // ── A. Event Contribution Report ─────────────────────────────────────────
    getEventReports: builder.query({
      query: ({ page, eventId, searchTerm, status }) => ({
        url: `/event-reports/event/${eventId}?page=${page}&searchTerm=${searchTerm}&status=${status}`,
        method: "GET",
      }),
      providesTags: ["reports"],
    }),

    getEventReportsExport: builder.query({
      query: ({ eventId, type }) => ({
        url: `/event-reports/event/${eventId}/export?type=${type}`,
        method: "GET",
      }),
      providesTags: ["reports"],
    }),

    // ── B. Master Member List Report ─────────────────────────────────────────
    getMasterMembersReports: builder.query({
      query: ({ page = 1 } = {}) => ({
        url: `/event-reports/get-master-members/report?page=${page}`,
        method: "GET",
      }),
      providesTags: ["reports"],
    }),

    getMasterMembersReportsExport: builder.query({
      query: ({ type }) => ({
        url: `/event-reports/get-master-members-report/export?type=${type}`,
        method: "GET",
      }),
      providesTags: ["reports"],
    }),

    // ── C. Suspended Members Report ──────────────────────────────────────────
    getSuspendMemberReports: builder.query({
      query: () => ({
        url: `/event-reports/get-suspended-members/report`,
        method: "GET",
      }),
      providesTags: ["reports"],
    }),

    getSuspendMemberReportsExport: builder.query({
      query: ({ type }) => ({
        url: `/event-reports/get-suspended-members-report/export?type=${type}`,
        method: "GET",
      }),
      providesTags: ["reports"],
    }),

  }),
  overrideExisting: true,
});

export const {
  // Urgent requests
  useGetUrgentRequestsQuery,
  useGetSingleEventReportsQuery,
  useReplyEventReportsMutation,
  useDeleteUrgentRequestMutation,
  // Report A
  useGetEventReportsQuery,
  useGetEventReportsExportQuery,
  // Report B
  useGetMasterMembersReportsQuery,
  useGetMasterMembersReportsExportQuery,
  // Report C
  useGetSuspendMemberReportsQuery,
  useGetSuspendMemberReportsExportQuery,
} = reportsApi;
