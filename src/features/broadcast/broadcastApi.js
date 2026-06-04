import { baseApi } from "../../utils/apiBaseQuery";


export const broadcastApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    sendBroadcast: builder.mutation({
      query: ({ data }) => ({
        url: `/bulk-notification/send`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["broadcast"],
    }),
  }),
});

// Export hooks
export const {
  useSendBroadcastMutation,
} = broadcastApi;
