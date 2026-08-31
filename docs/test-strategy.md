# Test Strategy — Restful Booker

## 1. Objectives

The primary objective of this project is to demonstrate a practical, risk-based QA approach for a RESTful booking application using API testing, test automation, integration testing, and AI-assisted QA techniques.

The test strategy aims to:

- Validate critical API functionality and booking workflows.
- Verify authentication, authorization, data validation, and data integrity.
- Identify and document unexpected system behavior and potential defects.
- Demonstrate automated API testing using TypeScript and Playwright.
- Demonstrate appropriate use of Postman for API exploration and validation.
- Demonstrate meaningful API integration and targeted browser-level testing where applicable.
- Apply AI to assist with test design, test review, edge-case identification, and defect analysis while maintaining human QA oversight.
- Produce a maintainable and CI-ready automated test suite suitable for regression testing.

### MVP Focus

The MVP prioritizes a small, reliable, well-documented regression suite over exhaustive coverage or maximizing the number of automated tests.

## 2. Scope

### In Scope

The following areas are included in the test strategy:

#### Authentication

- Valid authentication.
- Invalid authentication.
- Authentication token handling.
- Missing-credential behavior observed during reconnaissance.

#### Booking Retrieval

- Retrieve booking IDs.
- Retrieve individual bookings.
- Booking filtering.
- Handling of nonexistent booking IDs.
- Response and header validation.

#### Booking Creation

- Valid booking creation.
- Required-field validation.
- Data-type validation.
- Booking data persistence.
- Response validation.

#### Booking Updates

- Full booking updates using PUT.
- Partial booking updates using PATCH.
- Authentication and authorization behavior.
- Verification of updated and unchanged data.

#### Booking Deletion

- Authenticated DELETE behavior.
- Verification of the current HTTP 403 response.
- Verification that a booking remains retrievable after a blocked DELETE request.

#### Cross-Layer Testing

- Multi-step API workflows that validate state across related operations.
- Targeted browser-level validation where the UI provides meaningful additional coverage.
- End-to-end browser workflows only where the interaction can be reproduced reliably.

#### Quality Attributes

- Data integrity.
- Input validation.
- Error handling.
- Test-data resilience.
- Reliability of automated regression tests.

## 3. Out of Scope

The following areas are outside the initial scope of this portfolio:

- Exhaustive UI automation of the browser interface.
- Visual or pixel-level UI validation.
- Full automation of the room-booking calendar interaction until its drag-based date-range selection can be reproduced deterministically in Playwright.
- Load, stress, and endurance testing.
- Performance benchmarking of the Restful Booker infrastructure.
- Full security or penetration testing.
- Infrastructure and server-side monitoring.
- Database-level testing without an exposed test interface.
- Exhaustive testing of every possible input combination.
- Production-level reliability testing of the shared Restful Booker environment.
- Testing functionality that is not exposed through the available application or API interfaces.

## 4. Risk-Based Priorities

Testing priority will be based on business impact, likelihood of failure, data-integrity risk, and the value of automated regression coverage.

### High Priority

#### Authentication and Authorization

Protected booking operations require authentication. During reconnaissance, authenticated PUT and PATCH initially returned HTTP 403 but later succeeded with HTTP 200. Authenticated DELETE continues to return HTTP 403 in the shared environment.

The differing results make protected-operation behavior an important area for continued monitoring and regression coverage.

#### Data Validation

Invalid input was accepted in several scenarios, including:

- Invalid `totalprice` data type resulting in `null`.
- Invalid `depositpaid` data type being converted to `true`.
- Missing `firstname` or `lastname` resulting in HTTP 500.

These behaviors represent validation and data-integrity risks.

#### Data Integrity

Created and updated booking data must match the values returned by subsequent retrieval operations.

The automation suite therefore verifies persisted state in addition to response status codes.

### Medium Priority

- Booking retrieval and filtering.
- Booking date validation.
- Boundary and edge cases.
- Response-header behavior.
- Error and not-found handling.

### Lower Priority

- Extensive browser/UI coverage.
- Low-risk combinations of input values.
- Cosmetic or visual validation.
- Highly repetitive scenarios with limited regression value.

