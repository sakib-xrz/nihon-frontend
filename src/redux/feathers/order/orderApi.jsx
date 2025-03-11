import { baseApi } from "../api/baseApi";



export const OrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchAllOrders: builder.query({
      query: () => '/order/get-orders',
      providesTags:['user']
    }),
  }),
});

export const {useFetchAllOrdersQuery} = OrderApi;