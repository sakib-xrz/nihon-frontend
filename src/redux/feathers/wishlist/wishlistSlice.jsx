import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'sonner';


const initialState = {
    wishlist: typeof window !== 'undefined' && localStorage.getItem("wishlist")
        ? JSON.parse(localStorage.getItem("wishlist"))
        : [],
};

export const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        toggleWishlistItem: (state, action) => {
            const existingWishlistItem = state.wishlist.find((item) => item._id === action.payload._id);
            
            if (existingWishlistItem) {
                state.wishlist = state.wishlist.filter((item) => item._id !== action.payload._id);
                localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
                toast.warning("Removed from wishlist");
            } else {
                state.wishlist.push(action.payload);
                localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
                toast.success("Added to wishlist");
            }
        },
        removeWishlistItem: (state, action) => {
            state.wishlist = state.wishlist.filter((item) => item._id !== action.payload.key);
            localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
            toast.warning("Removed from wishlist");
        }
    },
});

export const { toggleWishlistItem, removeWishlistItem } = wishlistSlice.actions;
export default wishlistSlice.reducer;