# Kasidia Frontend Law

KFL is an aesthetics-first frontend design skill. It uses a scoped spec, shared contracts and inspection of the actual UI to produce a coherent visual result while avoiding recurring AI-generated clutter.

## Priority and scope

Follow the current explicit user requirements, then the project's approved direction and established design system. Within that scope, prioritize visual quality and identity, ordinary comprehension and task efficiency, consistency and implementation quality, then accessibility enhancements and numerical diagnostics. User-adopted accessibility or numerical requirements remain requirements. Content truth, data integrity and working controls are always required.

KFL distinguishes **required**, **default** and **advisory** rules from verification status. A default guides the design unless a scoped reason supports another choice. Numerical contrast, typography, radius and target-size heuristics do not override an approved design merely by producing a failing diagnostic. Preserve the actual measurement and document the design choice.

## The four laws

| Law | Purpose |
| --- | --- |
| Swiss Grid, Scoped Alignment | Align related content through shared layout owners. Keep intentional whitespace; remove accidental residual gaps. |
| Shared Component Contracts | Reuse components by semantic responsibility, with consistent dimensions and behavior across their consumers. |
| Reversible Motion | Give reversible opening and closing transitions coherent return paths. Meaningful task progression need not run backward. |
| Minimal, Weighted, Recognizable | Remove unsolicited filler and preserve hierarchy. Use icons for familiar compact actions, icon plus text for business/main actions, and visible labels for navigation, tabs and option values. Navigation does not require an icon. |

## Recurring anti-patterns to prevent

- Redundant or decorative copy with no basis in the user's content or the established product.
- Invented or irrelevant green status dots and other “live” decoration.
- Numbered headings for unordered peer sections.
- Overusing plain-text action buttons, replacing needed action/navigation labels with icons, or adding icons to every label. Visible text navigation is not action-button clutter.
- Residual gaps left by removed content or broken layout, while preserving deliberate spacing and breathing room.
- Newly injected side accent stripes and decorative underlines, while respecting approved inherited styles and meaningful structural rules.

These guards preserve the user's taste. They are scoped to the change and do not authorize rewriting every existing pattern.

## Workflow

1. Load the request, existing system, content sources and prior decisions.
2. Choose **Inherit** for work within an established system, using actual UI/screenshots as the baseline; choose **Explore** when establishing or changing the visual direction.
3. Clarify consequential gaps. Resolve routine design details within the contract without repeated permission requests.
4. Record the scoped design contract, affected rule IDs, requirement levels and preserved choices.
5. Implement in useful slices at shared layout and component owners.
6. Inspect actual screenshots and relevant interactions; report verified results and limitations honestly.

Image generation is for exploring a new visual direction or an explicit user request. A new page within an existing system does not require it. Generating a needed visual asset is distinct from regenerating the UI.

## Files

| File | Role |
| --- | --- |
| [SKILL.md](SKILL.md) | Modes, priority, stages and decision gates |
| [references/rules.md](references/rules.md) | Stable rule IDs, scope and requirement levels |
| [references/spec-template.md](references/spec-template.md) | Compact design contract and verification record |
| [references/design-review.md](references/design-review.md) | Evidence-based visual and interaction review |
| [references/workflow.md](references/workflow.md) | Starcode/mancode integration |
| [references/tools.md](references/tools.md) | Optional generators, diagnostics and reference kit |
| [tools/](tools/) | Local helpers with bounded measurement contracts |
| [examples/](examples/) | Reference specimens; adapt them to the product |
| [THIRD_PARTY.md](THIRD_PARTY.md) | Third-party notices |

## Optional tools

The tools help inspect declared layout and component contracts. They do not choose a visual direction or replace actual screenshot and interaction review. A diagnostic's exit code is not universal acceptance of the UI; see [the tool reference](references/tools.md) for measured and unmeasured properties.

## Starcode integration

Under Starcode, reuse the bound plan, task ledger and current authorization. G1 handles interaction confirmation and G2 handles visual baseline/change confirmation through Inherit or Explore. An established UI provides a valid inherited baseline; do not restart image generation or approval on every continuation. See [workflow integration](references/workflow.md).

## License

MIT, as declared by this repository. See [source declarations and verification boundaries](THIRD_PARTY.md).