### Prioritization Principle

The project will prioritize tests that are:

1. High risk if they fail.
2. Likely to regress.
3. Valuable for automated regression testing.
4. Representative of real QA engineering practices.
5. Suitable for reliable execution in the shared test environment.

## 5. Test Levels

### 5.1 API-Level Testing

API testing is the primary test level for this project because Restful Booker is primarily an API-focused application.

API-level testing covers:

- Authentication and token generation.
- Booking retrieval and filtering.
- Booking creation and persistence.
- Full booking updates using PUT.
- Partial booking updates using PATCH.
- Negative and validation scenarios.
- HTTP status codes and error responses.
- Data persistence and integrity.

#### Primary Tools (API)

- Postman for API exploration, manual validation, and investigation of API behavior.
- Playwright APIRequestContext for automated API regression testing and CI execution.

### 5.2 Integration Testing

Integration tests validate multi-step workflows involving multiple API operations and confirm that state remains consistent across those operations.

Current integration coverage includes:

- `INT-001`: Create → Filter → Retrieve.
- `INT-002`: Create → PUT → PATCH → Retrieve.

Integration testing focuses on:

- Data flow across related operations.
- Authentication within protected workflows.
- Persistence across multiple requests.
- State transitions.
- Consistency between operations.

#### Primary Tools (Integration)

- TypeScript + Playwright `APIRequestContext`.

### 5.3 Browser / UI-Level Testing

Browser testing is intentionally limited because Restful Booker is primarily an API-focused application.

Current UI automation covers:

- Contact form submission and confirmation.
- Admin authentication and access to the protected dashboard.

Browser automation is used selectively when user-facing or browser-specific behavior provides meaningful additional coverage.

The room-booking calendar was investigated during reconnaissance but is currently deferred because its drag-based date-range interaction could not be reproduced deterministically in Playwright.

#### Primary Tools (UI)

- TypeScript + Playwright.

### 5.4 Test-Level Allocation Principles

Tests should be implemented at the lowest appropriate level that provides reliable and meaningful coverage.

- Use API tests when backend behavior can be validated without the browser.
- Use integration tests when the primary risk involves interaction between multiple operations or state transitions.
- Use browser tests when user-facing or browser-specific behavior adds meaningful coverage.
- Avoid duplicating identical assertions across test levels without a specific risk-based justification.

The current test suite therefore intentionally contains more API tests, fewer integration tests, and a small number of targeted browser tests.

## 6. Tool Strategy

### 6.1 Postman

Postman is used primarily for API exploration, manual validation, and investigation of application behavior.

Postman is used to:

- Explore API endpoints and document request/response behavior.
- Validate authentication and token generation.
- Validate HTTP status codes and response bodies.
- Investigate request headers, parameters, and payloads.
- Explore positive, negative, and boundary scenarios.
- Investigate unexpected API behavior before automating it.

Postman supports exploratory testing and API investigation, while automated regression coverage is maintained in Playwright.

### 6.2 TypeScript + Playwright

Playwright with TypeScript is the primary automation framework for the project.

Playwright is used to:

- Automate API regression tests through `APIRequestContext`.
- Automate multi-step API integration workflows.
- Validate API responses and persisted data.
- Implement targeted browser-level tests where UI coverage provides meaningful value.
- Generate HTML test reports and diagnostic artifacts.
- Support CI execution through GitHub Actions.

The Playwright implementation follows maintainable automation practices, including:

- Reusable helpers and fixtures.
- Centralized configuration.
- Reliable assertions.
- Dynamic test data.
- Independent tests.
- Clear test organization.
- Appropriate abstraction without unnecessary complexity.

### 6.3 TypeScript

TypeScript is the primary programming language for the automation framework.

TypeScript is used to:

- Implement Playwright API and browser tests.
- Build reusable helpers and fixtures.
- Define test data and configuration.
- Improve maintainability through static typing.

### 6.4 GitHub Actions

GitHub Actions is used for continuous integration and automated regression execution.

The current CI workflow:

