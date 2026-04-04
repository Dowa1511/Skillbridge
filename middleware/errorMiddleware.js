const AppError = require('../utils/AppError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } 
  // Programming or other unknown error: don't leak error details
  else {
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    // Basic formatting for production, can add Mongoose specific error handled here
    let error = { ...err };
    error.message = err.message;
    
    if (err.name === 'CastError') error = new AppError(`Invalid ${err.path}: ${err.value}.`, 400);
    if (err.code === 11000) {
      const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
      error = new AppError(`Duplicate field value: ${value}. Please use another value!`, 400);
    }
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(el => el.message);
      error = new AppError(`Invalid input data. ${errors.join('. ')}`, 400);
    }
    if (err.name === 'JsonWebTokenError') error = new AppError('Invalid token. Please log in again!', 401);
    if (err.name === 'TokenExpiredError') error = new AppError('Your token has expired! Please log in again.', 401);

    sendErrorProd(error, res);
  }
};
