---
name: kasidia-frontend-law
description: "Aesthetics-first, spec-driven frontend design: inherit established visual systems, clarify consequential unknowns, implement in scoped slices and inspect the real result. Covers Swiss grid relationships, shared component contracts, reversible motion, concise content, contextual icon/text choices, semantic tokens and restrained interaction cues. Use when designing, implementing, refactoring or reviewing user-facing websites, applications, dashboards, admin panels, components and responsive layouts. Do not use for backend-only or non-visual work."
---

# Kasidia Frontend Law

KFL develops a coherent visual result through a scoped spec and real UI evidence. The rules have stable IDs and requirement levels in [references/rules.md](references/rules.md). The project spec, written from [the template](references/spec-template.md), records the visual baseline, decisions, affected rules and verification state; it is the working memory across slices and resumes.

## Governing order

Apply GOV-1 through GOV-4 before individual rules:

1. Follow the current explicit user requirements within their scope, then the approved project direction and established design system.
2. Within those requirements, prioritize **visual quality and identity → ordinary comprehension and task efficiency → consistency and implementation quality → accessibility enhancements and numerical diagnostics**. A user-adopted accessibility or numerical requirement is a requirement, not an advisory check.
3. Content truth, data integrity and working behavior remain required. Aesthetic priority does not authorize invented facts, fake success or broken controls.
4. Distinguish **required**, **default** and **advisory** rules from their measured status. Defaults guide decisions unless a scoped design reason justifies another choice. A diagnostic alone does not require a visual change, and an intentional choice must never be reported as a passed measurement.

## Three standing orders

1. **Clarify consequential uncertainty.** Ask when an unresolved fact would materially change the task, scope, content truth, supported platform or visual direction. Use the request, code and prior decisions first. Resolve routine, reversible design details using the established system and design judgment; record meaningful assumptions.
2. **Read the current contract.** At each stage and slice, consult the spec and the relevant rule text. Carry approved choices forward rather than reopening them as exceptions on every turn.
3. **Report evidence honestly.** A check is *pass* only with suitable evidence. Without evidence it is *not tested*. A generated design image is not evidence that the implementation works.

## Choose the mode and visual path

| Mode | When | Stages |
| --- | --- | --- |
| Build | new UI, including new pages within an existing system, or a redesign | 0 → 6 |
| Change | edit or repair existing UI | 0 → 6, scoped to affected roles; reuse existing decisions and authorization |
| Review | judge existing UI without editing | 0, 1 (only consequential facts needed to judge), 5, 6; change files only when asked |

- **Inherit:** an established design system, approved UI or sibling pages already define the direction. Reuse their tokens, components, density, icon/text roles and interaction language. Inspect actual UI screenshots as the baseline. A new page within that system does not require a new design image.
- **Explore:** the work establishes or deliberately changes the visual direction. Choose the appropriate method within the current workflow and authorization: actual exploration images, a scoped prototype or a clear visual specification. Use image generation when that method is selected or the user explicitly requests it; Explore does not always require it. Generating one illustration, photograph or other asset is an asset task; it does not reopen the whole UI design.

## Stage 0: Load

- Read this file and [rules.md](references/rules.md) in full. Under Starcode (the customized mancode fork), also read [workflow integration](references/workflow.md).
- Find the project spec: `kfl-spec.md` at the project root, or under Starcode the KFL section of the bound `docs/<module>.md` plan. Read its current checklist and decision log before continuing.
- Inspect the request, existing tokens, layout owners, components, icon family, sibling pages, fonts, themes, real content and state/data sources. Identify the Inherit or Explore path and the actual visual references available.

**Gate:** the scope and available sources are identified; consequential missing facts are visible. Missing optional assets or diagnostics do not block independent authorized work.

## Stage 1: Clarify

Use this inventory to find consequential gaps, not as a compulsory questionnaire:

1. **Task:** who uses the screen, for what, and its primary action.
2. **Platform:** supported devices, inputs and window range; whether mobile is in scope (VER-2).
3. **Content:** real content/data and any authorization for clearly labeled sample data (CON-1, CON-2).
4. **Brand:** existing name, logo, colors, fonts and other supplied assets (MIN-2, CON-1).
5. **Direction:** the established system or approved baseline; supported themes; Inherit or Explore.
6. **Geometry:** the existing or intended shape language, including square or rounded families (RAD).
7. **Icons:** the established family and the semantic roles of compact actions, main actions and navigation (MIN-5).
8. **Language:** UI languages and text direction (TYP, MIN-2).
9. **Scope:** the pages and components that may change and the choices to preserve.
10. **Authorization:** the current request and existing approvals; the governing workflow if one exists.

