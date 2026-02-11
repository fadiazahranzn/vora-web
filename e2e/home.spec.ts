import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
    await page.goto("/");

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Create Next App/); // Or whatever the title is, probably "Create Next App" by default
});

test("get started link", async ({ page }) => {
    await page.goto("/");

    // Click the get started link.
    // await page.getByRole("link", { name: "Get started" }).click();

    // Check for the heading
    await expect(page.locator("h1")).toContainText("To get started, edit the page.tsx file.");
});