- Checks out the repository.
- Sets up Node.js 24.
- Installs dependencies using `npm ci`.
- Runs the TypeScript typecheck.
- Installs Playwright browsers and system dependencies.
- Executes the full 19-test suite.
- Uploads the Playwright HTML report as a workflow artifact.
- Uploads `test-results/` when the workflow fails and results are available.

Authentication credentials are supplied through GitHub Actions repository secrets and are not committed to the repository.

### 6.5 AI-Assisted QA

AI is used as a supporting capability rather than as a replacement for human QA judgment.

AI may assist with:

- Generating candidate test scenarios.
- Identifying potential edge cases.
- Reviewing test cases for coverage gaps.
- Reviewing automated tests for weak or missing assertions.
- Analyzing failed test output and suggesting possible causes.
- Assisting with defect analysis and root-cause hypotheses.
- Reviewing test data for potential risks.

AI-generated suggestions are reviewed and validated by the QA engineer before being incorporated into the test strategy or automated test suite.

### 6.6 Tool Allocation Principles

The same scenario should not automatically be implemented in every tool.

- Use Postman for exploratory API analysis and manual validation.
- Use Playwright APIRequestContext for automated API regression.
- Use Playwright browser automation when user-facing or browser-specific behavior provides additional risk coverage.
- Use GitHub Actions for continuous automated execution.
- Use AI when it provides meaningful assistance in test design, analysis, or maintenance.

The final test suite prioritizes maintainability, reliability, and risk coverage over maximizing the number of tools or automated tests.

## 7. Test Data Strategy

### 7.1 Dynamic Test Data

The automated test suite avoids relying on fixed booking IDs or long-lived records.

Where practical, tests:

- Create their own booking data before testing.
- Capture the generated `bookingid`.
- Use the generated ID for subsequent operations.
- Verify the resulting data.
- Avoid relying on cleanup when the shared environment does not permit reliable deletion.

### 7.2 Test Data Independence

Tests should be independent of:

- Previously created booking records.
- A fixed number of bookings.
- Specific booking IDs.
- The current ordering of booking records.
- Data created by other users of the shared environment.

A test should be able to establish the data it requires rather than assuming that required data already exists.

### 7.3 Reusable Test Data

Reusable test data and helper structures should be used where they improve consistency and maintainability.

Test data should support:

- Valid booking creation.
- Negative scenarios.
- Boundary and edge cases.
- Update scenarios.
- Data-integrity verification.

Sensitive values such as authentication credentials and tokens will not be hard-coded into source files or committed to the repository.

### 7.4 Authentication Data

Authentication credentials are stored outside the committed source code where appropriate.

Authentication tokens are generated during test execution rather than hard-coded.

Tests involving protected operations obtain fresh authentication data as required.

### 7.5 Negative Test Data

Negative tests deliberately provide invalid or unexpected values, including:

- Missing required fields.
- Incorrect data types.
- Invalid dates.
- Invalid date ranges.
- Boundary values.
- Invalid booking IDs.
- Invalid authentication credentials.

Negative test data should be generated or maintained separately from standard valid test data to make the intent of each test clear.

### 7.6 Shared Environment Considerations

Restful Booker is a shared and changing environment.

Therefore:

- Tests should minimize assumptions about existing records.
- Tests should create data dynamically whenever practical.
- Tests should avoid interfering with unrelated records.
- Tests should minimize dependence on cleanup because authenticated DELETE is currently blocked in the shared environment.
- CI failures caused by external environment changes should be distinguishable from product or test failures.

### 7.7 Data Validation

For create and update operations, tests validate both the response and the resulting persisted data.

Where applicable, the strategy uses:

`Create → capture ID → retrieve → compare`

This helps detect cases where an API returns a successful response but persists an unexpected value.

## 8. Test Environment

### 8.1 Application Under Test

The primary system under test is the publicly accessible Restful Booker application and API.

**API Base URL:**

`https://restful-booker.herokuapp.com`

**UI Base URL:**

`https://automationintesting.online/`

The API and browser interfaces provide the functionality documented in the QA reconnaissance.

