import { useEffect, useState } from 'react';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';

import Message from '../components/Message';
import Loader from '../components/Loader';
import useHttp from '../hooks/use-http';
import { loginAction } from '../actions/authActions';

const ProfileScreen = () => {
  // useHttp => updating user profile
  const {
    results: updatedUser,
    isLoading,
    error,
    success,
    sendRequest: updateProfile,
  } = useHttp('PUT');

  // useHttp => getting user orders
  const {
    results: orders,
    isLoading: loadingOrders,
    error: errorOrders,
    sendRequest: getMyOrders,
  } = useHttp('GET', true);

  // Getting user data
  const user = useSelector((state) => state.auth);
  const { token } = user;

  // Dispatch & navigate
  const dispatch = useDispatch();

  // States
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState(null);

  // Get my orders once the page is loaded
  useEffect(() => {
    getMyOrders('/api/orders/myorders', null, {
      Authorization: `Bearer ${token}`,
    });
  }, [getMyOrders, token]);

  // Login the user again if update was successful
  useEffect(() => {
    if (success) {
      dispatch(loginAction(updatedUser));
    }
  }, [isLoading, error, dispatch, updatedUser, success]);

  // Handle Submit => update profile
  const submitHandler = (e) => {
    e.preventDefault();

    // Optional: Validation
    if (password !== password2) {
      setMessage('Passwords do not match');
      return;
    } else {
      setMessage(null);
    }

    // Send request
    const config = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    updateProfile('/api/users/profile', { name, email, password }, config);
  };

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>

        {message && <Message variant='danger'>{message}</Message>}
        {success && (
          <Message variant='success'>Profile updated successfully</Message>
        )}
        {error && <Message variant='danger'>{error}</Message>}
        {isLoading && <Loader />}

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

          <Form.Group className='mb-3' controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className='mb-3' controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className='mb-3' controlId='password2'>
            <Form.Label>Confirm password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Re-enter password'
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary'>
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant='danger'>{errorOrders}</Message>
        ) : (
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button variant='light' className='btn-sm'>
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
