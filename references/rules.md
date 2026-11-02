# KFL rules

The acceptance criteria [SKILL.md](../SKILL.md) applies stage by stage. Every rule has an ID; the project spec's checklist ([template](spec-template.md)) tracks each applicable ID with its evidence. Cite IDs in plans, findings and reports. Each section ends with its **Fail** conditions.

Prefixes: ALN alignment · REU reuse · MOT motion · MIN minimal/icon-first · RAD corner radius · COL color · ICO icons · CON content · STA status · TYP type · SCR scrollbars · INT interaction · VER verification.

## Law 1: Every Element Aligns

Give every visible element an intentional alignment relationship within its owning layout. A grid organizes relationships; it does not require every visible edge to touch a page-level column.

### 10 Rules of Good Swiss Grid Design

Source: [10 Rules of Good Swiss Grid Design](https://github.com/longplay45/swiss-grid-generator/blob/cca381a7254125a6ff0144c483ae72ba8e529c17/TEN_RULES_OF_GOOD_SWISS_GRID_DESIGN.md#10-rules-of-good-swiss-grid-design), as supplied by the user. In the spirit of Dieter Rams' 10 Principles of Good Design. The ten principles below retain the supplied wording with punctuation normalized; subsequent implementation requirements are Kasidia-specific UI adaptations.

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

- **ALN-1** Apply these principles through the scoped rules below, not a fixed Swiss visual template. Treat precision as consistent relationships, not fixed-pixel positions. Use asymmetry and contrast to support hierarchy without breaking reading or keyboard order. Reduction must preserve necessary labels, controls, feedback, and accessibility. Reveal structure only when it aids comprehension, not by drawing decorative grid lines everywhere.

### Define Three Alignment Scopes

- **ALN-2 Page frame:** own outer margins, container width, and the major anchors shared by navigation, headers, and content. Reuse the frame across sibling pages.
- **ALN-3 Region layout:** own the arrangement of meaningful content groups. Align region boundaries to their parent's tracks or named areas. Share tracks, or use `subgrid`, only when contents must align across regions; otherwise use an independent local layout.
- **ALN-4 Component interior:** own padding, control geometry, baselines, and local gaps. Align text and icons to the component's content box, not automatically to the page grid. Anchor floating surfaces to their trigger or a declared viewport edge.
- **ALN-5** Do not confuse aligned boxes with identical text lengths, icon outlines, or equal-height content. Use optical corrections only as small, reusable, documented adjustments.

### Derive the Layout from Content

- **ALN-6** Inspect the existing layout and token system first. Extend it instead of installing a competing grid or spacing scale.
- **ALN-7** Identify region roles, reading order, minimum usable widths, and flexible space. Then choose the simplest structure: normal flow for a stack, Flexbox for one-dimensional groups, Grid for shared two-dimensional tracks.
- **ALN-8** Declare container width, page padding, spacing scale, row/column gaps, track definitions, and responsive rules once in their owning shared layout. Distinguish outer padding from the content box in both implementation and measurement.
- **ALN-9** Choose columns for actual sibling relationships. Use asymmetry, rhythm, and proportion to express hierarchy, not novelty. Equal units may share equal tracks; a navigation rail and workspace need different width rules. Do not force 12 columns, one global count for all nested ratios, or asymmetry onto genuinely parallel content.
- **ALN-10** Constrain prose to a readable measure for its language and typeface; do not cap a table, canvas, or entire application at prose width. Primary importance does not automatically mean a wider column.
- **ALN-11** Use content-driven patterns: a reading page may need one column; a workspace may need a bounded rail plus `minmax(0, 1fr)`; a collection may need auto-fitting tracks with a shared item minimum. Choose a pattern for its content, not to produce a fashionable tile arrangement.
- **ALN-12** Align headings, toolbars, lists, and footers that share a content edge through the same container or track, not separately tuned widths. Let full-bleed backgrounds contain an aligned inner content frame.
- **ALN-13** Use shared spacing tokens for gutters, section gaps, margins, and padding. Local and vertical gaps need not equal the page gutter. Make related items closer than unrelated groups; do not insert empty columns merely to imitate padding.
- **ALN-14** Allow content to determine height. Reserve predictable loading/control space, but let longer text and validation grow in flow rather than clipping them or reserving excessive blank space.

### Reflow without Losing the Task

- **ALN-15** Choose breakpoints where content stops fitting, not from device names alone. Record what wraps, stacks, collapses, or changes interaction at each breakpoint, and why. A responsive contract may change tracks and navigation, not only spans.
- **ALN-16** Preserve task priority and a coherent DOM, reading, and keyboard order. Keep essential actions available; do not solve crowding by hiding required information or shrinking text.
- **ALN-17** Let flexible children shrink with `min-inline-size: 0` where needed; wrap long content. Give inherently wide tables, code, or canvases a deliberate local scrolling strategy (styled per SCR) instead of making the entire page overflow.
- **ALN-18** Adapt reusable regions to their available width, using container queries where supported by the project. Do not make a component depend on one page's viewport assumptions.
- **ALN-19** Test between reference widths and immediately around changed breakpoints within the product's supported window range. Do not conceal failed layouts with page-wide `overflow-x: hidden`, arbitrary fixed heights, absolute-positioned content, or viewport-specific nudges.

### Verify the Correct Anchors

- **ALN-20** Use a development overlay or browser layout tools that reflect the actual container, padding, tracks, and gaps. Check region edges against their owning grid, interiors against local edges/baselines, and floating surfaces against their anchors. Do not audit every descendant against the page grid. Shared edges should agree within one CSS pixel, except for documented optical adjustments.

**Fail:** unexplained offsets, conflicting containers, tokenless spacing patches, broken reading order, or alignment that works only at one width or content state.

## Law 2: Similar Elements Reuse One Contract

Reuse by semantic responsibility and interaction, not merely by visual resemblance. Share behavior as well as appearance.

- **REU-1** Inventory existing primitives, component families, and page templates before adding anything. Prefer the established library and native semantics over rebuilding controls.
- **REU-2** Choose the least complex structure that supports the task: lists for sequences, tables for cross-row comparison, cards for independently meaningful entities, tabs for peer views, dialogs for bounded interruptive tasks. Do not wrap every section in a card or turn every choice into a custom dropdown.
- **REU-3** Reuse sibling-page shells, headers, filter/toolbars, content layouts, and state presentations where their responsibilities match. A repeated page is not made reusable merely by sharing its buttons.
- **REU-4** Upgrade an incomplete shared contract and migrate its affected consumers together. Express legitimate differences through named variants, slots, composition, and explicit states; do not clone a page-private version.
- **REU-5** Keep component APIs coherent. Split materially different responsibilities instead of building a universal component with unrelated boolean switches or route-name branches. Do not force reuse solely because two things currently look alike.
- **REU-6** Centralize recurring geometry, spacing, typography, color roles, borders, elevation, focus, scrollbars, and motion in semantic tokens and shared recipes. Use the project's existing styling and breakpoint mechanisms.
- **REU-7** Distinguish constraints from patches: `0`, `auto`, ratios, intrinsic sizing, and a documented component minimum are legitimate. Arbitrary per-instance pixels, repeated magic values, and one-off tokens named to disguise a nudge are not.
- **REU-8** Keep static appearance in tokens and component styles. Allow bounded data-driven values for progress, charts, and measured positioning; do not hardcode data or move static styling inline to evade the shared contract.
- **REU-9** Keep hover, focus-visible, active, selected, disabled, loading, error, keyboard, touch, responsive, and motion behavior consistent wherever applicable. Domain wrappers may bind data or behavior, but must not recreate shared visual structure.

**Fail:** repeated responsibilities implemented independently, shared styles overridden page by page, cosmetic variants hiding different behavior, or a token/component introduced only to legitimize a one-off patch.

## Law 3: Motion Returns to Its Origin

Make motion optional and purposeful. When a transient surface animates in, define its matching return path in the same change.

- **MOT-1** Pair enter, settled, leave, and interrupted states. Keep the same origin, axis, and spatial relationship for opening/closing; a right-hand drawer returns right, and a triggered menu collapses toward its trigger.
- **MOT-2** Coordinate backdrop and content; finish exit before removal when an exit runs. Handle rapid reversal from the current state, not by replaying from the beginning or leaving stale focus/scroll locks.
- **MOT-3** Prefer transform and opacity. Return hover/active effects to resting geometry without reflow. Reserve predictable space and coordinate necessary layout changes; do not animate every state update or route by default.
- **MOT-4** Do not delay action feedback, focus management, or access to controls for decorative animation. Preserve focus and scroll continuity whether motion runs or not.
- **MOT-5** Honor `prefers-reduced-motion`: remove nonessential spatial motion; use instant updates or restrained opacity when appropriate. Zero-duration paths must complete cleanup without waiting for an animation event that will not fire.

**Fail:** animated entry without a coherent exit, changed origins, abrupt removal during an active exit, motion-induced layout jumps, or motion required for the UI to function.

## Law 4: Minimal, Weighted, Icon-First

Keep every screen highly concise. Show only what the current task needs, give every piece of information a clear weight, and let an icon replace words wherever an icon can carry the meaning.

- **MIN-1 Reduce:** remove every element, label, border, panel, and line of copy that fails the deletion test (CON-4). Prefer a few strong elements over many equal ones.
- **MIN-2 No decorative text:** every visible string must name, label, explain or report something the user needs for the current task. Do not add text whose job is atmosphere: eyebrows, kickers and overlines that restate or embellish a heading ("VISUAL COLLECTION / 2026", "THE COLLECTION"); issue, volume, page or section numbers used as ornament ("Vol. 02", "01 · Foundation"); decorative dates, years, version or "source notes" stamps; flavor labels in another language or all caps on a page written in one language; ornamental punctuation or glyphs (a colored trailing period, slashes, bullets as rhythm); the same date, count or name repeated in several places; slogans and taglines without a supplied source; and wordmarks or invented logos that duplicate the page title. Test: delete the string. If no user loses information needed to act, decide or understand state, it is decorative. A real group label, a navigation item or a meaningful date shown once where it matters is not decorative. Product names, logos and taglines appear only when the product actually has them (CON-1).
- **MIN-3 Weight:** give each item one level, primary, secondary, supporting, or contextual, expressed through size, weight, color, and spacing. Make the current task and its primary action obvious; reserve the strongest treatment for what matters in that task context, not every button or section. Keep the same roles consistent across pages and states.
- **MIN-4 Group by meaning** using proximity, headings, and whitespace before adding borders, backgrounds, or nested panels. Preserve a clear reading order without decorative scaffolding.
- **MIN-5 Icons replace text:** whenever an established icon from the product's icon family can express a control, action, status, or metadata item, show the icon alone, primary actions included. Put the words in a shared tooltip that appears on hover and on keyboard focus, and keep them as the accessible name. Text remains only where no icon can carry the meaning: headings, body copy, data values, messages, and form field labels. Items inside an open menu keep their words beside their icons; the trigger that opens the menu is icon-only. Do not invent a metaphor or give one icon two meanings to satisfy this rule. When the family lacks an icon for an action with an established metaphor, add one drawn to the family's contract or ask the design owner; until then, use text.
- **MIN-6** Verify hierarchy in loading, empty, error, populated, disabled, and selected states. Never let secondary metadata, badges, or decoration overwhelm task content.

**Fail:** decorative text of any kind, visible text on a control an established icon could express, an icon-only control without its tooltip, several elements competing for the primary level, sections that fail the deletion test, or decoration that outranks task content.

## Corner Radius

Equal CSS radii do not look equal: the same radius reads sharper on a larger box. Visually consistent roundness therefore needs different CSS radii for components of different sizes.

- **RAD-1** Declare radius as a size-tiered token scale in the shared tokens, for example control < card < panel or page surface. A clearly larger tier uses a larger radius; never reuse one radius across clearly different sizes.
- **RAD-2** One component family keeps one radius per tier; its variants do not change it.
- **RAD-3** Nest rounded surfaces concentrically: inner radius = outer radius - the inset between their edges (padding plus border), floored at 0. A nested corner follows its container, not the tier scale.
- **RAD-4** Square geometry is the radius-0 case of the same rules. Pills and circles are shape choices with a fully rounded short side and stay outside the scale.
- **RAD-5** Verify rendered radii by measurement: compare families by size and nested corners against their containers, for example with the surface audit's `--geometry rounded` mode.

**Fail:** one radius reused across clearly different sizes, mixed radii within a family, or a nested corner that is not concentric with its container.

## Color System

- **COL-1** Define semantic roles for accent/theme, supporting emphasis, background base, text, borders, focus, scrollbars, and real states. A supporting role need not introduce another vivid hue.
- **COL-2** Before a visual direction is approved, prefer low-saturation large surfaces and bounded strong color; closely related hues are a starting option for gradients. Preserve approved saturated fills and multihue gradients. Reconsider them only for a changed requirement or specific new evidence of a task/readability problem, following the existing design-review route.
- **COL-3** Check contrast: at least 4.5:1 for normal text and 3:1 for qualifying large text and essential control/state cues. Do not assume a heading automatically qualifies as large text.
- **COL-4** Reinforce hierarchy and labels rather than replacing them with color. Let state colors outrank the accent only when the urgency warrants it.

## Icon Integrity

- **ICO-1** Use genuine vector assets from the established icon family, with consistent stroke/fill treatment. Never substitute emoji, letters, punctuation, or Unicode pictograms for interface icons.
- **ICO-2** Reuse familiar product-wide metaphors. Give icon-only controls a tooltip label, an accessible name, and a stable hit area (MIN-5); hide purely decorative icons from assistive technology.

## Content Integrity

- **CON-1** Use supplied or product-declared facts. Never invent statistics, counts, testimonials, logos, prices, or generic feature claims to make a page look complete.
- **CON-2** Write necessary functional copy, but keep unsupported factual claims out. Use sample data only when explicitly requested, label it as sample, and keep it separate from production sources.
- **CON-3** Omit optional sections without real content. Retain useful empty states for genuine product features: explain what is missing and provide a relevant next action when one exists.
- **CON-4** Apply the deletion test: keep a section, element or string only if it helps users learn, decide, act, or understand the current state. Do not add metric strips, logo walls, feature grids, testimonial cards or decorative text (MIN-2) as filler. Show a fact once, where it is used.
- **CON-5** When asked to remove an element, remove it without inventing a replacement module.

## Status Integrity

- **STA-1** Require a real source and a user-relevant meaning for every status. Distinguish unknown, loading, success, degraded, offline, and error only where those states actually exist.
- **STA-2** Do not display decorative "Ready"/"Online" badges or animated telemetry. A rendered page does not prove backend connectivity, synchronization, or saved changes; report those only from the relevant source.
- **STA-3** Keep live state synchronized and expose stale/unknown data honestly. A persisted record status may remain unchanged during the session and still be useful; a pulsing dot must represent genuine ongoing activity.
- **STA-4** Omit a status that adds no decision value or merely duplicates an already clear state. Do not fabricate all possible states to justify an indicator.

## Type Legibility

- **TYP-1** Preserve project floors: Latin text at least 10 CSS pixels; CJK and mixed CJK text at least 12 CSS pixels. Use at least 16px-equivalent for primary reading text. Treat floors as limits, never default targets for supporting text.
- **TYP-2** Apply floors to labels, captions, badges, tables, chart annotations, placeholders, hints, and legal copy. Do not bypass them through transforms or pseudo-element substitutions.
- **TYP-3** Use a shared type scale, relative sizing where appropriate, and sufficient line height. Establish vertical rhythm through line heights and spacing tokens; align related baselines within their region. Let wrapped/localized text grow naturally, never crop or shrink it to force a page-wide baseline grid. De-emphasize through hierarchy, not illegibility.
- **TYP-4** Check computed sizes and rendered readability separately. Browser zoom is not a reason to reduce font sizes; preserve reading and operation when text is enlarged.

## Scrollbars

Scrollbars are part of the interface; the browser's default scrollbar is never shown.

- **SCR-1** Style every scroll container: the page, side panels, tables, dialogs and drawers, menus and listboxes, code blocks and text areas, including containers that only scroll with long content.
- **SCR-2** Declare scrollbar thumb, thumb hover, track and size as shared tokens with the color and geometry tokens. The thumb reaches 3:1 against what lies behind it (COL-3); the track is usually transparent or the container's surface. Shape follows the product's geometry contract (square kit: square thumb). Both themes are covered.
- **SCR-3** Implement once, globally. The standard `scrollbar-color` (inherits; set it on the root) and `scrollbar-width` (does not inherit) set color and thickness but leave the shape to the engine: Chromium draws a rounded thumb with arrow buttons. When that shape breaks the geometry contract, as it does for square geometry, style the `::-webkit-scrollbar` parts (Chromium, Safari) and apply the standard pair only under `@supports not selector(::-webkit-scrollbar)` (Firefox), because Chromium ignores the parts once a standard property is set. Do not restyle per page. Do not hide a scrollbar (`scrollbar-width: none`) unless another visible scroll affordance exists, such as a carousel's paging controls. Use `scrollbar-gutter: stable` where a scroll lock or content change would shift the layout.
- **SCR-4** Verify in each theme by looking at every scroll container in its scrolled state, and with the surface audit's `default-scrollbar` check where available.

**Fail:** any browser-default scrollbar, per-page scrollbar styling, a thumb under 3:1, or a hidden scrollbar with no other scroll affordance.

## Interaction Baseline

- **INT-1** Use links for navigation and buttons for actions. Preserve native behavior, visible focus, associated labels, and logical keyboard order; never use a clickable generic container when a native control fits.
- **INT-2 No interaction-triggered outline frames, without exception:** pointer clicks, keyboard focus, programmatic focus, active/selected states and restored focus must never produce an outline around a control, title, panel or container. Suppress browser/library default outlines within the owned UI contract; do not recreate the same outer frame with a box-shadow ring or pseudo-element. This does not prohibit permanent structural borders or vector icon strokes.
- **INT-3 Focus cue order.** Keyboard focus must remain clearly visible through a shared non-outline cue that follows what the element already draws, in this order:
  1. **Border:** an element with a visible permanent border changes the border's color only. No state (hover, focus, active, selected, checked, invalid) changes a border's width or adds a border: width cannot transition smoothly, and a 1px step reads as a flicker or a rendering fault.
  2. **Underline:** an element already underlined, such as a link, thickens its underline on keyboard focus, and eases the thickness in with a transition; an underline does not move layout. `text-decoration-thickness` does not interpolate in Chromium, so transition a registered length (`@property`) that the thickness reads. Hover and other states change color only, never thickness.
  3. **Color:** an element with neither changes its text and icon color.

  A border or color change must reach at least 3:1 against the resting color (COL-3). Where no color can while the text stays readable, such as text at rest in a secondary or danger color: a link underlines its text instead; a button-type element never takes an underline, so give it a resting text color the color cue can shift by 3:1 (carry a danger meaning on its icon), or show an inset bar along its inner bottom edge when it has no text. Do not give a borderless button a border just to carry the cue. A container whose content keeps its own colors, such as a scroll region or tab panel, also shows the inset bar. Every cue eases in and out with a short transition on the property it changes; none jumps. Never remove focus visibility or keyboard semantics. Verify both the absence of outer frames and the presence of a usable focus cue in real interactions.
- **INT-4** Make every visible control work or clearly explain its unavailability. Bind feedback to actual outcomes; never show successful saving after a timer while ignoring the result.
- **INT-5** Keep familiar actions discoverable and their labels specific. An icon-only control (MIN-5) still operates without hover: its tooltip also appears on keyboard focus. Do not use placeholders as labels or tooltips as the sole explanation of required input.
- **INT-6** Preserve entered values on validation/network failure; explain the problem at the relevant field or action and provide recovery. Prevent accidental duplicate submissions; use confirmation or undo proportionate to destructive risk, not for every routine action.
- **INT-7** Preserve filters, selection, scroll, and navigation context where the task expects continuity. Support browser Back for navigational changes and avoid unexpected resets on resize or refresh of data.
- **INT-8** Give transient surfaces correct semantics/names and trigger relationships such as `aria-expanded`/`aria-controls` when applicable. Define initial focus, keyboard behavior, Escape, outside interaction, and restoration according to the pattern, not one generic overlay handler.
- **INT-9** Trap focus and make the background inert only for modal surfaces; manage their scrolling. Keep non-modal popovers and disclosures non-modal. Restore focus to the trigger or a logical successor if the trigger no longer exists.
- **INT-10** Keep overlays and focus targets within the visible viewport. Allow anchor-aware flipping or shifting near edges; preserve the trigger relationship rather than clipping to obey a grid line.
- **INT-11** Keep primary touch targets at least 44 by 44 CSS pixels, or provide an equivalent non-overlapping hit area. Keep error, loading, and status feedback understandable without color and announce important updates without flooding assistive technology.
- **INT-12** Preserve table header relationships. Choose a shared narrow-screen strategy: prioritized columns, local horizontal scrolling, or an equivalent representation that retains required comparison and actions.

## Verification Gate

- **VER-1** Real rendered visual inspection and real interaction checks are mandatory for every changed UI slice, including small repairs and work with an explicit design-image waiver. Capture and actually inspect the affected running UI, including icon size/baselines, adjacent controls, alignment, spacing, text, scrollbars and interaction states. Exercise the relevant pointer and keyboard paths, open/close and focus restoration; recheck affected consumers after shared changes. A build, unit test, DOM measurement, generated mockup or screenshot file that nobody inspected cannot substitute. Screenshot/browser failure leaves VIS/FLOW unverified and blocks UI completion, not permission to skip the check. A design-image waiver never waives implementation inspection.
- **VER-2 Target-platform matrix:** declare the supported devices, input methods, minimum usable window and representative normal/wide windows before checking layouts. For a non-mobile GUI, verify that desktop window range and only affected breakpoints within it; do not add redundant phone/tablet viewports, 320/375 CSS-pixel reflow or touch checks merely because a generic checklist lists them. Mobile layouts apply only to products that actually support them. Preserve explicitly agreed accessibility/enlargement requirements and verify relevant desktop DPI/zoom behavior without silently turning it into a mobile-layout mandate. If the supported range is unknown, ask (SKILL.md Stage 1); do not invent a universal minimum. Confine unavoidable two-dimensional scrolling to the relevant table/canvas, not the page.
- **VER-3 Content/states:** exercise long and localized labels, long unbroken values, missing content, loading, empty, error, populated, disabled, selected, and changing values. Check that intended shared edges and spacing remain consistent without clipped text or unexplained jumps.
- **VER-4 Tasks/interactions:** complete the primary task with keyboard and the supported pointer/touch input methods; test errors/retry, browser Back, focus-visible, open/close, rapid reversal, and reduced motion where relevant. Check the affected sibling pages, not just the edited instance.
- **VER-5 Evidence:** use screenshots for appearance, DOM geometry/computed styles for alignment/type, interaction traces for behavior, and accessibility checks for semantics/contrast. Use an overlay derived from the actual layout when auditing grids; a screenshot alone does not verify behavior. Use existing grid generators/auditors when actually present; otherwise use shared CSS, browser layout tools, and DOM measurements. Do not invent tool dependencies or build a new auditing framework for a small UI change.
- **VER-6** Do not mark the UI complete while a required rule fails. Separate **verified**, **failed**, and **not tested** checks; when execution tools are unavailable, deliver the implementation and a clearly unverified checklist rather than claiming a pass.