### 8.2 Local Development Environment

The automation project is developed and executed locally using:

- Windows development environment.
- Node.js.
- npm.
- TypeScript.
- Playwright Test.
- Playwright-supported browsers.
- Postman for API exploration and validation.
- Git and GitHub for source control.

### 8.3 Automation Environment

The Playwright framework uses the centralized `playwright.config.ts` configuration to define:

- Test directory.
- API base URL.
- CI-specific retries and worker settings.
- HTML reporting.
- Failure screenshots.
- Retry traces.
- CI behavior through the `CI` environment variable.

Environment-specific values are supplied through environment variables and are referenced by the test code rather than embedded in individual test files.

### 8.4 Configuration and Secrets

Credentials, authentication tokens, and other environment-specific secrets must not be committed to the public repository.

Local authentication credentials are supplied through the `.env` file using:

- `RESTFUL_BOOKER_USERNAME`
- `RESTFUL_BOOKER_PASSWORD`

GitHub Actions supplies the same values through repository secrets.

Test code references environment variables rather than hard-coded credentials.

### 8.5 Shared Environment Considerations

Restful Booker is a shared and dynamic test environment.

Therefore:

- Existing booking data must not be assumed to remain unchanged.
- Tests create or discover the data they require.
- Tests avoid relying on fixed booking IDs.
- Tests minimize interference with unrelated records.
- Tests minimize dependence on execution order.
- Failures caused by external environment changes should be distinguished from actual test or application failures.

### 8.6 Local and CI Consistency

Local and CI test execution use the same:

- Test code.
- Playwright configuration.
- Test-data strategy.
- Assertion logic.
- Environment-variable approach.

CI-specific differences are limited to environment-specific settings such as secrets, worker count, retries, and reporting behavior.

### 8.7 Test Reporting and Artifacts

Automated execution can produce diagnostic information including:

- Playwright HTML reports.
- Screenshots for failed browser tests.
- Playwright traces when configured for retries.
- Test result files.
- GitHub Actions workflow artifacts.

Generated directories such as `test-results/` and `playwright-report/` are excluded from source control.

GitHub Actions uploads the Playwright HTML report for each run when available and uploads test results when the workflow fails and results are available.

### 8.8 Environment Limitations

The shared Restful Booker environment may experience:

- Data changes.
- Data resets.
- Interference from other users.
- Temporary service or network issues.
- Behavior that differs from a controlled production-like environment.

These limitations are considered when interpreting failures and designing automated regression tests.

The room-booking calendar also has a browser-automation reproducibility limitation: the drag-based date-range interaction has not yet been reproduced deterministically in Playwright. Full calendar automation is therefore deferred.

## 9. Automation Strategy

### 9.1 Automation Objectives

The automation framework focuses on reliable, maintainable regression coverage for high-risk and frequently reusable scenarios.

Automation prioritizes:

- Authentication.
- Booking creation and retrieval.
- Data validation.
- Data integrity.
- High-value negative scenarios.
- Protected booking operations.
- API and API-driven integration workflows.
- Selected browser-level scenarios where UI coverage provides additional value.

### 9.2 Framework

The primary automation framework uses:

- TypeScript.
- Playwright Test.
- Playwright `APIRequestContext` for API automation.
- Playwright browser automation for selected UI scenarios.

The framework supports API and browser testing within a consistent project structure.

### 9.3 Test Organization

Tests are organized by functional area rather than by individual HTTP method alone.

The current organization includes:

- Authentication tests.
- Booking retrieval tests.
- Booking creation tests.
- Booking validation tests.
- Booking update tests.
- Integration tests.
- Browser/UI tests.

Test names clearly describe the behavior being validated.

### 9.4 Reusable Components

The framework uses reusable components where they provide clear value, including:

- API helper functions.
- Test fixtures.
- Authentication helpers.
- Shared configuration.

Abstraction is introduced only when it improves maintainability and readability.

### 9.5 Dynamic Test Data

Tests generate or discover the booking data required for their workflows.

The framework:

