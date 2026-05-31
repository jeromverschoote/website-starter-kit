import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Starter-kit default: the e2e suite ships empty and the `test:e2e` script
  // runs with `--pass-with-no-tests`, so the CI gate stays green until you add
  // specs under this directory. Add real specs here to give the gate teeth.
  testDir: './src/test/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [['html', { outputFolder: 'playwright-report' }], ['list']] : [['list']],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'NEXT_PUBLIC_MSW=true yarn dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
