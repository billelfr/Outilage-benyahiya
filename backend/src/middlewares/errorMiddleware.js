const { Prisma } = require("@prisma/client");

function notFoundHandler(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(error, req, res, next) {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error";

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      statusCode = 409;
      message = "A record with the same unique value already exists";
    }

    if (error.code === "P2003") {
      statusCode = 409;
      message = "This record is referenced by related data and cannot be removed";
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid request data";
  }

  res.status(statusCode).json({
    success: false,
    message
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
