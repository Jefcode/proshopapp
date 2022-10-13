import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import useHttp from '../hooks/use-http';

const UserEditScreen = () => {
  const navigate = useNavigate();

  // useHttp => get user details
  const {
    results: user,
    isLoading: loadingUser,
    error: errorUser,
    success: successUser,
    sendRequest: getUserDetails,
  } = useHttp('GET', true);

  // useHttp => update user prep
  const {
    isLoading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
    sendRequest: updateUser,
  } = useHttp('PUT');

  const params = useParams();
  const { userId } = params;

  // Get user token from redux
  const token = useSelector((state) => state.auth.token);

  // States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Get user details
  useEffect(() => {
    getUserDetails(`/api/users/${userId}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }, [getUserDetails, userId, token]);

  // Update the state when user is fetched
  useEffect(() => {
    if (successUser && user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [successUser, user]);

  // Handle Submit
  const submitHandler = (e) => {
    e.preventDefault();

    // Optional: Validation

    const config = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    updateUser(`/api/users/${userId}`, { name, email, isAdmin }, config);
  };

  // Redirect the user if update was successfull
  useEffect(() => {
    if (successUpdate) {
      navigate('/admin/userlist');
    }
  }, [successUpdate, navigate]);

  return (
    <>
      <Link to='/admin/userlist' className='btn btn-light my-3'>
        Go Back
      </Link>

      <FormContainer>
        <h1>Edit user</h1>

        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

        {loadingUser ? (
          <Loader />
        ) : errorUser ? (
          <Message variant='danger'>{errorUser}</Message>
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

            <Form.Group className='mb-3' controlId='email'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='mb-3' controlId='isadmin'>
              <Form.Check
                type='checkbox'
                label='Is admin'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button type='submit' variant='primary' disabled={loadingUpdate}>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
