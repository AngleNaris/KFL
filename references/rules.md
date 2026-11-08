# KFL rules

The design and verification rules used by [SKILL.md](../SKILL.md). Cite stable IDs in the project spec, plans, findings and reports. Apply the governing order before a section's **Review findings**; a finding's requirement level and disposition determine whether it needs a change. The [spec template](spec-template.md) keeps those separate from the observed status.

Prefixes: GOV governing order · ALN alignment · REU reuse · MOT motion · MIN minimal/contextual controls · RAD corner radius · COL color · ICO icons · CON content · STA status · TYP type · SCR scrollbars · INT interaction · VER verification.

## Governing Rules

- **GOV-1 Precedence and scope:** follow the latest explicit user intent within its scope, then the approved project direction and established design system, then KFL defaults. An exception for one role does not rewrite the whole product. Resolve this precedence without asking the user to repeat an existing decision. Ask only when a consequential conflict remains unresolved by the available sources.
- **GOV-2 Design priorities:** within explicit requirements, prioritize visual quality and identity, then ordinary comprehension and task efficiency, then consistency and implementation quality, then accessibility enhancements and numerical diagnostics. Content truth, data integrity and working behavior remain required. Preserve native semantics and existing useful behavior where they do not conflict with the design; an accessibility enhancement does not automatically override the visual direction. Explicitly adopted accessibility requirements remain required within their stated scope.
- **GOV-3 Requirement levels:** distinguish `required`, `default` and `advisory` from `pass`, `fail` and `not tested`. Explicit user/project requirements, truthful content/state, working behavior, data preservation and honest verification are required. KFL's design preferences are defaults. Numerical heuristics and additional accessibility checks are advisory unless explicitly adopted. Split mixed rules into checks when necessary; a target-size diagnostic and a functional feedback check can have different levels. Follow defaults or record a concrete scoped reason grounded in the approved system, visual result or task. A measured advisory failure may be an intentional choice; do not relabel it as a passed measurement. The six anti-pattern guards are not permission to add filler: a new exception needs explicit user intent, genuine content/task meaning or faithful reuse of an approved pattern, not a generic claim that decoration looks better.
- **GOV-4 Baseline and continuity:** use the Inherit path for established systems and new pages within them. Inspect actual UI/screenshots and reuse their component, token and interaction contracts. Use Explore for a new or deliberately changed visual direction; image generation serves that exploration or an explicit request, not every continuation. Asset-only generation does not reopen the whole UI. Record baseline and decisions and preserve them across resumes; reopen only the part affected by new requirements or concrete evidence.

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

- **ALN-1** Apply these principles through scoped relationships, not a fixed Swiss visual template. Use asymmetry and contrast to support the approved composition and hierarchy without breaking reading or keyboard order. Reduction must preserve necessary labels, controls and truthful feedback. Reveal structure only when it aids the design or comprehension, not by drawing decorative grid lines everywhere.

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
- **ALN-14** Allow content to determine height. Reserve predictable loading/control space and let longer text and validation grow in flow. Remove residual gaps caused by deleted or hidden content, empty grid cells, stale minimum heights and unused wrappers. Preserve intentional whitespace that establishes hierarchy, rhythm, separation or breathing room; do not compress it merely to maximize density.

### Reflow without Losing the Task

- **ALN-15** Choose breakpoints where content stops fitting, not from device names alone. Record what wraps, stacks, collapses, or changes interaction at each breakpoint, and why. A responsive contract may change tracks and navigation, not only spans.
- **ALN-16** Preserve task priority and a coherent DOM, reading, and keyboard order. Keep essential actions available; do not solve crowding by hiding required information or shrinking text.
- **ALN-17** Let flexible children shrink with `min-inline-size: 0` where needed; wrap long content. Give inherently wide tables, code, or canvases a deliberate local scrolling strategy (styled per SCR) instead of making the entire page overflow.
- **ALN-18** Adapt reusable regions to their available width, using container queries where supported by the project. Do not make a component depend on one page's viewport assumptions.
- **ALN-19** Test between reference widths and immediately around changed breakpoints within the product's supported window range. Do not conceal failed layouts with page-wide `overflow-x: hidden`, arbitrary fixed heights, absolute-positioned content, or viewport-specific nudges.

