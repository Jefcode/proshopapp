import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @acess   private
 */
export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();

  res.status(201).json(createdOrder);
});

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @acess   private
 */
export const getOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(404);
    throw new Error('Order not found');
  }
});

/**
 * @desc    Update order to paid
 * @route   PUT /api/orders/:id/pay
 * @acess   private
 */
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    // order.paymentResult = {
    //   id: req.body.id,
    //   status: req.body.status,
    //   update_time: req.body.update_time,
    //   email_address: req.body.payer.email_address,
    // };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(404);
    throw new Error('Order not found');
  }
});

/**
 * @desc    Get logged in user orders
 * @route   GET /api/orders/myorders
 * @acess   private
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

/**
 * @desc    Get all orders
 * @route   GET /api/orders
 * @acess   private/Admin
 */
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

/**
 * @desc    Update order to delivered
 * @route   PUT /api/orders/:id/deliver
 * @acess   private
 */
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(404);
    throw new Error('Order not found');
  }
});
