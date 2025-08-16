export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  });
};
