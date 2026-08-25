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

- Although the application documentation describes a default dataset, the shared environment returned 2,466 booking IDs during this reconnaissance session.
- The API resets to its default data approximately every 10 minutes.

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

A browser-accessible interface is available, but the reconnaissance performed so far has focused primarily on the REST API.

### UI Testing Relevance

The portfolio will treat the API as the primary system-under-test layer. Browser automation will be included only where the application provides meaningful UI behavior that adds value beyond API-level testing.

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

### PUT /booking/{id}

**Purpose:**  
Replace the details of an existing booking.

**Test setup:**

- A fresh booking was created immediately before the PUT test.
- Created booking ID: `5221`

**Authentication:**

- Valid credentials successfully generated an authentication token.
- The token was supplied using the documented `Cookie: token=<token>` approach.

**Test data:**

- firstname: `Kenneth Updated`
- lastname: `PUT Test Updated`
- totalprice: `500`
- depositpaid: `false`
- checkin: `2026-12-01`
- checkout: `2026-12-10`
- additionalneeds: `Lunch`

**Observed result:**

- PUT request returned HTTP 403 Forbidden.
- The same result occurred using both PowerShell `Invoke-RestMethod` and `curl.exe`.
- The target booking remained unchanged when subsequently retrieved with `GET /booking/5221`.

**QA observation:**

- PUT update behavior could not be successfully completed during reconnaissance despite using valid credentials and the documented token-cookie approach.
- Authentication behavior for protected update operations requires further investigation before automation.

### PATCH /booking/{id}

**Purpose:**  
Partially update an existing booking.

**Test setup:**

- A fresh booking was created immediately before the PATCH test.
- Created booking ID: `2195`.

**Patch request:**

- Only `additionalneeds` was changed from `Breakfast` to `Dinner`.

**Authentication:**

- Valid credentials successfully generated an authentication token.
- The token was supplied using the `Cookie: token=<token>` approach.

**Observed result:**

- PATCH request returned HTTP 403 Forbidden.
- The subsequent GET request returned HTTP 200.
- The booking remained unchanged.

**QA observation:**

- PATCH update behavior could not be successfully completed during reconnaissance.
- PUT and PATCH both returned HTTP 403 despite successful authentication.
- Authentication behavior for protected update operations requires further investigation.

### DELETE /booking/{id}

**Purpose:**  
Delete an existing booking.

**Test setup:**

- A fresh booking was created immediately before the DELETE test.
- Created booking ID: `3022`.

**Authentication:**

- Valid credentials successfully generated an authentication token.
- The token was supplied using the `Cookie: token=<token>` approach.

**Observed result:**

- DELETE request returned HTTP 403 Forbidden.

**QA observation:**

- The booking was not deleted during reconnaissance.
- Authenticated DELETE behavior requires further investigation.

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

### Shared Test Data Behavior

**Observation:**

- Booking `3959` was created successfully during earlier reconnaissance.
- A later `GET /booking/3959` returned HTTP 404 Not Found.
- This confirms that booking records created during reconnaissance may not persist indefinitely.

**Testing implication:**

- Automated tests must not depend on previously created booking IDs.
- Tests should create or dynamically discover their required test data.
- Cleanup should be performed where appropriate.
- Test cases should be resilient to the shared environment being reset or modified.

## 6. Functional Scenarios

### Authentication

- Generate authentication token using valid credentials.
- Reject authentication using invalid credentials.
- Verify authentication response contains a token for valid credentials.

### Booking Retrieval

- Retrieve list of booking IDs.
- Retrieve an existing booking by ID.
- Return not-found response for a nonexistent booking.
- Filter bookings by supported query parameters.

### Booking Creation

- Create a booking with valid data.
- Verify the created booking returns a booking ID.
- Verify the created booking can be retrieved.
- Verify submitted booking data matches persisted data.

### Booking Updates

- Fully update an existing booking using PUT.
- Partially update an existing booking using PATCH.
- Verify updated booking data persists.

### Booking Deletion

- Delete an existing booking.
- Verify deleted booking can no longer be retrieved.

## 7. Negative Scenarios

### Authentication (Negative)

- Reject invalid username.
- Reject invalid password.
- Reject requests with missing credentials.
- Verify no authentication token is returned for invalid credentials.

### Booking Retrieval (Negative)

- Return HTTP 404 when requesting a nonexistent booking ID.
- Investigate behavior when unsupported or unmatched filter values are supplied.
- Verify API behavior when required request headers are omitted.

### Booking Creation (Negative)

- Reject or appropriately handle missing `firstname`.
- Reject or appropriately handle missing `lastname`.
- Reject invalid `totalprice` data types.
- Reject invalid `depositpaid` data types.
- Validate malformed booking dates.
- Validate invalid date ranges.
- Validate invalid or unexpected field values.

### Booking Updates (Negative)

