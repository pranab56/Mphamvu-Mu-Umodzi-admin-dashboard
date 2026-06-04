import { baseApi } from "../../utils/apiBaseQuery";


export const eventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEvent: builder.mutation({
      query: ({ data }) => ({
        url: `/events/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["event"],
    }),

    updateEvent: builder.mutation({
      query: ({ data, id }) => ({
        url: `/events/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["event"],
    }),


    getAllEvents: builder.query({
      query: ({ status, page }) => ({
        url: `/events?status=${status}&page=${page}`, // active || completed
        method: "GET",
      }),
      providesTags: ["event"],
    }),

    getSingleEvent: builder.query({
      query: ({ id }) => ({
        url: `/events/single/${id}`,
        method: "GET",
      }),
      providesTags: ["event"],
    }),

    eventTransection: builder.query({
      query: ({ userId, page }) => ({
        url: `/transactions/event-transactions/${userId}?page=${page}`,
        method: "GET",
      }),
      providesTags: ["event"],
    }),

    deleteEvent: builder.mutation({
      query: ({ id }) => ({
        url: `/events/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["event"],
    }),

    updateStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/events/update-status/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["event"],
    }),

    getEventAnalysis: builder.query({
      query: () => ({
        url: `/events/analysis`,
        method: "GET",
      }),
      providesTags: ["event"],
    }),
  }),
});

export const {
  useCreateEventMutation,
  useUpdateEventMutation,
  useGetAllEventsQuery,
  useGetSingleEventQuery,
  useEventTransectionQuery,
  useDeleteEventMutation,
  useUpdateStatusMutation,
  useGetEventAnalysisQuery,
} = eventApi;
