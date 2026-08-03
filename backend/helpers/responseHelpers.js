function successResponse(res, data = null, message = 'Operation successful', status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}

function errorResponse(res, message = 'An error occurred', status = 500, errors = null) {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
}

module.exports = {
  successResponse,
  errorResponse,
};
