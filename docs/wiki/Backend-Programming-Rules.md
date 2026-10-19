# General Rules
### Case and Naming
- Folders in the src/ path use plural names and group files by domain (users, creators, brands, orders), except home and auth.
- File names use kebab-case with the NestJS suffixes (orders.service.ts, create-order.dto.ts, order.entity.ts).
- Classes, interfaces, and type aliases use PascalCase. Entity classes are singular and have no suffix (Order). DTO classes end with the "Dto" suffix.
- Variables and functions use camel case.
- Use unambiguous names. Do not name a variable with a single letter (use `order`, not `o`).

### Imports
- External imports go first.
- Internal imports go after external imports.
- Put a comment before each block of imports to indicate if its external or internal imports (`// external imports` and `// internal imports`).
- Organize imports alphabetically by the name of what is imported (not by the path), ignoring case. The names inside the braces follow the same order.
- Use `import type` when importing only types.
- Imports between backend files use the `.js` extension, because the project is an ES module.

### Typing
- Type all function parameters and return types explicitly.
- Use Promise<T> return types for async controller and service methods.
- Do not use `any`.
- Put the shared interfaces of the authentication in `src/interfaces/auth/`, one per file and with the `Interface` suffix (`JWTPayloadInterface` for the token payload and `UserRequestInterface` for the request that carries it).
- Export the lists of valid values with `as const` from the entity file that uses them (STATUSES, ROLES).

### File headers
- Write `// Author: Name` as the first line of every file, crediting whoever originally wrote it. Keep a single author line: modifying a file does not add a second one.
- Every public method of a service has a short JSDoc with `@param`, `@returns`, and `@throws` when they apply.

## Project Structure
- Follow a feature-based module structure (based on the classes of the class diagram).
- Each feature should contain:
	- module
	- controller
	- service
	- seeder
	- dto
	- entities
- Register feature modules in AppModule.
- Keep the home module for the route that answers "API is running".

## Bootstrap and Global Config
- Keep the global API prefix as api.
- Configure CORS explicitly with allowed origins (the CORS_ORIGIN environment variable, with the local origins as default).
- Read the port, the database path, and the JWT secret from environment variables.
- Register a global `ValidationPipe` in `main.ts` with `whitelist: true`, `forbidNonWhitelisted: true`, and `transform: true`, so an unknown property in a request body answers 400.

## Controllers
- Keep controllers thin: route mapping and request/response orchestration only.
- Do not place domain/business logic in controllers.
- Use Nest decorators consistently: @Controller, @Get, @Post, @Patch, @Delete, @Param, @Body.
- Parse the id parameter with Nest's `ParseIntPipe` (`@Param('id', ParseIntPipe) id: number`), so an id that is not a number answers 400. Never convert it by hand.
- Delegate all business work to the corresponding service.
- Keep explicit response types in method signatures.
- Read the logged-in user with `@Request() request: UserRequestInterface` and pass `request.user.sub` to the service.
- Restrict the admin-only routes with @Roles('admin').

## Services
- Place business rules in services. The validation of the input format lives in the DTOs.
- Use constructor injection for dependencies.
- Use TypeORM repositories via @InjectRepository in services.
- Name the methods findAll, findOne, create, update, and remove. Extra lookups follow the same naming (findByEmail).
- Do not re-validate the input format in services (types, required fields, email or date format, allowed values): the DTO already did it before the service runs.
- Keep in the service the rules that need data or context (unique email, own-role change, self deletion, user with orders) and throw BadRequestException for them.
- Validate that the referenced entities exist (brand, creator, user) before saving, so a missing reference answers 400 instead of 500.
- `findOne` throws NotFoundException when no row has that id, so a missing entity answers 404. update and remove reuse `findOne` to validate existence.
- Build the entity field by field from the DTO. Never save the request body directly.
- Reload the entity after saving it when it has relations or hidden columns, so the response carries the relation ids and never the password hash.
- Keep private helper methods for repeated lookup logic.

## DTOs and Validation
- Validate the input in the DTOs with `class-validator` decorators, and keep the default error messages of the library (no custom `message`).
- Keep one Create DTO per resource in its dto folder (`create-<resource>.dto.ts`).
- Create the Update DTO with `PartialType(CreateDto)` from `@nestjs/mapped-types` (`update-<resource>.dto.ts`). Update methods receive it instead of `Partial<CreateDto>`.
- Clean the input in the DTO with `class-transformer` decorators: `@Trim()` on text properties and `@ToLowerCase()` on emails. Both live in `src/common`.
- Validate allowed values with `@IsIn(LIST)`, using the lists exported by the entities (`ROLES`, `STATUSES`).
- Validate day-only dates with `@Matches(/^\d{4}-\d{2}-\d{2}$/)` plus `@IsDateString({ strict: true })`, so impossible days such as `2026-02-30` are rejected.
- Mark with `@IsOptional()` the properties that have a default (`available`, `status`, `requestDate`, `role`) and the ones that accept `null` (`deliveryDate`, `creatorId`). The service assigns the default.
- Declare in the DTO every property the frontend sends: a property without a decorator is rejected by `forbidNonWhitelisted`.
- Test the DTOs with `plainToInstance` and `validate`.

## Entities and Persistence
- Use TypeORM decorators for all entities and columns.
- Use numeric primary keys generated by the database with @PrimaryGeneratedColumn(). Never generate ids in code.
- Use column types valid in SQLite: simple-enum (never enum), boolean, varchar, and date. Optional values are nullable.
- Save day-only dates in a date column with the YYYY-MM-DD format, typed as string in TypeScript.
- Include createdAt and updatedAt timestamps with the TypeORM date decorators.
- Define relationships with @ManyToOne, @JoinColumn, and @RelationId, so the JSON keeps the brandId, creatorId, and userId properties.
- Declare the inverse side with @OneToMany in the related entity (`orders: Order[]` in Brand, Creator, and User). It adds no column and is not loaded unless a query asks for it.
- Store passwords as a bcrypt hash in passwordHash with `select: false`. The API never returns it.

## Seeders
- Create one seeder per module as an injectable class named after its module (orders.seeder.ts).
- Insert the demo data only when its table is empty.
- Seed users, creators, and brands in onModuleInit. Seed orders in onApplicationBootstrap, so the rows they reference already exist.

## Authentication and Authorization
- Keep auth behavior inside the auth module (controller, service, guards, decorators, constants, DTOs).
- Use JWT via JwtModule (registered as global, with a one-hour expiration) and JwtService.
- Register AuthGuard and RolesGuard as global guards with APP_GUARD, in that order.
- Keep token extraction in a guard helper (Bearer token from Authorization header).
- Attach validated JWT payload to request user in the guard.
- Protect every route by default. Mark the public routes with @Public().

## Error Handling
- Prefer framework exceptions over manual error responses (BadRequestException, NotFoundException, UnauthorizedException).
- Use clear and domain-specific error messages (`Order: brand not found`).
- Fail fast on invalid references (for example missing related entities).
