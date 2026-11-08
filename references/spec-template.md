# KFL project spec template

Keep one compact spec per product or module. Standalone: `kfl-spec.md`. Under Starcode: a KFL section in the bound `docs/<module>.md` plan; reuse its task IDs, G1/G2 state and execution authorization. The fields below are documentation, not new Starcode runtime schema or a second approval ledger.

```markdown
# KFL spec — <product/module>

## Context

- Mode / stage: Build | Change | Review / <current stage>
- Scope: <affected pages, components and roles>
- Visual path: Inherit | Explore
- Authorization: <current request and relevant existing approvals>

| Topic | Established facts / source / meaningful assumptions |
| --- | --- |
| Task and primary action | |
| Supported platforms, inputs and window range | |
| Real content/data; sample-data authorization if applicable | |
| Brand, themes and geometry | |
| Existing system, actual UI references and sibling pages | |
| Icon family, language and text direction | |
| Scope and choices to preserve | |

Consequential open questions: <only questions that block dependent work; otherwise none>

## Design contract

- Visual intent and priorities: <explicit user requirements, project identity and desired composition>
- Baseline: <actual UI/screenshots, component contracts or approved Explore reference; revision and scope>
- Visual path: <what is inherited, or what direction is being explored; asset-only work separately>
- Task and content: <truthful inventory and hierarchy; keep navigation/option names visible where needed>
- Layout: <owners, shared edges, density, supported windows and intentional whitespace>
- Type and tokens: <reuse existing scale, palette, spacing, geometry, focus, scrollbar and motion contracts>
- Components: <semantic roles and shared owners; compact icon actions, icon+text main/business actions, visible navigation/option labels; icons optional for navigation>
- States and behavior: <real loading/empty/error/disabled/selected states and relevant interaction paths>
- Adopted requirements: <explicit accessibility/numerical requirements and their scope, if any>
- Preserved choices: <approved choices and reasons that later slices/resumes must carry forward>

## Slices

| Slice | Authorized change / shared owner | Affected rule IDs and checks |
| --- | --- | --- |
| | | |

## Rule checklist

Review the full rule set for a new design. For a scoped change, list affected rules and relevant inherited contracts. Requirement level and verification status are separate.

| Rule ID | Scope | Level and source | Slice | Status | Disposition | Evidence / rationale |
| --- | --- | --- | --- | --- | --- | --- |
| GOV-1 | affected work | required: user/project precedence | | todo | action needed | |
| MIN-5 | affected controls/navigation | default: contextual icon/text choice | | todo | action needed | |
| COL-3 | affected palette pairs | advisory, unless explicitly adopted | | not tested | diagnostic only | |

Levels: required | default | advisory
Statuses: todo | pass | fail | not tested | N/A
Dispositions: conforms | action needed | intentional choice | diagnostic only | out of scope

## Decision log

| Date | Decision and rationale | Authority / source | Scope and affected checks |
| --- | --- | --- | --- |
| | | | |

## Verification

- Actual screenshots inspected: <runtime, fixtures, widths, states and evidence references>
- Relevant interactions exercised: <paths and observed results>
- Required failures or missing evidence: <details, or none>
- Advisory findings and intentional choices: <measurement, visual/task effect and disposition>
- Remaining limitations: <what is not tested and why>
```

## How to use the record

- **Required** includes explicit user/project requirements and KFL's factual, functional and evidence requirements. Do not silently downgrade these to obtain a pass.
- **Default** is an operative design preference. Follow it, or record a scoped choice grounded in the user, approved system, visual quality or task comprehension. Preserve that choice across resumes unless its basis changes.
- **Advisory** is a diagnostic or optional enhancement. A measured failure may remain `fail` with `intentional choice` or `diagnostic only`; do not change the measurement to `pass` because the design is accepted.
- `N/A` needs a scope reason. Missing evidence is `not tested`, not `N/A` and not `pass`.
- Do not invent facts or state to complete a checklist. Ask only when missing information consequentially affects the dependent work.
- Inspect actual UI/screenshots and relevant interactions. Generated images and tool exit codes cannot establish runtime visual or functional completion.
- Update affected decisions and checks when new evidence arrives; do not reopen unrelated approved choices or request duplicate permission.
