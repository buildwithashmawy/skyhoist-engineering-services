# Origin setup

Workspace for Cursor Cloud Agents with the [Origin](https://cursor.com) CLI installed and ready.

## What’s here

- `scripts/install-origin.sh` — installs Origin and links it to `/usr/local/bin`
- `.cursor/environment.json` — Cloud Agent install hook so new agents get Origin on PATH

## Install Origin locally

```bash
curl -fsSL https://downloads.cursor.com/origin/install.sh | sh
export PATH="$HOME/.local/bin:$PATH"
```

Or use the repo script (requires `sudo` to link into `/usr/local/bin`):

```bash
./scripts/install-origin.sh
```

## Verify

```bash
origin --version
```

## Notes

This repository started empty. Origin `2026.10.01-18-10-45-4a05741` was installed in the Cloud Agent environment. Point the agent at a product repo (or describe what to build here) to continue feature work.
