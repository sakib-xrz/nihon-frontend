"use client"
import { configureStore } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authSlice from './feathers/Auth/AuthSlice'
import { productApi } from './feathers/Product/ProductApi'
import { ProductSlice } from './feathers/Product/ProductSlice'
import { wishlistSlice } from './feathers/wishlist/wishlistSlice'


const persistConfig = {
  key:'auth',
  storage
}
const persistAuthReducers = persistReducer(persistConfig,authSlice)


export const store = configureStore({
  reducer: {
        [productApi.reducerPath]:productApi.reducer,
        products:ProductSlice.reducer,
        wishlist:wishlistSlice.reducer,
        auth:persistAuthReducers,
  },
  middleware:(getDefaultMiddelware)=>getDefaultMiddelware({serializableCheck:{
    ignoredActions:[FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER]
  }}).concat(productApi.middleware)
})

export const persistor = persistStore(store)