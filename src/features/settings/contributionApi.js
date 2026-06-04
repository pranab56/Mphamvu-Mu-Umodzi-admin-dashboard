import { baseApi } from "../../utils/apiBaseQuery";


export const contributionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getContributionConfig: builder.query({
      query: () => ({
        url: `/rules`,
        method: "GET",
      }),
      providesTags: ["rules"],
    }),

    updateContributionConfig: builder.mutation({
      query: ({ data }) => ({
        url: `/rules`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["rules"],
    }),

  }),
});

// Export hooks
export const {
  useGetContributionConfigQuery,
  useUpdateContributionConfigMutation,
} = contributionApi;
