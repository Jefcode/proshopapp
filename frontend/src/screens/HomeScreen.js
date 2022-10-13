import { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { listProducts } from '../actions/productActions';
import Product from '../components/Product';
import { productActions } from '../slices/productSlice';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const keyword = params.keyword;

  const pageNumber = params.pageNumber || 1;

  // products from redux
  const {
    items: products,
    isSuccess,
    isError,
    isLoading,
    message,
    pages,
    page,
  } = useSelector((state) => state.products);

  // get all products
  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  // reset redux when getting posts was done
  useEffect(() => {
    if (isSuccess) {
      dispatch(productActions.reset());
    }
  }, [isSuccess, dispatch]);

  return (
    <>
      <Meta title='Welcome to ProShop' />

      {!keyword && <ProductCarousel />}
      <h1>Latest Products</h1>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant='danger'>{message}</Message>
      ) : (
        <>
          <Row>
            {products.length === 0 ? (
              <Col>
                <Message>No products found</Message>
              </Col>
            ) : (
              products.map((product) => (
                <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
                  <Product product={product} />
                </Col>
              ))
            )}
          </Row>
          <Paginate pages={pages} page={page} keyword={keyword} />
        </>
      )}
    </>
  );
};

export default HomeScreen;
