# KFL — Kasidia Frontend Law

Enforce Kasidia's frontend laws when designing, implementing, refactoring, or reviewing interactive UI.

## The Three Laws

1. **Every Element Aligns** — every visible UI element must align with at least one other visible element or an explicit layout anchor.
2. **Similar Elements Reuse One Contract** — elements with the same semantic role must use the same shared component or component family with explicit variants.
3. **Motion Returns to Its Origin** — every animated element must leave by reversing the path and transformation used to enter.

Plus supporting rules for information hierarchy, color roles, icon integrity, interaction baseline, and a verification gate.

The full specification lives in [`Kasidia-Frontend-Law.md`](./Kasidia-Frontend-Law.md).

## Usage

The file is written in Hermes Agent skill format (frontmatter + markdown). It can be used directly as a `SKILL.md` for agent-based UI work, or read as a human-facing design standard for frontend teams.

## License

MIT

## Reviewed tooling and Starcode integration

The specification retains the ten original Swiss grid principles, their source link and attribution. See [source declarations and verification boundaries](THIRD_PARTY.md).

[Optional tools](references/tools.md) include a shared manifest resolver, grid generator/auditor, a bounded surface auditor and a synthetic [reference kit](examples/index.html). Run `npm ci` and `npm test` inside `tools/`; browser tests need an available Chromium. Square-geometry checks apply only to an explicitly chosen square contract. The kit is neither an approved generated design nor a production backend.

[Starcode](https://github.com/AngleNaris/starcode) embeds this skill in its interaction approval → actual image generation and visual approval → implementation workflow. Read the [integration guide](references/workflow.md); reuse its existing approvals and task ledger. Standalone KFL remains usable without Starcode. No global skill installation is performed.
