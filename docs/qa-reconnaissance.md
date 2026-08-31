# QA Reconnaissance — Restful Booker

## 1. Application Overview

### Application

Restful Booker

### Purpose

Restful Booker is a free API playground designed for learning and practicing API testing.

### Core Functionality

The application provides a CRUD-based booking API with authentication, along with a browser-accessible interface for booking and administration.

### Available Capabilities

- Authentication
- Create bookings
- Retrieve booking IDs
- Retrieve individual bookings
- Filter bookings
- Fully update bookings
- Partially update bookings
- Delete bookings
- Browser-based booking and administration

### Test Data

The baseline environment is documented as containing 10 pre-loaded booking records.

### Environment Behavior

- During reconnaissance, the shared environment returned 2,466 booking IDs.
- The environment resets to its baseline dataset approximately every 10 minutes.
- Booking records created during testing may disappear after an environment reset.

### Testing Relevance

Restful Booker is suitable for demonstrating:

- Functional API testing
- Negative testing
- Boundary and edge-case testing
- Authentication testing
- CRUD testing
- Data validation
- API automation
- Integration testing
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

- A known valid test account was successfully used during reconnaissance.
- Credentials are stored outside the repository and are not committed to source control.

**Successful response observed:**

- HTTP 200
- Response contains a `token` value

**Negative Scenarios Observed:**

| Scenario | Observed Response |
| --- | --- |
| Valid username + valid password | Token returned |
| Invalid username + valid password | `reason: Bad credentials` |
| Valid username + invalid password | `reason: Bad credentials` |
| Missing username and password | `reason: Bad credentials` |

**Additional Observations:**

- Multiple successful authentication requests generated different token values.
- Invalid authentication did not return a token.

## 3. Booking Functionality

Restful Booker provides a booking API for creating, retrieving, updating, and deleting booking records.

### Create Booking

- Create a new booking using `POST /booking`.
- Booking data includes guest details, price, deposit status, booking dates, and additional needs.
- A successful request returns a generated `bookingid` and the created booking data.
- Created booking data can subsequently be retrieved using `GET /booking/{id}`.

### Retrieve Bookings

- Retrieve a list of booking IDs using `GET /booking`.
- Retrieve an individual booking using `GET /booking/{id}`.
- Filter the booking list using supported query parameters such as `firstname` and `lastname`.

### Update Booking

- Fully replace a booking using `PUT /booking/{id}`.
- Partially update a booking using `PATCH /booking/{id}`.
- Both operations require authentication.

### Delete Booking

- The API exposes `DELETE /booking/{id}` for booking deletion.
- Delete operations require authentication.
- During current reconnaissance, authenticated DELETE requests returned HTTP 403 and did not remove the booking.

### Booking Data Fields

A booking can contain:

- `firstname`
- `lastname`
- `totalprice`
- `depositpaid`
- `bookingdates.checkin`
- `bookingdates.checkout`
- `additionalneeds`

### Key QA Observations

- Booking creation successfully returned a generated booking ID.
- Created booking data was successfully retrieved and matched the submitted values.
- Missing `firstname` and `lastname` resulted in HTTP 500 responses.
- Invalid `totalprice` data was accepted and returned as `null`.
- A string value of `"yes"` supplied for `depositpaid` was accepted and returned as boolean `true`.
- Booking data and available IDs are dynamic because the environment is shared and periodically reset.

## 4. UI Observations

### Application UI

A browser-accessible interface is available for user-facing interactions and administration.

UI reconnaissance focused on:

- Contact form submission
- Admin authentication and navigation
- Room detail and booking interactions

### UI Testing Relevance

The API remains the primary testing layer because it provides broader and more efficient coverage of backend behavior. Browser automation is used selectively where it validates user-facing behavior that is not adequately represented by API tests.

### UI / Browser Coverage

The current browser automation scope includes:

- Contact form submission and confirmation.
- Admin login and access to the protected dashboard.

Room-booking workflow automation was investigated but deferred because the date-range calendar interaction could not be reproduced deterministically in Playwright.

### Test-Layer Strategy

The portfolio will avoid forcing UI automation onto scenarios that are more efficiently and reliably tested through API requests.

API-level testing will be preferred for:

- CRUD operations
- Authentication
- Data validation
- Negative API scenarios
- Response validation

Browser automation will be used selectively for:

- User-facing UI validation
- Browser authentication and navigation
- End-to-end workflows where browser behavior provides meaningful additional coverage

### Room Booking Calendar Observation

The room-detail page contains a booking calendar that uses drag-based interaction to select a stay.

During manual reconnaissance:

