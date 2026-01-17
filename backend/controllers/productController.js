const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Category = require('../models/Category'); // Import Category model for associations

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.findAll({
    include: [{
      model: Category,
      attributes: ['name']
    }]
  });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id, {
    include: [{
      model: Category,
      attributes: ['name']
    }]
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: `No product with id of ${req.params.id}`
    });
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = asyncHandler(async (req, res) => {
  const [updatedRowsCount] = await Product.update(req.body, {
    where: { id: req.params.id }
  });

  if (updatedRowsCount === 0) {
    return res.status(404).json({
      success: false,
      message: `No product with id of ${req.params.id}`
    });
  }

  const updatedProduct = await Product.findByPk(req.params.id, {
    include: [{
      model: Category,
      attributes: ['name']
    }]
  });

  res.status(200).json({
    success: true,
    data: updatedProduct
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = asyncHandler(async (req, res) => {
  const deletedRowsCount = await Product.destroy({
    where: { id: req.params.id }
  });

  if (deletedRowsCount === 0) {
    return res.status(404).json({
      success: false,
      message: `No product with id of ${req.params.id}`
    });
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get products by category
// @route   GET /api/products/category/:categoryId
// @access  Public
const getProductsByCategory = asyncHandler(async (req, res) => {
  const products = await Product.findAll({
    where: { categoryId: req.params.categoryId }
  });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
};