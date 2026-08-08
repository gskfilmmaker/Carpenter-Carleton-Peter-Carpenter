import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      // See test/server-only-stub.ts for why.
      "server-only": path.resolve(import.meta.dirname, "./test/server-only-stub.ts"),
    },
  },
});
