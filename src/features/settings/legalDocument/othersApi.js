import { baseApi } from "../../../utils/apiBaseQuery";


export const othersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getSettingByKey: builder.query({
      query: ({ key }) => ({
        url: `/settings?key=${key}`,
        method: "GET",
      }),
      providesTags: ["settings"],
    }),

    updateSettingByKey: builder.mutation({
      query: ({ data }) => ({
        url: `/settings/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["settings"],
    }),
  }),
});

// Export hooks
export const {
  useGetSettingByKeyQuery,
  useUpdateSettingByKeyMutation,
} = othersApi;
