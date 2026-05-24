const jwt = require("jsonwebtoken");

const prisma = require("../lib/prisma");
const { createHttpError } = require("../lib/http");

async function requireAdminAuth(req, res, next) {
  if (!process.env.JWT_SECRET) {
    return next(createHttpError(500, "JWT_SECRET is not configured"));
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(createHttpError(401, "Authorization token is required"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await prisma.admin.findUnique({
      where: { id: payload.adminId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    if (!admin) {
      return next(createHttpError(401, "Admin account not found"));
    }

    req.admin = admin;
    next();
  } catch (error) {
    next(createHttpError(401, "Invalid or expired token"));
  }
}

module.exports = {
  requireAdminAuth
};