### Verify the Correct Anchors

- **ALN-20** Use a development overlay or browser layout tools that reflect the actual container, padding, tracks and gaps. Check region edges against their owner, interiors against local edges/baselines, and floating surfaces against their anchors. Do not audit every descendant against the page grid. A one-CSS-pixel tolerance is a useful diagnostic for edges intended to coincide, not a universal gate for optical alignment, fractional rendering or an approved offset.

**Review findings:** unexplained offsets, conflicting containers, tokenless spacing patches, broken reading order, or alignment that works only at one width or content state.

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

**Review findings:** repeated responsibilities implemented independently, shared styles overridden page by page, cosmetic variants hiding different behavior, or a token/component introduced only to legitimize a one-off patch.

## Law 3: Motion Returns to Its Origin

Make motion optional and purposeful. When a transient surface animates in, define its matching return path in the same change.

- **MOT-1** For reversible opening/closing transitions, pair enter, settled, leave and interrupted states with a coherent origin, axis and spatial relationship: a right-hand drawer returns right, and a triggered menu collapses toward its trigger. Do not force task progression, a new destination or a deliberately different dismissal into a literal reversed animation.
- **MOT-2** Coordinate backdrop and content; finish exit before removal when an exit runs. Handle rapid reversal from the current state, not by replaying from the beginning or leaving stale focus/scroll locks.
- **MOT-3** Prefer transform and opacity. Return hover/active effects to resting geometry without reflow. Reserve predictable space and coordinate necessary layout changes; do not animate every state update or route by default.
- **MOT-4** Do not delay action feedback, focus management, or access to controls for decorative animation. Preserve focus and scroll continuity whether motion runs or not.
- **MOT-5** Preserve the existing reduced-motion behavior and support restrained alternatives where applicable. This accessibility enhancement follows GOV-2 unless adopted as a project requirement. Any zero-duration path must still complete functional cleanup without waiting for an animation event that will not fire.

**Review findings:** an incoherent return for a reversible transition, unintended jumps, stale cleanup, abrupt removal during a declared exit or motion required for the UI to function.

## Law 4: Minimal, Weighted, Recognizable

Keep the screen concise and visually deliberate. Remove unsolicited clutter, give information clear weight, and choose icons and visible words according to the role and the need to recognize or scan it.

- **MIN-1 Reduce:** remove unsolicited filler, duplicated content and visual scaffolding that fail the deletion test (CON-4). Keep concise labels needed for scanning, recognition and decisions; deleting words is not inherently more minimal than making their meaning clear.
- **MIN-2 No unsolicited decorative text:** do not invent eyebrows, kickers, overlines, flavor labels, slogans, decorative dates/version stamps, ornamental punctuation or duplicate wordmarks merely to fill a composition. Do not repeat a heading, date, count or name without a contextual need. Supplied meaningful copy and a faithful approved product pattern may remain; do not manufacture factual authority for it (CON-1). Number headings only for a real sequence, ordered procedure, chapter system or meaningful reference. Parallel settings and peer sections do not receive 1/2/3 just to look designed. A navigation name, group label, explanatory message or meaningful date is content, not decoration. Preserve actual product names, logos and requested brand copy; do not invent them or duplicate the page title as a logo.
- **MIN-3 Weight:** give each item one level, primary, secondary, supporting, or contextual, expressed through size, weight, color, and spacing. Make the current task and its primary action obvious; reserve the strongest treatment for what matters in that task context, not every button or section. Keep the same roles consistent across pages and states.
- **MIN-4 Group by meaning** using proximity, headings, and whitespace before adding borders, backgrounds, or nested panels. Preserve a clear reading order without decorative scaffolding.
- **MIN-5 Contextual icon/text choices:** prefer icon-only controls for familiar compact actions such as close, dismiss, search or an established toolbar operation when the surrounding context makes their meaning clear. Prefer icon plus a specific visible label for primary and business actions such as creating, submitting, purchasing or publishing; avoid defaulting these to plain-text action buttons. Keep visible names for navigation, sidebars, tabs, menu choices, dropdown values and ambiguous actions, especially where users must scan many similar destinations. Those labels may stand alone; navigation does not require an icon. Classify by semantic role, not by whether the implementation uses a `<button>`. A collapsed rail can use icons if it is an intentional supported mode with a clear route to visible names. A tooltip is supplementary and cannot replace a needed scan label. Icon-only actions keep a shared hover/focus tooltip and accessible name. Use established metaphors; when none fits, retain a clear label or the inherited pattern rather than inventing an icon or blocking routine work. Do not impose icon-only triggers on every menu or dropdown.
- **MIN-6** Verify hierarchy in loading, empty, error, populated, disabled, and selected states. Never let secondary metadata, badges, or decoration overwhelm task content.

