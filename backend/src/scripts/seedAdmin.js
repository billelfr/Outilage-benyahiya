require("dotenv").config();

const bcrypt = require("bcryptjs");

const prisma = require("../lib/prisma");

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {
      name,
      passwordHash
    },
    create: {
      name,
      email,
      passwordHash
    }
  });

  console.log(`Admin ready: ${admin.email}`);
}

seedAdmin()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
