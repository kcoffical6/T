import { test, expect } from '@playwright/test'

test('Dark and Light Mode Screenshot', async ({ page }) => {
    await page.goto('http://localhost:4323')

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle')

    // --- Light Mode ---
    // Set theme to light
    await page.evaluate(() => {
        localStorage.setItem('theme', 'light')
        document.documentElement.classList.remove('dark')
    })

    // Reload the page to apply the theme
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Take a screenshot of the light mode
    await page.screenshot({ path: 'light-mode.png', fullPage: true })

    // --- Dark Mode ---
    // Set theme to dark
    await page.evaluate(() => {
        localStorage.setItem('theme', 'dark')
        document.documentElement.classList.add('dark')
    })

    // Reload the page to apply the theme
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Take a screenshot of the dark mode
    await page.screenshot({ path: 'dark-mode.png', fullPage: true })
})
