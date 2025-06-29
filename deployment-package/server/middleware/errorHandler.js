const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);

  // Default error
  let error = {
    message: err.message || 'Internal Server Error',
    status: err.status || 500
  };

  // Database errors
  if (err.code === '23505') {
    error.message = 'Duplicate entry';
    error.status = 409;
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error.message = 'Invalid input data';
    error.status = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.status = 401;
  }

  res.status(error.status).json({
    error: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { errorHandler };