1. Creates or locates required test data.
2. Captures generated booking IDs.
3. Uses those IDs within the current test flow.
4. Validates the resulting state.
5. Avoids relying on cleanup when deletion is not reliably supported by the shared environment.

Hard-coded booking IDs are avoided because the shared environment is dynamic.

### 9.6 Test Independence

Each automated test should be independently executable where practical.

Tests should:

- Avoid relying on execution order.
- Avoid relying on another test's created data.
- Establish required preconditions.
- Avoid relying on cleanup when deletion is not reliably supported.
- Use deterministic assertions.
- Minimize dependencies on shared environment state.

### 9.7 Assertions

Assertions validate meaningful system behavior rather than only confirming that a request completed.

Assertions include:

- HTTP status codes.
- Response structure.
- Required fields.
- Field values.
- Data types.
- Persisted data.
- Error responses.
- Cross-request consistency.

A successful HTTP status alone is not considered sufficient evidence of a successful test when data integrity can also be validated.

### 9.8 API/UI Integration

API-to-UI integration is not part of the current automated regression suite.

The current integration layer focuses on API-to-API workflows, while browser automation is maintained separately for targeted UI scenarios.

Future API-to-UI coverage would only be introduced where the browser interface provides meaningful additional validation and the workflow can be automated reliably.

### 9.9 Error and Diagnostic Handling

Automated tests provide useful diagnostic information when failures occur.

Where applicable, the framework captures:

- Playwright traces.
- Screenshots for browser failures.
- HTML reports.
- CI test artifacts.

Tests fail with clear and actionable assertion messages.

### 9.10 CI Compatibility

The automation framework supports both local and CI execution.

Tests:

- Avoid machine-specific file paths.
- Avoid hard-coded credentials.
- Avoid assumptions about local browser state.
- Use environment-based configuration where appropriate.
- Produce CI-compatible reports and artifacts.

### 9.11 Automation Scope

The current automated regression suite contains:

- 15 API tests.
- 2 integration tests.
- 2 targeted browser/UI tests.
- 19 automated tests in total.

The automation scope is intentionally focused on high-value, reliable scenarios rather than maximizing test count.

Room-booking calendar automation is currently deferred because the drag-based date-range interaction could not be reproduced deterministically in Playwright.

Authenticated DELETE remains outside successful lifecycle automation because the current shared environment returns HTTP 403 and leaves the booking retrievable.

### 9.12 Maintainability Principles

The framework prioritizes:

- Readability.
- Reusability.
- Reliability.
- Clear separation of concerns.
- Minimal duplication.
- Stable test data handling.
- Strong assertions.
- Simple architecture.
- Easy CI execution.

Automation complexity should be justified by the testing value it provides.

## 10. AI-Assisted QA Strategy

### 10.1 Purpose

AI is used as a supporting capability within the QA process to assist with test design, test coverage analysis, automation review, and failure analysis.

AI-generated outputs are not treated as authoritative. Final testing decisions, expected results, defect classifications, and test acceptance remain the responsibility of the QA engineer.

### 10.2 AI-Assisted Test Design

AI may be used to generate candidate test scenarios from:

- Requirements.
- Acceptance criteria.
- API documentation.
- Request and response examples.
- Existing test cases.

Potential AI-generated scenarios may include:

- Positive scenarios.
- Negative scenarios.
- Boundary cases.
- Validation scenarios.
- Data-integrity scenarios.
- Authentication and authorization scenarios.

The QA engineer reviews generated scenarios for correctness, relevance, duplication, and risk coverage before adding them to the test suite.

### 10.3 AI-Assisted Edge-Case Discovery

AI may be used to identify test conditions that may not be immediately apparent during manual analysis.

Examples include:

- Unusual data types.
- Boundary values.
- Missing fields.
- Invalid date combinations.
- Unexpected input formats.
- Authentication edge cases.
- State-transition scenarios.

AI suggestions will be evaluated against the application's documented behavior and observed behavior before being implemented.

### 10.4 AI-Assisted Test Case Review

AI may review existing test cases and identify:

- Missing scenarios.
- Weak assertions.
- Duplicate coverage.
- Missing negative cases.
- Missing boundary cases.
- Tests that may be overly dependent on implementation details.

