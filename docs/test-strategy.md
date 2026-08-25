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

The first milestone will prioritize a small, reliable, well-documented regression suite over exhaustive coverage or implementation of every planned capability.

## 2. Scope

### In Scope

The following areas are included in the test strategy:

#### Authentication

- Valid authentication.
- Invalid authentication.
- Missing authentication credentials.
- Authentication token handling.

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
- Verification of updated data.

#### Booking Deletion

- Booking deletion.
- Authentication and authorization behavior.
- Verification that deleted bookings cannot be retrieved.

#### Cross-Layer Testing

- API-to-API workflows.
- API-to-browser validation where meaningful.
- End-to-end booking workflows where supported by the application.

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
- Load, stress, and endurance testing.
- Performance benchmarking of the Restful Booker infrastructure.
- Full security or penetration testing.
- Infrastructure and server-side monitoring.
- Database-level testing without an exposed test interface.
- Exhaustive testing of every possible input combination.
- Production-level reliability testing of the shared Restful Booker environment.
- Testing features that are not exposed through the documented application or API.

## 4. Risk-Based Priorities

Testing priority will be based on business impact, likelihood of failure, data-integrity risk, and the value of automated regression coverage.

### High Priority

#### Authentication and Authorization

PUT, PATCH, and DELETE operations returned HTTP 403 during reconnaissance despite successful token generation. This behavior requires further investigation and verification.

#### Data Validation

Invalid input was accepted in several scenarios, including:

- Invalid `totalprice` data type resulting in `null`.
- Invalid `depositpaid` data type being converted to `true`.
- Missing `firstname` or `lastname` resulting in HTTP 500.

#### Data Integrity

Created booking data must match the data persisted and subsequently retrieved from the API.

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

API testing will be the primary test level for this project because Restful Booker is primarily an API-focused application.

API-level testing will cover:

- Authentication and token generation.
- Booking retrieval.
- Booking creation.
- Booking updates using PUT and PATCH.
- Booking deletion.
- Request and response validation.
- Required-field validation.
- Data-type validation.
- Boundary and negative scenarios.
- HTTP status codes and error responses.
- Data persistence and integrity.

#### Primary Tools (API)

- Postman for API exploration, request validation, and collection-based testing.
- Playwright APIRequest for automated API regression testing and CI execution.

### 5.2 Integration Testing

Integration tests will verify interactions between related system operations rather than testing individual requests in isolation.

Examples include:

- Create booking → retrieve booking → compare data.
- Create booking → update booking → retrieve and verify updated data.
- Authenticate → perform protected booking operation.
- Create booking through API → validate through the browser only where the available UI provides meaningful additional coverage.
- Delete booking → verify the booking can no longer be retrieved.

Integration tests will focus on data flow, authentication, persistence, and consistency between system layers.

#### Primary Tools (Integration)

- TypeScript + Playwright APIRequest.
- Playwright browser capabilities where UI validation adds meaningful coverage.

### 5.3 Browser / UI-Level Testing

Browser testing will be intentionally limited because Restful Booker is primarily an API-testing playground rather than a feature-rich customer-facing application.

Browser-level testing will focus only on scenarios where UI validation provides value beyond API testing.

Potential coverage includes:

- Verifying application availability through a browser.
- Validating meaningful browser-level booking behavior where supported.
- API-to-browser validation of booking data where applicable.
- End-to-end workflows where browser interaction provides additional risk coverage.

#### Primary Tools (UI)

- TypeScript + Playwright.

### 5.4 Test-Level Allocation Principles

Tests should be implemented at the lowest appropriate level that provides reliable and meaningful coverage.

- Use API tests when backend behavior can be validated without the browser.
- Use integration tests when interaction between operations or system layers is the primary risk.
- Use browser tests when user-facing behavior or browser-specific behavior adds meaningful coverage.
- Avoid duplicating identical assertions across API and UI tests without a specific risk-based justification.

The initial automation suite will therefore contain more API tests, fewer integration tests, and a small number of targeted browser tests.

## 6. Tool Strategy

### 6.1 Postman

Postman will be used primarily for API exploration, manual API validation, and collection-based testing.

Postman will be used to:

