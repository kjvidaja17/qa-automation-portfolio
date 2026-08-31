import { expect, test } from '@playwright/test';
import { ApiClient } from '../../helpers/api-client';

test('API-006 should return 404 when retrieving a nonexistent booking', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const response = await apiClient.get('/booking/999999');

  expect(response.status()).toBe(404);
});