The QA engineer will determine whether each suggestion is valid before changing the test suite.

### 10.5 AI-Assisted Automation Review

AI may assist with reviewing Playwright and TypeScript tests for:

- Weak or missing assertions.
- Unnecessary duplication.
- Potential flaky-test patterns.
- Hard-coded test data.
- Poor test isolation.
- Maintainability issues.
- Opportunities for reusable fixtures or helpers.

AI recommendations will be reviewed manually before implementation.

### 10.6 AI-Assisted Failure and Defect Analysis

When an automated test fails, AI may be provided with relevant diagnostic information such as:

- Test name.
- Assertion failure.
- HTTP response.
- Error message.
- Relevant request data.
- Playwright trace or failure details.

AI may then suggest:

- Possible root causes.
- Related scenarios to investigate.
- Additional tests.
- Potential defect impact.

AI-generated root-cause analysis will be treated as a hypothesis and must be verified by the QA engineer.

### 10.7 AI-Assisted Defect Triage

AI may assist in organizing and analyzing discovered issues by suggesting:

- Potential severity.
- Potential impact.
- Related test scenarios.
- Possible reproduction areas.
- Additional evidence that should be collected.

Final severity, priority, defect status, and release impact will be determined by the QA engineer.

### 10.8 Human Oversight

Human QA judgment remains responsible for:

- Determining expected behavior.
- Reviewing AI-generated test scenarios.
- Validating AI-generated code or recommendations.
- Confirming defects.
- Determining severity and priority.
- Approving changes to the automated test suite.

AI will not be used as the sole source of truth for testing decisions.

### 10.9 AI Transparency

AI-assisted activities used in the portfolio are documented where appropriate.

The portfolio will distinguish between:

- QA decisions made by the tester.
- AI-generated suggestions.
- AI-generated implementation assistance.
- Final human-validated results.

This demonstrates responsible use of AI within a professional QA workflow rather than treating AI-generated output as automatically correct.

### 10.10 AI Security and Privacy

Sensitive information must not be submitted to external AI systems.

The project will avoid providing AI tools with:

- Real credentials.
- Authentication tokens.
- Secrets.
- Private production data.
- Personally identifiable information.

Only synthetic or publicly appropriate test information will be used for AI-assisted activities.

### 10.11 AI MVP Scope

The portfolio may demonstrate AI-assisted QA through two primary workflows:

1. AI-assisted test case review and edge-case discovery.
2. AI-assisted analysis of automated test failures and potential root causes.

Any AI-assisted output included in the portfolio will be reviewed and validated by the QA engineer before being treated as a testing decision or defect conclusion.

## 11. CI/CD Strategy

### 11.1 Purpose

GitHub Actions provides continuous integration for the automated QA suite by executing the project's typecheck and Playwright regression tests in a consistent CI environment.

The CI pipeline helps detect regressions and environment-specific issues before changes are integrated.

### 11.2 CI Workflow

The current CI workflow:

1. Checks out the repository.
2. Sets up Node.js 24 on `ubuntu-latest`.
3. Installs project dependencies using `npm ci`.
4. Runs the TypeScript typecheck using `npm run typecheck`.
5. Installs Playwright browsers and system dependencies.
6. Supplies Restful Booker credentials through GitHub Actions repository secrets.
7. Executes the full 19-test Playwright suite using `npm test`.
8. Uploads the Playwright HTML report as a workflow artifact.
9. Uploads `test-results/` when the workflow fails and results are available.

### 11.3 Trigger Conditions

The CI workflow runs on:

- Pushes to the `main` branch.
- Pull requests targeting the `main` branch.

### 11.4 Test Execution Strategy

The CI pipeline executes the complete automated regression suite rather than maintaining separate API, integration, and UI CI jobs.

The current suite contains:

- 15 API tests.
- 2 integration tests.
- 2 targeted browser/UI tests.

The Playwright configuration applies CI-specific settings including:

- `CI=true`.
- Single-worker execution.
- Up to two retries for failed tests.
- HTML reporting.
- Failure screenshots.
- Traces on the first retry.

