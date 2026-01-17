const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.findAll();

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: `No category with id of ${req.params.id}`
    });
  }

  res.status(200).json({
    success: true,
    data: category
  });
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private
const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    data: category
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = asyncHandler(async (req, res) => {
  const [updatedRowsCount] = await Category.update(req.body, {
    where: { id: req.params.id }
  });

  if (updatedRowsCount === 0) {
    return res.status(404).json({
      success: false,
      message: `No category with id of ${req.params.id}`
    });
  }

  const updatedCategory = await Category.findByPk(req.params.id);

  res.status(200).json({
    success: true,
    data: updatedCategory
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = asyncHandler(async (req, res) => {
  const deletedRowsCount = await Category.destroy({
    where: { id: req.params.id }
  });

  if (deletedRowsCount === 0) {
    return res.status(404).json({
      success: false,
      message: `No category with id of ${req.params.id}`
    });
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};