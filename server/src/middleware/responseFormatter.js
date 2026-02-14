export function responseFormatter(req, res, next) {
  res.success = (data = null, message = "OK", statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      error: null,
    });
  };

  res.fail = (message = "Request failed", statusCode = 400, details = null) => {
    return res.status(statusCode).json({
      success: false,
      message,
      data: null,
      error: details,
    });
  };

  next();
}
