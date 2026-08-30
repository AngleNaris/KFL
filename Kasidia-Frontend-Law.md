---
name: kasidia-frontend-law
description: "Enforce Kasidia's frontend laws when designing, implementing, refactoring, or reviewing interactive UI: intentional alignment, shared component contracts, reversible motion, controlled information hierarchy, structured color roles, genuine vector icons, substance-first content with no invented data or decorative filler, status indication only for states that can actually change, and legible text held to hard typographic floors. Use for web pages, applications, dashboards, admin panels, components, responsive layouts, and UI quality reviews. Do not use for backend-only or non-visual work."
---

# Kasidia Frontend Law

Treat the three laws below as required acceptance criteria, not aesthetic suggestions.

## Law 1: Every Element Aligns

Every visible UI element must align with at least one other visible element or with an explicit layout anchor shared by other elements.

Valid alignment relationships include:

- shared left, right, top, or bottom edges
- shared text or control baselines
- shared centers
- shared CSS grid tracks
- repeated spacing rhythm inside one flex or grid group
- alignment to a container edge that also anchors another element

Requirements:

- Establish the page grid, column boundaries, baselines, and spacing scale before polishing individual elements.
- Use Grid, Flexbox, container constraints, and shared spacing tokens. Do not repair structure with unrelated pixel nudges.
- Text, icons, controls, dividers, panels, empty states, overlays, and floating tools must each have an identifiable alignment relationship.
- Preserve alignment across content states, localization, zoom, and responsive viewports.
- Reserve stable space for loading, badges, labels, validation, and changing values so state changes do not shift neighboring elements.
- Treat an element that appears intentionally offset as aligned only when the offset repeats as part of a documented pattern.

Fail the law when an element floats without an anchor, uses arbitrary margins to look approximately aligned, or becomes misaligned in another state or viewport.

## Law 2: Similar Elements Reuse One Contract

Elements with the same semantic role must use the same shared component or the same component family with explicit variants.

Similarity includes purpose, information structure, control type, or user expectation. Visual resemblance alone is not the only test.

Requirements:

- Inventory existing shared components before creating a new one.
- Upgrade the shared component when the existing contract is incomplete. Do not clone it into a page-private alternative.
- Express legitimate differences through named variants, sizes, slots, props, and states.
- Reused components must share visual language and interaction behavior for hover, focus-visible, active, selected, disabled, loading, error, keyboard, touch, and motion states.
- Centralize tokens for geometry, typography, color roles, borders, elevation, focus, and motion.
- A domain wrapper may add domain behavior or data binding, but it must not recreate the shared component's chrome.
- Similar responsive behavior must also be shared. Reuse is incomplete when desktop matches but mobile interaction diverges without a product reason.

Create a new component only when the semantic responsibility or interaction model is materially different. Record that distinction in the component API, not in page-specific CSS.

Fail the law when two similar controls have different heights, spacing, hover behavior, keyboard behavior, animation, or state feedback without an explicit semantic reason.

## Law 3: Motion Returns to Its Origin

Every animated element must leave by reversing the path and transformation used to enter. No interactive surface may abruptly appear or disappear.

Requirements:

- Define enter and leave states together before implementation.
- Preserve the same origin, axis, distance, scale reference, and transform origin in both directions.
- Reverse timing curves where appropriate so the exit reads as the return leg of the same motion.
- Do not unmount an element until its leave transition completes.
- A panel entering from the right exits to the right. A menu expanding from its trigger collapses into that trigger. A dialog scaling from its center returns to its center.
- Animate layout presence deliberately. Reserve space, use layout transitions, or coordinate sibling movement so surrounding content does not jump.
- Portalled overlays must retain a visible relationship with their trigger or declared screen edge.
- Pair overlay and content transitions; closing must reverse both layers coherently.
- Prefer transform and opacity for motion, while keeping stable element dimensions.
- Hover and active motion must return to the exact resting geometry and must not cause reflow.

For reduced-motion preferences, remove spatial travel while preserving lifecycle continuity with a short reversible opacity or visibility transition. When motion is explicitly disabled for accessibility, preserve layout and focus continuity so the state change does not create a spatial jump.

