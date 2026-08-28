import { expect, test } from '@playwright/test';
import { ApiClient } from '../../helpers/api-client';

test('should handle an invalid totalprice data type', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const bookingData = {
    firstname: 'Taylor',
    lastname: 'Reed',
    totalprice: 'one hundred fifty',
    depositpaid: true,
    bookingdates: {
      checkin: '2026-10-01',
      checkout: '2026-10-05',
    },
    additionalneeds: 'Breakfast',
  };

  const createResponse = await apiClient.post('/booking', {
    data: bookingData,
  });

  await expect(createResponse).toBeOK();
  const createBody = await createResponse.json();
  expect(createBody.bookingid).toEqual(expect.any(Number));

  const bookingId = createBody.bookingid as number;
  const getResponse = await apiClient.get(`/booking/${bookingId}`);

  await expect(getResponse).toBeOK();
  const persistedBooking = await getResponse.json();

  expect(persistedBooking.totalprice).toBeNull();
});

test('should handle an invalid depositpaid data type', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const bookingData = {
    firstname: 'Jordan',
    lastname: 'Blake',
    totalprice: 180,
    depositpaid: 'yes',
    bookingdates: {
      checkin: '2026-11-01',
      checkout: '2026-11-06',
    },
    additionalneeds: 'Dinner',
  };

  const createResponse = await apiClient.post('/booking', {
    data: bookingData,
  });

  await expect(createResponse).toBeOK();
  const createBody = await createResponse.json();
  expect(createBody.bookingid).toEqual(expect.any(Number));

  const bookingId = createBody.bookingid as number;
  const getResponse = await apiClient.get(`/booking/${bookingId}`);

  await expect(getResponse).toBeOK();
  const persistedBooking = await getResponse.json();

  expect(persistedBooking.depositpaid).toBe(true);
});

test('should return 500 when firstname is omitted', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const bookingData = {
    lastname: 'Parker',
    totalprice: 210,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-12-01',
      checkout: '2026-12-07',
    },
    additionalneeds: 'Lunch',
  };

  const response = await apiClient.post('/booking', {
    data: bookingData,
  });

  expect(response.status()).toBe(500);
});

test('should return 500 when lastname is omitted', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const bookingData = {
    firstname: 'Casey',
    totalprice: 195,
    depositpaid: true,
    bookingdates: {
      checkin: '2027-01-05',
      checkout: '2027-01-10',
    },
    additionalneeds: 'Dinner',
  };

  const response = await apiClient.post('/booking', {
    data: bookingData,
  });

  expect(response.status()).toBe(500);
});
