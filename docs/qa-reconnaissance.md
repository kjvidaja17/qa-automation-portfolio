# QA Reconnaissance — Restful Booker

## 1. Application Overview

### Application

Restful Booker

### Purpose

Restful Booker is a free API playground designed for learning and practicing API testing and API testing tools.

### Core functionality

The application provides a CRUD-based booking API with authentication.

### Available capabilities

- Authentication
- Create bookings
- Retrieve booking IDs
- Retrieve individual bookings
- Update bookings
- Partially update bookings
- Delete bookings

### Test data

The API starts with 10 pre-loaded booking records.

### Environment behavior

The API resets to its default data approximately every 10 minutes.

### Testing relevance

Restful Booker is suitable for demonstrating:

- Functional API testing
- Negative testing
- Boundary and edge-case testing
- Authentication testing
- CRUD testing
- Data validation
- API automation
- API/UI integration testing
- AI-assisted test design and analysis

## 2. Authentication

### POST /auth

**Purpose:**  
Generate an authentication token for protected booking operations.

**Endpoint:**  
`https://restful-booker.herokuapp.com/auth`

**Required fields:**

- `username`
- `password`

**Valid credentials observed:**

- Username: `admin`
- Password: `password123`

**Successful response observed:**

- HTTP 200
- Response contains a `token` value

**Negative scenarios observed:**

| Scenario | Observed response |
| --- | --- |
| Valid username + valid password | Token returned |
| Invalid username + valid password | `reason: Bad credentials` |
| Valid username + invalid password | `reason: Bad credentials` |
| Missing username and password | `reason: Bad credentials` |

**Additional observation:**

- Multiple successful authentication requests generated different token values.
- Invalid authentication did not return a token.

## 3. Booking Functionality

Restful Booker provides CRUD functionality for managing hotel booking records.

### Create Booking

- Create a new booking using `POST /booking`.
- Booking data includes guest information, price, deposit status, booking dates, and additional needs.
- A successful request returns a generated `bookingid` and the created booking data.
- Created booking data can subsequently be retrieved using `GET /booking/{id}`.

### Retrieve Bookings

- Retrieve a list of booking IDs using `GET /booking`.
- Retrieve an individual booking using `GET /booking/{id}`.
- Booking-list filtering is supported through query parameters such as `firstname` and `lastname`.

### Update Booking

- Full booking updates are supported using `PUT /booking/{id}`.
- Partial booking updates are supported using `PATCH /booking/{id}`.
- These operations require authentication.

### Delete Booking

- Bookings can be deleted using `DELETE /booking/{id}`.
- Delete operations require authentication.

### Booking Data Fields

A booking can contain:

- `firstname`
- `lastname`
- `totalprice`
- `depositpaid`
- `bookingdates.checkin`
- `bookingdates.checkout`
- `additionalneeds`

### Initial QA Observations

- Booking creation successfully returned a generated booking ID.
- Created booking data was successfully retrieved and matched the submitted values.
- Missing `firstname` and `lastname` resulted in HTTP 500 responses.
- Invalid `totalprice` data was accepted and returned as `null`.
- A string value of `"yes"` supplied for `depositpaid` was accepted and returned as boolean `true`.
- Booking data and available IDs are dynamic because the environment is shared and periodically reset.

## 4. UI Observations

### Application UI

Restful Booker provides a basic browser-accessible interface associated with the booking application and API playground.

### UI Testing Relevance

The application is primarily designed for API testing rather than as a feature-rich customer-facing web application. Therefore, the primary automation focus of this portfolio will be API and API-driven testing.

### Planned UI / Browser Coverage

Playwright will be used where browser-level coverage provides meaningful value, including:

- Verifying availability and accessibility of the application through a browser.
- Validating browser-level behavior where applicable.
- Demonstrating Playwright TypeScript capabilities alongside API automation.

### Test-Layer Strategy

The portfolio will avoid forcing UI automation onto scenarios that are more efficiently and reliably tested through API requests.

API-level testing will be preferred for:

- CRUD operations
- Authentication
- Data validation
- Negative API scenarios
- Response validation

Playwright browser/API capabilities will be used for:

- UI/browser validation where applicable
- API automation
- API-to-UI integration scenarios
- End-to-end workflows where meaningful

## 5. API Observations

### GET /booking

