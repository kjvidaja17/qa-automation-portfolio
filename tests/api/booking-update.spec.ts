import { expect, test } from '@playwright/test';
import { ApiClient } from '../../helpers/api-client';
import { AuthHelper } from '../../helpers/auth-helper';

test('should update a booking with an authenticated PUT request', async ({ request }) => {
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
  const token = await authHelper.authenticate(username, password);
  const originalBooking = {
    firstname: 'Morgan',
    lastname: 'Ellis',
    totalprice: 275,
    depositpaid: true,
    bookingdates: {
      checkin: '2027-04-01',
      checkout: '2027-04-07',
    },
    additionalneeds: 'Breakfast',
  };

  const createResponse = await apiClient.post('/booking', {
    data: originalBooking,
  });

  await expect(createResponse).toBeOK();
  const createBody = await createResponse.json();
  expect(createBody.bookingid).toEqual(expect.any(Number));

  const bookingId = createBody.bookingid as number;
  const updatedBooking = {
    firstname: 'Morgan Updated',
    lastname: 'Ellis Updated',
    totalprice: 325,
    depositpaid: false,
    bookingdates: {
      checkin: '2027-05-01',
      checkout: '2027-05-08',
    },
    additionalneeds: 'Dinner',
  };

  const updateResponse = await apiClient.put(`/booking/${bookingId}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Cookie: `token=${token}`,
    },
    data: updatedBooking,
  });

  // Current observed behavior: authenticated PUT returns HTTP 200.
  // The persisted booking state is verified below.
  expect(updateResponse.status()).toBe(200);

  const getResponse = await apiClient.get(`/booking/${bookingId}`);
  await expect(getResponse).toBeOK();
  const persistedBooking = await getResponse.json();

  expect(persistedBooking.firstname).toBe(updatedBooking.firstname);
  expect(persistedBooking.lastname).toBe(updatedBooking.lastname);
  expect(persistedBooking.totalprice).toBe(updatedBooking.totalprice);
  expect(persistedBooking.depositpaid).toBe(updatedBooking.depositpaid);
  expect(persistedBooking.bookingdates.checkin).toBe(updatedBooking.bookingdates.checkin);
  expect(persistedBooking.bookingdates.checkout).toBe(updatedBooking.bookingdates.checkout);
  expect(persistedBooking.additionalneeds).toBe(updatedBooking.additionalneeds);
});
