# GoatSpamer

A small collection of browser-automation scripts built with [Playwright](https://playwright.dev/).
The project drives a **real Chromium browser** to automate repetitive interactions on two
websites: LinkedIn and the University of Bern's ILIAS platform.

> ⚠️ **Read the [Disclaimer](#disclaimer) before running anything.** These scripts automate
> actions on third-party platforms in ways that likely violate their Terms of Service, and one
> file currently contains a hardcoded login session.

---

## What's in here

| File | Purpose |
|------|---------|
| `linkedin.spec.js` | LinkedIn auto-follow bot — scrolls the "Grow your network" page and follows suggested people who share mutual connections. |
| `test.spec.js` | ILIAS survey auto-filler — opens a specific survey on `ilias.unibe.ch` and submits pre-written answers. |
| `package.json` | Node project manifest and Playwright dependencies. |
| `playwright-profile/`, `user-data/` | Persistent browser profiles / session data (created at runtime). |
| `test-results/` | Output artifacts from Playwright test runs. |

---

## How the scripts work

### `linkedin.spec.js` — LinkedIn auto-follow bot

- Launches Chromium with a persistent profile (`./playwright-profile`) in **non-headless** mode.
- Authenticates by injecting a LinkedIn session cookie (`li_at`).
- Opens the feed, then the **"Grow your network"** (`/mynetwork/grow/`) page.
- Scrolls through the suggested-people cards and selects candidates who have **2 or more mutual
  connections**, then clicks **Follow** on their profile.
- Designed to imitate a human user: randomized wait times (`humanPause`), random scroll patterns,
  a random cap of **5–10 follows per run**, and the `--disable-blink-features=AutomationControlled`
  launch flag to reduce automation fingerprinting.
- Console output is in German (e.g. `✅ Gefolgt`, `⏭️ Bereits gefolgt`, `🛑 Fertig`).

### `test.spec.js` — ILIAS survey auto-filler

- A `@playwright/test` test that opens a fixed survey URL on `ilias.unibe.ch`.
- Walks through the survey pages, filling text answers and checking boxes, then confirms
  submission.
- The answer content is hardcoded joke/prank text.

---

## Requirements

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm

## Installation

```bash
npm install
npx playwright install chromium
```

## Usage

### Run the LinkedIn bot

This file is a plain Node script (not a Playwright test), so run it directly:

```bash
node linkedin.spec.js
```

Before running, you must supply a **valid LinkedIn `li_at` session cookie** in `linkedin.spec.js`
(look for the `❗ COOKIE HIER EINSETZEN` marker). See the security note below.

### Run the ILIAS survey test

This file uses the Playwright test runner:

```bash
npx playwright test test.spec.js
```

---

## Security note: the session cookie

`linkedin.spec.js` reads a LinkedIn session cookie (`li_at`) that grants **full access to a
LinkedIn account**. At the time of writing, a real-looking cookie value is committed directly in
the source file.

**Recommendations:**

- **Never commit a session cookie to source control.** Anyone with the file can hijack the account.
- If a real cookie has been committed, **revoke the session** (LinkedIn → Settings → Sign in &
  security → *Where you're signed in*) and change the account password.
- Load the cookie from an environment variable or an untracked local config file instead:

  ```js
  value: process.env.LI_AT, // set LI_AT in your shell, do not hardcode
  ```

- Add `playwright-profile/`, `user-data/`, `node_modules/`, and any secrets to a `.gitignore`.

---

## Disclaimer

This project is provided for educational and personal experimentation only.

- Automating LinkedIn (auto-following, scraping, mimicking human behavior to evade detection)
  violates the [LinkedIn User Agreement](https://www.linkedin.com/legal/user-agreement) and can
  result in **account restriction or permanent ban**.
- Automatically submitting surveys or other content on ILIAS (or any institutional system) may
  violate that institution's acceptable-use policies.
- You are solely responsible for how you use these scripts. Only run them against accounts and
  systems you own or are explicitly authorized to use.
