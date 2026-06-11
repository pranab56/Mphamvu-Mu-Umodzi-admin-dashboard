import { baseApi } from "../../utils/apiBaseQuery";


export const createAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMember: builder.mutation({
      query: ({ data }) => ({
        url: `/team-members/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["createAdmin"],
    }),

    updateMember: builder.mutation({
      query: ({ data, id }) => ({
        url: `/team-members/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["createAdmin"],
    }),

    updateMemberByAdmin: builder.mutation({
      query: ({ data, id }) => ({
        url: `/user-managements/update-profile-by-admin/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["createAdmin"],
    }),

    deleteMember: builder.mutation({
      query: ({ id }) => ({
        url: `/team-members/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["createAdmin"],
    }),

    getAllAdmins: builder.query({
      query: ({ page }) => ({
        url: `/team-members?page=${page}`,
        method: "GET",
      }),
      providesTags: ["createAdmin"],
    }),
  }),
});

// Export hooks
export const {
  useCreateMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
  useGetAllAdminsQuery,
  useUpdateMemberByAdminMutation,
} = createAdminApi;
