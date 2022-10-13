import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import useHttp from '../hooks/use-http';

const ProductEditScreen = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { productId } = params;

  // useHttp => get product details
  const {
    results: product,
    isLoading: loadingProduct,
    error: errorProduct,
    success: successProduct,
    sendRequest: getProductDetails,
  } = useHttp('GET', true);

  // useHttp => get product details
  const {
    isLoading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
    sendRequest: updateProduct,
  } = useHttp('PUT');

  // useHttp => upload image
  const {
    results: uploadedImage,
    isLoading: uploading,
    success: successUpload,
    sendRequest: uploadImage,
  } = useHttp('POST');

  // Get user token from redux
  const token = useSelector((state) => state.auth.token);

  // States
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  // Get user details
  useEffect(() => {
    getProductDetails(`/api/products/${productId}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }, [getProductDetails, productId, token]);

  // Update the state when product is fetched
  useEffect(() => {
    if (successProduct) {
      // set state
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [successProduct, product]);

  // Handle Submit
  const submitHandler = (e) => {
    e.preventDefault();

    // Optional: Validation

    // send request
    const product = {
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description,
    };

    const config = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    updateProduct(`/api/products/${productId}`, product, config);
  };

  // Redirect if update product was successfull
  useEffect(() => {
    if (successUpdate) {
      navigate('/admin/productlist');
    }
  }, [successUpdate, navigate]);

  // Uploading file
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    const config = {
      'Content-Type': 'multipart/form-data',
    };

    uploadImage('/api/upload', formData, config);
  };

  // when upload was successful
  useEffect(() => {
    if (successUpload) {
      setImage(uploadedImage);
    }
  }, [successUpload, uploadedImage]);

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>

      <FormContainer>
        <h1>Edit Product</h1>

        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

        {loadingProduct ? (
          <Loader />
        ) : errorProduct ? (
          <Message variant='danger'>{errorProduct}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group className='mb-3' controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='mb-3' controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='mb-3' controlId='image'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image url'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                type='file'
                label='Choose file'
                onChange={uploadFileHandler}
              ></Form.Control>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group className='mb-3' controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='mb-3' controlId='countInStock'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter count in stock'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='mb-3' controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='mb-3' controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
