# Optional KFL tools

The tools supplement the scoped design contract and current authorization. They are bounded diagnostics, not mancode runtime gates or global design acceptance criteria. Apply GOV-1 through GOV-4 to their findings.
Run commands from `tools/`. Dependencies are isolated in this directory;
do not add Playwright to mancode's root dependencies or install globally.

With project authorization, use `npm ci` for the pinned tooling dependencies. A compatible Chromium is required
for audits; use an existing installation via `KFL_CHROMIUM` or the Playwright browser installation process.
Missing browser/dependencies leaves the dependent audit **not tested**, not passed. It does not block independent authorized work. Actual UI screenshot and interaction evidence is still required before claiming verified completion.

## Grid

Only use the manifest generator when the approved project actually uses this grid contract.
Reuse a project's existing layout system otherwise. The defaults are example values, not universal design rules.

```sh
npm run grid:generate -- grid/demo/demo.manifest.json /absolute/path/to/scratch-output
npm run grid:audit -- --manifest grid/demo/demo.manifest.json --html grid/demo/index.html --viewports 375,768,1440 --json /absolute/path/to/grid-report.json
```

Choose an explicit scratch destination when inspecting generation; do not overwrite an approved project's assets.
The audit checks annotated regions and their actual owning grids. Nested local layouts use `data-grid="local"`;
regions without a page span can still declare width bounds. Empty/gutter tracks and local interiors are different constraints.
The fixed measure window is a tool heuristic; it is not a universal CJK text or application-width requirement.
Report that limitation and use project-specific manual/browser evidence where the heuristic does not apply.
See [grid tool details](../tools/grid/README.md).

## Surface

The viewport arguments below illustrate syntax. Replace them with the product's supported window/input matrix; the examples do not add mobile or touch scope.

```sh
npm run surface:audit -- --html /path/to/page.html --viewports 375t,1440 --json /absolute/path/to/surface-report.json
npm run surface:audit -- --html ../examples/components.html --viewports 375t,1440 --geometry square
```

This detects selected type-floor and target-size risks, default browser scrollbars (SCR) and corner geometry.
The scrollbar check covers the page when it scrolls and every element with `overflow: auto|scroll`, hidden ones included,
and passes when the standard `scrollbar-color` or `scrollbar-width` is set or `::-webkit-scrollbar` is sized; it does not judge the thumb's shape or contrast.
Headless Chromium hides scrollbars in screenshots; to inspect them (SCR-4), launch a full Chromium without `--hide-scrollbars`. The default `--geometry rounded`
measures its configured geometry model: one radius per component family, a larger radius for a clearly larger
family (short side at least 2x), and concentric nested corners. That model is an advisory diagnostic unless the
project explicitly adopts it; it does not override approved shapes. Square-only pages pass it trivially.
`--geometry square` is the reference kit's stricter contract: any rounded rectangle, pill, round SVG cap/join or
rounded clip fails. Use it only for a project that explicitly chose square geometry.
Families are keyed by an element's first class (plus `data-size`); a family named differently is not compared.
The checker samples hit areas; it is not a complete WCAG conformance engine, keyboard audit or behavior test.
Its type and target thresholds are numerical screening values, not automatic visual mandates. For supported touch
input, inspect actual target accuracy; the 44px reference is advisory unless explicitly adopted. An optional warning
mode does not lower an adopted requirement. The tools do not assess contextual icon/text choices, actual contrast,
focus visibility or business behavior; inspect those with appropriate real evidence. Preserve native behavior,
approved typography, geometry and icon systems rather than changing them solely to silence a diagnostic.

Exit codes for both audits: 0 = the configured checks passed, 1 = configured violations, 2 = not tested
(bad input, missing page, unavailable browser). Never report exit 2 as a measured pass or failure. Exit 0 does not
prove the UI is attractive, recognizable or functional; exit 1 does not automatically reject an approved design.
Record the result, requirement level and disposition separately. A justified choice may retain a failing advisory
measurement; do not alter the result or silently downgrade an adopted requirement.

Keep generated reports/screenshots outside the distributed skill. Record command, environment, result, measured scope,
unmeasured requirements and exceptions in the original task ledger. Do not upload private page content without authorization.

## Reference kit boundaries

`examples/` is a local synthetic component specimen, not an approved image package or a production backend.
Its geometry, tokens and data demonstrate one direction; use only parts consistent with the project's approved contract.
Demo feedback and browser storage cannot establish real identity, server persistence or business integration.
Its focus specimens demonstrate restrained palette-compatible cues (INT-3), not a required focus/resting ratio.
Tab through the running components page and inspect the actual result. Its compact icon actions and visible
main-action/navigation labels illustrate semantic choices; they do not require every project control to use
the same treatment.
