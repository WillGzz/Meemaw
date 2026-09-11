import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests", testMatch: "*.spec.ts", fullyParallel: false, workers: 1,
  timeout: 60000, use: { baseURL: "http://127.0.0.1:3000", headless: true, launchOptions: { executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" } },
});
