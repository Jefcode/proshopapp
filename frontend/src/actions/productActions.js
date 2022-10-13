import axios from 'axios';
import { productActions } from '../slices/productSlice';

const API_URL = '/api/products';

export const listProducts =
  (keyword = '', pageNumber = '') =>
  async (dispatch) => {
    try {
      dispatch(productActions.loading());

      const { data } = await axios.get(
        `${API_URL}?keyword=${keyword}&pageNumber=${pageNumber}`
      );

      dispatch(productActions.success(data));
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch(productActions.fail(message));
    }
  };
