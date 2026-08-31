import { expect, test } from '@playwright/test';
import { ApiClient } from '../../helpers/api-client';

test('should find a created booking using firstname and lastname filters', async ({ request }) => {
  const apiClient = new ApiClient(request);

  const bookingData = {
    firstname: 'FilterTest',
    lastname: 'Unique12345',
    totalprice: 200,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-09-01',
      checkout: '2026-09-05',
    },
    additionalneeds: 'None',
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

  expect(bookingList).toEqual(
    expect.arrayContaining([
        expect.objectContaining({
            bookingid: bookingId,
        }),
    ]),
  );
});
