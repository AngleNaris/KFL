---
name: kasidia-frontend-law
description: "Staged, spec-driven frontend design law: clarify unknowns with the user, write a project spec with an ID'd rule checklist, build in slices that re-check their rules, and verify every rule with evidence. Rules cover task-first composition, the ten Swiss grid principles and scoped alignment, shared component contracts, reversible motion, minimal icon-first screens without decorative text, size-tiered concentric corner radii, semantic tokens, styled scrollbars, non-outline focus cues and truthful content. Use when designing, implementing, refactoring or reviewing user-facing frontend UI: websites, applications, dashboards, admin panels, components and responsive layouts. Do not use for backend-only or non-visual work."
---

# Kasidia Frontend Law

KFL is a spec, executed in stages. Each stage ends at a gate; do not start the next stage until the gate is met. The rules are acceptance criteria with IDs in [references/rules.md](references/rules.md), not a visual template. The project spec, written from [the template](references/spec-template.md), is the working memory: it records the answers, the design contract and the status of every applicable rule.

## Three standing orders

1. **Ask, never guess.** Anything the request, the code or an earlier answer does not establish is an open question. Ask it; do not fill it in with a plausible default. See [Stop and ask](#stop-and-ask).
2. **Read, never recall.** At every stage and every slice, reopen the spec and the rule texts you are about to apply. Rules held in memory drift; the files do not.
3. **Evidence, never assumption.** A rule is *pass* only with evidence from the rendered UI or a tool. Without evidence it is *not tested*.

## Choose the mode

| Mode | When | Stages |
| --- | --- | --- |
| Build | new UI or redesign | 0 → 6 |
| Change | edit or repair existing UI | 0 → 6, spec scoped to the affected roles; reuse existing approvals |
| Review | judge existing UI without editing | 0, 1 (only facts needed to judge), 5, 6; change files only when asked |

## Stage 0: Load

- Read this file and [rules.md](references/rules.md) in full. Under Starcode (the customized mancode fork), also read [workflow integration](references/workflow.md).
- Find the project spec: `kfl-spec.md` at the project root, or under Starcode the KFL section of the bound `docs/<module>.md` plan. If it exists, read it and resume from its checklist state.
- Inspect the project: the request, existing tokens, layout owners, components, icon family, sibling pages, fonts, themes, real content and state/data sources.

**Gate:** the facts are listed, each with its source (request, file, earlier answer).

## Stage 1: Clarify

Check every item of the must-ask list against the facts. An item is settled only by the request, the code or an explicit answer, never by assumption.

1. **Task:** who uses the screen, for what, and its primary action.
2. **Platform:** devices, input methods, minimum and representative window widths; whether mobile is in scope (VER-2).
3. **Content:** which real content and data exist; whether sample data is allowed, and how it is labeled (CON-1, CON-2).
4. **Brand:** brand assets that actually exist: name, logo, colors, fonts. None are invented (MIN-2, CON-1).
5. **Direction:** existing design system or approved images; light, dark or both themes.
6. **Geometry:** square or rounded, and the radius tiers if rounded (RAD).
7. **Icons:** the icon family; who extends it or decides when an icon is missing (MIN-5).
8. **Language:** UI language(s) and text direction (TYP, MIN-2).
9. **Scope:** which pages and components may change; what must stay as is.
10. **Approval:** Starcode G1/G2 or standalone; who approves.

Ask all open items in one consolidated set, each with a recommended answer, then stop and wait. Record the answers in the spec.

**Gate:** every item is answered or recorded as not applicable with a reason.

## Stage 2: Spec

Write or update the spec from [the template](references/spec-template.md). Design in this order: **user task → real content → hierarchy and reading order → layout → component contracts → styling and motion**. Never start by filling a screen with available components.

- The design contract fixes the task and primary action, the content inventory (with every visible string justified by MIN-2), hierarchy and type scale, layout scopes and breakpoints, tokens (color, type, spacing, radius tiers, focus, scrollbar, motion), the reuse map with icon assignments, and the states and motion.
- The checklist lists every rule ID from rules.md, marked *applies* or *N/A* with a reason.
- For a Change, record only the affected roles; preserve the product's established language and the requested scope. Fix shared causes deliberately; do not redesign unrelated surfaces.
- Record each consequential exception in the decision log with its user or content need; visual novelty alone is never a reason.

Present the spec for approval: standalone, ask the user; under Starcode, through G1 and then the G2 image approval (see workflow.md). KFL does not authorize implementation itself, repeat approval questions or keep a second task ledger.

**Gate:** the spec is approved. No implementation before this.

## Stage 3: Plan slices

Split the work into slices, foundations first: tokens (including scrollbar, focus and radius) → page frame → shared components → pages → states. Give each slice the rule IDs it must satisfy, and write the slice list into the spec.

**Gate:** every applicable ID belongs to at least one slice.

## Stage 4: Build, one slice at a time

For each slice:

1. Reopen the spec's contract and the texts of the slice's rule IDs.
2. Build only that slice, using the shared tokens and components the contract names.
3. Check each of the slice's IDs against the rendered result; record status and evidence in the checklist.
4. Fix a failure before starting the next slice. Fix the shared cause, not the instance.

A missing fact, a conflict or a scope change found here goes to [Stop and ask](#stop-and-ask); do not decide it inside the slice.

**Gate:** every slice is built and its IDs are recorded.

## Stage 5: Verify

Reopen rules.md and walk the whole checklist against the running UI, following VER-1 to VER-6 and, where it helps, [design review](references/design-review.md). Use the [optional tools](references/tools.md) where the project benefits from them; they verify bounded properties, never image approval, accessibility conformance or working business journeys.

**Gate:** every applicable ID is *pass*, *fail* or *not tested*, each with its evidence.

## Stage 6: Report

Report the changed foundations; the verified widths, states and task paths; and the checklist summary: failures and *not tested* items first. Report a violation as **rule ID + component/selector + observable evidence + smallest shared correction**. Never claim a check ran when it did not. Update the spec so the next session can resume from it.

## Stop and ask

At any stage, stop and ask the user before acting when:

- a rule conflicts with the request, an approval or another rule;
- a needed fact is missing: content, data, a state source, a brand asset or an icon;
- a change would exceed the agreed scope or reopen an approved decision;
- a required check cannot run (no browser, no screenshot, no image tool).

State the conflict or gap, the options and a recommendation. Then wait. Record the answer in the spec's decision log. Do not silently choose, invent content, soften a rule or skip a check.

## Resume

After a break or context loss, rerun Stage 0, read the spec and continue from the first gate that is not met. Never resume from memory.

See [sources and licenses](THIRD_PARTY.md) before redistributing the skill or its reference kit.