- Explore API endpoints and document request/response behavior.
- Validate authentication and token generation.
- Build reusable API request collections.
- Validate HTTP status codes and response bodies.
- Test positive, negative, and boundary scenarios.
- Validate request headers, parameters, and payloads.
- Investigate unexpected API behavior before automating it.
- Demonstrate API testing techniques using Postman.

Postman will serve as the primary tool for exploratory API testing and for establishing expected API behavior before implementing automated regression tests.

### 6.2 TypeScript + Playwright

Playwright with TypeScript will be used as the primary automation framework.

Playwright will be used to:

- Automate API regression tests through Playwright APIRequest.
- Automate integration workflows involving multiple API operations.
- Validate API responses and persisted data.
- Implement browser-level tests where UI coverage provides meaningful value.
- Execute tests across supported browser configurations where applicable.
- Generate test reports and diagnostic artifacts.
- Support CI/CD execution through GitHub Actions.

The Playwright implementation will follow maintainable automation practices, including:

- Reusable test fixtures.
- Centralized configuration.
- Reliable assertions.
- Dynamic test data.
- Independent tests.
- Clear test organization.
- Appropriate abstraction without unnecessary complexity.

### 6.3 TypeScript

TypeScript will be the primary programming language for the automation framework.

TypeScript will be used to:

- Implement Playwright API and browser tests.
- Create reusable helper functions and fixtures.
- Manage test data and configuration.
- Improve maintainability through static typing.
- Support scalable automation architecture.

### 6.4 GitHub Actions

GitHub Actions will be used for continuous integration and automated regression execution.

The CI workflow will:

- Install project dependencies.
- Execute automated API tests.
- Execute selected browser/integration tests.
- Generate test reports.
- Preserve relevant test artifacts for failed runs.
- Provide a consistent automated test execution environment.

### 6.5 AI-Assisted QA

AI will be used as a supporting capability rather than as a replacement for human QA judgment.

AI-assisted activities may include:

- Generating candidate test scenarios from requirements.
- Identifying potential edge cases.
- Reviewing test cases for coverage gaps.
- Reviewing automated tests for weak or missing assertions.
- Analyzing failed test output and suggesting possible causes.
- Assisting with defect analysis and root-cause hypotheses.
- Reviewing test data for potential risks.

AI-generated suggestions will be reviewed and validated by the QA engineer before being incorporated into the test strategy or automated test suite.

### 6.6 Tool Allocation Principles

The same scenario should not automatically be implemented in every tool.

- Use Postman when exploratory API analysis or manual API validation provides the greatest value.
- Use Playwright APIRequest when the scenario belongs in automated API regression.
- Use Playwright browser automation when user-facing or browser-specific behavior provides additional risk coverage.
- Use GitHub Actions to continuously execute selected automated tests.
- Use AI when it provides meaningful assistance in test design, analysis, or maintenance.

The final test suite will prioritize maintainability, reliability, and risk coverage over maximizing the number of tools or automated tests.

## 7. Test Data Strategy

### 7.1 Dynamic Test Data

The automated test suite will avoid relying on fixed booking IDs or long-lived records.

Where possible, tests will:

- Create their own booking data before testing.
- Capture the generated `bookingid`.
- Use the generated ID for subsequent operations.
- Verify the resulting data.
- Clean up created records when the API and current authentication behavior permit it.

### 7.2 Test Data Independence

Tests should be independent of:

- Previously created booking records.
- A fixed number of bookings.
- Specific booking IDs.
- The current ordering of booking records.
- Data created by other users of the shared environment.

A test should be able to establish the data it requires rather than assuming that required data already exists.

### 7.3 Reusable Test Data

Common valid booking data will be maintained in reusable test-data structures rather than duplicated throughout individual tests.

Test data should support:

- Valid booking creation.
- Negative scenarios.
- Boundary and edge cases.
- Update scenarios.
- Data-integrity verification.

Sensitive values such as authentication credentials and tokens will not be hard-coded into source files or committed to the repository.

### 7.4 Authentication Data

Authentication credentials will be stored outside the committed source code where appropriate.

Authentication tokens will be generated during test execution rather than hard-coded.

Tests involving protected operations will obtain fresh authentication data as required.

### 7.5 Negative Test Data

