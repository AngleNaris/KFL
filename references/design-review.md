# Evidence-led design review

Use this within G2 visual baseline/change confirmation and implementation verification. It adds no approval stage, scanner, task identifier or ledger. Record findings in the existing design/evidence section and apply GOV-1 through GOV-4 first.

1. **Judge before reporting.** Inspect the actual UI/image, relevant source and approved intent. Record the rule ID, scope, requirement level, observed status, evidence, visual/task effect and disposition. Separate a confirmed defect, an intentional choice, an advisory diagnostic and a false positive. A pattern name or numerical threshold alone is not evidence of a design defect. Filter false positives before raising a consequential unresolved choice.
2. **Fix the shared cause.** Group confirmed defects by the responsible token, component, layout owner or content rule. Make the smallest common correction and identify affected consumers. Do not redesign unrelated surfaces or hide a cause with isolated overrides.
3. **Preserve approved choices.** Carry forward the established palette, gradients, corners, density, type and interaction patterns with their scope. A current user instruction can reopen an affected choice; a generic KFL default cannot. Distinguish an approved inherited pattern from newly injected decoration. Do not justify new filler copy, green dots, numbering or accent bars merely by calling them aesthetic.
4. **Review the result.** On Inherit, inspect actual product/sibling screenshots and component contracts. On Explore, inspect the selected visual references and supplementary contract; inspect generated pixels if images were used. After implementation, compare the running result under relevant fixtures/windows and inspect affected consumers. Keep visual evidence separate from keyboard, task-flow and persistence evidence. A tool result cannot establish visual quality or working behavior.

## Mandatory implementation review

Changed UI cannot be marked visually and functionally verified without inspecting actual running screenshots and exercising relevant interactions, even for a small repair or work that needs no generated design image. Check adjacent icon/control scale, baselines, visible names, hierarchy, spacing and relevant focus/open/close states. Recheck affected observations after fixes. An unavailable browser or inaccessible screenshot leaves evidence unverified; builds and DOM measurements do not replace looking at the rendered result. Continue independent authorized work and state the limitation honestly.

Choose windows and inputs from the supported product contract. Do not add unrelated mobile or enlargement requirements to a desktop GUI; preserve requirements explicitly adopted by the user. Inspect the approved focus/state language. For new controls prefer restrained, palette-compatible non-outline focus; preserve an approved inherited alternative. There is no mandatory focused/resting ratio, main-ink resting color, selected-state background fill or universal underline width.

Review the recurring anti-patterns in context: unsupported or duplicate copy; irrelevant status dots; numbers on unordered headings; overuse of plain-text action buttons or loss of recognizable names through icon-only controls; residual layout gaps; and newly injected accent stripes/decorative underlines. Text navigation labels, deliberate whitespace, real statuses and meaningful numbering do not become defects merely by resembling those patterns.

Record environment, states, evidence and dispositions in the existing ledger. A failed advisory measurement can coexist with an accepted design choice; do not hide the measurement, and do not escalate it into a required redesign unless an adopted requirement or concrete visual/task problem supports that change.

## Example review cases

| Observation | Disposition and next step |
| --- | --- |
| Approved rounded gradient hero remains readable and matches the requested direction | Intentional choice; retain its baseline and scope. |
| Shared muted text is difficult to read on two actual pages | Confirmed reading problem; adjust the affected shared role and inspect both pages, preserving the rest of the hierarchy. |
| A palette pair falls below an advisory ratio, but actual content remains recognizable and the subdued role is intentional | Retain the failing measurement as an advisory finding and document the choice; do not recolor every text role. |
| A large sidebar uses unrelated icons without visible destination names | Confirmed scanning problem; restore visible names. Icons are optional alongside those names. |
| A main business action becomes a generic text-only button during a redesign | Review its role under MIN-5; prefer a clear label with an established meaningful icon, while respecting the approved system. |
| A green dot has no source or useful status meaning | Remove the invented indicator; a real relevant status would need its own source. |
| Removing a subtitle leaves an empty grid row above the main content | Repair the residual layout gap; preserve intentional separation between meaningful groups. |
| An approved tab system already uses an underline, while a new unrelated card receives a decorative side stripe | Preserve the inherited tab pattern; remove the newly injected stripe unless its scope has an explicit basis. |
| Source contains an unused decorative class | False positive for the rendered page; do not claim a visible defect without evidence. |
| The image looks correct but saving does not persist | Required behavior/data failure; visual approval does not close it. |

These are hypothetical review examples, not scan output or executed acceptance results. Source context and license declaration are in [THIRD_PARTY.md](../THIRD_PARTY.md).
