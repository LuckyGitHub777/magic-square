# Magic Square

A self-contained interactive atlas of mathematical magic squares. The first experience, **The Solar Square (SOL 111)**, preserves the exact 6×6 arrangement of a source image. The project presents the square as **mathematics, history, and visual interpretation**, distinguishing testable structure from traditional symbolism. The page is intentionally limited to the verified grid, six exploration modes, two concise mathematical explanations, and historical context.

## Open

Open `index.html` in any modern desktop or mobile browser. No installation, server, signup, or network connection is required for the interactive experience. A static table remains available when JavaScript is disabled. One optional historical source link leads to an external website if selected.

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

This project is maintained in a **private repository**. It is self-contained: no external runtime scripts, analytics, telemetry, automated deployments, passwords, secrets, or third-party application packages. A minimal GitHub Actions workflow verifies syntax and source tests on pushes and pull requests. As of the latest remote verification, GitHub Pages is **not enabled** (`has_pages: false`). Publishing requires configuring Pages in repository Settings; source pushes alone cannot enable it. The historical-reference link is the only outbound link within the site. The root `.nojekyll` file is inert while Pages remains disabled and avoids unwanted Jekyll processing if static hosting is later authorized.

The supplied artwork in `assets/solar-square-art.webp` is an original AI-generated visualization. The original source number placement remains the canonical data in `square.js`; the image is illustrative, not a replacement for verified values.

### Run locally

Open `index.html` to explore the square without network access. Run `node --test` from the repository root to verify the source data and the static site. The canonical repository is `LuckyGitHub777/magic-square`; no duplicate import is necessary.

### GitHub compatibility and privacy

- GitHub repository: preserve **private** visibility. A Pages website is not live until its publishing source is configured and its public URL returns the expected application.
- Site entry point: `index.html` in the repository root; CSS, JS, and the artwork use relative paths. If publication is deliberately enabled later, use `main` and `/(root)` as the publishing source after reviewing visibility and content.
- **Private repository ≠ private GitHub Pages site.** Publishing through GitHub Pages normally makes the website publicly accessible, even if the source repository is private. Do not enable Pages for confidential content without an independently verified access-control approach.
- Confirm repository visibility and the exact release commit before publishing. GitHub user and commit metadata are still present in private-repository history.
- This project is a static client-side experience. All source code and assets are accessible to anyone who receives a published build; there is no authentication or server-side access control inside this repository.