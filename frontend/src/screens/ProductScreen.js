import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  ListGroup,
  Card,
  Image,
  Button,
  Form,
} from 'react-bootstrap';

import Rating from '../components/Rating';
import useHttp from '../hooks/use-http';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';

const ProductScreen = () => {
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const params = useParams();
  const { productId } = params;

  // User data
  const user = useSelector((state) => state.auth);
  const isLoggedIn = !!user.token;

  // useHttp => get product
  const {
    results: product,
    isLoading,
    error,
    sendRequest: fetchProduct,
  } = useHttp('GET', true);

  // useHttp => create review prep
  const {
    isLoading: loadingReview,
    error: errorReview,
    success: successReview,
    sendRequest: createReview,
  } = useHttp('POST');

  // Get product on page load
  useEffect(() => {
    fetchProduct(`/api/products/${productId}`);
  }, [fetchProduct, productId, successReview]);

  const addToCartHandler = () => {
    navigate(`/cart/${productId}?qty=${qty}`);
  };

  const createReviewHandler = (event) => {
    event.preventDefault();

    // Send request
    const config = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`,
    };

    const review = {
      rating,
      comment,
    };

    createReview(`/api/products/${productId}/reviews`, review, config);
  };

  // When creating review is successful
  useEffect(() => {
    if (successReview) {
      setRating(0);
      setComment('');
    }
  }, [successReview]);

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Meta title={product.name} description={product.description} />

          <Row className='mb-4'>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item className='d-grid'>
                    <Button
                      onClick={addToCartHandler}
                      type='button'
                      disabled={product.countInStock === 0}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && <Message>No reviews</Message>}
              <ListGroup variant='flush'>
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a customer review</h2>
                  {errorReview && (
                    <Message variant='danger'>{errorReview}</Message>
                  )}
                  {successReview && (
                    <Message variant='success'>Review submitted!</Message>
                  )}
                  {isLoggedIn ? (
                    <Form onSubmit={createReviewHandler}>
                      <Form.Group className='mb-3' controlId='rating'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          value={rating}
                          onChange={(e) => {
                            setRating(e.target.value);
                          }}
                        >
                          <option value=''>Select...</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good</option>
                          <option value='4'>4 - Very Good</option>
                          <option value='5'>5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group className='mb-3' controlId='comment'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          row='3'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        type='submit'
                        variant='primary'
                        disabled={loadingReview}
                      >
                        {loadingReview && (
                          <Loader
                            style={{
                              width: '15px',
                              height: '15px',
                              marginRight: '10px',
                            }}
                          />
                        )}
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to='/login'>sign in</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
