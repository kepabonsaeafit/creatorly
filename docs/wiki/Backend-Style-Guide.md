## Code Style

The style guide for this project is based on the standards enforced by **Prettier** and **oxlint**.

- **Prettier** is an opinionated code formatter that automatically formats the code to ensure a consistent style across the project: single quotes, semicolons, and trailing commas.
- **oxlint** is a static code analysis tool that identifies problems in TypeScript code, improving code quality and preventing potential bugs. It forbids the use of `any`.

> Before running the following commands, make sure you are inside the `/backend` directory:
>
> ```bash
> cd backend
> ```

To apply this guide, run the following commands before each commit:

### oxlint
```bash
npm run lint
```

### Prettier
```bash
npm run format
```

### Build
```bash
npm run build
```

> If `npm run format` modifies files, those changes go in the same commit. `npm run build` is also the type check of the backend: run it before opening a Pull Request.
