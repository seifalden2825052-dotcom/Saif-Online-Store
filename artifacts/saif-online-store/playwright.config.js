import { defineConfig } from "@playwright/test";

const themes = ["dark", "light"];
const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
];

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    launchOptions: {
      executablePath: "/repl/tools/bin/chromium",
    },
    trace: "retain-on-failure",
  },
  projects: viewports.flatMap((viewport) =>
    themes.map((theme) => ({
      name: `${viewport.name}-${theme}`,
      use: { viewport: { width: viewport.width, height: viewport.height } },
      metadata: { theme },
    })),
  ),
  webServer: {
    command: "pnpm run dev --port 4173",
    env: { PORT: "4173", BASE_PATH: "/" },
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});