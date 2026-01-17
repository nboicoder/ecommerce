const express = require('express');
const router = express.Router();
const { 
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    getUserOrders 
} = require('../../controllers/orderController');

// @route   GET api/orders
// @desc    Get all orders
// @access  Private
router.get('/', getOrders);

// @route   GET api/orders/user/:userId
// @desc    Get orders by user
// @access  Private
router.get('/user/:userId', getUserOrders);

// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', getOrderById);

// @route   POST api/orders
// @desc    Create an order
// @access  Private
router.post('/', createOrder);

// @route   PUT api/orders/:id
// @desc    Update an order
// @access  Private
router.put('/:id', updateOrder);

// @route   DELETE api/orders/:id
// @desc    Delete an order
// @access  Private
router.delete('/:id', deleteOrder);

module.exports = router;