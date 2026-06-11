import { baseApi } from "../../utils/apiBaseQuery";


export const requestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({


    getEventRequest: builder.query({
      query: ({ page }) => ({
        url: `/event-reports?page=${page}`,
        method: "GET",
      }),
      providesTags: ["reports"],
    }),

    getSingleEventRequest: builder.query({
      query: ({ id }) => ({
        url: `/event-reports/${id}`,
        method: "GET",
      }),
      providesTags: ["reports"],
    }),

    deleteSingleEventRequest: builder.mutation({
      query: ({ id }) => ({
        url: `/event-reports/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["reports"],
    }),

    replyEventRequest: builder.mutation({
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
  useGetEventRequestQuery,
  useLazyGetSingleEventRequestQuery,
  useDeleteSingleEventRequestMutation,
  useReplyEventRequestMutation,
} = requestApi;
