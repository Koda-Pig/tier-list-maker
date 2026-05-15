import { test, expect } from "@playwright/test";

test("updates document title from tier list title input", async ({ page }) => {
  await page.goto("/");

  const titleInput = page.getByLabel("Tier list title");
  await titleInput.fill("Arcade rankings");

  await expect(page).toHaveTitle("Arcade rankings");
});

test("adds item and reset clears ranked data", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Item name").fill("Chess");
  await page.getByRole("button", { name: "Add" }).click();

  await expect(page.getByText("1 items")).toBeVisible();

  await page.getByRole("button", { name: "Reset" }).click();
  await page.getByRole("button", { name: "Reset list" }).click();

  await expect(page.getByText("0 items", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Item name")).toHaveValue("");
});

test("adds and removes an optional empty tier", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "+ Tier" }).click();
  await expect(page.getByLabel("Remove empty D tier")).toBeVisible();

  await page.getByLabel("Remove empty D tier").click();
  await expect(page.getByLabel("Remove empty D tier")).toHaveCount(0);
});
