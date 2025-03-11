import { baseApi } from "../api/baseApi";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addProductReview: builder.mutation({
      query: (information) => {
        console.log(information)
        return {
          url: `/review/add-product-review/${information.id}`,
          method: "POST",
          body: information.data,
        };
      },
      providesTags: ['productReview'],
    }),
  }),
});

export const { useAddProductReviewMutation } = reviewApi;
