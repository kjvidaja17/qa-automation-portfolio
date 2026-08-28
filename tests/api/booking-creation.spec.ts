import { expect, test } from '@playwright/test';
import { ApiClient } from '../../helpers/api-client';

test('should create a booking and verify the persisted booking data', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const bookingData = {
    firstname: 'Avery',
    lastname: 'Morgan',
    totalprice: 245,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-09-15',
      checkout: '2026-09-20',
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

  expect(persistedBooking.firstname).toBe(bookingData.firstname);
  expect(persistedBooking.lastname).toBe(bookingData.lastname);
  expect(persistedBooking.totalprice).toBe(bookingData.totalprice);
  expect(persistedBooking.depositpaid).toBe(bookingData.depositpaid);
  expect(persistedBooking.bookingdates.checkin).toBe(bookingData.bookingdates.checkin);
  expect(persistedBooking.bookingdates.checkout).toBe(bookingData.bookingdates.checkout);
  expect(persistedBooking.additionalneeds).toBe(bookingData.additionalneeds);
});