- Dragging across dates successfully changed the selected stay.
- Selecting 2026-09-15 through 2026-09-18 produced a three-night stay.
- The price summary updated to reflect the selected number of nights and total price.
- The `Reserve Now` action was available after selecting the stay.

During Playwright/Codegen inspection:

- Clicking a single date did not produce the expected selection behavior.
- The date-range drag interaction could not be reproduced reliably or deterministically.
- Browser behavior observed during manual interaction differed from the behavior observed during Playwright automation.

**Testing Decision:**

Full automated room-booking coverage is deferred until the date-range interaction can be reproduced deterministically in Playwright.

## 5. API Observations

### GET /booking

**Purpose:**  
Retrieve a list of booking IDs, with optional filtering.

**Endpoint:**  
`https://restful-booker.herokuapp.com/booking`

**Observed Response:**

- HTTP 200
- Response contains booking ID objects.
- 2,466 booking records were returned during reconnaissance.
- The first 10 IDs observed were 1 through 10.

**Filtering Observations:**

- `?firstname=sally` returned no matching records during initial reconnaissance.
- `?lastname=brown` returned no matching records during initial reconnaissance.
- Filtering by `firstname` and `lastname` was later validated successfully using a dynamically created booking.
- The generated booking ID was present in the filtered results.

**Testing Considerations:**

- The booking dataset is dynamic.
- Tests should avoid assuming a fixed number of bookings.
- Tests should avoid relying on arbitrary booking IDs.

### GET /booking/{id}

**Purpose:**  
Retrieve the details of a specific booking.

**Endpoint:**  
`https://restful-booker.herokuapp.com/booking/{id}`

**Initial Test:**

- Requested booking ID `1`.

**Initial Observation:**

- A request without an explicit `Accept` header returned HTTP 418 (`I'm a Teapot`).

**Follow-up Test:**

- A request with `Accept: application/json` returned HTTP 200 and the booking details.

**Observed Response Fields:**

- `firstname`
- `lastname`
- `totalprice`
- `depositpaid`
- `bookingdates.checkin`
- `bookingdates.checkout`
- `additionalneeds`

**Testing Considerations:**

- Define required request headers explicitly where appropriate.
- Consider header-dependent behavior during negative and compatibility testing.

**Negative Scenario:**

- Requested nonexistent booking ID `999999`.
- Observed HTTP 404 (`Not Found`).

### POST /booking

**Purpose:**  
Create a new booking.

**Endpoint:**  
`https://restful-booker.herokuapp.com/booking`

**Initial Test Data:**

- `firstname`: `Kenneth`
- `lastname`: `QA`
- `totalprice`: `150`
- `depositpaid`: `true`
- `bookingdates.checkin`: `2026-09-01`
- `bookingdates.checkout`: `2026-09-05`
- `additionalneeds`: `Breakfast`

**Observed Response:**

- Booking creation succeeded.
- HTTP 200 was returned.
- A generated `bookingid` was returned: `3959`.
- The response included the complete created booking data.
- The submitted values were preserved in the response.

**Persistence Verification:**

- The newly created booking (`bookingid: 3959`) was subsequently retrieved using `GET /booking/3959`.
- The retrieved values matched the values submitted during creation.
- This confirmed that the booking was persisted and retrievable at the time of verification.

**Testing Considerations:**

- Verify successful booking creation.
- Verify that a generated booking ID is returned.
- Verify that the created booking can subsequently be retrieved.
- Compare submitted data with persisted data.
- Validate behavior for missing required fields.
- Validate behavior for invalid data types.
- Validate invalid booking date ranges.
- Consider boundary and unexpected field values.

### PUT /booking/{id}

**Purpose:**  
Replace the details of an existing booking.

**Initial Reconnaissance:**

- A fresh booking was created immediately before the PUT test.
- Created booking ID: `5221`.
- Valid credentials successfully generated an authentication token.
- The token was supplied using the documented `Cookie: token=<token>` approach.
- The initial PUT request returned HTTP 403 Forbidden.
- The same result occurred using both PowerShell `Invoke-RestMethod` and `curl.exe`.
- A subsequent GET confirmed that the target booking remained unchanged.

**Later Observation — 2026-08-31:**

- During later automated test execution, an authenticated PUT request returned HTTP 200.
- The booking update persisted successfully when subsequently retrieved.

**Current Testing Position:**

- Authenticated PUT currently succeeds with HTTP 200 and is covered by automated regression testing.
- The earlier HTTP 403 result is retained as historical reconnaissance evidence.
- The difference between the observations indicates that protected-operation behavior may vary in the shared environment.

