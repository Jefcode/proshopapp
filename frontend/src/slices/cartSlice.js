import { createSlice } from '@reduxjs/toolkit';

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
    paymentMethod: '',
  },
  reducers: {
    addToCart(state, action) {
      const item = action.payload;

      const existingItem = state.cartItems.find(
        (x) => x.product === action.payload.product
      );

      if (existingItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === item.product ? item : x
        );
      } else {
        state.cartItems.push(item);
      }
    },
    removeFromCart(state, action) {
      state.cartItems = state.cartItems.filter(
        (x) => x.product !== action.payload
      );
    },
    saveShippingAddress(state, action) {
      state.shippingAddress = action.payload;
    },
    savePaymentMethod(state, action) {
      state.paymentMethod = action.payload;
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
