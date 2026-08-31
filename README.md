# QA Automation Portfolio — Restful Booker

## Project Description

A QA automation portfolio project demonstrating practical API, integration, and browser-based testing with Playwright and TypeScript against the Restful Booker application.

The project emphasizes risk-based test coverage, negative testing, data validation, multi-step workflows, and continuous integration with GitHub Actions.

## Project Overview

The portfolio uses the API as its primary testing layer because it provides broad, efficient coverage of the Restful Booker service. Integration tests validate multi-step booking workflows, while selective UI tests cover user-facing behavior that benefits from browser-level validation.

The full suite currently contains 19 automated tests. The suite passes locally and in GitHub Actions CI.

## Automated Test Coverage

| Test Layer | Coverage | Tests |
| --- | --- | ---: |
| API | Authentication, health checks, retrieval, filtering, creation, updates, negative testing, and validation | 15 |
| Integration | `INT-001: Create → Filter → Retrieve`; `INT-002: Create → PUT → PATCH → Retrieve` | 2 |
| UI | `UI-001: Contact form submission`; `UI-002: Admin login and protected dashboard access` | 2 |
| **Total** | **Automated regression coverage** | **19** |

## Test Strategy / Test-Layer Strategy

- **API first:** API tests provide the primary regression signal and cover core service behavior efficiently.
- **Integration for workflows:** Multi-step booking scenarios verify that related operations work together and that data remains consistent across requests.
- **Selective UI coverage:** Browser automation is used where user-facing behavior, navigation, or browser authentication adds meaningful coverage.
- **Negative and validation testing:** Invalid credentials, missing fields, invalid data types, and other boundary behaviors are explicitly exercised.
- **CI consistency:** Local and CI execution use the same Playwright configuration and npm scripts, with credentials supplied securely through environment variables and GitHub Actions secrets.

## What Is Covered

- Restful Booker authentication and health checks
- Booking creation, retrieval, filtering, full updates, and partial updates
- Negative and input-validation scenarios
- Dynamic test data and verification of persisted booking values
- Multi-step API workflows
- Contact form submission and confirmation
- Admin login and protected dashboard access
- TypeScript typechecking
- Full-suite execution in GitHub Actions

## Technology Stack

- TypeScript
- Playwright Test
- npm
- dotenv
- GitHub Actions
- Node.js 24 in GitHub Actions
- Restful Booker

## Repository Structure

```text
.
├── .github/workflows/playwright.yml  # GitHub Actions workflow
├── data/                             # Test data
├── docs/                             # QA reconnaissance and test strategy
├── fixtures/                         # Playwright fixtures
├── helpers/                          # API and authentication helpers
├── postman/                          # Postman collections and environments
├── tests/
│   ├── api/                          # API test suite
│   ├── integration/                  # Multi-step API integration workflows
│   └── ui/                           # Selective browser coverage
├── playwright.config.ts              # Playwright configuration
├── package.json                      # npm scripts and dependencies
└── tsconfig.json                     # TypeScript configuration
```

## Prerequisites

- Node.js installed locally
- npm available on the command line

## Environment Configuration

Create a local `.env` file from the provided template:

```bash
cp .env.example .env
```

Then set the required credentials:

```text
RESTFUL_BOOKER_USERNAME=
RESTFUL_BOOKER_PASSWORD=
```

The `.env` file is not committed. Never hard-code credentials in source code, documentation, or test data.

GitHub Actions uses repository secrets with the same variable names.

## Install Dependencies

```bash
npm ci
```

Install Playwright browsers if they are not already installed:

```bash
npx playwright install
```

## Run Typecheck

```bash
npm run typecheck
```

## Run All Tests

```bash
npm test
```

## Run API, Integration, and UI Tests Separately

### API

```bash
npm run test:api
```

### Integration

```bash
npm run test:integration
```

### UI

```bash
npm run test:ui
```

These commands run the API, integration, and UI test directories independently.

## Run Headed Playwright Tests

```bash
npm run test:headed
```

## GitHub Actions / CI

The workflow in `.github/workflows/playwright.yml` runs on pushes to `main` and pull requests targeting `main`.

Each CI run:

1. Uses `ubuntu-latest`.
2. Sets up Node.js 24.
3. Installs dependencies with `npm ci`.
4. Runs `npm run typecheck`.
5. Installs Playwright browsers and system dependencies with `npx playwright install --with-deps`.
6. Runs the complete suite with `npm test`.

The workflow sets `CI=true` and reads Restful Booker credentials from GitHub Actions secrets. Credentials are not stored in the workflow or repository.

The workflow runs the full suite in CI and publishes the Playwright report as an artifact.

## Test Reports and Artifacts

Playwright uses the HTML reporter.

GitHub Actions uploads the generated `playwright-report/` directory as the `playwright-report` artifact for each run when a report is available.

When a run fails, the workflow also uploads `test-results/` as the `test-results` artifact when available.

## Known Limitations / Environment Observations

- Full room-booking UI automation is deferred. The drag-based calendar date-range interaction could not be reproduced deterministically in Playwright. This is documented as an automation reproducibility limitation, not as a confirmed product defect.
- Authenticated `DELETE` requests currently return HTTP 403 in the shared environment. This is documented as an environment/application limitation, not as a successful delete capability.
- Authenticated `PUT` and `PATCH` requests currently succeed and are covered by automated regression tests.
- Restful Booker uses a shared, changing environment, so tests use dynamic booking data where appropriate and avoid depending on fixed booking IDs.

## Documentation & Configuration

- [QA reconnaissance](docs/qa-reconnaissance.md)
- [Test strategy](docs/test-strategy.md)
- [Playwright configuration](playwright.config.ts)
- [GitHub Actions workflow](.github/workflows/playwright.yml)
- [Environment template](.env.example)

## QA Approach / Engineering Principles

- Prefer risk-based coverage over maximizing test count.
- Keep the API as the primary layer for service behavior.
- Use UI automation selectively for meaningful user-facing workflows.
- Create or discover test data dynamically rather than relying on fixed shared records.
- Keep tests readable, independent, maintainable, and strongly asserted.
- Separate environment configuration and secrets from test logic.
- Use typechecking and CI execution as automated quality gates.
- Document observed environment behavior clearly without overstating its cause.
