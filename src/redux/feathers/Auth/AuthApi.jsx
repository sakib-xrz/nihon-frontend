import { baseApi } from "../api/baseApi"


const authApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        login:builder.mutation({
            query:(userinfo)=>({
                url:'/auth/login',
                method:'POST',
                body:userinfo
            })
        }),
        register:builder.mutation({
            query:(data)=>({
                url:'/auth/register-user',
                method:'POST',
                body:data
            })
        })
    })
})

export const {useLoginMutation,useRegisterMutation} = authApi