### 11.5 Environment Configuration

CI credentials are supplied through GitHub Actions repository secrets:

- `RESTFUL_BOOKER_USERNAME`
- `RESTFUL_BOOKER_PASSWORD`

Credentials and authentication tokens are not hard-coded into the workflow or committed to the repository.

### 11.6 Test Data in CI

CI tests use the same dynamic test-data strategy as local execution.

Tests:

- Create required booking data dynamically.
- Capture generated booking IDs.
- Avoid relying on persistent shared records.
- Minimize dependence on execution order.
- Avoid relying on cleanup when deletion is not reliably supported by the shared environment.

### 11.7 CI Concurrency

The CI workflow uses a single Playwright worker.

This reduces concurrency against the shared Restful Booker environment and helps minimize interference between tests that create or modify booking data.

Local execution may use multiple workers where supported by the environment.

### 11.8 Failure Diagnostics

The CI workflow preserves diagnostic information for investigation.

Available artifacts include:

- Playwright HTML reports.
- `test-results/` when a workflow failure produces test results.
- Screenshots for failed browser tests.
- Playwright traces when a retry occurs.

These artifacts allow failures to be investigated without requiring every failure to be reproduced locally.

### 11.9 CI Quality Gate

The CI pipeline fails when the required typecheck or automated Playwright tests fail.

A successful workflow indicates that the configured regression suite passed in the CI environment.

A failed workflow requires investigation before the associated change is considered ready for integration.

### 11.10 Shared Environment Limitations

Because Restful Booker is a shared and changing environment, a CI failure may result from:

- Application availability issues.
- Shared test-data changes.
- Environment resets.
- Network failures.
- External interference.
- Application defects.
- Test implementation defects.

CI failures should therefore be investigated to distinguish environmental issues from genuine test or application failures.

### 11.11 Future CI Enhancements

Potential future improvements include:

- Scheduled regression runs.
- Separate smoke and full-regression workflows.
- Multi-browser CI execution.
- Test sharding where reliable.
- Additional reporting integrations.
- Automated publishing of test results.

Future CI enhancements should be introduced only when they provide meaningful value without reducing test reliability.

## 12. Entry / Exit Criteria

### 12.1 Entry Criteria

Testing can begin when:

- The application/API is available.
- Required environment configuration is available.
- Project dependencies are installed successfully.
- Required authentication information is available through approved configuration mechanisms.
- Relevant test scenarios have been reviewed and prioritized.
- Required test data can be created or discovered.
- The automated test framework can execute successfully in the target environment.

### 12.2 Automation Entry Criteria

A scenario is ready for automation when:

- Expected behavior is sufficiently understood.
- The scenario provides meaningful regression value.
- The test can be executed reliably in the available environment.
- Required test data can be created or discovered dynamically.
- Expected results can be validated through reliable assertions.
- The scenario is appropriate for the selected test level and tool.

### 12.3 Exit Criteria

Testing for a planned scope is considered complete when:

- All prioritized test scenarios have been executed.
- Critical and high-priority failures have been investigated.
- Confirmed defects have been documented appropriately.
- Required automated tests are passing, or known environment limitations have been documented.
- Test results and relevant evidence have been reviewed.
- Environment-related failures have been distinguished from product or test failures.
- Required test documentation has been updated.
- CI execution has completed successfully when CI execution is part of the scope.

### 12.4 Portfolio Completion Criteria

The current portfolio milestone is considered complete when:

- The prioritized API regression suite is implemented.
- Multi-step integration scenarios are implemented where supported.
- Targeted browser tests are implemented where they provide meaningful value.
- The automated tests execute successfully locally.
- The automated tests execute successfully through GitHub Actions.
- Test reports and failure diagnostics are available.
- AI-assisted QA practices are documented.
- The repository contains sufficient documentation to explain the test strategy, automation approach, and known limitations.

### Expected vs Observed Behavior

The project will distinguish between:

- Documented or intended behavior.
- Behavior observed during reconnaissance.
- Behavior implemented in automated regression tests.

