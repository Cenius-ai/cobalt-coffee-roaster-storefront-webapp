# Install

Step-by-step setup guide for this project. Every prerequisite, command, and environment variable referenced here is derived from files actually present in this repo (manifests like `package.json` / `pyproject.toml` / `build.gradle.kts` / `pom.xml` / `pubspec.yaml` / `Cargo.toml` / `go.mod` / `composer.json` and the source itself).

## 1. Prerequisites

- Node.js 20 or later (declared as `>=20.0.0`)
- Package manager: **npm** (use `which` to confirm it's on your PATH)
- **Git** (to clone the repo)

## 2. Get the code

```bash
git clone <repo-url> && cd <project>
```

The repo's top-level project is named **cobalt**.

## 3. Install dependencies

This project uses **npm** as the package manager — dependency files: `package.json`.

Run:

```bash
npm install
```

## 4. Configure environment variables

This project does not reference any environment variables in its source code, so no `.env` file is required for setup.

## 5. Run in development

```bash
npm run dev
```

_This runs `ng serve --host 0.0.0.0 --port "${PORT:-4200}" --disable-host-check` (declared in `package.json` `scripts.dev`)._

## 6. Build for production

```bash
npm run build
```

## 7. Common pitfalls + troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `EACCES` permission errors during install | Global npm install path not writable | Use a node-version manager (nvm / fnm / volta) instead of system Node; never `sudo npm install`. |
| `Module not found` for `next` / `react` after install | Wrong package manager — lockfile says one, you ran another | Stick to `npm` (the lockfile in this repo). Delete `node_modules` + rerun `npm install` if you accidentally mixed. |
| Dev server fails: `Address already in use` | Another process holding the port | `lsof -i :<port>` to find the PID, then `kill <pid>`. Or set `PORT=<free_port>` before the dev command. |