**Review findings:** unsolicited filler or duplicate copy, numbering unordered headings, overuse of plain-text action buttons, hiding needed action/navigation names behind icons, forcing icons beside every navigation label, unclear icon-only controls, competing primary treatments or decoration that overwhelms the intended content. Apply MIN-5 by semantic role; a text navigation label is not a plain-text action-button defect.

## Corner Radius

Corner geometry belongs to the visual system. Size-tiered or concentric radii can produce a coherent result, but they are design aids rather than a universal mathematical style.

- **RAD-1** Reuse the approved shape language and shared radius tokens. Size-tiered radii, for example control < card < panel, are a useful starting pattern when larger components should appear equally rounded. Do not force larger radii on every larger box when the design deliberately uses a shared radius or a different silhouette.
- **RAD-2** Keep each component family coherent. Share its radius recipe; allow named semantic or size variants when they express a genuine design choice rather than an isolated patch.
- **RAD-3** For corners intended to be concentric, start with inner radius = max(0, outer radius - the inset between their edges). Treat this as a geometric aid and inspect the result; optical adjustments and deliberately distinct nested shapes may follow the approved contract.
- **RAD-4** Preserve square geometry when it is the contract. Pills, circles and deliberately mixed shape families are design choices; do not force them into one numerical scale.
- **RAD-5** Inspect actual corner relationships. Measurements and the surface audit's `--geometry rounded` mode can flag differences from its configured family, tier and nesting model; those differences are advisory unless that model was adopted as a project requirement.

**Review findings:** accidental corner inconsistency or a deviation from the approved shape contract. A tier, family or concentricity diagnostic alone is advisory; inspect and record intentional shapes before proposing a change.

## Color System

- **COL-1** Define semantic roles for accent/theme, supporting emphasis, background base, text, borders, focus, scrollbars, and real states. A supporting role need not introduce another vivid hue.
- **COL-2** Before a visual direction is approved, prefer low-saturation large surfaces and bounded strong color; closely related hues are a starting option for gradients. Preserve approved saturated fills and multihue gradients. Reconsider them only for a changed requirement or specific new evidence of a task/readability problem, following the existing design-review route.
- **COL-3 Contrast diagnostics:** inspect actual readability and hierarchy on the intended surfaces and supported displays. Ratios such as 4.5:1 for normal text and 3:1 for qualifying large text or essential cues are advisory reference thresholds, not a universal aesthetic acceptance gate. Do not require every pair to equal a ratio, recolor the whole palette to pass one, or flatten secondary text into the primary ink. Use a measured result to locate a real reading/task problem; adjust the affected role when needed. If the user explicitly adopts a standard, apply its actual scope and thresholds as requirements. There is no KFL requirement for a focus color to contrast 3:1 with its resting color.
- **COL-4** Reinforce hierarchy and labels rather than replacing them with color. Let state colors outrank the accent only when the urgency warrants it.

