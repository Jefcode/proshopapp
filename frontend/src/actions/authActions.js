import { authActions } from '../slices/authSlice';

export const loginAction = (userData) => (dispatch) => {
  // Save to localStorage
  localStorage.setItem('userInfo', JSON.stringify(userData));

  dispatch(authActions.login(userData));
};

export const logoutAction = () => (dispatch) => {
  // remove from localStorage
  localStorage.removeItem('userInfo');

  dispatch(authActions.logout());
};
