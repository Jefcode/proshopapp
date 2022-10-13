import { useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Message from '../components/Message';
import Loader from '../components/Loader';
import useHttp from '../hooks/use-http';

const OrderScreen = () => {
  const params = useParams();
  const orderId = params.orderId;
  const user = useSelector((state) => state.auth);
  const token = user.token;
  const authConfig = useMemo(() => {
    return {
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  // useHttp => for get the order by id
  const {
    results: order,
    isLoading,
    error,
    sendRequest: getOrderById,
  } = useHttp('GET', true);

  // useHttp => for paying the order
  const {
    results: updatedOrder,
    isLoading: loadingPay,
    success: successPay,
    sendRequest: payOrder,
  } = useHttp('PUT');

  // useHttp => mark as delivered prep
  const {
    isLoading: loadingDeliver,
    success: successDeliver,
    sendRequest: deliverOrder,
  } = useHttp('PUT');

  const fetchOrder = useCallback(() => {
    getOrderById(`/api/orders/${orderId}`, null, authConfig);
  }, [authConfig, getOrderById, orderId]);

  // send request to get the order once to page loads
  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Calculate Prices
  const itemsPrice = order?.orderItems?.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // Handle paying order
  const payOrderHandler = () => {
    payOrder(`/api/orders/${orderId}/pay`, null, authConfig);
  };

  // useEffect => refetch the order after paying
  useEffect(() => {
    if (updatedOrder && successPay) {
      fetchOrder();
    }
  }, [updatedOrder, successPay, fetchOrder]);

  const deliverOrderHandler = () => {
    deliverOrder(`/api/orders/${orderId}/deliver`, {}, authConfig);
  };

  // useEffect => refetch the order after marking as delivered
  useEffect(() => {
    if (successDeliver) {
      fetchOrder();
    }
  }, [successDeliver, fetchOrder]);

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <Row>
      <Col md={8}>
        <ListGroup variant='flush'>
          <ListGroup.Item>
            <h2>Shipping</h2>
            <p>
              <strong>Name: </strong> {order.user?.name}
            </p>
            <p>
              <strong>Email: </strong>{' '}
              <a href={`mailto:${order.user?.email}`}>{order.user?.email}</a>
            </p>
            <p>
              <strong>Address:</strong>
              {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
              {order.shippingAddress.postalCode},{' '}
              {order.shippingAddress.country}
            </p>

            {order.isDelivered ? (
              <Message variant='success'>
                Delivered on {order.deliveredAt}
              </Message>
            ) : (
              <Message variant='danger'>Not Delivered</Message>
            )}
          </ListGroup.Item>

          <ListGroup.Item>
            <h2>Payment Method</h2>

            <p>
              <strong>Method: </strong>
              {order.paymentMethod}
            </p>

            {order.isPaid ? (
              <Message variant='success'>Paid on {order.paidAt}</Message>
            ) : (
              <Message variant='danger'>Not Paid</Message>
            )}
          </ListGroup.Item>

          <ListGroup.Item>
            <h2>Order Items</h2>
            {order.orderItems.length === 0 ? (
              <Message>Order is empty</Message>
            ) : (
              <ListGroup variant='flush'>
                {order.orderItems.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={1}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </Col>
                      <Col md={4}>
                        {item.qty} * {item.price} = {item.qty * item.price}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </ListGroup.Item>
        </ListGroup>
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Order Summary</h2>
            </ListGroup.Item>

            <ListGroup.Item>
              <Row>
                <Col>Items</Col>
                <Col>${itemsPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Shipping</Col>
                <Col>${order.shippingPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Tax</Col>
                <Col>${order.taxPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Total</Col>
                <Col>${order.totalPrice}</Col>
              </Row>
            </ListGroup.Item>
            {!order.isPaid && (
              <ListGroup.Item className='d-grid'>
                {loadingPay && !updatedOrder ? (
                  <Loader style={{ width: '20px', height: '20px' }} />
                ) : (
                  <Button variant='info' onClick={payOrderHandler}>
                    Pay now
                  </Button>
                )}
              </ListGroup.Item>
            )}

            {user.isAdmin && order.isPaid && !order.isDelivered && (
              <ListGroup.Item className='d-grid'>
                {loadingDeliver ? (
                  <Loader style={{ width: '20px', height: '20px' }} />
                ) : (
                  <Button onClick={deliverOrderHandler}>
                    Mark as delivered
                  </Button>
                )}
              </ListGroup.Item>
            )}
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default OrderScreen;