Reuse facts and decisions already present. Ask remaining consequential questions together with recommendations, then wait only for work that depends on those answers. Choose routine details within the contract without another permission request.

**Gate:** consequential unknowns are resolved; other assumptions and inapplicable items are recorded honestly.

## Stage 2: Spec

Write or update the spec from [the template](references/spec-template.md). Start with **visual intent and the user task**, then real content, hierarchy and reading order, layout, component contracts, styling and motion. Do not fill a screen merely because components are available.

- Record the visual baseline and Inherit/Explore path, task and primary action, content inventory, hierarchy/type, layout scopes, supported windows, tokens, reuse map, icon/text choices, states and motion.
- For a new design, review the full rule set. For a scoped Change, list affected rule IDs and relevant inherited contracts; do not turn unrelated surfaces into a redesign.
- Separate each check's requirement level, status and disposition. Record justified design choices and their scope so later reviews preserve them.
- Keep truthful content and functional behavior required. Treat numerical style, contrast and target-size diagnostics as advisory unless the user or approved project requirements explicitly adopts them.

Use existing authorization. Confirm a new consequential direction or unresolved requirement when necessary; do not ask again for a decision already made or for routine work authorized by the current request. Under Starcode, use the existing G1 interaction confirmation and G2 **visual baseline/change confirmation** with its Inherit/Explore paths (see workflow.md), without a second task ledger.

**Gate:** the scoped contract and visual baseline are sufficient for the authorized work, with no unresolved consequential dependency. Inherit work does not require new image generation or another image approval.

## Stage 3: Plan slices

Split the affected work into useful slices: shared foundations when they need changing, page frame, shared components, pages and states. Attach affected rule IDs and checks to each slice. Reuse established foundations instead of creating new tokens or a new component layer for every change.

**Gate:** the affected requirements and design checks have an owner and a verification plan.

## Stage 4: Build, one slice at a time

For each slice:

1. Read its current contract, relevant rule text and preserved decisions.
2. Implement the authorized change at the correct shared owner; inspect affected consumers.
3. Inspect the actual rendered UI and exercise relevant interactions (VER-1). Record evidence and anything not tested.
4. Fix required failures and actual visual or task defects. Evaluate advisory measurements in context rather than flattening the design to satisfy a number. Apply [Stop and ask](#stop-and-ask) only to consequential dependencies.

**Gate:** the slice's current state and disposition are recorded before dependent work relies on it. An unresolved diagnostic alone does not stop unrelated work.

## Stage 5: Verify

Use [design-review.md](references/design-review.md) to compare the actual UI with the applicable baseline, supported windows and real content/states. Check the six recurring anti-patterns as scoped in MIN, CON, STA, ALN and INT: unsolicited filler copy, irrelevant status dots, numbering unordered headings, overuse of plain-text action buttons or indiscriminate icon-only controls (visible navigation labels are not action-button clutter), residual gaps and newly injected accent stripes or decorative underlines.

Keep real screenshot inspection and relevant interaction checks mandatory for completion of changed UI. Use the optional [tools](references/tools.md) only for what they measure; their results and exit codes are bounded diagnostics, not universal design acceptance. A missing browser or screenshot leaves the relevant checks unverified; report that limitation and continue independent authorized work without claiming visual completion.

**Gate:** required checks have evidence, and defaults/advisories have honest dispositions. A justified choice may retain a failing advisory measurement; do not relabel that measurement as a pass.

## Stage 6: Report

Lead with what changed and why. State the baseline used, actual widths/states/interactions checked, and material limitations. Distinguish required failures or unverified checks from advisory findings and preserved design choices. For a defect, give the rule ID, observable evidence and the smallest shared fix. Do not claim verification that did not occur.

## Stop and ask

Pause only the dependent work when:

- A consequential requirement, content fact, supported platform or visual direction remains unresolved after checking available sources.
- Required behavior or content truth cannot be established without the user's decision.
- The proposed change would exceed the authorized scope or replace an approved direction that the current request does not reopen.
- A required deliverable or verification dependency is unavailable and completing it needs a user decision.

Resolve a conflict between a KFL default and an explicit user choice through GOV-1; do not request the same permission again. A missing optional icon, an advisory contrast result or an unavailable image-generation tool on the Inherit path is not an automatic stop. Continue independent authorized work.

## Resume

Read the spec, baseline and decision log. Continue from the recorded state, carrying forward justified choices and existing authorization. Reopen a decision only when a new requirement or concrete evidence changes its basis, and only within the affected scope.
