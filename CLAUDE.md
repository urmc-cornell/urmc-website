## About This Project

URMC (Underrepresented Minorities in Computing) is a Cornell University student organization. This is the public-facing website for the club, showcasing the org's mission, leadership, events, sponsors, points/leaderboard, and TA directory, and providing pathways for students to get involved.

---

## Tech Stack

- Framework: React (Create React App / react-scripts)
- Language: JavaScript (ES modules)
- Styling: Bootstrap + react-bootstrap, custom CSS, styled-components patterns where used
- Data: Supabase (storage + db), Airtable, Google Drive proxy, CSV parsing
- Other: Express helper scripts, react-slick carousels, @fontsource/montserrat
- Hosting: served at https://urmc.cs.cornell.edu/

---

## Key Directories

src/pages/ → Top-level routed pages (Home, About_us, Events, Leadership, Sponsors, etc.)
src/components/ → Reusable components (Navbar, Footer, cards, popups, carousel, page-specific subfolders)
src/hooks/ → Custom React hooks
src/lib/ → Client integrations (Supabase, Airtable, etc.)
src/styles/ → Shared CSS / style modules
src/images/, src/fonts/, src/ta-headshots/ → Static assets
scripts/ → Node scripts to populate data (eboard, headshots, points, events) via Supabase/Airtable
public/ → CRA static files

---

## Commands

```bash
# Install deps
npm install

# Run dev server
npm start

# Run dev server pointing at staging data
npm run start:staging

# Production build
npm run build

# Tests
npm test

# Data population scripts
npm run populate-eboard
node scripts/populate-headshots.js
node scripts/populate-points-fa24.js
node scripts/populate-sp23-events.js
```

---

## Code Style

- React: functional components with hooks; prefer named exports
- File naming follows existing conventions in the repo (PascalCase for components, snake_case for some pages — match what's already there rather than renaming)
- Use Bootstrap / react-bootstrap utilities before adding custom CSS
- Keep colors, spacing, and typography consistent with existing styles in src/styles and the Figma source of truth — don't hardcode new hex values when an existing token/class fits
- Mobile responsiveness is a first-class concern (recent commits include mobile polish for hero, pillars, sponsors, happenings)

---

## Workflow

1. Create a feature branch from main (e.g. `fadi/home-page-v2`-style: `<name>/<feature>`)
2. Implement the feature
3. Verify locally (`npm start`) including mobile breakpoints
4. Get approval from user before committing
5. Get approval from user before pushing / opening a PR

---

## Boundaries

ALWAYS:

- Verify the dev server still builds and the page renders before saying you're done with a UI change
- Check mobile breakpoints for any layout/visual change
- Reuse existing components, styles, and assets before creating new ones
- Match the format/structure of nearby code rather than introducing a new pattern

ASK FIRST:

- Adding new dependencies
- Schema/data shape changes that affect Supabase, Airtable, or the populate scripts
- Changes to build config, CRA scripts, or proxy settings in package.json
- Changes to the public-facing routing or top-level navigation

NEVER:

- Commit secrets, API keys, or .env files with real credentials
- Force push to main
- Include "Claude", "AI", or any AI assistant references in commit authors, co-author lines, or commit messages
- Hardcode credentials or service URLs that should live in env vars

---

## PR Descriptions

- When asked for a PR description, output the entire response as a single markdown code block so the user can copy and paste it directly
- Use the following format by default unless instructed otherwise:

```markdown
### Summary <!-- Required -->
<!-- Provide a general summary of your changes in the Title above -->
<!-- Itemize bug fixes, new features, and other changes -->
This pull request is the first step towards implementing feature Foo
- [x] implemented X
- [x] fixed Y
Remaining TODOs:
- [ ] resolve bug 1
- [ ] implement Z
Depends on #{number of PR}
### Test Plan <!-- Required -->
<!-- Provide screenshots or point out the additional unit tests -->
### Notes <!-- Optional -->
### Blockers <!-- Optional -->
### Breaking Changes  <!-- Optional -->
```

---

## Reviewing PRs

- By default, present all review comments in chat — do NOT post reviews or comments directly to GitHub unless explicitly told to. Before ever posting a review to GitHub, ask for confirmation first.
- Break up the review into different comments for each thing that needs to change, making sure to be clear and specific about what needs to change and why it was a problem before
- Always read the full diff before commenting — understand the complete change, not just individual files
- Look for hardcoded values (colors, strings, URLs) that should be constants or config
- Flag any changes to shared files (top-level config, scripts/, public/) that weren't relevant to the PR
- Check that the PR description accurately reflects what the diff actually does
- Verify no secrets, API keys, or .env values are included in the diff
- Comment on architecture/design concerns, not just style

---

## Writing Dev Tasks

When creating developer task descriptions:

- Structure: Overview (what this is and why), Scope (bullet list of what to build), Key files to reference, Done when (acceptance criteria)
- Use clear language — if something sounds like jargon, explain what it actually means in practical terms. Write as if the dev might not know the concept yet
- Don't tell devs exactly how to build it — give them the what, not the how. No method signatures, no step-by-step implementation. Let them figure out the design
- Point them to existing modules/files to use as reference for patterns (e.g. "follow the same pattern as Navbar.js")
- Scope tasks so each one is independently buildable and testable without depending on another dev's task being done first
- If something is being built now but the consumer/UI comes in a later sprint, call that out so they know what "done" looks like without the full feature
- Keep it concise

---

## General Gotchas / Working Style

- Before making any code changes, pull/check the latest state of the target branch (e.g., `git pull origin main`) to avoid conflicts with recently merged work.

- Before implementing, do a pre-flight check: read recent git history, check branch state, and review related files before writing any code.

- When writing documentation or developer task descriptions, use concise and direct language. Avoid excessive inline comments in code. If the user says wording is confusing, simplify rather than adding more explanation.

- When the user asks you to do something, execute it immediately rather than asking for permission. Do not ask 'should I do X?' when the user has already told you to do X.

- If you encounter errors during build or test — fix them, even if they're pre-existing and unrelated to your changes. Never dismiss an error as "pre-existing" and move on.

- When debugging, check environment-specific issues first (env vars, Supabase/Airtable keys, proxy config) before diving into code logic.

- When generating PR descriptions, diff against only the commits on the current branch (the merge base), not the full `git diff main..HEAD`, which may include changes from other merged PRs that were rebased/merged into the branch. Use `git log main..HEAD --oneline` to identify which commits are actually part of the PR, then scope the diff accordingly.
