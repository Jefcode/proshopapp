import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Message from '../components/Message';
import Loader from '../components/Loader';
import useHttp from '../hooks/use-http';
import { listProducts } from '../actions/productActions';
import Paginate from '../components/Paginate';
import { useParams } from 'react-router-dom';

const ProductListScreen = () => {
  const navigate = useNavigate();
  const params = useParams();

  const pageNumber = params.pageNumber || 1;

  const dispatch = useDispatch();
  const {
    items: products,
    isError: errorProducts,
    isLoading: loadingProducts,
    pages,
    page,
  } = useSelector((state) => state.products);

  // useHttp => delete product prep
  const {
    isLoading: loadingDelete,
    error: errorDelete,
    success: successDelete,
    sendRequest: deleteProduct,
  } = useHttp('DELETE');

  // useHttp => create product prep
  const {
    results: createdProduct,
    isLoading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    sendRequest: createProduct,
  } = useHttp('POST');

  // Get user token
  const { token } = useSelector((state) => state.auth);
  const authConfig = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  // Get all products
  useEffect(() => {
    dispatch(listProducts('', pageNumber));
  }, [dispatch, successDelete, pageNumber]);

  // Delete Product
  const deleteProductHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      deleteProduct(`/api/products/${id}`, null, authConfig);
    }
  };

  // Create product
  const createProductHandler = () => {
    createProduct('/api/products', null, authConfig);
  };

  // Redirect to edit product if creation was successfull
  useEffect(() => {
    if (successCreate) {
      navigate(`/admin/product/${createdProduct._id}/edit`);
    }
  }, [successCreate, navigate, createdProduct]);

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-right'>
          <Button
            variant='primary'
            className='my-3'
            onClick={createProductHandler}
          >
            <i className='fas fa-plus'></i> Create Product
          </Button>
        </Col>
      </Row>

      {loadingDelete && <Loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}

      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}

      {loadingProducts ? (
        <Loader />
      ) : errorProducts ? (
        <Message variant='danger'>{errorProducts}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteProductHandler(product._id)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>

                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
