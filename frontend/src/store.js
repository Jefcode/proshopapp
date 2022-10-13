import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';

const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    auth: authReducer
  },
});

export default store;
