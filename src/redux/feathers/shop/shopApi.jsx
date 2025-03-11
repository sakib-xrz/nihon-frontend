import { baseApi } from "../api/baseApi";


export const CategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchAllCategory: builder.query({
      query: () => '/category/get-all-categories',
      providesTags:['category']
    }),
    
    fetchSingleCategory: builder.query({
      query: (id) => `/category/get-single-category/${id}`,
      providesTags:['category']
    }),
    
    addNewCategory:builder.mutation({
      query:(data)=>({
        url:'/category/add-category',
        method:'POST',
        body:data
      }),
      invalidatesTags:['category'],
    }),
    updateCategory: builder.mutation({
      query: (info) => {
        return {
          url: `/category/update-single-category/${info.id}`, 
          method: 'PUT',
          body: info.data, 
        };
      },
      invalidatesTags: ['category'], 
    }),
    deleteCategory: builder.mutation({
      query: (id) => {
        return {
          url: `/category/delete-single-category/${id}`, 
          method: 'DELETE',
        };
      },
      invalidatesTags: ['category'], 
    }),
  }),
});

export const {useUpdateCategoryMutation,useDeleteCategoryMutation,useAddNewCategoryMutation,useFetchAllCategoryQuery,useFetchSingleCategoryQuery} = CategoryApi;