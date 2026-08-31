import { expect, test } from '@playwright/test';
import { ApiClient } from '../../helpers/api-client';
import { AuthHelper } from '../../helpers/auth-helper';

test('INT-001: should create, filter, and retrieve a booking', async ({ request }) => {
  const apiClient = new ApiClient(request);

  const bookingData = {
    firstname: 'Integration',
    lastname: 'FilterTest',
    totalprice: 300,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-10-15',
      checkout: '2026-10-20',
    },
    additionalneeds: 'Airport shuttle',
  };

  // Create a booking
  const createResponse = await apiClient.post('/booking', {
    data: bookingData,
  });

  expect(createResponse.status()).toBe(200);
  const createBody = await createResponse.json();
  expect(createBody.bookingid).toEqual(expect.any(Number));

  const bookingId = createBody.bookingid as number;

  // Filter bookings by firstname and lastname
  const filterResponse = await apiClient.get('/booking', {
    params: {
      firstname: bookingData.firstname,
      lastname: bookingData.lastname,
    },
  });

  expect(filterResponse.status()).toBe(200);
  const bookingList = await filterResponse.json();

  expect(Array.isArray(bookingList)).toBe(true);
  const bookingIds = bookingList.map((booking: any) => booking.bookingid);
  expect(bookingIds).toContain(bookingId);

  // Retrieve the specific booking
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

test('INT-002: should create, fully update, partially update, and retrieve a booking', async ({ request }) => {
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
    totalprice: 200,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-11-01',
      checkout: '2026-11-07',
    },
    additionalneeds: 'Breakfast',
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

  // Full update with PUT
  const fullyUpdatedBooking = {
    firstname: 'FullyUpdated',
    lastname: 'PutTest',
    totalprice: 400,
    depositpaid: false,
    bookingdates: {
      checkin: '2026-12-01',
      checkout: '2026-12-08',
    },
    additionalneeds: 'Dinner',
  };

  const putResponse = await apiClient.put(`/booking/${bookingId}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Cookie: `token=${token}`,
    },
    data: fullyUpdatedBooking,
  });

  expect(putResponse.status()).toBe(200);

  // Partial update with PATCH
  const partialUpdate = {
    firstname: 'PartiallyUpdated',
    totalprice: 550,
  };

  const patchResponse = await apiClient.patch(`/booking/${bookingId}`, {
    headers: {
      Cookie: `token=${token}`,
    },
    data: partialUpdate,
  });

  expect(patchResponse.status()).toBe(200);

  // Retrieve and verify the final booking state
  const getResponse = await apiClient.get(`/booking/${bookingId}`);

  expect(getResponse.status()).toBe(200);
  const finalBooking = await getResponse.json();

  // Verify PATCH-updated fields
  expect(finalBooking.firstname).toBe(partialUpdate.firstname);
  expect(finalBooking.totalprice).toBe(partialUpdate.totalprice);

  // Verify fields from the PUT that were not overridden by PATCH
  expect(finalBooking.lastname).toBe(fullyUpdatedBooking.lastname);
  expect(finalBooking.depositpaid).toBe(fullyUpdatedBooking.depositpaid);
  expect(finalBooking.bookingdates.checkin).toBe(fullyUpdatedBooking.bookingdates.checkin);
  expect(finalBooking.bookingdates.checkout).toBe(fullyUpdatedBooking.bookingdates.checkout);
  expect(finalBooking.additionalneeds).toBe(fullyUpdatedBooking.additionalneeds);
});
