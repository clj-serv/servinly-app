import { test, expect } from "@playwright/test";

test("no debug UI visible by default", async ({ page }) => {
  await page.goto("/onboarding-v2?step=ROLE_SELECT&fresh=1");
  
  // Wait for page to load
  await page.waitForSelector('[data-testid="role-select"]', { timeout: 10000 });
  
  // Ensure no debug UI components are visible
  await expect(page.getByText(/Client State Report/i)).toHaveCount(0);
  await expect(page.getByText(/DEV BUILD/i)).toHaveCount(0);
  await expect(page.getByText(/Debug Mode/i)).toHaveCount(0);
});
