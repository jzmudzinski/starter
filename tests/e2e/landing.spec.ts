import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("displays hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Start for free")).toBeVisible();
  });

  test("has working navigation links", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Sign in" }).click();
    await expect(page).toHaveURL("/login");
  });

  test("shows pricing section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Pricing" }).click();
    await expect(page.getByText("Simple, transparent pricing")).toBeVisible();
  });

  test("privacy page loads", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible();
  });

  test("terms page loads", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.getByRole("heading", { name: "Terms of Service" })).toBeVisible();
  });
});
