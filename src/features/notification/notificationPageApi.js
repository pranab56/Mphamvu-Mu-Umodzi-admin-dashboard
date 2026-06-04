import { baseApi } from "../../utils/apiBaseQuery";


export const notificationPageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getNotifications: builder.query({
      query: ({ page }) => ({
        url: `/notifications?page=${page}`,
        method: "GET",
      }),
      providesTags: ["notification"],
    }),

    readAllNotifications: builder.mutation({
      query: () => ({
        url: "/notifications",
        method: "PATCH",
      }),
      invalidatesTags: ["notification"],
    }),

    readSingleNotification: builder.mutation({
      query: ({ id }) => ({
        url: `/notifications/read/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["notification"],
    }),

  }),
});

// Export hooks
export const {
  useGetNotificationsQuery,
  useReadAllNotificationsMutation,
  useReadSingleNotificationMutation,
} = notificationPageApi;
