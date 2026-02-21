import { expect, test } from '@playwright/test'

test.describe('root', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has title hacklondon26', async ({ page }) => {
    await expect(page).toHaveTitle(/hacklondon26/)
  })
})
