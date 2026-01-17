const express = require('express');
const router = express.Router();
const { 
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductBySlug,
    getProductsByCategory 
} = require('../../controllers/productController');

// @route   GET api/products
// @desc    Get all products
// @access  Public
router.get('/', getProducts);

// @route   GET api/products/category/:categoryId
// @desc    Get products by category
// @access  Public
router.get('/category/:categoryId', getProductsByCategory);

// @route   GET api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', getProductById);

// @route   GET api/products/slug/:slug
// @desc    Get product by slug
// @access  Public
router.get('/slug/:slug', getProductBySlug);

// @route   POST api/products
// @desc    Create a product
// @access  Private
router.post('/', createProduct);

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Private
router.put('/:id', updateProduct);

// @route   DELETE api/products/:id
// @desc    Delete a product
// @access  Private
router.delete('/:id', deleteProduct);

module.exports = router;