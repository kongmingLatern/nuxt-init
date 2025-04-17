import { test, expect } from '@nuxt/test-utils/playwright'

test('homepage has the correct title', async ({ page, goto }) => {
  // Navigation is handled by the goto helper
  await goto('/')
  
  // The title should contain "Nuxt Application"
  await expect(page).toHaveTitle(/Nuxt Application/)
})

test('homepage has Nuxt content', async ({ page, goto }) => {
  await goto('/')
  
  // Check that the page contains some text indicating it's a Nuxt application
  const content = page.locator('body')
  await expect(content).toContainText(/Nuxt/)
}) 