## Icon Integrity

- **ICO-1** Use genuine vector assets from the established icon family, with consistent stroke/fill treatment. Never substitute emoji, letters, punctuation, or Unicode pictograms for interface icons.
- **ICO-2** Reuse familiar product-wide metaphors. Give icon-only controls a tooltip label, an accessible name, and a stable hit area (MIN-5); hide purely decorative icons from assistive technology.

## Content Integrity

- **CON-1** Use supplied or product-declared facts. Never invent statistics, counts, testimonials, logos, prices, or generic feature claims to make a page look complete.
- **CON-2** Write necessary functional copy, but keep unsupported factual claims out of the real product. Within an already authorized design, prototype or test task, use existing fixtures or clearly identified synthetic examples when needed to inspect layout and behavior; keep them isolated from production sources. Do not request duplicate permission for those task-local fixtures, pass them off as real metrics or records, or invent them merely to fill optional sections. Using fabricated business facts in the actual product requires an explicit request and clear sample labeling.
- **CON-3** Omit optional sections without real content. Retain useful empty states for genuine product features: explain what is missing and provide a relevant next action when one exists.
- **CON-4** Apply the deletion test in context: keep content that helps users learn, scan, recognize, decide, act or understand state, and preserve user-supplied content and approved brand expression. Do not add metric strips, logo walls, feature grids, testimonial cards or decorative text (MIN-2) as filler. Show a fact where it is useful; repeat it only for a genuine context or navigation need. This test does not authorize deleting visible navigation names or meaningful whitespace.
- **CON-5** When asked to remove an element, remove it without inventing a replacement module.

## Status Integrity

- **STA-1** Require a real source and a user-relevant meaning for every status. Distinguish unknown, loading, success, degraded, offline, and error only where those states actually exist.
- **STA-2** Do not add decorative “Ready”/“Online” badges, green dots or animated telemetry. A rendered page does not prove backend connectivity, synchronization or saved changes; report those only from the relevant source. A genuine, decision-relevant status may use the established indicator pattern. Green is not a generic ornament or automatic sign that the page works.
- **STA-3** Keep live state synchronized and expose stale/unknown data honestly. A persisted record status may remain unchanged during the session and still be useful; a pulsing dot must represent genuine ongoing activity.
- **STA-4** Omit a status that adds no decision value or merely duplicates an already clear state. Do not fabricate all possible states to justify an indicator.

## Type Legibility

- **TYP-1** Reuse the approved type scale and evaluate its actual legibility, hierarchy and density. Values such as 10 CSS pixels for Latin text, 12 for CJK/mixed text and 16px-equivalent for primary reading text are diagnostic starting references, not universal floors or default targets. Explicit project type requirements take precedence.
- **TYP-2** Inspect labels, captions, badges, tables, chart annotations, placeholders, hints and legal copy in their actual role. Do not enlarge every category merely because a generic threshold flags it; fix concrete reading problems at the shared role. Do not use transforms or pseudo-elements to disguise a violation of an explicitly adopted requirement.
- **TYP-3** Use a shared type scale, relative sizing where appropriate, and sufficient line height. Establish vertical rhythm through line heights and spacing tokens; align related baselines within their region. Let wrapped/localized text grow naturally, never crop or shrink it to force a page-wide baseline grid. De-emphasize through hierarchy, not illegibility.
- **TYP-4** Check computed size and rendered readability separately. Preserve supported zoom/enlargement behavior and any explicitly agreed requirements; additional enlargement diagnostics follow GOV-2. Do not use browser zoom as an excuse for illegible default text.

## Scrollbars

Scrollbars are part of the visual and interaction system. Reuse the approved treatment and inspect the actual supported browser result.

