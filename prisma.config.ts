import { defineConfig } from "prisma/config";
import "dotenv/config"; // 🔥 THIS IS THE FIX

export default defineConfig({
  schema: "prisma/schema.prisma",

  datasource: {
    url: process.env.DATABASE_URL!,
  },
});