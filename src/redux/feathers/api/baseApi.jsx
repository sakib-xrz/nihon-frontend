import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setUsers } from "../Auth/AuthSlice";
import { BASE_URL } from "@/utils/contant";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `${token}`);
    }
    return headers;
  },
});

const customBaseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();

    if (data?.data?.data.accessToken) {
      const user = api.getState().auth.user;
      api.dispatch(setUsers({ user, token: data?.data?.data.accessToken }));
      await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: customBaseQuery,
  endpoints: () => ({}),
});
