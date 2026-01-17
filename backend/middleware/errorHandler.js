// Error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const message = err.errors.map(error => error.message);
    error = { message, statusCode: 400 };
  }

  // Handle invalid UUID format (similar to MongoDB CastError)
  if (err.name === 'UUIDError' || err.message.includes('invalid input syntax for type uuid')) {
    const message = 'Invalid ID format';
    error = { message, statusCode: 400 };
  }

  // Handle resource not found
  if (err.message && err.message.includes('not found')) {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Internal Error'
  });
};

module.exports = errorHandler;