Fail the law when an element has only an enter animation, disappears before leave completes, exits in another direction, changes origin, or causes surrounding content to jump.

## Information Hierarchy

Every interface must divide information into intentional levels such as primary, secondary, supporting, and contextual content.

Control visual prominence with these four factors:

- element size
- font weight
- color emphasis and contrast
- distance from related and surrounding elements

Requirements:

- Match prominence to importance. Do not make supporting information so visually heavy that it competes with the user's primary task.
- Do not make important information so visually light that users can overlook it.
- Elements at the same information level must use a consistent combination of size, weight, color, and spacing.
- Use proximity to express relationships: related elements stay closer together, while distinct information groups receive a deliberate larger gap or divider.
- Reserve the strongest visual treatment for the smallest number of elements needed to establish the page's reading order.
- Verify hierarchy in populated, empty, loading, error, disabled, and selected states. State styling must not accidentally promote secondary content above primary content.

Fail the hierarchy rule when everything appears equally important, decorative content dominates task content, or essential information cannot be detected during a normal scan.

## Color System

Every interface must define and consistently apply these color roles:

1. **Accent or theme color:** the primary brand and action color. Use it for the most important actions, active states, and essential emphasis.
2. **Supporting color:** a color related to the accent color or intentionally contrasted with it. Use it for secondary emphasis, distinct product domains, or complementary states without competing with the accent.
3. **Background base:** a very low-saturation color that supports long viewing sessions and lets content hierarchy remain legible.

Requirements:

- Assign color roles as semantic tokens before styling individual elements.
- Keep large surfaces and most background regions low in saturation.
- Use high-saturation color only in bounded areas where strong emphasis is necessary.
- Do not fill large regions with high-saturation color.
- Do not create gradients from colors with strongly different hues. If a gradient is necessary, use closely related colors with controlled saturation and preserve text contrast.
- Color must reinforce hierarchy rather than replace size, weight, spacing, labels, or structure.
- Supporting and semantic state colors must not visually overpower the primary accent without an explicit critical-state reason.

Fail the color rule when color roles are ambiguous, large saturated surfaces dominate the interface, unrelated vivid colors compete, or a high-contrast multihue gradient becomes the main fill.

## Icon Integrity

- Never use emoji as interface icons.
- Never use letters, punctuation, Unicode symbols, or ordinary text as substitutes for icons.
- Icons must be genuine vector icons from an established icon library or an intentionally designed vector asset.
- Reuse the same icon component and stroke/fill style for the same semantic action.
- Give icon-only controls an accessible name and a stable hit area.
- Do not introduce a new icon metaphor when a familiar product-wide icon already exists.

Fail the icon rule when a control uses emoji or text characters as pictograms, mixes incompatible icon styles without semantic reason, or relies on an unlabeled icon whose meaning is unclear.

## Content Integrity

Every interface must be built from real, purposeful content. An empty region is always preferable to a decorative filler module, and a page that communicates less is always preferable to a page that invents.

Requirements:

- Use only copy, numbers, and media supplied by the user or declared by the product. Never fabricate statistics, counts, testimonials, customer logos, case studies, or prices to fill space.
- When a section has no real content, omit the entire section. Blank space is a correct deliverable, not an unfinished page.
- Do not introduce modules that impute information the product has not declared. Unless explicitly requested, these include stat bars (a large numeral above a small caption), "Trusted by" logo walls, testimonial cards, and icon-grid feature cards padded with generic claims.
- Apply the deletion test to every section: if removing it would not change what a visitor learns or decides, remove it.
- When asked to remove an element, perform only that subtraction. Do not backfill the freed space with a different module.
- Decorative prominence placed on invented content also violates Information Hierarchy: fabricated emphasis is worse than no emphasis.

Fail the content rule when the page presents invented metrics or endorsements, keeps a module whose removal would not change any visitor decision, or adds sections to look complete rather than to communicate.

## Status Integrity

A status indicator is a report, not a decoration. It may exist only when it reads a state the interface does not already prove, from a source that can actually change, in support of a decision the user makes differently per state.

Requirements:

