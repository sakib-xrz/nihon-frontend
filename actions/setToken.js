"use server";

import { cookies } from "next/headers";

const setToken = async (token) => {
  cookies().set("REFRESH_TOKEN", token, {
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  });
};

export default setToken;
