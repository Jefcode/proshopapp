import { createSlice } from '@reduxjs/toolkit';

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : {
      name: null,
      email: null,
      token: null,
      isAdmin: false,
    };

const initialState = userInfoFromStorage;

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.token = action.payload.token;
      state.isAdmin = action.payload.isAdmin;
    },
    logout(state) {
      return {
        email: null,
        name: null,
        token: null,
        isAdmin: false,
      };
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
