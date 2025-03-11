import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'sonner';

const initialState = {
    cartItem: typeof window !== 'undefined' && localStorage.getItem("cartItem")
        ? JSON.parse(localStorage.getItem("cartItem"))
        : [],
};



export const ProductSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // add product 
        addProduct: (state, action) => {
            const existingProduct = state.cartItem.find(
                (item) => item._id === action.payload._id
            );
            if (existingProduct) {
                if (existingProduct.in_stock === 0) {
                    toast.error("Sorry, the item is out of stock.");
                } else if (existingProduct.in_stock <= existingProduct.quantity) {
                    toast.error("Sorry, the item is out of stock.");
                } else {
                    existingProduct.quantity += 1;
                    localStorage.setItem("cartItem", JSON.stringify(state.cartItem));
                    toast.success("Added to cart");
                }
            } else {
                if (action.payload.in_stock === 0) {
                    toast.error("Sorry, the item is out of stock.");
                } else {
                    const newProduct = { ...action.payload, quantity: 1 };
                    state.cartItem.push(newProduct);
                    localStorage.setItem("cartItem", JSON.stringify(state.cartItem));
                    toast.success("Added to cart");
                }
            }
        },

        decrementQuantity: (state, action) => {
            const existingProduct = state.cartItem.find(item => item._id === action.payload._id);
            if (existingProduct) {
                if (existingProduct.quantity > 1) {
                    existingProduct.quantity -= 1;
                    toast.warning("Decrementing quantity");
                } else {
                    state.cartItem = state.cartItem.filter(item => item._id !== action.payload._id);
                    toast.error("Removed from cart");
                }
                localStorage.setItem("cartItem", JSON.stringify(state.cartItem));
            }
        },

        updateQuantity: (state, action) => {
            const { _id, quantity } = action.payload;
            const existingProduct = state.cartItem.find(item => item._id === _id);

            if (existingProduct) {
                // Ensure quantity is set to 1 if it's null, undefined, or an empty string
                let updatedQuantity = 1; // Default to 1

                if (quantity && !isNaN(quantity) && quantity > 0) {
                    updatedQuantity = quantity; // Use the provided quantity if valid
                }

                if (updatedQuantity > existingProduct.in_stock) {
                    toast.error("Quantity exceeds available stock.");
                    return;
                }

                existingProduct.quantity = updatedQuantity;

                // Update localStorage with the updated cart
                localStorage.setItem("cartItem", JSON.stringify(state.cartItem));
                toast.success("Quantity updated successfully.");
            }
        },

        deleteFromCart: (state, action) => {
            const existingProduct = state.cartItem.find(item => item._id === action.payload.key); 
            if (existingProduct) {
                state.cartItem = state.cartItem.filter(item => item._id !== action.payload.key); 
                localStorage.setItem("cartItem", JSON.stringify(state.cartItem));
                toast.warning(`${existingProduct.name} has been removed from your cart`);
            }
        },
        clearCart: (state) => {
            state.cartItem = [];
            localStorage.setItem("cartItem", JSON.stringify(state.cartItem));
        }
    }
});

export const { clearCart, addProduct, decrementQuantity, updateQuantity, deleteFromCart } = ProductSlice.actions;
export default ProductSlice.reducer;