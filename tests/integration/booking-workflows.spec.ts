import { expect, test } from '@playwright/test';
import { ApiClient } from '../../helpers/api-client';
import { AuthHelper } from '../../helpers/auth-helper';

test('should create and retrieve a booking with matching persisted data', async ({ request }) => {
  const apiClient = new ApiClient(request);

  const bookingData = {
    firstname: 'Jordan',
    lastname: 'Williams',
    totalprice: 350,
    depositpaid: false,
    bookingdates: {
      checkin: '2026-10-05',
      checkout: '2026-10-12',
    },
    additionalneeds: 'Late checkout',
  };

  // Create a booking
  const createResponse = await apiClient.post('/booking', {
    data: bookingData,
  });

  expect(createResponse.status()).toBe(200);
  const createBody = await createResponse.json();
  expect(createBody.bookingid).toEqual(expect.any(Number));

  const bookingId = createBody.bookingid as number;

  // Retrieve the booking
  const getResponse = await apiClient.get(`/booking/${bookingId}`);

  expect(getResponse.status()).toBe(200);
  const retrievedBooking = await getResponse.json();

  // Verify all fields match
  expect(retrievedBooking.firstname).toBe(bookingData.firstname);
  expect(retrievedBooking.lastname).toBe(bookingData.lastname);
  expect(retrievedBooking.totalprice).toBe(bookingData.totalprice);
  expect(retrievedBooking.depositpaid).toBe(bookingData.depositpaid);
  expect(retrievedBooking.bookingdates.checkin).toBe(bookingData.bookingdates.checkin);
  expect(retrievedBooking.bookingdates.checkout).toBe(bookingData.bookingdates.checkout);
  expect(retrievedBooking.additionalneeds).toBe(bookingData.additionalneeds);
});

test('should create, update, and retrieve a booking with the updated data', async ({ request }) => {
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
    firstname: 'Alex',
    lastname: 'Thompson',
    totalprice: 425,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-11-01',
      checkout: '2026-11-08',
    },
    additionalneeds: 'High floor',
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

  // Update the booking
  const updatedBooking = {
    firstname: 'Alexandra',
    lastname: 'Thompson-Hayes',
    totalprice: 550,
    depositpaid: false,
    bookingdates: {
      checkin: '2026-12-01',
      checkout: '2026-12-10',
    },
    additionalneeds: 'Quiet location',
  };

  const updateResponse = await apiClient.put(`/booking/${bookingId}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Cookie: `token=${token}`,
    },
    data: updatedBooking,
  });

  expect(updateResponse.status()).toBe(200);

  // Retrieve and verify updated booking
  const getResponse = await apiClient.get(`/booking/${bookingId}`);

  expect(getResponse.status()).toBe(200);
  const retrievedBooking = await getResponse.json();

  // Verify all updated fields persist
  expect(retrievedBooking.firstname).toBe(updatedBooking.firstname);
  expect(retrievedBooking.lastname).toBe(updatedBooking.lastname);
  expect(retrievedBooking.totalprice).toBe(updatedBooking.totalprice);
  expect(retrievedBooking.depositpaid).toBe(updatedBooking.depositpaid);
  expect(retrievedBooking.bookingdates.checkin).toBe(updatedBooking.bookingdates.checkin);
  expect(retrievedBooking.bookingdates.checkout).toBe(updatedBooking.bookingdates.checkout);
  expect(retrievedBooking.additionalneeds).toBe(updatedBooking.additionalneeds);
});
