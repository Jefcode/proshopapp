import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import useHttp from '../hooks/use-http';
import { loginAction } from '../actions/authActions';

const RegisterScreen = () => {
  // useHttp
  const { results, isLoading, error, sendRequest: register } = useHttp('POST');

  // States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState(null);

  // Dispatch & navigate
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect => get from url
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') ?? '/';

  // Redirect if user is already logged in
  const user = useSelector((state) => state.auth);

  useEffect(() => {
    if (user.token) {
      navigate(redirect, { replace: true });
    }
  }, [user, navigate, redirect]);

  // when sending request is done, dispatch and redirect
  useEffect(() => {
    if (results && !error) {
      const userData = {
        email: results.email,
        name: results.name,
        token: results.token,
        isAdmin: results.isAdmin,
      };

      dispatch(loginAction(userData));
      navigate(redirect);
    }
  }, [results, error, dispatch, navigate, redirect]);

  // Handle Submit
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
    const config = { 'Content-Type': 'application/json' };
    register('/api/users', { name, email, password }, config);
  };

  return (
    <FormContainer>
      <h1>Sign Up</h1>

      {message && <Message variant='danger'>{message}</Message>}
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
          Sign Up
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          Already a Customer?{' '}
          <Link
            to={redirect !== '/' ? `/login?redirect=${redirect}` : '/login'}
          >
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