Unexpected observed behavior will not automatically be treated as the intended expected result.

## 13. Risks and Mitigations

### 13.1 Shared Test Environment

**Risk:**  
The Restful Booker environment is shared and dynamic. Existing records may change or disappear, and other users may modify data.

**Mitigation:**

- Create required test data dynamically.
- Capture generated booking IDs.
- Avoid hard-coded test records.
- Minimize dependencies on shared state.
- Distinguish environmental failures from product failures.

### 13.2 Authentication Behavior

**Risk:**

Protected-operation behavior was inconsistent during reconnaissance. Authenticated PUT and PATCH initially returned HTTP 403 but later succeeded with HTTP 200. Authenticated DELETE continues to return HTTP 403 in the shared environment.

**Mitigation:**

- Validate the documented authentication mechanism using automated and exploratory API testing.
- Record historical observations separately from current regression expectations.
- Maintain automated coverage for protected operations where reliable expected behavior has been established.
- Document authenticated DELETE as a current environment/application limitation.
- Avoid assuming that an observed environment-specific response represents the intended API contract.

### 13.3 Unvalidated Input Behavior

**Risk:**  
The API accepted invalid input types and produced unexpected results.

Examples observed:

- Invalid `totalprice` resulted in `null`.
- Invalid `depositpaid` was converted to `true`.
- Missing `firstname` or `lastname` resulted in HTTP 500.

**Mitigation:**

- Include negative and data-integrity tests.
- Validate both status codes and response/persisted data.
- Compare observed behavior against documented expectations.
- Document potential defects rather than assuming all successful responses are correct.

### 13.4 Test Flakiness

**Risk:**  
Tests may fail because of unstable shared data, external service behavior, network issues, or timing conditions rather than actual application defects.

**Mitigation:**

- Keep tests independent.
- Generate test data dynamically.
- Avoid unnecessary dependencies between tests.
- Capture diagnostic artifacts.
- Use controlled retries only for genuinely transient failures.
- Investigate repeated failures before classifying them as product defects.

### 13.5 Over-Automation

**Risk:**  
Automating low-value or repetitive scenarios may increase maintenance cost without improving meaningful coverage.

**Mitigation:**

- Use risk-based prioritization.
- Prefer API testing when UI testing adds no value.
- Avoid duplicating identical scenarios across tools.
- Maintain a focused regression suite.

### 13.6 AI Misinterpretation

**Risk:**  
AI-generated test ideas, code, or defect analysis may be incomplete, incorrect, or misleading.

**Mitigation:**

- Require human QA review of AI-generated output.
- Treat AI root-cause analysis as a hypothesis.
- Verify generated scenarios against requirements and actual system behavior.
- Do not allow AI output to become the sole basis for defect decisions.

### 13.7 Credential and Secret Exposure

**Risk:**  
Authentication credentials, tokens, or other sensitive configuration could accidentally be committed to the public repository.

**Mitigation:**

- Use environment variables and CI secrets.
- Never hard-code credentials or tokens in committed files.
- Review `.gitignore` and repository contents regularly.
- Avoid submitting secrets or private information to AI tools.

### 13.8 CI Environment Differences

**Risk:**  
Tests may pass locally but fail in GitHub Actions because of differences in environment, browser configuration, networking, or concurrency.

**Mitigation:**

- Keep local and CI configuration consistent.
- Centralize Playwright configuration.
- Avoid machine-specific paths and assumptions.
- Use the same test-data strategy locally and in CI.
- Preserve CI failure artifacts for investigation.

### 13.9 Scope Expansion

**Risk:**  
The portfolio could grow indefinitely through additional tools, test cases, frameworks, and certifications.

**Mitigation:**

- Prioritize a defined MVP.
- Focus on high-value QA capabilities.
- Add new capabilities only when they demonstrate a meaningful skill.
- Prefer depth and quality over the number of technologies or tests.

### MVP Principle

The initial portfolio milestone will prioritize depth, reliability, and demonstrable QA judgment over the number of automated tests, tools, or features.

New automation, AI capabilities, and integrations will only be added when they provide meaningful testing or portfolio value.
