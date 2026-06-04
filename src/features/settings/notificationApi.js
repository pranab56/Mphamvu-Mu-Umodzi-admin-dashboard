import { baseApi } from "../../utils/apiBaseQuery";


export const NotificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getNotificationConfig: builder.query({
      query: () => ({
        url: `/notification-config`,
        method: "GET",
      }),
      providesTags: ["notification-config"],
    }),

    updateNotificationConfig: builder.mutation({
      query: ({ data }) => ({
        url: `/notification-config`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["notification-config"],
    }),

  }),
});

// Export hooks
export const {
  useGetNotificationConfigQuery,
  useUpdateNotificationConfigMutation,
} = NotificationApi;
