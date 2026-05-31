require("dotenv").config();

const app = require("./app");
const { disconnectCache } = require("./lib/cache");
const prisma = require("./lib/prisma");

const port = Number(process.env.PORT) || 4000;

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    await disconnectCache();
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
