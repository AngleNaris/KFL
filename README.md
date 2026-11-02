# KFL — Kasidia Frontend Law

Enforce Kasidia's frontend laws when designing, implementing, refactoring, or reviewing interactive UI.

## The Four Laws

1. **Every Element Aligns** — every visible UI element must align with at least one other visible element or an explicit layout anchor.
2. **Similar Elements Reuse One Contract** — elements with the same semantic role must use the same shared component or component family with explicit variants.
3. **Motion Returns to Its Origin** — every animated element must leave by reversing the path and transformation used to enter.
4. **Minimal, Weighted, Icon-First** — every screen stays highly concise with no decorative text, every piece of information has a clear weight, and an icon replaces text wherever an established icon can carry the meaning; the words move into a hover/focus tooltip.

Plus supporting rules for size-tiered concentric corner radii, color roles, icon integrity, content and status integrity, type legibility, styled scrollbars, interaction baseline, and a verification gate.

## How it runs

KFL is a spec executed in stages, so an agent cannot apply a rule once and then forget it:

1. **Load** the skill, the rules and the project's spec.
2. **Clarify:** ask every unknown on a must-ask list (task, platform, content, brand, themes, geometry, icons, language, scope, approval) in one batch, then wait.
3. **Spec:** write the design contract and a checklist of every rule ID; get approval.
4. **Plan slices,** foundations first, each with its rule IDs.
5. **Build** slice by slice, rereading the rules and recording evidence per ID.
6. **Verify** the whole checklist against the running UI; **report** pass, fail and not tested.

| File | Role |
| --- | --- |
| [`SKILL.md`](./SKILL.md) | entry: stages, gates, when to stop and ask |
| [`references/rules.md`](./references/rules.md) | the laws and rules, each with an ID |
| [`references/spec-template.md`](./references/spec-template.md) | the per-project spec and checklist |

`SKILL.md` uses the agent skill format (frontmatter + markdown); copy the repository as a skill folder. The rules also read as a human-facing design standard for frontend teams.

## License

MIT

## Reviewed tooling and Starcode integration

The specification retains the ten original Swiss grid principles, their source link and attribution. See [source declarations and verification boundaries](THIRD_PARTY.md).

[Optional tools](references/tools.md) include a shared manifest resolver, grid generator/auditor, a bounded surface auditor and a synthetic [reference kit](examples/index.html). Run `npm ci` and `npm test` inside `tools/`; browser tests need an available Chromium. Square-geometry checks apply only to an explicitly chosen square contract. The kit is neither an approved generated design nor a production backend.

[Starcode](https://github.com/AngleNaris/starcode) embeds this skill in its interaction approval → actual image generation and visual approval → implementation workflow. Read the [integration guide](references/workflow.md); reuse its existing approvals and task ledger. Standalone KFL remains usable without Starcode. No global skill installation is performed.
