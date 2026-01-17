const asyncHandler = require('express-async-handler');
const { db } = require('../config/db'); // Import models from the db connection
const slugify = require('slugify');

// Access models
const Product = db.Product;
const Category = db.Category;

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.findAll({
    // Temporarily removing include until associations are properly set up
    // include: [{
    //   model: Category,
    //   attributes: ['name']
    // }]
  });

  // Manually fetch categories and attach them to products
  const categories = await Category.findAll();
  const productsWithCategories = products.map(product => {
    const category = categories.find(cat => cat.id === product.categoryId);
    return {
      ...product.toJSON(),
      category: category ? { name: category.name } : null
    };
  });

  res.status(200).json({
    success: true,
    count: productsWithCategories.length,
    data: productsWithCategories
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: `No product with id of ${req.params.id}`
    });
  }

  // Manually fetch and attach category
  const category = await Category.findByPk(product.categoryId);

  const productWithCategory = {
    ...product.toJSON(),
    category: category ? { name: category.name } : null
  };

  res.status(200).json({
    success: true,
    data: productWithCategory
  });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private
const createProduct = asyncHandler(async (req, res) => {
  // Generate slug from name if not provided
  const productData = { ...req.body };
  if (!productData.slug) {
    productData.slug = slugify(productData.name, { lower: true, strict: true });
  }

  const product = await Product.create(productData);

  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = asyncHandler(async (req, res) => {
  // Generate slug from name if name changed and slug not provided
  const productData = { ...req.body };
  if (productData.name && !productData.slug) {
    productData.slug = slugify(productData.name, { lower: true, strict: true });
  }

  const [updatedRowsCount] = await Product.update(productData, {
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

  // Manually fetch and attach category info
  const category = await Category.findByPk(req.params.categoryId);
  const productsWithCategory = products.map(product => ({
    ...product.toJSON(),
    category: category ? { name: category.name } : null
  }));

  res.status(200).json({
    success: true,
    count: productsWithCategory.length,
    data: productsWithCategory
  });
});

// @desc    Get single product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    where: { slug: req.params.slug }
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: `No product with slug of ${req.params.slug}`
    });
  }

  // Manually fetch and attach category
  const category = await Category.findByPk(product.categoryId);

  const productWithCategory = {
    ...product.toJSON(),
    category: category ? { name: category.name } : null
  };

  res.status(200).json({
    success: true,
    data: productWithCategory
  });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductBySlug
};