- Verify behavior when authentication is missing or invalid for PUT.
- Verify behavior when authentication is missing or invalid for PATCH.
- Verify behavior when authentication is missing or invalid for DELETE.
- Investigate why authenticated PUT, PATCH, and DELETE requests return HTTP 403.
- Verify behavior when updating a nonexistent booking.
- Verify behavior when required fields are omitted from a PUT request.
- Verify behavior when invalid data types are supplied during updates.

### Booking Deletion (Negative)

- Reject unauthorized DELETE requests.
- Verify behavior when deleting a nonexistent booking.

## 8. Boundary / Edge Cases

### Authentication (Boundary)

- Empty username.
- Empty password.
- Username or password containing leading/trailing whitespace.
- Unexpectedly long username or password values.

### Booking Data

- `totalprice` equal to `0`.
- `totalprice` as a negative value.
- Very large `totalprice` value.
- `totalprice` with decimal values.
- Empty `firstname`.
- Empty `lastname`.
- Very long `firstname` or `lastname`.
- Leading/trailing whitespace in name fields.

### Deposit Status

- `depositpaid = true`.
- `depositpaid = false`.
- Invalid boolean representations such as strings or numeric values.

### Booking Dates

- Check-in date equal to check-out date.
- Check-out date earlier than check-in date.
- Dates in the past.
- Very distant future dates.
- Missing check-in date.
- Missing check-out date.
- Invalid date formats.

### Booking Retrieval (Boundary)

- Booking ID of `0`.
- Negative booking ID.
- Very large booking ID.
- Non-numeric booking ID.
- Empty booking ID.

### Additional Needs

- Empty `additionalneeds`.
- Very long `additionalneeds`.
- Special characters in `additionalneeds`.

## 9. Integration Scenarios

### API → UI / Browser Validation

- Create a booking through the API and verify that the booking can be retrieved through the application/browser where applicable.
- Retrieve booking data through the API and verify that corresponding data is displayed correctly through the application/browser where applicable.

### API → API Data Flow

- Create a booking through `POST /booking`, capture the generated booking ID, and use it in subsequent API requests.
- Create a booking, retrieve it, and compare submitted data against persisted data.
- Create a booking, update it, retrieve it again, and verify the updated data.

### Authentication → Protected Operations

- Generate an authentication token through `POST /auth` and use it for protected booking operations.
- Verify that protected operations are rejected when authentication is missing or invalid.
- Investigate the observed HTTP 403 behavior for PUT, PATCH, and DELETE operations.

### End-to-End Booking Flow

- Authenticate.
- Create a booking.
- Retrieve the booking.
- Update the booking.
- Verify the updated data.
- Delete the booking.
- Verify that the booking can no longer be retrieved.

### Cross-Layer Test Strategy

- Use API testing for backend validation and CRUD operations.
- Use Playwright for browser-level validation where the UI provides meaningful coverage.
- Use Playwright API capabilities for automated API and API/UI integration scenarios.
- Avoid duplicating the same test unnecessarily across UI and API layers.

## 10. Initial Risks / Questions

### Authentication and Authorization

- Why do PUT, PATCH, and DELETE return HTTP 403 despite successful authentication and token generation?
- Is the documented cookie-based authentication method currently behaving as expected?
- Should authenticated requests use an alternative authentication header or mechanism?
- What is the expected behavior for expired or invalid authentication tokens?

### Data Validation

- Why do missing `firstname` or `lastname` fields result in HTTP 500 instead of a client-side validation response?
- Why is an invalid `totalprice` value accepted and returned as `null`?
- Why is an invalid `depositpaid` string value accepted and converted to `true`?
- What validation rules are officially expected for booking fields?

### Test Data and Environment

- Booking data is dynamic and may change or disappear over time.
- Tests must not depend on fixed booking IDs or a fixed number of records.
- Test data should be created dynamically where possible.
- The shared environment may introduce test instability or interference from other users.

### Request Headers

- Explicit `Accept: application/json` affected the observed behavior of `GET /booking/{id}`.
- API tests should explicitly define required headers.
- Header-dependent behavior should be included in API validation.

### UI Coverage

- Restful Booker is primarily an API-testing playground rather than a feature-rich customer-facing application.
- UI automation should therefore be limited to meaningful browser-level scenarios.
- API testing should remain the primary layer for CRUD and validation testing.

### Automation Risks

- Tests should remain independent and avoid relying on previously created data.
- Tests should capture dynamically generated booking IDs.
- Tests should clean up created data where the API permits it.
- CI execution must account for the shared and potentially changing test environment.

### Open Questions

- What is the correct authentication mechanism for PUT, PATCH, and DELETE in the current environment?
- Which API behaviors are documented requirements versus intentional characteristics of the test application?
- Which observed behaviors should be treated as defects, limitations, or expected behavior?
- Which scenarios provide the highest value for automated regression coverage?
