# Magic Square

An interactive exploration of number, geometry, and mathematical constancy. The first experience is **The Solar Square** — a 6 × 6 magic square with the integers 1 through 36.

**[Explore the live experience](https://luckygithub777.github.io/magic-square/)**

| Grid | Each row, column, and main diagonal | Total |
| :---: | :---: | :---: |
| 6 × 6 | 111 | 666 |

## Explore

Select any of the 36 numbers to inspect its position, or switch between six modes: **Inspect**, **Rows**, **Columns**, **Diagonals**, **Complements**, and **Trace**. The trace reveals the positions of 1 through 36 in order. Use the keyboard arrow keys to navigate the square.

The experience adapts to desktop and mobile. A readable static grid is provided when JavaScript is disabled.

## Verify

No installation or third-party application dependencies are needed to use the page. To run the repository checks locally with Node.js 18 or later:

```sh
node --test
```

The tests verify the exact numerical arrangement, all 14 equal-sum lines, unique values, complementary pairs, image and asset paths, and publication structure.

## History and interpretation

This grid is a horizontal reflection of a traditional **Magic Square of the Sun**, historically associated with Cornelius Agrippa's *Three Books of Occult Philosophy* (Book II, Chapter 22). The reflection preserves the magic sums. The visual artwork is illustrative; `square.js` is the mathematical source of truth.

[Historical reference and source arrangement](https://esotericnotebook.com/planetary-magic/planets/sun)

Planetary and symbolic associations are cultural history, not evidence of supernatural causation.

## Design and delivery

Built with vanilla HTML, CSS, and JavaScript. There is no application server, database, account system, analytics, cookie tracking, runtime package dependency, or external script. GitHub Actions runs the tests, publishes only the necessary static site assets, and verifies that production files match the committed release.

The website is public. Repository visibility and redistribution rights are separate questions; no license grant is implied by public access.
