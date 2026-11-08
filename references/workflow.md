# KFL within the visual-spec workflow

Read the sibling [visual specification](https://github.com/AngleNaris/starcode/blob/main/develop-with-visual-spec/SPEC.md) and
[mancode adapter](https://github.com/AngleNaris/starcode/blob/main/develop-with-visual-spec/MANCODE.md) for stage authority.
KFL supplies design judgment and evidence within that workflow; it does not create another workflow engine.

| KFL stage | Starcode stage |
| --- | --- |
| 0 Load, 1 Clarify | inspect existing state; add only consequential gaps to the consolidated questions |
| 2 Spec | G1 interaction confirmation, then G2 visual baseline/change confirmation through Inherit or Explore |
| 3 Plan slices | final scoped plan using the current baseline and execution authorization |
| 4 Build, 5 Verify | execution and evidence (VIS/FLOW/DATA/ENG) |
| 6 Report | existing delivery/review report |

## One contract, one conversation

Use the existing TaskRef, requirements, policy and bound `docs/<module>.md` plan.
Keep design decisions and any image-generation records outside the runtime `delivery-record` block.
Do not copy task/session status into KFL files or extend `design-policy.json` with custom fields.
The KFL section of the bound plan records the baseline, scoped design contract, preserved choices, slices,
rule levels and checklist. Stage and authorization status stay in Starcode's own ledger; checklist evidence
points to existing acceptance items instead of restating them.

Reuse the request, existing code, answers, approvals and authorization. The coordinator asks one consolidated
set of consequential unresolved decisions; KFL's context inventory is not a requirement to ask about every
font, radius, icon and breakpoint. Apply GOV-1 through GOV-4 before interpreting individual design checks.
A justified choice and its scope remain part of the contract across resumes.

## G1: define what the user can do

Inspect actual roles, data, journeys and existing UI. Add decision-changing constraints: layout ownership,
reading order, reuse, supported windows, meaningful states and relevant keyboard/motion behavior.
Derive layout from real content and visual intent, not the kit's example column counts.
Use existing acceptance IDs; distinguish established facts, consequential questions and routine design decisions.
G1 alone does not establish the visual baseline or execution authorization. Complete or reuse the relevant
existing decisions under the governing workflow before dependent implementation; do not request an approval
already supplied by the current request or an earlier decision.

## G2: visual baseline/change confirmation

Follow [IMAGE-TO-UI.md](https://github.com/AngleNaris/starcode/blob/main/develop-with-visual-spec/IMAGE-TO-UI.md)
using the path appropriate to the work. G2 confirms what visual contract applies and what changes are authorized;
it is not a universal requirement to generate a new screen image.

### Inherit an established system

Use this path for continuing or repairing an approved UI and for new pages within its established design system.
Inspect actual UI/screenshots, sibling pages, tokens and component/state contracts. Record the source/revision,
relevant viewport, fixture/theme where available, and which relationships are being reused or changed.
A screenshot of the actual product is a baseline; a generated imitation is not needed to legitimize it.
Keep the approved density, palette, type, geometry, icon/text roles and interaction language.

Reuse current approval and authorization for changes within that contract. Clarify only a consequential gap or
new direction. Do not start image generation, replace the visual system or add a style-choice gate merely
because this is a new page, a new turn or a small correction.

### Explore a new visual direction

Use this path when the user requests a redesign, no usable direction exists, or a consequential visual choice
is deliberately being opened. Use actual generated exploration images when that is the selected or requested
way to establish the direction. Supply hierarchy, alignment scopes, meaningful content, shared components
and states; use synthetic fixtures or authorized material. Record the image ID/revision, accessible file,
generation input, viewport and fixture. Inspect the pixels: a prompt, path or inaccessible link is not evidence.

Review visual quality, identity, hierarchy, recognizability, density and reusable component consistency.
Do not claim exact DOM geometry or contrast measurements from a generated image. Keep exact copy, tokens,
responsive rules, interaction behavior and scoped choices in the supplementary contract.
Apply [design review](design-review.md), filter false positives and combine only consequential unresolved choices
with the workflow's existing confirmation. Reuse a direction already selected by the user.

### Asset generation and unavailable references

Generating or replacing one illustration, photograph or other needed asset is separate from changing the UI
baseline. Match the established art direction and authorized scope; do not regenerate the whole screen as a
prerequisite. If a required reference or tool is unavailable, mark only the dependent work unresolved and explain
what is missing. Do not silently substitute an implementation for a required design reference. An optional
image-generation tool is not a dependency of the Inherit path; continue independent authorized work.

## Implementation and evidence

Use the confirmed or inherited baseline, supplementary rules, fixtures and file scope in the final plan.
Respect the original workflow's execution authorization and reuse it when already present; KFL neither grants
missing authorization nor creates a duplicate confirmation. Implement using existing shared foundations.
Copy kit components only when they fit the design and framework; the kit is not a mandatory architecture.

Compare running screenshots with the applicable baseline under comparable fixture, viewport, font and theme.
For Inherit, this can be the actual product or sibling component reference; for Explore, the selected visual
package and its supplements. Use browser geometry for measurable relationships, real keyboard/pointer journeys
for behavior, and actual persistence/permissions for data claims.

Grid/surface CLI exit codes cover only configured measurements. They cannot approve a visual direction or prove
G3 completion, contrast quality, contextual icon choices or working behavior. Record requirement level and
measurement status separately: a failing advisory diagnostic may remain an intentional choice without becoming
a false pass. Map relevant evidence to VIS/FLOW/DATA/ENG and keep the original ledger as the completion record.

Every changed UI slice needs actual visual inspection and relevant interaction evidence, including repairs and
Inherit work. Inspect running screenshots and exercise affected paths; a missing screenshot or unperformed
interaction leaves that evidence unverified. Builds, geometry or an uninspected file cannot substitute.
Report the limitation and continue independent work; do not claim verified UI completion.

Use the supported platform/window range from the plan. Desktop-only GUIs do not inherit phone/tablet or
320/375 CSS-pixel checks. Preserve explicit accessibility/enlargement requirements without inventing scope.
Check the approved focus pattern; for new controls prefer restrained non-outline, palette-compatible cues.
Do not impose a focus/rest 3:1 ratio, a global primary-ink resting color, a selected-state fill or a universal
underline thickness. Inspect whether the actual focus and state remain understandable.
Recheck affected consumers after shared fixes and keep visual, interaction and persistence evidence distinct.

## Resume, change or repair

Read the current stage, baseline, decisions, authorization and evidence freshness. For completed G2, inspect the
recorded actual UI or selected image reference and supplements. For pending G2, continue its recorded Inherit
or Explore path; do not infer that “pending” always means “generate images.”
An inaccessible reference blocks only dependent work. Logic changes reopen affected G1; a new visual direction
reopens affected G2. Use the workflow's supported realignment/reframe protocol when a baseline truly changes;
do not silently replace it or change runtime schema.

A correction restoring the existing contract reuses its decisions and authorization. Make the smallest shared
fix, inspect affected consumers and collect fresh evidence. A justified default deviation or advisory finding
does not reopen a settled aesthetic choice without concrete new evidence or changed requirements.
