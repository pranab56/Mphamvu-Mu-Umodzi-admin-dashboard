import { baseApi } from "../../utils/apiBaseQuery";


export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query({
      query: ({ searchTerm = "", status = "", page = 1 } = {}) => ({
        url: `/transactions?searchTerm=${searchTerm}&status=${status}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["payment"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetPaymentsQuery,
} = paymentsApi;
