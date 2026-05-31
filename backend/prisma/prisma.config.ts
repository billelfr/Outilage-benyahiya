import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url:
      process.env.MONGODB_URI || "mongodb+srv://abdrezzake:IPhone720212@alpha.32iozyi.mongodb.net/store_market?appName=alpha",
  },
});