import { test, expect } from '@playwright/test'

test('Dark and Light Mode Screenshot', async ({ page }) => {
    // --- Home Page ---
    await page.goto('http://localhost:4323')
    await page.waitForLoadState('networkidle')

    // Light Mode
    await page.evaluate(() => {
        localStorage.setItem('theme', 'light')
        document.documentElement.classList.remove('dark')
    })
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: 'light-mode-home.png', fullPage: true })

    // Dark Mode
    await page.evaluate(() => {
        localStorage.setItem('theme', 'dark')
        document.documentElement.classList.add('dark')
    })
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: 'dark-mode-home.png', fullPage: true })

    // --- About Page ---
    await page.goto('http://localhost:4323/about')
    await page.waitForLoadState('networkidle')

    // Light Mode
    await page.evaluate(() => {
        localStorage.setItem('theme', 'light')
        document.documentElement.classList.remove('dark')
    })
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: 'light-mode-about.png', fullPage: true })

    // Dark Mode
    await page.evaluate(() => {
        localStorage.setItem('theme', 'dark')
        document.documentElement.classList.add('dark')
    })
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: 'dark-mode-about.png', fullPage: true })
})