**Purpose:**  
Retrieve a list of booking IDs, with optional filtering.

**Endpoint:**  
`https://restful-booker.herokuapp.com/booking`

**Observed response:**

- HTTP 200
- Response contains booking ID objects.
- 2,466 booking records were returned during reconnaissance.
- The first 10 IDs observed were 1 through 10.

**Filtering observations:**

- `?firstname=sally` returned no matching records.
- `?lastname=brown` returned no matching records.
- Exact-match filter behavior should be investigated further using known existing booking data.

**Testing considerations:**

- The booking dataset is dynamic.
- Tests should avoid assuming a fixed number of bookings.
- Tests should avoid relying on arbitrary booking IDs that may disappear or change.

### GET /booking/{id}

**Purpose:**  
Retrieve the details of a specific booking.

**Endpoint:**  
`https://restful-booker.herokuapp.com/booking/{id}`

**Test performed:**

- Requested booking ID `1`

**Initial observation:**

- Request without an explicit `Accept` header returned HTTP 418 (`I'm a Teapot`).

**Follow-up test:**

- Request with `Accept: application/json` returned HTTP 200 and the booking details.

**Observed response fields:**

- `firstname`
- `lastname`
- `totalprice`
- `depositpaid`
- `bookingdates.checkin`
- `bookingdates.checkout`
- `additionalneeds`

**Testing considerations:**

- Request headers should be included explicitly in automated API tests where appropriate.
- Header-dependent behavior should be covered by negative/compatibility testing.

**Negative scenario:**

- Requested nonexistent booking ID `999999`.
- Observed HTTP 404 (`Not Found`).

### POST /booking

**Purpose:**  
Create a new booking.

**Endpoint:**  
`https://restful-booker.herokuapp.com/booking`

**Test data used:**

- firstname: `Kenneth`
- lastname: `QA`
- totalprice: `150`
- depositpaid: `true`
- checkin: `2026-09-01`
- checkout: `2026-09-05`
- additionalneeds: `Breakfast`

**Observed response:**

- Booking was successfully created.
- A `bookingid` was returned: `3959`.
- Response included the complete created booking data.
- Submitted values were preserved in the response.

**Testing considerations:**

- Verify that a valid booking can be created.
- Verify that the generated booking ID can subsequently be retrieved.
- Verify that submitted data matches persisted data.
- Test missing required fields.
- Test invalid data types.
- Test invalid date ranges.
- Test boundary values.

**Persistence verification:**

- The newly created booking (`bookingid: 3959`) was successfully retrieved using `GET /booking/3959`.
- The retrieved values matched the values submitted during creation.
- This confirms the created booking was persisted and retrievable.

### Negative scenarios — Missing required fields

| Scenario | Observed result |
| --- | --- |
| `firstname` omitted | HTTP 500 Internal Server Error |
| `lastname` omitted | HTTP 500 Internal Server Error |

**QA observation:**

- Omitting either `firstname` or `lastname` causes a server-side 500 response.
- A more appropriate API behavior would typically be a client-side validation response such as HTTP 400.
- These cases should be included in the negative-test suite and tracked as potential API defects/limitations.

### Negative scenario — Invalid totalprice data type

**Test:**

- `totalprice` supplied as a string (`"one hundred fifty"`) instead of a numeric value.

**Observed result:**

- HTTP 200 / booking created successfully.
- A `bookingid` was returned: `1262`.
- `totalprice` was returned as `null`.

**QA observation:**

- The API accepts an invalid data type for `totalprice`.
- The supplied invalid value is not rejected and is converted to `null`.
- This indicates weak input validation and potential data-integrity risk.
- This should be covered by negative API tests.

### Negative scenario — Invalid depositpaid data type

**Test:**

- `depositpaid` supplied as a string (`"yes"`) instead of a boolean.

**Observed result:**

- HTTP 200 / booking created successfully.
- A `bookingid` was returned: `1916`.
- `depositpaid` was returned as boolean `true`.

**QA observation:**

- The API accepts a string value where a boolean is expected.
- The input appears to be coerced to boolean rather than rejected.
- This represents weak input-type validation and should be covered by negative API tests.

## 6. Functional Scenarios

## 7. Negative Scenarios

## 8. Boundary / Edge Cases

## 9. Integration Scenarios

## 10. Initial Risks / Questions
