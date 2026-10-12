# KFL within the visual-spec workflow

Read the sibling [visual specification](https://github.com/AngleNaris/starcode/blob/main/develop-with-visual-spec/SPEC.md) and
[mancode adapter](https://github.com/AngleNaris/starcode/blob/main/develop-with-visual-spec/MANCODE.md) for stage authority.
KFL is the design-quality specialist, not another workflow engine.

## One contract, one conversation

Use the existing TaskRef, requirements, policy and bound `docs/<module>.md` plan.
Keep design approvals and image-generation records outside the runtime `delivery-record` block.
Do not copy task/session status into KFL files or extend `design-policy.json` with custom fields.
The coordinating assistant asks one consolidated set of unresolved decisions. KFL must reuse answers and approved directions instead of starting another style questionnaire.

## G1: define what the user can do

Inspect actual roles, data, journeys and existing UI. Add only decision-changing design constraints:
page/region/component ownership, reading order, reuse map, responsive behavior, meaningful states,
keyboard and motion behavior. Derive layout from real content, not from the supplied kit's column counts.
Use the existing acceptance IDs; identify facts, unresolved questions and proposed constraints distinctly.
After logic approval, leave Step 4 pending. This is permission to produce design images, not to implement.

## G2: turn the contract into an image brief

Follow [IMAGE-TO-UI.md](https://github.com/AngleNaris/starcode/blob/main/develop-with-visual-spec/IMAGE-TO-UI.md).
Supply the selected visual direction, hierarchy, alignment scopes, shared components and state coverage
to an actual available image-generation tool. Use synthetic fixtures or authorized material.
Record image ID/revision, actual accessible file, generation input, viewport and fixture ID.
Inspect the pixels: a path, prompt or inaccessible link is not a visual reference.

Review task visibility, layout relationships, type/readability, content density and reusable component consistency.
Do not claim to measure DOM geometry or exact contrast from a generated image. Record exact copy, tokens,
responsive rules, focus/motion behavior and approved exceptions as the image's supplementary contract.
Resolve conflicts with approved behavior before asking for one combined visual-package approval.
Apply [design review](design-review.md) here: classify evidence before reporting, preserve intentional choices and combine only unresolved design tradeoffs with the existing G2 approval.
If the image or tool is unavailable, leave G2 blocked with a transferable brief; do not build a replacement UI.

## Implementation and evidence

After G2, revise the final plan with specific image revisions, supplementary rules, fixtures and authorized file scope,
then obtain the original workflow's execution confirmation. KFL never substitutes for that confirmation.
Implement the approved design using existing shared foundations. Copy kit components only when they fit the
approved design and framework; the sample kit is not a mandatory product architecture.

Compare rendered screenshots with the actual approved images under the same fixture, viewport, font and theme.
Use browser geometry for alignment, real keyboard/pointer journeys for behavior, and actual persistence/permissions
for data claims. Grid/surface CLI exit 0 proves only the configured measured checks, not G2 approval or G3 completion.
Map evidence to the existing VIS/FLOW/DATA/ENG acceptance items and supported verification surfaces;
keep the original delivery/review ledger as the sole completion record.
Reapply the design review after shared-token/component fixes across affected pages; distinguish visual comparison from real interaction and persistence checks.

## Resume, change or repair

On resume, read the current stage and plan, constraints and evidence freshness. If G2 is complete, also read its approved image pixels and exact supplements; if G2 is pending, continue image generation without inventing a missing-reference blocker.
An inaccessible reference blocks only its dependent UI work; continue independent authorized work.
Logic changes reopen affected G1; new visual decisions reopen affected G2. Do not silently replace approved images.
During execution, use the supported realignment/reframe protocol before changing the baseline, never direct plan revise.
A correction restoring an existing approved rule reuses its approvals: make the smallest shared fix, check affected
consumers and collect fresh evidence. Do not request new images or a style choice for an unchanged approved design.
