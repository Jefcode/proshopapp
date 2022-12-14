import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const searchHandler = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <Form onSubmit={searchHandler}>
      <Form.Group className='d-flex'>
        <Form.Control
          type='text'
          name='q'
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder='Search Products...'
          className='mr-sm-2 ml-sm-4'
        ></Form.Control>
        <Button type='submit' variant='outline-success' className='p-2'>
          Search
        </Button>
      </Form.Group>
    </Form>
  );
};

export default SearchBox;
