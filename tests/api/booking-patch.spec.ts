import { expect, test } from '@playwright/test';
import { ApiClient } from '../../helpers/api-client';
import { AuthHelper } from '../../helpers/auth-helper';

test('API-015 should partially update a booking and preserve unchanged fields', async ({ request }) => {
  const username = process.env.RESTFUL_BOOKER_USERNAME;
  const password = process.env.RESTFUL_BOOKER_PASSWORD;

  if (!username) {
    throw new Error('Missing required environment variable: RESTFUL_BOOKER_USERNAME');
  }

  if (!password) {
    throw new Error('Missing required environment variable: RESTFUL_BOOKER_PASSWORD');
  }

  const apiClient = new ApiClient(request);
  const authHelper = new AuthHelper(request);

  const originalBooking = {
    firstname: 'Original',
    lastname: 'Name',
    totalprice: 100,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-10-01',
      checkout: '2026-10-08',
    },
    additionalneeds: 'WiFi',
  };

  // Create a booking
  const createResponse = await apiClient.post('/booking', {
    data: originalBooking,
  });

  expect(createResponse.status()).toBe(200);
  const createBody = await createResponse.json();
  expect(createBody.bookingid).toEqual(expect.any(Number));

  const bookingId = createBody.bookingid as number;

  // Authenticate
  const token = await authHelper.authenticate(username, password);

  // Partially update the booking with only firstname and totalprice
  const partialUpdate = {
    firstname: 'Updated',
    totalprice: 250,
  };

  const patchResponse = await apiClient.patch(`/booking/${bookingId}`, {
    headers: {
      Cookie: `token=${token}`,
    },
    data: partialUpdate,
  });

  expect(patchResponse.status()).toBe(200);

  // Retrieve the booking to verify the update
  const getResponse = await apiClient.get(`/booking/${bookingId}`);

  expect(getResponse.status()).toBe(200);
  const updatedBooking = await getResponse.json();

  // Verify updated fields
  expect(updatedBooking.firstname).toBe(partialUpdate.firstname);
  expect(updatedBooking.totalprice).toBe(partialUpdate.totalprice);

  // Verify unchanged fields
  expect(updatedBooking.lastname).toBe(originalBooking.lastname);
  expect(updatedBooking.depositpaid).toBe(originalBooking.depositpaid);
  expect(updatedBooking.bookingdates.checkin).toBe(originalBooking.bookingdates.checkin);
  expect(updatedBooking.bookingdates.checkout).toBe(originalBooking.bookingdates.checkout);
  expect(updatedBooking.additionalneeds).toBe(originalBooking.additionalneeds);
});
