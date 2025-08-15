import { test, expect } from '@playwright/test';

test.describe('Short Flow Navigation @shortflow', () => {
  test('same family role triggers short flow from preview', async ({ page }) => {
    // Start with a completed bar role profile
    await page.goto('/onboarding-v2?step=PREVIEW');
    
    // Mock localStorage with previous bar family role
    await page.addInitScript(() => {
      const mockSignals = {
        roleId: 'bartender-craft',
        roleFamily: 'bar',
        shineKeys: ['friendly', 'efficient'],
        busyKeys: ['rush-hour'],
        vibeKey: 'energetic',
        orgName: 'Craft Cocktail Bar',
        startDate: '2023-01-01',
        highlightText: 'Led team during busy weekend service',
        responsibilities: ['Mix cocktails', 'Manage bar inventory']
      };
      
      localStorage.setItem('onboarding_signals', JSON.stringify(mockSignals));
      localStorage.setItem('onboarding_draft', JSON.stringify({
        schemaVersion: 2,
        currentStep: 'PREVIEW',
        flow: 'FULL',
        signals: mockSignals
      }));
    });
    
    // Click Add Another Role
    await page.click('button:has-text("Add Another Role")');
    
    // Should navigate to role select
    await expect(page).toHaveURL(/step=ROLE_SELECT/);
    
    // Select another bar family role (sports bar bartender)
    await page.click('[data-testid="role-bartender-sports-bar"]');
    await page.click('button:has-text("Continue")');
    
    // Should skip to Organization step (SHORT flow)
    await expect(page).toHaveURL(/step=ORG/);
    
    // Verify previous answers are preserved
    const orgInput = page.locator('input[name="orgName"]');
    await expect(orgInput).toHaveValue('Craft Cocktail Bar');
  });

  test('different family role triggers full flow from preview', async ({ page }) => {
    // Start with a completed bar role profile
    await page.goto('/onboarding-v2?step=PREVIEW');
    
    // Mock localStorage with previous bar family role
    await page.addInitScript(() => {
      const mockSignals = {
        roleId: 'bartender-craft',
        roleFamily: 'bar',
        shineKeys: ['friendly', 'efficient'],
        busyKeys: ['rush-hour'],
        vibeKey: 'energetic',
        orgName: 'Craft Cocktail Bar',
        startDate: '2023-01-01',
        highlightText: 'Led team during busy weekend service',
        responsibilities: ['Mix cocktails', 'Manage bar inventory']
      };
      
      localStorage.setItem('onboarding_signals', JSON.stringify(mockSignals));
      localStorage.setItem('onboarding_draft', JSON.stringify({
        schemaVersion: 2,
        currentStep: 'PREVIEW',
        flow: 'FULL',
        signals: mockSignals
      }));
    });
    
    // Click Add Another Role
    await page.click('button:has-text("Add Another Role")');
    
    // Should navigate to role select
    await expect(page).toHaveURL(/step=ROLE_SELECT/);
    
    // Select a service family role (server)
    await page.click('[data-testid="role-server-fine-dining"]');
    await page.click('button:has-text("Continue")');
    
    // Should go to How You Shine (FULL flow)
    await expect(page).toHaveURL(/step=SHINE/);
    
    // Previous shine keys should be cleared for new family
    const shineChips = page.locator('[data-testid^="shine-chip-"]');
    const selectedChips = shineChips.locator('.bg-blue-600');
    await expect(selectedChips).toHaveCount(0);
  });

  test('preserves draft without fresh parameter', async ({ page }) => {
    // Start at preview with existing role
    await page.goto('/onboarding-v2?step=PREVIEW');
    
    // Mock localStorage with role data
    await page.addInitScript(() => {
      const mockSignals = {
        roleId: 'bartender-craft',
        roleFamily: 'bar',
        shineKeys: ['friendly'],
        orgName: 'Test Bar'
      };
      
      localStorage.setItem('onboarding_signals', JSON.stringify(mockSignals));
    });
    
    // Click Add Another Role
    await page.click('button:has-text("Add Another Role")');
    
    // Verify URL does not contain fresh=1
    await expect(page).toHaveURL(/step=ROLE_SELECT/);
    await expect(page).not.toHaveURL(/fresh=1/);
    
    // Verify localStorage still contains previous data
    const signals = await page.evaluate(() => {
      return localStorage.getItem('onboarding_signals');
    });
    
    expect(signals).toBeTruthy();
    const parsedSignals = JSON.parse(signals);
    expect(parsedSignals.roleId).toBe('bartender-craft');
    expect(parsedSignals.orgName).toBe('Test Bar');
  });
});
