import { baseApi } from "../api/baseApi";



export const BrandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchAllBrand: builder.query({
      query: () => '/brand/get-all-brands',
      providesTags:['brand']
    }),
    
    addNewBrand:builder.mutation({
      query:(data)=>({
        url:'/brand/add-brand',
        method:'POST',
        body:data
      }),
      invalidatesTags:['brand'],
    }),
    deleteBrand:builder.mutation({
      query:(id)=>({
        url:`brand/delete-single-brand/${id}`,
        method:'DELETE',
      }),
      invalidatesTags:['brand'],
    }),
   
  }),
});

export const {useAddNewBrandMutation,useFetchAllBrandQuery,useDeleteBrandMutation} = BrandApi;