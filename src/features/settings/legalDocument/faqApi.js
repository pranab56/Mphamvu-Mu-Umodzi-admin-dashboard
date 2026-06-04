import { baseApi } from "../../../utils/apiBaseQuery";


export const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getFaq: builder.query({
      query: () => ({
        url: `/faqs`,
        method: "GET",
      }),
      providesTags: ["faqs"],
    }),

    createFaq: builder.mutation({
      query: (data) => ({
        url: `/faqs/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["faqs"],
    }),

    updateFaq: builder.mutation({
      query: ({ id, data }) => ({
        url: `/faqs/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["faqs"],
    }),

    deleteFaq: builder.mutation({
      query: ({ id }) => ({
        url: `/faqs/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["faqs"],
    }),


  }),
});

// Export hooks
export const {
  useGetFaqQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqApi;