**Initial Test Data:**

- `firstname`: `Kenneth Updated`
- `lastname`: `PUT Test Updated`
- `totalprice`: `500`
- `depositpaid`: `false`
- `bookingdates.checkin`: `2026-12-01`
- `bookingdates.checkout`: `2026-12-10`
- `additionalneeds`: `Lunch`

### PATCH /booking/{id}

**Purpose:**  
Partially update an existing booking.

**Initial Reconnaissance:**

- A fresh booking was created immediately before the PATCH test.
- Created booking ID: `2195`.
- Valid credentials successfully generated an authentication token.
- The token was supplied using the documented `Cookie: token=<token>` approach.
- The initial PATCH request attempted to change `additionalneeds` from `Breakfast` to `Dinner`.
- The PATCH request returned HTTP 403 Forbidden.
- A subsequent GET returned HTTP 200 and confirmed that the booking remained unchanged.

**Later Observation — 2026-08-31:**

- During later automated test execution, an authenticated PATCH request returned HTTP 200.
- The request changed only `firstname` and `totalprice`.
- A subsequent GET confirmed that both requested fields were updated.
- The subsequent GET also confirmed that `lastname`, `depositpaid`, `bookingdates.checkin`, `bookingdates.checkout`, and `additionalneeds` remained unchanged.

**Current Testing Position:**

- Authenticated PATCH currently succeeds with HTTP 200 and is covered by automated regression testing.
- Partial-update behavior is validated by checking both changed and unchanged fields.
- The earlier HTTP 403 result is retained as historical reconnaissance evidence.
- The later successful result differs from the initial 403 observation in the shared environment.

**Initial Test Data:**

- `firstname`: `Original`
- `lastname`: `Name`
- `totalprice`: `100`
- `depositpaid`: `true`
- `bookingdates.checkin`: `2026-10-01`
- `bookingdates.checkout`: `2026-10-08`
- `additionalneeds`: `WiFi`

### DELETE /booking/{id}

**Purpose:**  
Delete an existing booking.

**Initial Reconnaissance:**

- A fresh booking was created immediately before the DELETE test.
- Created booking ID: `3022`.
- Valid credentials successfully generated an authentication token.
- The token was supplied using the documented `Cookie: token=<token>` approach.
- The DELETE request returned HTTP 403 Forbidden.
- The booking was not deleted.

**Latest Observation — 2026-08-31:**

- A fresh booking was created successfully.
- Created booking ID: `3853`.
- Valid credentials successfully generated an authentication token.
- The token was supplied using the documented `Cookie: token=<token>` approach.
- `DELETE /booking/3853` returned HTTP 403 Forbidden.
- A subsequent `GET /booking/3853` returned HTTP 200 OK.
- The booking data remained present and unchanged after the failed DELETE.

**Current Testing Position:**

- Authenticated DELETE currently returns HTTP 403 in the shared environment.
- The booking remains retrievable after the failed DELETE request.
- DELETE is therefore documented as a current environment/application limitation rather than automated as a successful deletion workflow.
- The earlier 403 result is consistent with the latest observation.

### Negative Scenarios — Missing Required Fields

| Scenario | Observed Result |
| --- | --- |
| `firstname` omitted | HTTP 500 Internal Server Error |
| `lastname` omitted | HTTP 500 Internal Server Error |

**QA Observation:**

- Omitting either `firstname` or `lastname` results in a server-side HTTP 500 response.
- The API does not reject these missing fields with a client-side validation response.
- These behaviors are covered by negative API tests.
- The observed responses may indicate weak input validation or inadequate error handling.

### Negative Scenario — Invalid `totalprice` Data Type

**Test:**

- `totalprice` was supplied as the string `"one hundred fifty"` instead of a numeric value.

**Observed Result:**

- HTTP 200
- Booking was created successfully.
- A `bookingid` was returned: `1262`.
- The stored `totalprice` value was `null`.

**QA Observation:**

- The API accepts an invalid data type for `totalprice` instead of rejecting the request.
- The invalid value is converted to `null`.
- This indicates weak input validation and presents a potential data-integrity risk.
- The behavior is covered by automated negative API testing.

### Negative Scenario — Invalid `depositpaid` Data Type

**Test:**

- `depositpaid` was supplied as the string `"yes"` instead of a boolean value.

**Observed Result:**

- HTTP 200
- Booking was created successfully.
- A `bookingid` was returned: `1916`.
- The stored `depositpaid` value was returned as boolean `true`.

**QA Observation:**

