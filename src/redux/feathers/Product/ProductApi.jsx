import { BASE_URL } from "@/utils/contant";
import { baseApi } from "../api/baseApi";
export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // fetchAllProducts: builder.query({
    //   query: (args) => {
    //     const queryString = new URLSearchParams(
    //       args.reduce((acc, { name, value }) => {
    //         if (value) acc[name] = value;
    //         return acc;
    //       }, {})
    //     ).toString();

    //     return {
    //       url: `/product/get-all-products?${queryString}`,
    //       method: 'GET',
    //     };
    //   },
    //   providesTags: ['product'],
    // }),

    fetchSingleProduct: builder.query({
      query: (id) => `/product/get-single-product/${id}`,
    }),

    addNewProduct: builder.mutation({
      query: (data) => ({
        url: "/product/add-product",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["product"],
    }),

    updateProduct: builder.mutation({
      query: (info) => {
        return {
          url: `/product/update-product-details/${info.id}`,
          method: "PATCH",
          body: info.data,
        };
      },
      invalidatesTags: ["product"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => {
        return {
          url: `/product/delete-single-product/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["product"],
    }),
    onMarketStatus: builder.mutation({
      query: ({ id, info }) => {
        console.log(id, info);
        return {
          url: `${BASE_URL}/product/update-product-on-market/${id}`,
          method: "PATCH",
          body: info,
        };
      },
      invalidatesTags: ["product"],
    }),

    fetchAllProducts: builder.query({
      query: (params) => {
        return {
          url: "/product/get-all-products",
          method: "GET",
          params,
        };
      },
      providesTags: ["product"],
    }),
  }),
});

export const {
  useDeleteProductMutation,
  useUpdateProductMutation,
  useOnMarketStatusMutation,
  useAddNewProductMutation,
  useFetchAllProductsQuery,
  useFetchSingleProductQuery,
} = productApi;