Negative tests will deliberately provide invalid or unexpected values, including:

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
- Tests should avoid modifying unrelated records.
- Tests should clean up test data when supported.
- CI failures caused by external environment changes should be distinguishable from product/test failures.

### 7.7 Data Validation

For create and update operations, tests will validate both the response and the resulting persisted data.

Where applicable, the strategy will use:

`Create → capture ID → retrieve → compare`

This will help detect cases where an API returns a successful response but persists an unexpected value.

## 8. Test Environment

### 8.1 Application Under Test

The primary system under test is the publicly accessible Restful Booker API.

**Base URL:**
`https://restful-booker.herokuapp.com`

The application provides the API endpoints documented in the QA reconnaissance.

### 8.2 Local Development Environment

The automation project will be developed and executed locally using:

- Windows development environment.
- Node.js.
- npm.
- TypeScript.
- Playwright Test.
- Playwright-supported browsers.
- Postman for API exploration and validation.
- Git and GitHub for source control.

### 8.3 Automation Environment

The Playwright automation framework will use a centralized configuration file to define:

- Base URL.
- Browser configuration.
- Test execution settings.
- Reporting configuration.
- Timeout settings.
- Environment-specific behavior where required.

Environment-specific values should be configurable rather than embedded throughout individual test files.

### 8.4 Configuration and Secrets

Credentials, authentication tokens, and other environment-specific secrets must not be committed to the public repository.

Where required, configuration values will be supplied through:

- Environment variables.
- Local environment configuration.
- GitHub Actions secrets for CI execution.

Test code should reference configuration values rather than hard-coded credentials.

### 8.5 Shared Environment Considerations

Restful Booker is a shared and dynamic test environment.

Therefore:

- Existing booking data must not be assumed to remain unchanged.
- Tests should create or discover the data they require.
- Tests should avoid interfering with unrelated records.
- Tests should minimize dependence on execution order.
- Failures caused by external environment changes should be distinguishable from actual test failures.

### 8.6 Local and CI Consistency

Local and CI test execution should use the same:

- Test code.
- Playwright configuration.
- Test-data strategy.
- Assertion logic.
- Environment configuration approach.

Differences between local and CI execution should be limited to environment-specific settings such as secrets, workers, or reporting.

### 8.7 Test Reporting and Artifacts

Automated execution should produce useful diagnostic information, including where applicable:

- Test results.
- HTML reports.
- Screenshots for failed browser tests.
- Playwright traces for debugging.
- Other relevant CI artifacts.

Generated artifacts such as `test-results/` and `playwright-report/` should not be committed to source control unless a specific portfolio requirement makes them necessary.

### 8.8 Environment Limitations

The shared Restful Booker environment may experience:

- Data changes.
- Data resets.
- Interference from other users.
- Temporary service or network issues.
- Behavior that differs from a controlled production-like environment.

These limitations should be considered when interpreting failures and designing automated regression tests.

## 9. Automation Strategy

### 9.1 Automation Objectives

The automation framework will focus on reliable, maintainable regression coverage for high-risk and frequently reusable scenarios.

Automation will prioritize:

- Authentication.
- Booking creation and retrieval.
- Data validation.
- Data integrity.
- High-value negative scenarios.
- Protected booking operations.
- API and API-driven integration workflows.
- Selected browser-level scenarios where UI coverage provides additional value.

### 9.2 Framework

The primary automation framework will use:

- TypeScript.
- Playwright Test.
- Playwright APIRequest for API automation.
- Playwright browser automation for selected UI scenarios.

The framework will be designed to support both API and browser testing within a consistent project structure.

### 9.3 Test Organization

Tests will be organized by functional area rather than by individual HTTP method alone.

Initial organization may include:

- Authentication tests.
- Booking retrieval tests.
- Booking creation tests.
- Booking validation tests.
- Booking update tests.
- Booking deletion tests.
- Integration tests.
- Browser/UI tests.

Test names should clearly describe the behavior being validated.

### 9.4 Reusable Components

The framework will use reusable components where they provide clear value, including:

- API helper functions.
- Test fixtures.
- Test-data builders or factories.
- Authentication helpers.
- Shared configuration.
- Reusable validation utilities.

Abstraction should be introduced only when it improves maintainability and readability.

### 9.5 Dynamic Test Data