- Justify every status indicator against three tests before designing it: the reported state can change while the interface is visible; the user would act differently in at least one state; the state is not already proven by the interface being rendered and interactive.
- Never render readiness or connectivity indicators for the interface itself. A visible, interactive page is its own proof of readiness; a green "Ready" or "Online" badge that no real condition can turn red must not exist.
- Do not animate indicator lights for atmosphere. A pulsing or glowing dot claims a live signal; placing it on a state that never changes fabricates telemetry.
- When a genuine state need exists, bind the indicator to a real state source, design every state it can reach — loading, nominal, degraded, offline, error — through one shared component contract, and keep the displayed state synchronized with that source.
- A status change must not rely on color alone: pair the light with text or an icon, and announce the change when the user depends on it.
- Omission is the default outcome. An indicator that fails any justification test is removed, not restyled.

Fail the status rule when an interface displays a green dot with "Ready", "Online", or another self-evident state, when an indicator cannot display a different state during real use, or when an indicator light animates without reporting anything.

## Type Legibility

Text exists to be read. Every text element must render at or above a hard minimum size, and smallness is never used as a design tool for de-emphasis, decoration, or density.

Requirements:

- Honor the typographic floors: Latin text is never smaller than 10 CSS pixels; CJK text is never smaller than 12 CSS pixels, because dense glyph strokes collapse below that size; mixed-language text containing CJK follows the 12-pixel floor.
- Treat the floors as absolute. They apply equally to captions, labels, timestamps, badges, table cells, chart annotations, placeholder text, keyboard hints, legal copy, and watermarks. There is no fine-print exemption.
- Judge the computed style, not the declared token. A text element passes only when its rendered computed font-size meets the floor at the tested viewport and zoom level.
- Do not bypass the floors with transforms or rendering tricks: `transform: scale()` on text, duplicated pseudo-element text, or condensed optical tricks that render glyphs below the floor are violations, not loopholes.
- Keep primary reading text at the platform reference of 16px or above; treat the floors as the limit for the smallest supporting text, not as a target for body copy.
- De-emphasize supporting text through weight, color role, and spacing under the Information Hierarchy rule, never by shrinking glyphs below the floors.

Fail the type rule when any text element's computed font-size falls below its floor at a verified viewport or zoom level, when transforms or optical tricks render glyphs below the floor, or when a text class claims a fine-print exemption.

## Required Workflow

### Before Design or Editing

1. Inspect the existing layout system, tokens, and component inventory.
2. Define the alignment map: page grid, major edges, baselines, repeated gaps, and responsive changes.
3. Define the component map: repeated semantic roles and the shared component responsible for each.
4. Define the motion map: trigger, origin, enter state, settled state, leave state, duration, easing, and reduced-motion behavior.
5. Define the hierarchy map: primary, secondary, supporting, and contextual information, including the size, weight, color, and spacing treatment for each level.
6. Define the color-role map: accent/theme color, supporting color, background base, and any semantic state colors.
7. Define the content map: the real copy and data available for each planned section. Mark sections without real content as omissions, not placeholders.
8. Define the status map: for every proposed status indicator, the state source it reads, every state it can display, and the user decision each state change supports. Omit indicators whose state cannot vary while the interface is visible.
9. Define the type scale: every named text role with its size, weight, and line height, with computed sizes never below the typographic floors (10px Latin, 12px CJK and mixed-language text).

Do not begin visual polishing while any of these maps is ambiguous.

### During Implementation

- Build or correct shared foundations before migrating repeated UI.
- Keep dimensions stable across interaction and data states.
- Use structured layout primitives instead of one-off positional corrections.
- Implement enter and leave transitions in the same change.
- Keep focus, pointer, keyboard, and touch behavior consistent across every instance of a component.
- Preserve the declared information hierarchy across responsive and interaction states.
- Use semantic color tokens and genuine vector icons instead of page-local colors, emoji, or text-symbol substitutes.
- Set text through shared type-scale tokens and keep computed sizes at or above the typographic floors at every viewport and zoom level.

### During Review

Review the core laws and supporting visual rules independently:

