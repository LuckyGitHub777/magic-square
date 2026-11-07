# Magic Square

A self-contained interactive atlas of mathematical magic squares. The first experience, **The Solar Square (SOL 111)**, preserves the exact 6×6 arrangement of a source image. The project presents the square as **mathematics, history, and visual interpretation**, distinguishing testable structure from traditional symbolism. The page is intentionally limited to the verified grid, six exploration modes, two concise mathematical explanations, and historical context.

## Open

Open `index.html` in any modern desktop or mobile browser. No installation, server, signup, or network connection is required for the interactive experience. When JavaScript is disabled, the six-by-six source grid appears in place of the inactive interactive controls. One optional historical source link leads to an external website if selected.

## Explore

- **Inspect:** Select a number to highlight its row and column.
- **Rows / Columns:** Show the six entries and independently check the sum.
- **Diagonals:** Highlight both main diagonals.
- **Complements:** Highlight any `n` and its arithmetic partner `37 − n`.
- **Trace:** Follow the placement of `1 → 36`, advancing stepwise or selecting a destination number.

## Verify

Requires Node.js 18 or later, with no npm dependencies:

```sh
node --test
```

The twelve tests verify the supplied grid, unique values 1–36, fourteen equal-sum lines, total 666, complementary pairs, rejection of altered data, and GitHub-compatible static asset paths and structure.

## Source and provenance

The grid is a **horizontal reflection** of the traditional Sun square appearing in Cornelius Agrippa's *Three Books of Occult Philosophy*, Book II, Chapter 22. The reflection preserves all row, column, and diagonal sums.

- 36 cells = the numbers 1 to 36, each used once.
- Magic constant: `6 × (36 + 1) / 2 = 111`.
- All entries: `36 × 37 / 2 = 666`.
- All six rows, six columns, and both main diagonals equal 111.

Historical references:

- [Esoteric Notebook — Sun square, numbers, source](https://esotericnotebook.com/planetary-magic/planets/sun)

**Interpretive boundary:** Planetary attributions, mystical associations, and visual imagery are cultural and artistic contexts, not evidence of supernatural causation.

## Repository posture

The source repository is **private**, but its GitHub Pages site is **public**. The site is static, with no server-side backend, login, database, analytics, telemetry, external scripts, package dependencies, or client-side secrets.

Only `index.html`, `styles.css`, `square.js`, `app.js`, `.nojekyll`, and `assets/solar-square-art.webp` are staged for the Pages release. GitHub Actions runs the source checks before deployment, publishes from `main`, and verifies that live HTML, styles, scripts, and artwork match the release commit byte-for-byte. It also confirms that the README, test suite, and workflow file are not served as website assets.

[Open production Magic Square](https://luckygithub777.github.io/magic-square/). The sole optional external link within the site is its historical reference.

The supplied artwork in `assets/solar-square-art.webp` is an original AI-generated visualization. The original source number placement remains the canonical data in `square.js`; the image is illustrative, not a replacement for verified values.

### Run locally

Open `index.html` to explore the square without network access. Run `node --test` from the repository root to verify the source data and the static site. The canonical repository is `LuckyGitHub777/magic-square`; no duplicate import is necessary.

### GitHub compatibility and privacy

- GitHub repository: preserve **private** visibility. The Pages website is live and independently checked after every deployment.
- Site entry point: `index.html` in the repository root; CSS, JS, and the artwork use relative paths. Pages is configured for GitHub Actions publishing from `main`.
- **Private repository ≠ private GitHub Pages site.** Publishing through GitHub Pages normally makes the website publicly accessible, even if the source repository is private. The published experience is intentionally public; do not add secrets or confidential content.
- Keep public artifacts limited to approved website assets. GitHub user and commit metadata remain in private-repository history.
- This project is a static client-side experience. All source code and assets are accessible to anyone who receives a published build; there is no authentication or server-side access control inside this repository.