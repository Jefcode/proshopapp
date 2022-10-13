import { useEffect, useMemo } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import Message from '../components/Message';
import Loader from '../components/Loader';
import useHttp from '../hooks/use-http';

const UserListScreen = () => {
  // useHttp => get all users prep
  const {
    results: users,
    isLoading: loadingUsers,
    error: errorUsers,
    sendRequest: getUsers,
  } = useHttp('GET', true);

  // useHttp => delete user by id prep
  const { success: successDelete, sendRequest: deleteUser } = useHttp(
    'DELETE',
    true
  );

  // Get user token
  const { token } = useSelector((state) => state.auth);
  const authConfig = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  // Get all users
  useEffect(() => {
    getUsers(`/api/users`, null, authConfig);
  }, [getUsers, token, authConfig, successDelete]);

  // Delete user
  const deleteUserHandler = (userId) => {
    if (window.confirm('Are you sure?')) {
      deleteUser(`/api/users/${userId}`, null, authConfig);
    }
  };

  return (
    <>
      <h1>Users</h1>
      {loadingUsers ? (
        <Loader />
      ) : errorUsers ? (
        <Message variant='danger'>{errorUsers}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <i className='fas fa-check' style={{ color: 'green' }}></i>
                  ) : (
                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteUserHandler(user._id)}
                  >
                    <i className='fas fa-trash'></i>
                  </Button>

                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant='light' className='btn-sm'>
                      <i className='fas fa-edit'></i>
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;
