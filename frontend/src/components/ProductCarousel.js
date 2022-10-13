import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Loader from './Loader';
import Message from './Message';
import useHttp from '../hooks/use-http';

const ProductCarousel = () => {
  // useHttp => get top products
  const {
    results: products,
    isLoading,
    error,
    sendRequest: getTopProducts,
  } = useHttp('GET', true);

  useEffect(() => {
    getTopProducts(`/api/products/top`);
  }, [getTopProducts]);

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <Carousel pause='hover' className='bg-dark mb-5'>
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid />
          </Link>
          <Carousel.Caption className='carousel-caption'>
            {product.name} (${product.price})
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
