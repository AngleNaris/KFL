# Evidence-led design review

Use this within the existing G2 image review and post-implementation verification. It adds no approval stage, scanner, task identifier or ledger. Record findings in the task's existing design/evidence section.

1. **Judge before reporting.** Inspect the actual image or rendered page, relevant source and approved intent. For each candidate record its location/evidence, effect on reading or completing the task, and disposition: confirmed issue, intentional choice, or false positive. A pattern name alone is not evidence of harm. The assistant filters false positives and groups findings before asking the user about a consequential unresolved tradeoff.
2. **Fix the shared cause.** Group confirmed issues by the responsible token, component or content rule. Propose the smallest common correction and identify affected consumers. Avoid unrelated restyling and isolated overrides that hide the cause.
3. **Preserve approved choices.** Gradients, rounded corners, colors and decoration in an approved design remain valid choices. Carry forward the decision and its scope so later reviews do not reopen it without new evidence or changed requirements. A real conflict follows the existing realignment/G1/G2 route.
4. **Review the result.** Before G2 approval, inspect the actual generated image and its supplementary contract. After implementation, compare the same fixtures/viewports against that approved package and inspect sibling pages affected by shared changes. Record visual findings separately from keyboard, task-flow and persistence evidence. No scan result proves visual quality or working behavior.

## Example acceptance cases

| Observation | Disposition and next step |
| --- | --- |
| Approved rounded gradient hero remains legible | Intentional choice; preserve its approval reference. |
| Shared muted text disappears on two pages | Confirmed issue; correct the shared contrast rule, review both pages and check their affected controls. |
| Source contains an unused decorative class | False positive for the rendered page; do not report a visible defect without evidence. |
| Image looks correct but saving never persists | Separate behavior/data failure; visual approval does not close it. |

These are hypothetical review examples, not scan output or executed acceptance results. Source context and license declaration are in [THIRD_PARTY.md](../THIRD_PARTY.md).