Tests will generate or discover required booking data dynamically.

The framework should:

1. Create or locate required test data.
2. Capture generated booking IDs.
3. Use those IDs within the current test flow.
4. Validate the resulting state.
5. Clean up created data where supported.

Hard-coded booking IDs will be avoided because the shared environment is dynamic.

### 9.6 Test Independence

Each automated test should be independently executable where practical.

Tests should:

- Avoid relying on execution order.
- Avoid relying on another test's created data.
- Establish required preconditions.
- Clean up test data where appropriate.
- Use deterministic assertions.
- Minimize dependencies on shared environment state.

### 9.7 Assertions

Assertions will validate meaningful system behavior rather than only confirming that a request completed.

Assertions may include:

- HTTP status code.
- Response structure.
- Required fields.
- Field values.
- Data types.
- Persisted data.
- Error responses.
- Business-rule behavior.
- Cross-request consistency.

A successful HTTP status alone will not be considered sufficient evidence of a successful test when data integrity can also be validated.

### 9.8 API/UI Integration

API/UI integration will be implemented only where the Restful Booker browser interface provides meaningful behavior beyond API-level validation.

The primary integration layer will therefore remain API-to-API workflows, with targeted browser integration where justified.

### 9.9 Error and Diagnostic Handling

Automated tests should provide useful diagnostic information when failures occur.

Where applicable, the framework will capture:

- Request/response information.
- Playwright traces.
- Screenshots for browser failures.
- HTML reports.
- CI test artifacts.

Tests should fail with clear and actionable assertion messages.

### 9.10 CI Compatibility

The automation framework will be designed for both local and CI execution.

Tests should:

- Avoid machine-specific file paths.
- Avoid hard-coded credentials.
- Avoid assumptions about local browser state.
- Use environment-based configuration where appropriate.
- Produce CI-compatible reports and artifacts.

### 9.11 Automation Scope

The initial MVP will prioritize approximately:

- 12–15 API tests.
- 3–5 integration tests.
- 2–3 targeted browser/UI tests.

The exact number may change based on test value, duplication, and reliability.

The goal is meaningful regression coverage rather than maximizing test count.

### 9.12 Maintainability Principles

The framework will prioritize:

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

AI will be used as a supporting capability within the QA process to improve test design, test coverage, analysis, and maintenance.

AI-generated outputs will not be treated as authoritative. Final testing decisions, expected results, defect classifications, and test acceptance will remain the responsibility of the QA engineer.

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

The QA engineer will review generated scenarios for correctness, relevance, duplication, and risk coverage before adding them to the test suite.

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

AI-assisted activities used in the portfolio will be documented where appropriate.

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

The initial portfolio milestone will demonstrate two primary AI-assisted QA workflows:

1. AI-assisted test case review and edge-case discovery.
2. AI-assisted analysis of automated test failures and potential root causes.

Additional AI-assisted capabilities may be added later if they provide meaningful testing value.

## 11. CI/CD Strategy

### 11.1 Purpose

GitHub Actions will be used to automatically execute the automated QA test suite whenever relevant changes are pushed to the repository or submitted through a pull request.

The CI pipeline will provide consistent test execution and early detection of regressions.

### 11.2 CI Workflow

The initial CI workflow will follow this general process:

1. Check out the repository.
2. Set up the required Node.js environment.
3. Install project dependencies.
4. Install required Playwright browsers and dependencies.
5. Configure environment variables and secrets.
6. Execute automated API tests.
7. Execute selected integration and browser tests.
8. Generate test reports.
9. Upload relevant test artifacts.
10. Mark the workflow as passed or failed based on test results.

### 11.3 Trigger Conditions

The CI workflow will initially run on:

- Pushes to the `main` branch.
- Pull requests targeting the `main` branch.

Additional scheduled execution may be introduced later if it provides meaningful regression coverage.

### 11.4 Test Execution Strategy

CI execution will prioritize fast and reliable tests first.

The initial order will be:

1. API tests.
2. Integration tests.
3. Selected browser/UI tests.

API tests will provide the primary regression signal because the Restful Booker application is primarily API-focused.

### 11.5 Environment Configuration

CI-specific configuration will be supplied through GitHub Actions environment variables or secrets where appropriate.

