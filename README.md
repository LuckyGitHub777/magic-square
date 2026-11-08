# Magic Square

A single, carefully curated interactive atlas of mathematical order, historic designs and symbolic traditions.

**[Explore the live atlas](https://luckygithub777.github.io/magic-square/)**

## Collection

The **seven classical planetary magic squares** (Saturn 3×3 through Moon 9×9) can be selected inside the existing interactive Solar Square explorer. The 6×6 Solar exhibit preserves the original site's exact reflected arrangement: its 14 ordinary lines sum to 111 and all 36 entries total 666.

The expandable historical collection includes the Chinese Lo Shu; the 1514 Dürer square from *Melencolia I*; Benjamin Franklin's 8×8 **semimagic** square (rows and columns are equal, ordinary diagonals are not); and a non-normal birthday square associated with Srinivasa Ramanujan (constant 139, top row encoding 22 December 1887).

The laboratory generates normal magic squares of orders **3 through 12**, using the Siamese algorithm, the doubly-even complement construction and the singly-even quadrant-swap construction. Automated mathematics tests validate those methods through order **19**.

## Explore

Select an exhibit, then use **Inspect, Rows, Columns, Diagonals, Complements, Trace**. The editor updates the numeric grid, proof, historical explanation, and source link together. Complements are disabled for non-normal squares. Franklin's diagonal exception is explained explicitly. Mouse, touch and keyboard arrow navigation are available. Browser Back and Forward restore the selected exhibit. Dense mobile grids keep a minimum cell width and can scroll horizontally with an on-screen cue.

Direct links use `?square=jupiter`, `?square=durer`, or `?square=generated-10`. The no-JavaScript fallback retains the original complete 6×6 Solar exhibit.

## Verification

`square.js` preserves the original `GRID` constant and `analyze()` API and adds `EXHIBITS`, `verify()`, `generate()`, and `getExhibit()`. The tests verify all historical tables, normal and non-normal cases, Franklin's semimagic exception, and constructed squares across all three parity classes.

```sh
node --test
```

No site runtime dependencies, third-party scripts, analytics, accounts or cookies are used. GitHub Pages staging still publishes only the approved static assets and checks production bytes against each release.

## Sources and boundaries

- [Agrippa's seven planetary tables](https://esotericnotebook.com/correspondences/squares), Book II chapter 22.
- [National Gallery of Art — Dürer's *Melencolia I*](https://www.nga.gov/artworks/35101-melencolia-i).
- [Mathematical Association of America — Lo Shu](https://journals.sagepub.com/doi/full/10.1177/2158244015585828).
- [MacTutor — Benjamin Franklin](https://mathshistory.st-andrews.ac.uk/Biographies/Franklin_Benjamin/).
- [*At Right Angles* — Ramanujan birthday-square discussion](https://publications.azimpremjiuniversity.edu.in/3104/1/ramanujans_honour_magic_square.pdf).

Planetary and symbolic correspondences are cultural history, not evidence of supernatural causation. The Solar artwork is illustrative, and source-grid values are verified from code. The repository is public; repository visibility does not imply any particular license grant.
