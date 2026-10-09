## Code Style

The style guide for this project is based on the standards enforced by **Prettier**, **ESLint**, and **oxlint**.

- **Prettier** is an opinionated code formatter that automatically formats the code to ensure a consistent style across the project: no semicolons, single quotes, and a 100-character line width.
- **ESLint** is a static code analysis tool that identifies and helps fix problems in TypeScript and Vue code, improving code quality and preventing potential bugs.
- **oxlint** is a fast linter that runs together with ESLint as a first pass over common errors.

> Before running the following commands, make sure you are inside the `/frontend` directory:
>
> ```bash
> cd frontend
> ```

To apply this guide, run the following commands before each commit:

### Prettier
```bash
npm run format
```

### ESLint and oxlint
```bash
npm run lint
```

### Type check
```bash
npm run type-check
```

> If `npm run format` modifies files, those changes go in the same commit. Run `npm run build` before opening a Pull Request.
