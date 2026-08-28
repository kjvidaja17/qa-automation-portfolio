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