- The API accepts an invalid data type for `depositpaid` instead of rejecting the request.
- The supplied string value appears to be coerced to boolean `true`.
- This indicates weak input validation and presents a potential data-integrity risk.
- The behavior is covered by automated negative API testing.

### Shared Test Data Behavior

**Observation:**

- Booking `3959` was created successfully during earlier reconnaissance.
- A later `GET /booking/3959` returned HTTP 404 Not Found.
- This demonstrates that booking records in the shared environment may be removed or reset over time.

**Testing Implications:**

- Automated tests must not depend on previously created booking IDs.
- Tests should create or dynamically discover the data required for each scenario.
- Tests should remain independent of shared data created by other sessions.
- Test design should account for periodic environment resets and changing booking data.

## 6. Functional Scenarios

### Authentication

- Authenticate using valid credentials and verify that a token is returned.
- Reject invalid credentials.
- Verify that invalid authentication does not return a token.

### Booking Retrieval

- Retrieve the list of booking IDs.
- Retrieve an existing booking by ID.
- Return HTTP 404 for a nonexistent booking.
- Filter bookings using supported query parameters.

### Booking Creation

- Create a booking using valid data.
- Verify that a generated booking ID is returned.
- Retrieve the created booking.
- Verify that submitted values match the persisted booking data.

### Booking Updates

- Fully replace an existing booking using PUT.
- Partially update selected fields using PATCH.
- Verify that updated values persist after retrieval.
- Verify that PATCH does not unintentionally change fields outside the PATCH payload.

### Booking Deletion

- Attempt authenticated deletion of an existing booking.
- Record the current HTTP 403 response.
- Verify that the booking remains retrievable after the blocked deletion.

## 7. Negative Scenarios

### Authentication (Negative)

- Reject an invalid username.
- Reject an invalid password.
- Verify that invalid authentication does not return a token.
- Missing-credential behavior was observed during reconnaissance but is not currently included in the automated regression suite.

### Booking Retrieval (Negative)

- Return HTTP 404 when requesting a nonexistent booking ID.
- Header-dependent behavior was observed during reconnaissance when `Accept: application/json` was omitted.
- Unmatched or unsupported filter values remain an area for further investigation.

### Booking Creation (Negative)

- Verify behavior when `firstname` is omitted.
- Verify behavior when `lastname` is omitted.
- Verify behavior when an invalid `totalprice` data type is supplied.
- Verify behavior when an invalid `depositpaid` data type is supplied.
- Verify behavior for malformed booking dates.
- Verify behavior for invalid date ranges.
- Validate unexpected or unsupported field values.

### Booking Updates (Negative)

- Verify behavior when authentication is missing or invalid for PUT.
- Verify behavior when authentication is missing or invalid for PATCH.
- Verify behavior when updating a nonexistent booking.
- Verify behavior when required fields are omitted from a PUT request.
- Verify behavior when invalid data types are supplied during updates.

**Current Observation:**

- Authenticated PUT and PATCH currently succeed with HTTP 200.

### Booking Deletion (Negative)

- Verify behavior when authentication is missing or invalid for DELETE.
- Verify behavior when attempting to delete a nonexistent booking.

**Current Observation:**

- Authenticated DELETE requests currently return HTTP 403 in the shared environment.

## 8. Boundary / Edge Cases

### Authentication (Boundary / Future Coverage)

Potential boundary scenarios for future coverage include:

- Empty username.
- Empty password.
- Username or password containing leading/trailing whitespace.
- Unexpectedly long username or password values.

### Booking Data (Boundary / Future Coverage)

Potential boundary scenarios for future coverage include:

- `totalprice` equal to `0`.
- Negative `totalprice`.
- Very large `totalprice` values.
- Decimal `totalprice` values.
- Empty `firstname`.
- Empty `lastname`.
- Very long `firstname` or `lastname`.
- Leading/trailing whitespace in name fields.

### Deposit Status (Boundary / Future Coverage)

Potential boundary scenarios for future coverage include:

- `depositpaid = true`.
- `depositpaid = false`.
- Invalid boolean representations such as strings or numeric values.

### Booking Dates (Boundary / Future Coverage)

Potential boundary scenarios for future coverage include:

- Check-in date equal to check-out date.
- Check-out date earlier than check-in date.
- Dates in the past.
- Very distant future dates.
- Missing check-in date.
- Missing check-out date.
- Invalid date formats.

### Booking Retrieval (Boundary / Future Coverage)

Potential boundary scenarios for future coverage include:

- Booking ID of `0`.
- Negative booking ID.
- Very large booking ID.
- Non-numeric booking ID.
- Empty booking ID.

### Additional Needs (Boundary / Future Coverage)

