# KFL Grid Tools

Grid-first workflow tooling for Kasidia Frontend Law. The UI is never placed first:
the grid is declared, generated, and audited, and only then do elements exist.
The overlay draws the same tracks the layout uses — the pattern of the Swiss Grid
reference site (swissgrid.posterhouse.org), automated.

## The four-step loop

### 1. Declare — write the manifest

No element may be placed before this file exists. Columns, gutter, margin, and
container are declared once per breakpoint; regions are named roles with a span map.

```json
{
  "breakpoints": [
    { "id": "mobile",  "minWidth": 0,    "columns": 4,  "gutter": 16, "margin": 20 },
    { "id": "tablet",  "minWidth": 768,  "columns": 8 },
    { "id": "desktop", "minWidth": 1200, "columns": 12, "gutter": 20, "margin": 40, "container": 1440 }
  ],
  "regions": [
    { "role": "content", "spans": { "mobile": 4, "tablet": 5, "desktop": 8 } },
    { "role": "sidebar", "spans": { "mobile": 4, "tablet": 3, "desktop": 4 } }
  ]
}
```

Fields inherit down the breakpoint list; the first breakpoint inherits the Swiss
grid reference defaults (12 columns / 20px gutter / 40px margin / 1440px container).
Other values are legal — the law is that each value is declared exactly once.

Derive the numbers the way Law 1 "Deriving the Substrate" prescribes: body size
first, reading regions inside the 45–75 character measure window, a width intent
per role, then the smallest column count that expresses every required ratio. Each
breakpoint and region carries a one-line `rationale`. Roles are annotated for the
audit:

- `kind: "measure"` — reading text; audited against the measure window
- `kind: "fixed"` plus optional `min`/`max` (px) — regions with known component bounds

### 2. Generate — produce the substrate

```bash
node generate.mjs grid.manifest.json [outdir]
```

Emits `grid.css` (tokens, `.grid-container`, `.grid-row`, `.c-N`/`.cs-N` utilities,
per-breakpoint `[data-region]` spans, debug overlay) and `grid-overlay.html`
(Ctrl+G toggle). The overlay animates opacity only, per Law 3.

`generate.mjs` also lints the declaration — soft warnings, never blockers: unused
granularity (every span divisible, so a smaller column count would express the same
ratios), a margin below the gutter, missing rationales. Declared design notes are
echoed back so the reasons stay visible in build output.

### 3. Place — regions on tracks

- Layout regions are grid items annotated with `data-region="<role>"`, matching a
  manifest role.
- Whitespace between regions is the gutter or empty tracks (`cs-N` start offsets).
  Per-element margins that push regions into position are violations.
- A nested grid that intentionally uses a different column count must declare it:
  `<div class="grid-row" data-grid-columns="3">`.
- A documented optical adjustment may opt out with `data-grid-optical`; the auditor
  reports it as a named exemption rather than silently passing it.

### 4. Audit — verify the geometry

```bash
node audit.mjs --manifest grid.manifest.json --html page.html --screenshot shots/
node audit.mjs --manifest grid.manifest.json --url http://localhost:5173 --json report.json
```

Default viewports: one per activated breakpoint plus a container-fitting width.
Checks, all against the manifest numbers (±1px, per the Interaction Baseline):

- every `[data-region]` left/right edge resolves to a track line
- region width matches the declared span
- sibling gaps equal the gutter or an empty-track span
- grid ancestors implement the declared column count
- `measure` roles sit inside the 45–75ch reading window (enforced from 768px up;
  1ch is measured live from the region's own typography, not estimated)
- declared `min`/`max` bounds hold

Exit code 0 = pass, 1 = violations. Treat the report the way the review section of
KFL requires: fix the shared root cause (tokens, span map, or placement), never the
symptom. Screenshots are captured with the overlay on and serve as visual evidence
alongside the geometry report.

## Scope

The horizontal substrate is the auditable contract. Vertical rhythm is set with
spacing tokens and reviewed under Information Hierarchy; transient surfaces
(dialogs, popovers) are exempt from region checks but remain bound by Law 1 and the
Interaction Baseline.

## Demo

`demo/` contains a manifest, a compliant page, and a broken page (a nudging margin
plus a percentage width). Run the audit on both to see the pass and fail outputs.
