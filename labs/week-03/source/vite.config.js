import { defineConfig } from "vite";

const repositoryName = "engse203-lab03-68543210029-3";

export default defineConfig({
  base: `/${repositoryName}/`,
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});