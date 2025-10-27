
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:4321")
        page.screenshot(path="jules-scratch/verification/destinations.png")
        browser.close()

run()
