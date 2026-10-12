# Optional KFL tools

The tools supplement the skill after the relevant design is approved. They are not mancode runtime gates.
Run commands from `tools/`. Dependencies are isolated in this directory;
do not add Playwright to mancode's root dependencies or install globally.

With project authorization, use `npm ci` for the pinned tooling dependencies. A compatible Chromium is required
for audits; use an existing installation via `KFL_CHROMIUM` or the Playwright browser installation process.
Missing browser/dependencies is **not tested / blocked**, not a pass.

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

```sh
npm run surface:audit -- --html ../examples/components.html --viewports 375t,1440 --strict-touch --json /absolute/path/to/surface-report.json
```

This detects selected type-floor and target-size risks, and the reference kit's geometry policy.
The current surface checker always applies square geometry. Run it only for an explicitly selected square-geometry contract; it cannot validate an approved rounded visual system. Keep that project's own geometry checks instead.
The checker samples hit areas; it is not a complete WCAG conformance engine, keyboard audit or behavior test.
Primary touch controls still need KFL's 44px target check; the optional warning mode does not lower an approved requirement.
Native control behavior and an approved icon family must not be replaced merely to silence an aesthetic finding.

Keep generated reports/screenshots outside the distributed skill. Record command, environment, result, measured scope,
unmeasured requirements and exceptions in the original task ledger. Do not upload private page content without authorization.

## Reference kit boundaries

`examples/` is a local synthetic component specimen, not an approved image package or a production backend.
Its geometry, tokens and data demonstrate one direction; use only parts consistent with the project's approved contract.
Demo feedback and browser storage cannot establish real identity, server persistence or business integration.
