import axios from 'axios';
import { cartActions } from '../slices/cartSlice';

export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`);

  dispatch(
    cartActions.addToCart({
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    })
  );

  // Save to localStorage
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (productId) => (dispatch, getState) => {
  // Remove from cart
  dispatch(cartActions.removeFromCart(productId));

  // Remove from LocalStorage
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const saveShippingAddress = (shippingData) => (dispatch) => {
  dispatch(cartActions.saveShippingAddress(shippingData));

  localStorage.setItem('shippingAddress', JSON.stringify(shippingData));
};

export const savePaymentMethod = (paymentMethod) => (dispatch) => {
  dispatch(cartActions.savePaymentMethod(paymentMethod));

  localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));
};
