# AI-Assisted QA

## Purpose

AI was used as a supporting QA capability for test design, review, analysis, and documentation. It helped the QA engineer explore scenarios, assess coverage gaps, and reason through failures, while final QA decisions, implementation choices, and validation remained human-controlled.

This project used AI as a collaborator for thinking and review, not as an autonomous testing authority or a separate AI-powered execution framework.

## Example 1 — Test Scenario and Edge-Case Review

AI assistance was used to review the Restful Booker API coverage and identify additional negative and boundary scenarios that could strengthen the test suite.

Examples of scenarios considered during review included:

- Missing required fields.
- Invalid data types.
- Invalid booking dates.
- Authentication edge cases.
- Shared-environment behavior.

These were treated as candidate scenarios for further QA assessment. Some suggestions were evaluated for fit with the current test strategy; others were not selected for automation because they did not match the project scope, required environment conditions, or current coverage goals.

This distinction is important: AI-generated suggestions were considered as inputs to review, while the scenarios actually implemented in automation were selected and validated by the QA engineer based on project context and observed application behavior.

## Example 2 — Automated Test Review

AI assistance was also used to review the Playwright suite for quality and maintainability. The review focused on areas such as:

- Weak or missing assertions.
- Test isolation concerns.
- Dynamic test data handling.
- Unnecessary duplication.
- Maintainability of selectors and checks.

In this project, the review was grounded in the actual tests and their real behavior. No specific defect was invented or assumed; the purpose was to assess whether the tests clearly validated the intended behavior and whether the checks were durable in CI.

This work supported better test quality without replacing the QA engineer's judgment. Final decisions about retaining, refining, or rejecting suggested changes were made by a human reviewer.

## Example 3 — CI Failure Analysis

AI assistance was used to help interpret real CI issues encountered during this project and to evaluate appropriate remediation options.

The actual sequence of issues was:

1. GitHub Actions initially failed because `RESTFUL_BOOKER_USERNAME` was not available as a GitHub Actions secret.
2. After the secrets were configured, the 19-test suite passed.
3. A Node.js 20 deprecation warning was identified for older GitHub Actions versions.
4. `checkout`, `setup-node`, and `upload-artifact` were upgraded to current Node.js 24-compatible action versions.
5. UI-002 showed intermittent CI flakiness when dashboard elements took longer to render.
6. The test was hardened by increasing locator assertion timeouts from the default to 10000 ms without adding fixed sleeps or removing assertions.
7. The final CI run passed all 19 tests with no failures or flaky tests.

AI helped interpret the failure signals and consider likely root causes, but the final diagnosis, fix validation, and implementation choices were confirmed by the QA engineer using the actual CI results and observed test behavior.

## AI Usage Principles

- AI output is treated as a hypothesis or suggestion, not as authoritative truth.
- Human QA validation is required before changes are accepted.
- Secrets, credentials, tokens, and private data are not supplied to AI tools.
- AI-generated code is reviewed before use.
- Observed application behavior is the source of truth.
- AI is not used to fabricate expected results or defect conclusions.

## Outcome

AI-assisted QA in this portfolio supported coverage analysis, test review, failure interpretation, and documentation. It improved the QA workflow by helping identify risks, compare scenarios, and reason about CI issues, while keeping human QA judgment as the final authority.
