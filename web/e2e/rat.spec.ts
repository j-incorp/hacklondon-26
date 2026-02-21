import { expect, test } from '@playwright/test'

test.describe('rat', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has title rat', async ({ page }) => {
    await expect(page).toHaveTitle(/rat/)
  })
})
