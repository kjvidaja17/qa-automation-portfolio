import { expect, test } from '@playwright/test';

test('UI-001: should submit the contact form and display a confirmation', async ({ page }) => {
  // Navigate to the application
  await page.goto('https://automationintesting.online/');

  // Fill the contact form fields
  await page.getByTestId('ContactName').fill('QA Automation');
  await page.getByTestId('ContactEmail').fill('qa@example.com');
  await page.getByTestId('ContactPhone').fill('09171234567');
  await page.getByTestId('ContactSubject').fill('UI Reconnaissance');
  await page.getByTestId('ContactDescription').fill(
    'This is a test message for the QA automation portfolio.',
  );

  // Submit the form
  await page.getByRole('button', { name: 'Submit' }).click();

  // Verify the success confirmation is visible
  const confirmationMessage = page.getByText('Thanks for getting in touch', {
    exact: false,
  });
  await expect(confirmationMessage).toBeVisible();

  // Verify the confirmation contains the submitted name
  await expect(confirmationMessage).toContainText('QA Automation');

  // Verify the confirmation contains the submitted subject
  await expect(
    page.getByText('UI Reconnaissance', { exact: true }),
  ).toBeVisible();
});
