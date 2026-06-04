import { baseApi } from "../../utils/apiBaseQuery";


export const memberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createUser: builder.mutation({
      query: ({ data }) => ({
        url: `/users/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["users"],
    }),

    getAllUsers: builder.query({
      query: ({ page }) => ({
        url: `/user-managements?page=${page}`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),

    getUserById: builder.query({
      query: ({ id }) => ({
        url: `/user-managements/single/${id}`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),

    getCompleteContribution: builder.query({
      query: ({ userId }) => ({
        url: `/user-managements/completed-contributions/${userId}`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),

    getInPendingContribution: builder.query({
      query: ({ userId }) => ({
        url: `/user-managements/pending-contributions/${userId}`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),


    getTotalDue: builder.query({
      query: ({ userId }) => ({
        url: `/user-managements/total-dues/${userId}`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),

    getUserAnalyticsCard: builder.query({
      query: () => ({
        url: `/user-managements/user-analysis`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),


    updateStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user-managements/status/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["users"],
    }),

    updateSuspended: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user-managements/suspension/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["users"],
    }),


  }),
});

// Export hooks
export const {
  useCreateUserMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useGetCompleteContributionQuery,
  useGetInPendingContributionQuery,
  useGetTotalDueQuery,
  useGetUserAnalyticsCardQuery,
  useUpdateStatusMutation,
  useUpdateSuspendedMutation,
} = memberApi;
