# Using cobalt

## Overview

Cobalt — a coffee roaster e-commerce storefront

## Quickstart

After completing the install steps in `INSTALL.md`:

```bash
npm run dev    # start the server
# in another terminal:
curl http://localhost:8000/
```

## Endpoints

_No HTTP routes were auto-extracted. If the server registers routes dynamically (e.g. config-driven), document them here manually._

## Worked example

1. Boot the server (`npm run dev`).
2. Hit a smoke-test endpoint:

```bash
curl -sS http://localhost:8000/
```

3. If you get a JSON / HTML response, the server is healthy. Inspect `.env` if it errors with an auth/config failure.

## Reference

### Entry points

_No explicit entry points declared in this project's manifests._

## Next steps

- Read [INSTALL.md](./INSTALL.md) if anything in the Quickstart didn't work.
- Inspect `.env.example` for the full list of environment variables this project understands.
- See [README.md](./README.md) for the architecture diagram + feature list.
