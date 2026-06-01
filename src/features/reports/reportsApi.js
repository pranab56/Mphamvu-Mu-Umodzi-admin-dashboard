import { baseApi } from "../../utils/apiBaseQuery";


export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({


    getEventReports: builder.query({
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

    deleteSingleEventReports: builder.mutation({
      query: ({ id }) => ({
        url: `/event-reports/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["reports"],
    }),

    replyEventReports: builder.mutation({
      query: ({ id, data }) => ({
        url: `/event-reports/reply/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["reports"],
    }),

  }),
});

// Export hooks
export const {
  useGetEventReportsQuery,
  useGetSingleEventReportsQuery,
  useDeleteSingleEventReportsMutation,
  useReplyEventReportsMutation,
} = reportsApi;