- **SCR-1** Reuse the product's scrollbar treatment for affected scroll containers: the page, panels, tables, dialogs, drawers, menus, listboxes, code and text areas, including long-content states. For a new direction, prefer a restrained shared treatment. An approved native scrollbar or engine limitation is not by itself a design failure.
- **SCR-2** Where custom scrollbars are used, share thumb, hover, track and size tokens with the palette and geometry contract. Inspect discoverability in supported themes; the track may be transparent or match its surface. Thumb contrast ratios are advisory under COL-3. Do not force extra themes, square thumbs or a particular thickness into a product with a different approved contract.
- **SCR-3** Implement the chosen scrollbar treatment at its shared owner. Standard `scrollbar-color`/`scrollbar-width` and `::-webkit-scrollbar` parts have different engine support and shape control; choose and test the appropriate route for the supported browsers. Avoid conflicting recipes and page-private restyles. Hide a scrollbar only when the scrolling interaction remains discoverable through the approved pattern, such as visible paging controls. Use `scrollbar-gutter: stable` where it prevents an unwanted layout shift.
- **SCR-4** Inspect affected scroll containers in their scrolled state and supported themes. The surface audit's `default-scrollbar` check can report whether CSS styling is detected; it does not judge visual quality, contrast, shape or an intentional native treatment.

**Review findings:** accidental scrollbar inconsistency, unwanted layout shifts or scrolling that users cannot discover. A detected native scrollbar or advisory contrast result alone does not establish a visual defect.

## Interaction Baseline

- **INT-1** Use links for navigation and buttons for actions. Preserve native behavior, visible focus, associated labels, and logical keyboard order; never use a clickable generic container when a native control fits.
- **INT-2 Restrained focus by default:** for newly designed or owned controls, prefer a palette-compatible cue without an added outer outline or box-shadow ring. Replace an unwanted browser/library frame only after providing a visible working cue. Preserve an approved inherited focus pattern or an explicit user choice; do not rewrite it merely to satisfy this default. Permanent structural borders and vector strokes are not outline frames.
- **INT-3 Palette-compatible focus:** prefer a restrained color change on an existing border, text/icon or existing fill, consistent with the component and its neighbors. Keep border geometry stable by default; do not add a stripe, decorative underline or frame merely to make focus measurable. Preserve secondary and muted text roles instead of forcing every resting control into the main ink color. No ratio between focused and resting colors is required; assess whether focus is discernible in the actual UI and follow any explicitly adopted standard. A focusable scroll region may use its existing visible name or surface cue; do not add redundant focusable containers. Retain native keyboard semantics and inspect actual focus behavior. Use the established transition treatment without requiring animation for every cue.
- **INT-3a No newly injected stripes or decorative underlines:** do not add start-edge accent stripes to rows, cards, alerts, quotes or fields, or ornamental bars beneath headings, tabs and navigation merely for emphasis. Preserve an explicitly requested or approved inherited pattern. For new states, prefer an appropriate existing text, icon, border or surface treatment; not every selected/current state needs a background fill. Keep real links, meaningful text decoration and structural dividers such as table rules or a tab-list baseline when they serve the design. Do not impose a universal one-pixel underline limit. An inherited state indicator is not permission to scatter new decorative stripes elsewhere.
- **INT-4** Make every visible control work or clearly explain its unavailability. Bind feedback to actual outcomes; never show successful saving after a timer while ignoring the result.
- **INT-5** Keep familiar actions discoverable and their labels specific. An icon-only control (MIN-5) still operates without hover: its tooltip also appears on keyboard focus. Do not use placeholders as labels or tooltips as the sole explanation of required input.
- **INT-6** Preserve entered values on validation/network failure; explain the problem at the relevant field or action and provide recovery. Prevent accidental duplicate submissions; use confirmation or undo proportionate to destructive risk, not for every routine action.
- **INT-7** Preserve filters, selection, scroll, and navigation context where the task expects continuity. Support browser Back for navigational changes and avoid unexpected resets on resize or refresh of data.
- **INT-8** Give transient surfaces correct semantics/names and trigger relationships such as `aria-expanded`/`aria-controls` when applicable. Define initial focus, keyboard behavior, Escape, outside interaction, and restoration according to the pattern, not one generic overlay handler.
- **INT-9** Trap focus and make the background inert only for modal surfaces; manage their scrolling. Keep non-modal popovers and disclosures non-modal. Restore focus to the trigger or a logical successor if the trigger no longer exists.
- **INT-10** Keep overlays and focus targets within the visible viewport. Allow anchor-aware flipping or shifting near edges; preserve the trigger relationship rather than clipping to obey a grid line.
- **INT-11** For supported touch input, inspect actual target accuracy and separation. A 44 by 44 CSS-pixel target or equivalent hit area is a useful diagnostic reference, not a universal geometry gate; use the approved density and actual task evidence, unless an explicit requirement adopts that minimum. Keep feedback truthful and understandable. Nonvisual announcements and additional accessibility enhancements follow GOV-2 and should not introduce duplicate visible copy.
- **INT-12** Preserve table header relationships. Choose a shared narrow-screen strategy: prioritized columns, local horizontal scrolling, or an equivalent representation that retains required comparison and actions.

