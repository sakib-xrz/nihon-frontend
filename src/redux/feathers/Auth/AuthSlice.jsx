import {createSlice} from '@reduxjs/toolkit'
const initialState = {
    user:null ,
    token:null 
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setUsers:(state,action)=>{
            console.log(state)
            const {user,token}= action.payload
            state.user = user 
            state.token = token
        },
        logout:(state)=>{
            state.user = null
            state.token = null
        }
    }
})

export const {setUsers,logout} = authSlice.actions
export default authSlice.reducer
export const currentToken = (state)=> state.auth.token
export const currentUser = (state)=> state.auth.user