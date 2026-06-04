import { baseApi } from "../../utils/apiBaseQuery";


export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query({
      query: ({ searchTerm = "", page = 1 } = {}) => ({
        url: `/transactions?searchTerm=${searchTerm}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["payment"],
    }),
  }),
});

// Export hooks
export const {
  useGetPaymentsQuery,
} = paymentsApi;
