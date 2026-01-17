const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const User = require('../models/User'); // Import User model for associations

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.findAll({
    include: [{
      model: User,
      attributes: ['id', 'name', 'email']
    }]
  });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.id, {
    include: [{
      model: User,
      attributes: ['id', 'name', 'email']
    }]
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: `No order with id of ${req.params.id}`
    });
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const order = await Order.create(req.body);

  res.status(201).json({
    success: true,
    data: order
  });
});

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private
const updateOrder = asyncHandler(async (req, res) => {
  const [updatedRowsCount] = await Order.update(req.body, {
    where: { id: req.params.id }
  });

  if (updatedRowsCount === 0) {
    return res.status(404).json({
      success: false,
      message: `No order with id of ${req.params.id}`
    });
  }

  const updatedOrder = await Order.findByPk(req.params.id);

  res.status(200).json({
    success: true,
    data: updatedOrder
  });
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private
const deleteOrder = asyncHandler(async (req, res) => {
  const deletedRowsCount = await Order.destroy({
    where: { id: req.params.id }
  });

  if (deletedRowsCount === 0) {
    return res.status(404).json({
      success: false,
      message: `No order with id of ${req.params.id}`
    });
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get orders by user
// @route   GET /api/orders/user/:userId
// @access  Private
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.findAll({
    where: { userId: req.params.userId }
  });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getUserOrders
};