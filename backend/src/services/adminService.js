const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = require("../lib/prisma");
const { createHttpError } = require("../lib/http");

async function loginAdmin(email, password) {
  if (!process.env.JWT_SECRET) {
    throw createHttpError(500, "JWT_SECRET is not configured");
  }

  if (!email || !password) {
    throw createHttpError(400, "Email and password are required");
  }

  const admin = await prisma.admin.findUnique({
    where: { email }
  });

  if (!admin) {
    throw createHttpError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, admin.passwordHash);

  if (!passwordMatches) {
    throw createHttpError(401, "Invalid email or password");
  }

  const token = jwt.sign(
    {
      adminId: admin.id,
      email: admin.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    }
  );

  return {
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      createdAt: admin.createdAt
    }
  };
}

module.exports = {
  loginAdmin
};