The workflow must not contain:

- Hard-coded credentials.
- Authentication tokens.
- Private keys.
- Other sensitive values.

Environment-specific configuration should remain separate from test logic.

### 11.6 Test Data in CI

CI tests will follow the same dynamic test-data strategy used for local execution.

Tests should:

- Create required booking data dynamically.
- Capture generated booking IDs.
- Avoid relying on persistent shared records.
- Minimize interference with other users.
- Clean up test data where supported.

### 11.7 Parallel Execution

Parallel execution may be enabled where tests are independent and the shared environment can support concurrent requests reliably.

Tests that interact with the same booking or shared state must not be executed concurrently unless their isolation is guaranteed.

Parallelism will therefore be introduced based on test reliability rather than maximum execution speed.

### 11.8 Failure Diagnostics

When CI tests fail, the workflow should preserve useful diagnostic information where applicable, including:

- Playwright HTML reports.
- Test result files.
- Screenshots from failed browser tests.
- Playwright traces.
- Relevant logs.

The goal is to allow failures to be investigated without reproducing every failure locally.

### 11.9 CI Quality Gate

The CI pipeline will fail when required automated tests fail.

A successful pipeline indicates that the configured regression suite passed in the CI environment.

A failed pipeline requires investigation before the associated change is considered ready for integration.

### 11.10 Shared Environment Limitations

Because Restful Booker is a shared and changing environment, a CI failure may result from:

- Application availability issues.
- Shared test-data changes.
- External interference.
- Environment resets.
- Network failures.
- Actual application defects.
- Test implementation defects.

The test team must distinguish environmental failures from product failures before treating a CI failure as a confirmed defect.

### 11.11 Future CI Enhancements

Future improvements may include:

- Scheduled nightly regression runs.
- Separate smoke and full regression workflows.
- Browser matrix execution.
- Test retries for controlled transient failures.
- Parallel test sharding.
- Additional reporting integrations.
- Automated publishing of test results.

These enhancements will only be introduced when they provide meaningful value without reducing test reliability.

## 12. Entry / Exit Criteria

### 12.1 Entry Criteria

Testing may begin when:

- The application/API is available.
- The required test environment configuration is available.
- Required dependencies are installed successfully.
- Test data requirements are understood.
- The relevant test scenarios have been reviewed and prioritized.
- Required authentication information is available through approved configuration mechanisms.
- The automated test framework is able to execute successfully in the target environment.

### 12.2 Automation Entry Criteria

A scenario should be considered ready for automation when:

- The expected behavior is sufficiently understood.
- The scenario provides meaningful regression value.
- The test can be executed reliably in the available environment.
- Required test data can be created or discovered dynamically.
- Expected results can be validated through reliable assertions.
- The scenario is suitable for the selected test level and tool.

### 12.3 Exit Criteria

Testing for a planned scope may be considered complete when:

- All prioritized test scenarios have been executed.
- Critical and high-priority failures have been investigated.
- Confirmed defects have been documented appropriately.
- Required automated tests are passing.
- Test results and relevant evidence have been reviewed.
- Known environment-related failures have been identified and separated from product defects.
- Required test documentation has been updated.
- CI execution has completed successfully where CI execution is part of the scope.

### 12.4 Portfolio Completion Criteria

The initial portfolio milestone will be considered complete when:

- The prioritized API regression suite is implemented.
- Integration scenarios are implemented where supported.
- Targeted browser tests are implemented where they provide meaningful value.
- Tests execute successfully locally.
- Tests execute through GitHub Actions.
- Reports and failure diagnostics are available.
- AI-assisted QA examples are documented.
- The repository contains sufficient documentation to explain the test strategy and automation approach.

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
PUT, PATCH, and DELETE returned HTTP 403 during reconnaissance despite successful token generation.

**Mitigation:**

- Investigate authentication behavior before implementing final protected-operation assertions.
- Validate the documented authentication mechanism using Postman.
- Record observed behavior separately from expected behavior.
- Avoid assuming that the current 403 behavior represents the intended contract.
- If the current 403 behavior cannot be resolved because of environmental or application limitations, the behavior will be documented and protected-operation coverage will be implemented only to the extent that reliable expected behavior can be established.

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
