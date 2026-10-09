# General Rules
### Case
- Files should be named in pascal case unless specified by other rules in this document. The files of `utils/` and `router/` use camel case.
- Variables and functions use camel case.
### Language
- Everything is written in English: identifiers, file names, comments, UI text, and documentation. Only the proper names in the seed data are the exception.
### Imports
- External imports go first.
- Internal imports go after the external imports.
- Put a comment before each block of imports to indicate if its external or internal imports (`// external imports` and `// internal imports`).
- Organize imports alphabetically by the name of what is imported (not by the path), ignoring case. The names inside the braces follow the same order.
### Typing
- Type all functions: parameters and return type.
- Type all domain-related code, such as interfaces, DTOs, and API contracts.
- Don't type local variables inside functions that TypeScript can infer its type automatically.
- The shape of each entity goes in the src/interfaces directory, and each use case has its own type in the src/dtos directory.
- Do not use `any`.
### Environment Variables
- All environment variables go in the .env files.
### File headers
- Write your name in the header of every file you modify as an authorship validation (`// Author: Name`).
- Exports will not use the "default" keyword.
### Functions
- Static functions will not contain the keyword "public" in their definition.
- Use unambiguous names. Do not name a variable with a single letter (use `order`, not `o`).

# Routes
- Associate a view to each route.
- Do not write logic inside the routes file. The access guard lives in its own file and the admin-only routes are grouped in their own file.
- Follow the same structure for all routes: paths in lowercase with hyphens (`/orders/create`) and route names with dots for the variants of a resource (`orders`, `orders.create`, `orders.edit`).

# Services
- Use services as a bridge between the views and the API.
- Define services as a class of static methods that call the API with axios. Do not write constants or functions outside the class.
- Read the base URL of the API from the environment variable, never write it in a service.
- Name the CRUD methods getAll, getById, create, update, and remove. They are async and return Promise<T>.
- Use DTOs to create or update registries.
- Write the filters and aggregations as pure static methods over the arrays already fetched from the API.
- Do not duplicate the business validations of the backend. Show the error message of the API in a toast.

# Stores
- Use Pinia only for the session: the SessionStore keeps the token and the current user.
- Nobody touches local storage directly: the session token is persisted through the storage service.
- Views do not read the store. They ask the authentication service.

# Views
- Define every view as a Single File Component.
- The structure of the view files is: script -> template -> style.
- Comment each section in the script tag.
- The section order in the script tag is:
  - External imports
  - Internal imports
  - Props
  - Emits
  - Non-reactive variables
  - Reactive variables
  - Selectors
  - Computed variables
  - Functions
  - Watchers
- Selectors are only the variables bound with `v-model` to a `<select>`. Any other reactive variable goes in the reactive variables.
- Do not define reusable code inside a view. Use a util for this instead.
- Do not call a store from a view.
- Do not write a chart inside a view. Charts live in the charts folder of the components.
- Use the layout in App.vue except for views that do not require the elements of this layout.
- The parameters of a watcher should use the prefix "old" and "new" + the name of the variable being watched (using camel case).

# Components
- Put the "Component" suffix to all the component files.
- Receive the data through props and notify the parent through emits. Do not mutate the props.
- If two views need the same chart, table, or form, create a reusable component.
- Every Chart.js chart is created through the base chart component. No view or component imports Chart.js directly.
