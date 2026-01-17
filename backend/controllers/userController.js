const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll();

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Public
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: `No user with id of ${req.params.id}`
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Create user
// @route   POST /api/users
// @access  Public
const createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const [updatedRowsCount] = await User.update(req.body, {
    where: { id: req.params.id }
  });

  if (updatedRowsCount === 0) {
    return res.status(404).json({
      success: false,
      message: `No user with id of ${req.params.id}`
    });
  }

  const updatedUser = await User.findByPk(req.params.id);

  res.status(200).json({
    success: true,
    data: updatedUser
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
  const deletedRowsCount = await User.destroy({
    where: { id: req.params.id }
  });

  if (deletedRowsCount === 0) {
    return res.status(404).json({
      success: false,
      message: `No user with id of ${req.params.id}`
    });
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};