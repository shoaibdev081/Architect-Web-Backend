const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({ field: e.path, message: e.message }));
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: `Invalid ${err.path}` });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ success: false, message: `Duplicate value for ${field}` });
  }

  if (err.name === 'MulterError') {
    let message = 'File upload error';
    if (err.code === 'LIMIT_FILE_SIZE') message = 'File size too large';
    return res.status(400).json({ success: false, message });
  }

  res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal server error' });
};

module.exports = errorHandler;