## Verification Gate

- **VER-1** Actual rendered visual inspection and relevant interaction checks are required for completion of changed UI, including small repairs and work on either Inherit or Explore. Capture and inspect the affected running UI: icons, visible labels, baselines, adjacent controls, alignment, whitespace, type, scrollbars and states. Exercise relevant pointer/keyboard paths, opening/closing and focus restoration; recheck affected consumers of shared changes. A build, unit test, DOM measurement, generated mockup or uninspected screenshot cannot substitute. Browser/screenshot failure leaves VIS/FLOW unverified; report the limitation rather than claiming visual completion. It does not block independent authorized work, and no design-image waiver substitutes for implementation inspection.
- **VER-2 Target-platform matrix:** derive supported devices, inputs and window range from the request and existing project contract. For a non-mobile GUI, verify representative desktop windows and affected breakpoints; do not add phone/tablet, 320/375 CSS-pixel reflow or touch requirements from a generic checklist. Preserve explicitly agreed accessibility/enlargement requirements and inspect relevant desktop DPI/zoom behavior. Ask about an unknown range only when it consequentially changes the work; otherwise record the scoped assumption. Confine unavoidable two-dimensional scrolling to the relevant table/canvas, not the page.
- **VER-3 Content/states:** exercise the content and states relevant to the change, including long/localized labels, unbroken values, missing content, loading, empty, error, populated, disabled, selected or changing values where applicable. Inspect clipping, residual gaps, unintended jumps and broken shared relationships. Do not invent absent product states to complete a checklist.
- **VER-4 Tasks/interactions:** exercise the affected task with its supported input methods, including keyboard paths where applicable. Check relevant errors/retry, browser Back, focus visibility, open/close, rapid reversal and affected sibling consumers. Preserve existing reduced-motion behavior; additional accessibility checks use the requirement levels in GOV-3. Select checks for actual changed risks rather than replaying every path for an isolated visual correction.
- **VER-5 Evidence:** use actual screenshots for appearance, DOM geometry/computed styles for measurable relationships, and interaction traces for behavior. Contrast and accessibility diagnostics have the level set by GOV-3; a numerical result alone cannot judge aesthetics or usability. Use an overlay derived from the actual layout, and existing tools when useful. Do not invent an audit framework or dependency for a small change. A tool exit code covers only that tool's configured checks, not global design acceptance.
- **VER-6** Do not claim complete verification while a required check fails or remains untested. Report verified, failed and not-tested results separately, with requirement levels and dispositions. When execution tools are unavailable, deliver the implementation and its clearly unverified checklist. A justified default deviation or advisory failure may remain an intentional choice; preserve its actual evidence instead of treating it as a mandatory redesign or a false pass.
