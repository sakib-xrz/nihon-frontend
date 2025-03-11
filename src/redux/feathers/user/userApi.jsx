import { baseApi } from "../api/baseApi";



export const UserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchAllUsers: builder.query({
      query: () => '/user/get-all-users',
      providesTags:['user']
    }),
   
  }),
});

export const {useFetchAllUsersQuery} = UserApi;