Potential boundary scenarios for future coverage include:

- Empty `additionalneeds`.
- Very long `additionalneeds`.
- Special characters in `additionalneeds`.

## 9. Integration Scenarios

### INT-001 — Create → Filter → Retrieve

- Create a fresh booking through `POST /booking`.
- Capture the generated booking ID.
- Filter bookings using the created booking's `firstname` and `lastname`.
- Verify that the generated booking ID is present in the filtered results.
- Retrieve the booking using the generated booking ID.
- Verify the full persisted booking data.

### INT-002 — Create → PUT → PATCH → Retrieve

- Create a fresh booking.
- Authenticate.
- Fully update the booking using PUT.
- Partially update selected fields using PATCH.
- Retrieve the final booking.
- Verify the PATCH-updated fields.
- Verify that fields not changed by PATCH retain the values established by PUT.

### Authentication and Protected Operations

Protected-operation workflows use authentication generated through `POST /auth`.

The integration suite verifies authenticated state transitions through the PUT → PATCH workflow in INT-002.

Authenticated DELETE remains outside the automated integration suite because the current shared environment returns HTTP 403 and does not remove the booking.

### Integration Test Strategy

Integration tests are used for multi-step workflows that combine multiple API operations and validate state across those operations.

The integration layer is intentionally kept smaller than the API layer to avoid duplicating individual endpoint tests.

UI workflows are maintained separately in the browser automation layer.

## 10. Risks and Questions

### Authentication and Authorization

**Risk:**  
Protected-operation behavior has not been consistent across reconnaissance sessions.

**Current Observation:**

- Authenticated PUT currently succeeds with HTTP 200.
- Authenticated PATCH currently succeeds with HTTP 200.
- Authenticated DELETE currently returns HTTP 403 and the booking remains retrievable.

**Open Questions:**

- Why does authenticated DELETE still return HTTP 403 while authenticated PUT and PATCH succeed?
- Is the documented cookie-based authentication mechanism behaving consistently across protected operations?
- What is the expected behavior for expired or invalid authentication tokens?

### Data Validation

**Risk:**  
The API accepts some invalid input values instead of rejecting them.

**Current Observations:**

- Missing `firstname` or `lastname` results in HTTP 500.
- An invalid `totalprice` data type is accepted and stored as `null`.
- An invalid `depositpaid` string value is accepted and returned as boolean `true`.

**Open Question:**

- What validation rules and error responses are expected for invalid or missing booking fields?

### Shared Test Environment

**Risk:**  
The shared environment is dynamic and may reset or modify booking data.

**Observed Behavior:**

- Booking records created during reconnaissance may later return HTTP 404.
- The available booking dataset changes over time.

**Mitigation:**

- Create test data dynamically.
- Capture generated booking IDs.
- Avoid hard-coded booking IDs.
- Keep tests independent of shared state.

### Request Headers

**Observation:**

- Omitting `Accept: application/json` caused an initial GET request to return HTTP 418.
- Including the header resulted in HTTP 200 and the booking details.

**Testing Consideration:**

- Required request headers should be defined explicitly in automated tests.
- Header-dependent behavior should be considered when investigating compatibility or unexpected responses.

### UI Automation Stability

**Risk:**  
The room-booking calendar requires drag-based date-range selection, but the interaction could not be reproduced deterministically in Playwright.

**Current Observation:**

- Manual browser interaction successfully selected date ranges and updated pricing.
- The same interaction was not reliably reproducible during Playwright/Codegen inspection.

**Testing Decision:**

- Full room-booking calendar automation is deferred until a deterministic interaction can be established.
- Flaky mouse-based automation should not be introduced solely to increase test count.

### Test Flakiness

**Risk:**  
Failures may result from shared-environment changes, external service behavior, network conditions, or timing rather than actual application defects.

**Mitigation:**

- Keep tests independent.
- Generate test data dynamically.
- Avoid unnecessary dependencies between tests.
- Preserve failure diagnostics.
- Investigate repeated failures before classifying them as product defects.

### AI-Assisted Testing

**Risk:**  
AI-generated test ideas, code, or analysis may contain incorrect assumptions.

**Mitigation:**

- Review AI-generated code before execution.
- Validate generated tests against actual application behavior.
- Treat AI-generated defect analysis as a hypothesis.
- Use observed system behavior as the basis for final QA decisions.

### Open Questions

- Which API behaviors represent documented requirements versus characteristics of the shared training environment?
- Which observed behaviors should be classified as defects, environment limitations, or expected behavior?
- What additional boundary or negative scenarios would provide enough value to justify expanding the current regression suite?
