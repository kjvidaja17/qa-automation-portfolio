import { expect, test } from '@playwright/test';
import { ApiClient } from '../../helpers/api-client';

test('should retrieve an existing booking from the booking list', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const listResponse = await apiClient.get('/booking');

  await expect(listResponse).toBeOK();
  const bookingList = await listResponse.json();

  expect(Array.isArray(bookingList)).toBe(true);
  expect(bookingList.length).toBeGreaterThan(0);

  const bookingId = bookingList[0].bookingid;
  expect(bookingId).toEqual(expect.any(Number));

  const bookingResponse = await apiClient.get(`/booking/${bookingId}`);

  await expect(bookingResponse).toBeOK();
  const booking = await bookingResponse.json();

  expect(booking).toEqual(expect.objectContaining({
    firstname: expect.any(String),
    lastname: expect.any(String),
    totalprice: expect.any(Number),
    depositpaid: expect.any(Boolean),
    bookingdates: expect.objectContaining({
      checkin: expect.any(String),
      checkout: expect.any(String),
    }),
  }));
});
