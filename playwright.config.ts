import { defineConfig, devices } from '@playwright/test'
import type { ConfigOptions } from '@nuxt/test-utils/playwright'

export default defineConfig<ConfigOptions>({
  // Directory where your tests are located
  testDir: './tests/e2e',
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: 'html',
  
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env.CI ? 'http://localhost:3000' : 'http://localhost:3000',
    
    // Captures screenshot after each test failure
    screenshot: 'only-on-failure',
    
    // Record trace only on failure
    trace: 'on-first-retry',
    
    // Nuxt configuration
    nuxt: {
      rootDir: process.cwd()
    }
  },
  
  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  
  // Run your local dev server before starting the tests
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
}) 