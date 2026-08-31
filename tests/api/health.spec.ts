import { expect, test } from '@playwright/test';
import { ApiClient } from '../../helpers/api-client';

test('should return a successful response from the health endpoint', async ({ request }) => {
  const apiClient = new ApiClient(request);

  const response = await apiClient.get('/ping');

  expect(response.status()).toBe(201);
});
