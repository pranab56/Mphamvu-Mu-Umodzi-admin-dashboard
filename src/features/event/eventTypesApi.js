import { baseApi } from "../../utils/apiBaseQuery";


export const eventTypesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createEventTypes: builder.mutation({
      query: ({ data }) => ({
        url: `/event-types/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["event-types"],
    }),

    getAllEventTypes: builder.query({
      query: () => ({
        url: `/event-types`,
        method: "GET",
      }),
      providesTags: ["event-types"],
    }),

    deleteEventType: builder.mutation({
      query: ({ id }) => ({
        url: `/event-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["event-types"],
    }),


  }),
});

export const {
  useCreateEventTypesMutation,
  useGetAllEventTypesQuery,
  useDeleteEventTypeMutation,
} = eventTypesApi;
