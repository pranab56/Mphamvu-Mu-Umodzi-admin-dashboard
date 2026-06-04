import { baseApi } from "../../utils/apiBaseQuery";


export const dependentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getPendingDependents: builder.query({
      query: ({ page }) => ({
        url: `/dependents/pending?page=${page}`,
        method: "GET",
      }),
      providesTags: ["dependents"],
    }),

    updateStatusDependents: builder.mutation({
      query: ({ id, data }) => ({
        url: `/dependents/update-status/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["dependents"],
    }),
  }),
});

export const {
  useGetPendingDependentsQuery,
  useUpdateStatusDependentsMutation,
} = dependentsApi;
