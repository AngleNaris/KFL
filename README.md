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
