import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    loading(state) {
      state.isLoading = true;
    },
    success(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
      state.items = action.payload.products;
      state.pages = action.payload.pages;
      state.page = action.payload.page;
    },
    fail(state, action) {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    },
    reset(state) {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
});

export const productActions = productSlice.actions;
export default productSlice.reducer;
