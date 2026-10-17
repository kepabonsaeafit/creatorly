# ADR-0007: Input validation in the DTOs with class-validator

- **Date:** 2026-10-17
- **Status:** Accepted — supersedes the validation decision of ADR-0005
- **Decided by:** Kevin Pabón (architect)

## Context

ADR-0005 chose to validate inside each service (a private `validate` method that throws `BadRequestException`), with plain DTO classes and without `class-validator`. At the review of Deliverable 1 Part 2, the professor's tutorial 8 ("Validations") asked to validate with `class-validator` in the DTOs and a global `ValidationPipe`, as his reference project does (`backend/src/main.ts` and `books/dto/create-review.dto.ts` in `courseprojects-2026`). The Trazo project of the course follows the same pattern and adds `@Trim()` and `PartialType` for the update DTOs.

The services also repeated the same input checks (`validate`, `isDate`, `EMAIL_REGEX`, `normalizeEmail`, `trim()`) in four places, mixed with the real business rules.

## Decision

- **`class-validator` and `class-transformer`** in `backend/`, and a global `ValidationPipe` in `main.ts` with `whitelist: true`, `forbidNonWhitelisted: true` and `transform: true`, like the professor's. An unknown property in a body answers 400.
- **Validation decorators in the five input DTOs** (sign-in, brand, creator, user, order). Roles and statuses use `@IsIn(ROLES)` and `@IsIn(STATUSES)`; day-only dates use `@Matches(/^\d{4}-\d{2}-\d{2}$/)` (not `@IsDateString`, which also accepts a date with time). Properties with a default or that accept `null` use `@IsOptional()`; the service still assigns the defaults.
- **Error messages are the library's defaults**, with no custom `message`. The API keeps answering `{ statusCode, message, error }`, where `message` is now an array for DTO errors.
- **Cleaning in the DTO**, not in the service: a `@Trim()` decorator (the Trazo pattern) on text properties and a `@ToLowerCase()` decorator, in `src/common`, on emails. The services no longer normalize.
- **Update DTOs** with `PartialType(CreateDto)` from `@nestjs/mapped-types` (`UpdateCreatorDto`, `UpdateUserDto`, `UpdateOrderDto`). Controllers and services receive them instead of `Partial<CreateDto>`.
- **Business rules stay in the services**: unique email, no removing your own admin role, no deleting yourself, no deleting a user with orders, existence of the referenced brand, creator and user, `NotFoundException`, the login `UnauthorizedException`, defaults and password hashing.

## Considered Options

- **Keep validation in the services (ADR-0005)** — rejected: it is not what the professor's tutorial 8 teaches and the grading follows his style; it also duplicated the checks across services.
- **Custom error messages in every decorator** — rejected: the professor uses the library's messages, and it would bring back the long hand-written messages the DTOs replace.
- **`@IsDateString` for dates** — rejected: it accepts `2026-10-11T10:00:00Z`, but the columns are day-only dates.

## Consequences

- `@Matches` only checks the shape of the date, so an impossible day such as `2026-02-30` is accepted (the old `isDate` rejected it).
- Every property the frontend sends must be declared in a DTO, or the request fails with 400 (`forbidNonWhitelisted`).
- `niche` is not lowercased yet: the duplicated-niche fix ("gaming" and "Gaming") is a later change.
- The frontend's `getErrorMessage` already joins array messages, so DTO errors are shown in the toasts without changes.
- DTO rules are tested with `plainToInstance` and `validate`, without starting Nest.
