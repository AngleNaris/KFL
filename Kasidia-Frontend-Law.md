---
name: kasidia-frontend-law
description: "Design, implement, refactor, or review user-facing frontend UI with Kasidia's laws: task-first composition, the ten Swiss grid principles, scoped alignment, shared page and component contracts, semantic tokens, predictable accessible interactions, reversible motion, and truthful content. Use for websites, applications, dashboards, admin panels, components, responsive layouts, and UI quality reviews. Prevent component overuse, arbitrary styling, duplicate pages, and screenshot-only layouts. Do not use for backend-only or non-visual work."
---

# Kasidia Frontend Law

Treat these laws and supporting rules as acceptance criteria, not a visual template.

Design in this order: **user task -> real content -> hierarchy and reading order -> layout -> component contracts -> styling and motion**. Never start by filling a screen with available components.

Preserve the product's established language and the requested editing scope. Fix shared causes deliberately; do not redesign unrelated surfaces. Explain consequential exceptions through a user or content need, never through visual novelty alone.

## Law 1: Every Element Aligns

Give every visible element an intentional alignment relationship within its owning layout. A grid organizes relationships; it does not require every visible edge to touch a page-level column.

### 10 Rules of Good Swiss Grid Design

Source: [10 Rules of Good Swiss Grid Design](https://github.com/longplay45/swiss-grid-generator/blob/main/TEN_RULES_OF_GOOD_SWISS_GRID_DESIGN.md#10-rules-of-good-swiss-grid-design), as supplied by the user. In the spirit of Dieter Rams' 10 Principles of Good Design. The ten principles below retain the supplied wording with punctuation normalized; subsequent implementation requirements are Kasidia-specific UI adaptations.

1. **Good Swiss Grid Design is systematic.** It begins with a clear, logical grid and follows it rigorously. Arbitrary placement is chaos.
2. **Good Swiss Grid Design serves the content.** The grid is not decoration; it is infrastructure. It organizes information so the message becomes clear and accessible.
3. **Good Swiss Grid Design creates order without boredom.** It uses asymmetry, rhythm, and proportional relationships to bring life to strict geometry.
4. **Good Swiss Grid Design is precise.** Every millimeter, every baseline, every margin matters. Sloppiness destroys credibility.
5. **Good Swiss Grid Design achieves clarity through reduction.** It removes the unnecessary so the essential can speak with maximum power.
6. **Good Swiss Grid Design respects typography.** Text is not filler. It is given generous space, proper hierarchy, and breathing room on the baseline grid.
7. **Good Swiss Grid Design creates visual tension and harmony.** It balances strong contrasts (scale, weight, color) with quiet, harmonious structure.
8. **Good Swiss Grid Design is timeless rather than fashionable.** It avoids trends and cheap effects. A well-designed grid still looks contemporary in twenty years.
9. **Good Swiss Grid Design is honest.** It does not hide behind ornament or unnecessary decoration. Form follows function, and structure is visible when it serves the message.
10. **Good Swiss Grid Design is thorough to the last detail.** Even the smallest element (a caption, a folio number, a hairline rule) is considered with the same care as the headline.

**UI application:** Apply these principles through the scoped rules below, not a fixed Swiss visual template. Treat precision as consistent relationships, not fixed-pixel positions. Use asymmetry and contrast to support hierarchy without breaking reading or keyboard order. Reduction must preserve necessary labels, controls, feedback, and accessibility. Reveal structure only when it aids comprehension, not by drawing decorative grid lines everywhere.

### Define Three Alignment Scopes

- **Page frame:** own outer margins, container width, and the major anchors shared by navigation, headers, and content. Reuse the frame across sibling pages.
- **Region layout:** own the arrangement of meaningful content groups. Align region boundaries to their parent's tracks or named areas. Share tracks, or use `subgrid`, only when contents must align across regions; otherwise use an independent local layout.
- **Component interior:** own padding, control geometry, baselines, and local gaps. Align text and icons to the component's content box, not automatically to the page grid. Anchor floating surfaces to their trigger or a declared viewport edge.

Do not confuse aligned boxes with identical text lengths, icon outlines, or equal-height content. Use optical corrections only as small, reusable, documented adjustments.

### Derive the Layout from Content

- Inspect the existing layout and token system first. Extend it instead of installing a competing grid or spacing scale.
- Identify region roles, reading order, minimum usable widths, and flexible space. Then choose the simplest structure: normal flow for a stack, Flexbox for one-dimensional groups, Grid for shared two-dimensional tracks.
- Declare container width, page padding, spacing scale, row/column gaps, track definitions, and responsive rules once in their owning shared layout. Distinguish outer padding from the content box in both implementation and measurement.
- Choose columns for actual sibling relationships. Use asymmetry, rhythm, and proportion to express hierarchy, not novelty. Equal units may share equal tracks; a navigation rail and workspace need different width rules. Do not force 12 columns, one global count for all nested ratios, or asymmetry onto genuinely parallel content.
- Constrain prose to a readable measure for its language and typeface; do not cap a table, canvas, or entire application at prose width. Primary importance does not automatically mean a wider column.
- Use content-driven patterns: a reading page may need one column; a workspace may need a bounded rail plus `minmax(0, 1fr)`; a collection may need auto-fitting tracks with a shared item minimum. Choose a pattern for its content, not to produce a fashionable tile arrangement.
- Align headings, toolbars, lists, and footers that share a content edge through the same container or track, not separately tuned widths. Let full-bleed backgrounds contain an aligned inner content frame.
- Use shared spacing tokens for gutters, section gaps, margins, and padding. Local and vertical gaps need not equal the page gutter. Make related items closer than unrelated groups; do not insert empty columns merely to imitate padding.
- Allow content to determine height. Reserve predictable loading/control space, but let longer text and validation grow in flow rather than clipping them or reserving excessive blank space.

### Reflow without Losing the Task

- Choose breakpoints where content stops fitting, not from device names alone. Record what wraps, stacks, collapses, or changes interaction at each breakpoint, and why. A responsive contract may change tracks and navigation, not only spans.
- Preserve task priority and a coherent DOM, reading, and keyboard order. Keep essential actions available; do not solve crowding by hiding required information or shrinking text.
- Let flexible children shrink with `min-inline-size: 0` where needed; wrap long content. Give inherently wide tables, code, or canvases a deliberate local scrolling strategy instead of making the entire page overflow.
- Adapt reusable regions to their available width, using container queries where supported by the project. Do not make a component depend on one page's viewport assumptions.
- Test between reference widths and immediately around each breakpoint. Do not conceal failed layouts with page-wide `overflow-x: hidden`, arbitrary fixed heights, absolute-positioned content, or viewport-specific nudges.

### Verify the Correct Anchors

Use a development overlay or browser layout tools that reflect the actual container, padding, tracks, and gaps. Check region edges against their owning grid, interiors against local edges/baselines, and floating surfaces against their anchors. Do not audit every descendant against the page grid. Shared edges should agree within one CSS pixel, except for documented optical adjustments.

**Fail:** unexplained offsets, conflicting containers, tokenless spacing patches, broken reading order, or alignment that works only at one width or content state.

## Law 2: Similar Elements Reuse One Contract

Reuse by semantic responsibility and interaction, not merely by visual resemblance. Share behavior as well as appearance.

- Inventory existing primitives, component families, and page templates before adding anything. Prefer the established library and native semantics over rebuilding controls.
- Choose the least complex structure that supports the task: lists for sequences, tables for cross-row comparison, cards for independently meaningful entities, tabs for peer views, dialogs for bounded interruptive tasks. Do not wrap every section in a card or turn every choice into a custom dropdown.
- Reuse sibling-page shells, headers, filter/toolbars, content layouts, and state presentations where their responsibilities match. A repeated page is not made reusable merely by sharing its buttons.
- Upgrade an incomplete shared contract and migrate its affected consumers together. Express legitimate differences through named variants, slots, composition, and explicit states; do not clone a page-private version.
- Keep component APIs coherent. Split materially different responsibilities instead of building a universal component with unrelated boolean switches or route-name branches. Do not force reuse solely because two things currently look alike.
- Centralize recurring geometry, spacing, typography, color roles, borders, elevation, focus, and motion in semantic tokens and shared recipes. Use the project's existing styling and breakpoint mechanisms.
- Distinguish constraints from patches: `0`, `auto`, ratios, intrinsic sizing, and a documented component minimum are legitimate. Arbitrary per-instance pixels, repeated magic values, and one-off tokens named to disguise a nudge are not.
- Keep static appearance in tokens and component styles. Allow bounded data-driven values for progress, charts, and measured positioning; do not hardcode data or move static styling inline to evade the shared contract.
- Keep hover, focus-visible, active, selected, disabled, loading, error, keyboard, touch, responsive, and motion behavior consistent wherever applicable. Domain wrappers may bind data or behavior, but must not recreate shared visual structure.

**Fail:** repeated responsibilities implemented independently, shared styles overridden page by page, cosmetic variants hiding different behavior, or a token/component introduced only to legitimize a one-off patch.

## Law 3: Motion Returns to Its Origin

Make motion optional and purposeful. When a transient surface animates in, define its matching return path in the same change.

- Pair enter, settled, leave, and interrupted states. Keep the same origin, axis, and spatial relationship for opening/closing; a right-hand drawer returns right, and a triggered menu collapses toward its trigger.
- Coordinate backdrop and content; finish exit before removal when an exit runs. Handle rapid reversal from the current state, not by replaying from the beginning or leaving stale focus/scroll locks.
- Prefer transform and opacity. Return hover/active effects to resting geometry without reflow. Reserve predictable space and coordinate necessary layout changes; do not animate every state update or route by default.
- Do not delay action feedback, focus management, or access to controls for decorative animation. Preserve focus and scroll continuity whether motion runs or not.
- Honor `prefers-reduced-motion`: remove nonessential spatial motion; use instant updates or restrained opacity when appropriate. Zero-duration paths must complete cleanup without waiting for an animation event that will not fire.

**Fail:** animated entry without a coherent exit, changed origins, abrupt removal during an active exit, motion-induced layout jumps, or motion required for the UI to function.

## Information Hierarchy

- Establish primary, secondary, supporting, and contextual levels through size, weight, color, and spacing. Keep the same roles consistent across pages and states.
- Make the current task and its primary action obvious. Reserve the strongest treatment for what matters in that task context, not every button or section.
- Group by meaning using proximity, headings, and whitespace before adding borders, backgrounds, or nested panels. Preserve a clear reading order without decorative scaffolding.
- Verify hierarchy in loading, empty, error, populated, disabled, and selected states. Never let secondary metadata, badges, or decoration overwhelm task content.

## Color System

- Define semantic roles for accent/theme, supporting emphasis, background base, text, borders, focus, and real states. A supporting role need not introduce another vivid hue.
- Keep large surfaces low in saturation and strong color bounded. Avoid large saturated fills and strongly divergent multihue gradients; use closely related hues when a gradient is justified.
- Check contrast: at least 4.5:1 for normal text and 3:1 for qualifying large text and essential control/state cues. Do not assume a heading automatically qualifies as large text.
- Reinforce hierarchy and labels rather than replacing them with color. Let state colors outrank the accent only when the urgency warrants it.

## Icon Integrity

- Use genuine vector assets from the established icon family, with consistent stroke/fill treatment. Never substitute emoji, letters, punctuation, or Unicode pictograms for interface icons.
- Reuse familiar product-wide metaphors. Give icon-only controls accessible names and stable hit areas; hide purely decorative icons from assistive technology.

## Content Integrity

- Use supplied or product-declared facts. Never invent statistics, counts, testimonials, logos, prices, or generic feature claims to make a page look complete.
- Write necessary functional copy, but keep unsupported factual claims out. Use sample data only when explicitly requested, label it as sample, and keep it separate from production sources.
- Omit optional sections without real content. Retain useful empty states for genuine product features: explain what is missing and provide a relevant next action when one exists.
- Apply the deletion test: keep a section only if it helps users learn, decide, act, or understand the current state. Do not add metric strips, logo walls, feature grids, or testimonial cards as filler.
- When asked to remove an element, remove it without inventing a replacement module.

## Status Integrity

- Require a real source and a user-relevant meaning for every status. Distinguish unknown, loading, success, degraded, offline, and error only where those states actually exist.
- Do not display decorative "Ready"/"Online" badges or animated telemetry. A rendered page does not prove backend connectivity, synchronization, or saved changes; report those only from the relevant source.
- Keep live state synchronized and expose stale/unknown data honestly. A persisted record status may remain unchanged during the session and still be useful; a pulsing dot must represent genuine ongoing activity.
- Omit a status that adds no decision value or merely duplicates an already clear state. Do not fabricate all possible states to justify an indicator.

## Type Legibility

- Preserve project floors: Latin text at least 10 CSS pixels; CJK and mixed CJK text at least 12 CSS pixels. Use at least 16px-equivalent for primary reading text. Treat floors as limits, never default targets for supporting text.
- Apply floors to labels, captions, badges, tables, chart annotations, placeholders, hints, and legal copy. Do not bypass them through transforms or pseudo-element substitutions.
- Use a shared type scale, relative sizing where appropriate, and sufficient line height. Establish vertical rhythm through line heights and spacing tokens; align related baselines within their region. Let wrapped/localized text grow naturally, never crop or shrink it to force a page-wide baseline grid. De-emphasize through hierarchy, not illegibility.
- Check computed sizes and rendered readability separately. Browser zoom is not a reason to reduce font sizes; preserve reading and operation when text is enlarged.

## Required Workflow

1. **Inspect:** identify the requested task, available content, existing tokens, layout owners, components, sibling pages, and actual state/data sources. Preserve unaffected work.
2. **Decide:** use the ten Swiss grid principles to write or update one compact design contract covering the task/primary action, content hierarchy/type scale, layout scopes and responsive behavior, reuse/variant map, and interaction/state/motion behavior. Reuse existing decisions; document only affected roles for a small edit, not nine separate planning documents.
3. **Build:** fix shared foundations first, then compose the page. Implement a complete primary task path, including applicable loading, empty, error, success, and recovery states, before decorative polish.
4. **Verify:** review the ten Swiss grid principles against real rendered UI, including sibling consumers of changed shared contracts. Inspect captions, pagination, dividers, and validation as carefully as headlines. Fix root causes and rerun failed checks rather than accumulating per-instance patches.
5. **Report:** identify changed foundations, verified widths/states/task paths, remaining violations, and unavailable checks. Report a violation as component/selector + broken rule + observable evidence + smallest shared correction. Never claim a test ran when it did not.

Use existing grid generators/auditors when actually present; otherwise use shared CSS, browser layout tools, and DOM measurements. Do not invent tool dependencies or build a new auditing framework for a small UI change.

## Interaction Baseline

- Use links for navigation and buttons for actions. Preserve native behavior, visible focus, associated labels, and logical keyboard order; never use a clickable generic container when a native control fits.
- Make every visible control work or clearly explain its unavailability. Bind feedback to actual outcomes; never show successful saving after a timer while ignoring the result.
- Keep familiar actions discoverable, labels specific, and essential controls usable without hover. Do not use placeholders as labels or tooltips as the sole explanation of required input.
- Preserve entered values on validation/network failure; explain the problem at the relevant field or action and provide recovery. Prevent accidental duplicate submissions; use confirmation or undo proportionate to destructive risk, not for every routine action.
- Preserve filters, selection, scroll, and navigation context where the task expects continuity. Support browser Back for navigational changes and avoid unexpected resets on resize or refresh of data.
- Give transient surfaces correct semantics/names and trigger relationships such as `aria-expanded`/`aria-controls` when applicable. Define initial focus, keyboard behavior, Escape, outside interaction, and restoration according to the pattern, not one generic overlay handler.
- Trap focus and make the background inert only for modal surfaces; manage their scrolling. Keep non-modal popovers and disclosures non-modal. Restore focus to the trigger or a logical successor if the trigger no longer exists.
- Keep overlays and focus targets within the usable viewport/safe area, including with the virtual keyboard open. Allow anchor-aware flipping or shifting near edges; preserve the trigger relationship rather than clipping to obey a grid line.
- Keep primary touch targets at least 44 by 44 CSS pixels, or provide an equivalent non-overlapping hit area. Keep error, loading, and status feedback understandable without color and announce important updates without flooding assistive technology.
- Preserve table header relationships. Choose a shared narrow-screen strategy: prioritized columns, local horizontal scrolling, or an equivalent representation that retains required comparison and actions.

## Verification Gate

Verify in a rendered browser when available; a successful build or attractive screenshot alone is insufficient.

- **Widths:** test 375x812, 768x1024, 1024x768, 1440x1000, and 1920x1080 unless the product defines a stricter matrix. Also test intermediate widths, both sides of changed breakpoints, 200% enlargement, and reflow at 320 CSS pixels wide. Confine unavoidable two-dimensional scrolling to the relevant table/canvas, not the page.
- **Content/states:** exercise long and localized labels, long unbroken values, missing content, loading, empty, error, populated, disabled, selected, and changing values. Check that intended shared edges and spacing remain consistent without clipped text or unexplained jumps.
- **Tasks/interactions:** complete the primary task with keyboard and touch/pointer; test errors/retry, browser Back, focus-visible, open/close, rapid reversal, and reduced motion where relevant. Check the affected sibling pages, not just the edited instance.
- **Evidence:** use screenshots for appearance, DOM geometry/computed styles for alignment/type, interaction traces for behavior, and accessibility checks for semantics/contrast. Use an overlay derived from the actual layout when auditing grids; a screenshot alone does not verify behavior.

Do not mark the UI complete while a required rule fails. Separate **verified**, **failed**, and **not tested** checks; when execution tools are unavailable, deliver the implementation and a clearly unverified checklist rather than claiming a pass.