1. **Alignment audit:** identify the alignment partner or shared anchor for every visible element.
2. **Reuse audit:** group similar elements and verify that each group resolves to one component contract.
3. **Motion audit:** exercise open/close, mount/unmount, hover/rest, expand/collapse, route transitions, and responsive overlays in both directions.
4. **Hierarchy audit:** verify that primary, secondary, supporting, and contextual information have intentional and consistent prominence.
5. **Color audit:** verify semantic color roles, low-saturation large surfaces, bounded emphasis, and the absence of strongly divergent gradient fills.
6. **Icon audit:** verify that every interface icon is a genuine vector icon with a consistent component contract and accessible name where required.
7. **Content audit:** verify that every section communicates real, supplied substance; confirm there are no invented statistics, endorsements, or logos, and no filler module whose removal would not change a visitor decision.
8. **Status audit:** verify that every status indicator reads a real state source, can display more than one state during real use, and supports a user decision; confirm no self-evident readiness badge or decorative live light remains.
9. **Type audit:** sample every class of text — including captions, badges, placeholders, and chart labels — and verify computed font sizes meet the typographic floors at every verified viewport and zoom level.

Report violations with the affected component or selector, the broken law, observable evidence, and the smallest foundational correction. Prefer fixing a shared root cause over patching each occurrence.

## Interaction Baseline

The three laws apply to interaction and accessibility states as well as static appearance.

- Transient surfaces must expose the correct semantic role and accessible name.
- Triggers must expose state and relationship with `aria-expanded`, `aria-controls`, or the equivalent framework contract when applicable.
- Dialogs, Drawers, Sheets, menus, and Popovers must define initial focus, keyboard navigation, Escape behavior, outside-interaction behavior, and focus restoration.
- Modal surfaces must trap focus, make the background inert, and own scroll while open.
- Touch targets for primary interactive controls must be at least 44 by 44 CSS pixels unless an equivalent enlarged hit area is provided.
- Status, loading, validation, and error feedback must not rely on color alone and must be announced when the user needs it.
- Tables must preserve header relationships and define an intentional narrow-screen strategy such as prioritized columns, a controlled horizontal scroller, or a shared compact representation.
- Overlays must remain inside the usable viewport and safe area without breaking their declared alignment origin.

For alignment measurement, elements assigned to the same grid track, edge, or baseline should resolve within one CSS pixel at the tested viewport unless a documented optical-adjustment token applies. Repeated gaps must resolve to the same spacing token.

## Verification Gate

Use a real rendered UI when available. Unless the product defines a stricter matrix, verify at:

- `375x812` mobile
- `768x1024` tablet portrait
- `1024x768` tablet landscape
- `1440x1000` desktop
- `1920x1080` wide desktop
- `200%` zoom on the most information-dense view

Exercise long labels, changing values, loading, empty, error, populated, disabled, selected, hover, focus-visible, and open/closed transient states. Use browser screenshots, DOM geometry or computed styles, keyboard focus traces, and an accessibility scanner as evidence when tools are available.

The work does not pass until:

- every visible element has an intentional alignment relationship
- repeated semantic elements use a shared component contract
- equivalent component states look and behave consistently
- every animated surface completes both entrance and reverse exit
- closing, filtering, loading, validation, and responsive changes cause no unexplained layout jump
- keyboard focus remains visible and returns to the correct trigger after transient UI closes
- reduced-motion behavior preserves continuity without spatial travel
- information hierarchy remains clear without overemphasizing supporting content or hiding essential content
- accent, supporting, and background colors follow their declared semantic roles
- large surfaces avoid high saturation and gradients avoid strongly divergent colors
- interface icons use genuine vector assets rather than emoji or text-symbol substitutes
- every section presents real, supplied content; sections without real content are omitted rather than padded, and no statistic, testimonial, or logo has been invented
- every status indicator reports a real, varying state the interface does not already prove, and no decorative "ready" or "online" light exists
- no text element renders below the typographic floors (10px Latin, 12px CJK and mixed-language text) at any verified viewport or zoom level

If any law or supporting visual rule fails, treat the UI as unfinished even when the page builds successfully or resembles a reference screenshot.
