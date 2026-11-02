# KFL spec template

Copy this into `kfl-spec.md` at the project root (under Starcode, into the KFL section of the bound `docs/<module>.md` plan). Keep it compact: one spec per product or module, updated in place. Write facts, not intentions; mark unknowns as open questions instead of filling them in.

```markdown
# KFL spec: <product or module>

Mode: Build | Change | Review    Stage: <0-6>    Approved: <who, when, or "pending">

## 1. Answers (Stage 1)
| # | Item | Answer | Source |
| --- | --- | --- | --- |
| 1 | Task and primary action | | request / file / answer <date> |
| 2 | Platform and window range | | |
| 3 | Content and data (sample allowed?) | | |
| 4 | Brand assets that exist | | |
| 5 | Direction and themes | | |
| 6 | Geometry and radius tiers | | |
| 7 | Icon family and owner | | |
| 8 | Language(s) | | |
| 9 | Scope (may change / must stay) | | |
| 10 | Approval route | | |

Open questions: <none, or the list to ask>

## 2. Design contract (Stage 2)
- **Task:** <user, goal, primary action>
- **Content inventory:** every visible string or group and why it exists (MIN-2, CON-4). Anything without a reason is cut.
- **Hierarchy:** primary / secondary / supporting / contextual items (MIN-3); type scale with sizes and line heights (TYP).
- **Layout:** page frame, regions, local layouts; breakpoints and what changes at each (ALN).
- **Tokens:** color roles per theme (COL), spacing, radius tiers (RAD), focus cues (INT-3), scrollbar thumb/track/size (SCR), motion durations and curves (MOT).
- **Components:** reuse map, variants, icon per action with tooltip text (REU, MIN-5).
- **States and motion:** loading, empty, error, populated, disabled, selected; enter/leave pairs; reduced motion.

## 3. Slices (Stage 3)
| Slice | Builds | Rule IDs |
| --- | --- | --- |
| 1 Tokens | | REU-6, COL-1, RAD-1, SCR-2, SCR-3, INT-3, ... |

## 4. Checklist (Stages 2-5)
One row per rule ID in references/rules.md. Status: todo | pass | fail | not tested | N/A.
| ID | Applies | Slice | Status | Evidence |
| --- | --- | --- | --- | --- |
| ALN-1 | yes | 2 | todo | |
| MIN-2 | yes | all | todo | |
| SCR-1 | yes | 1 | todo | |
| ... | | | | |

## 5. Decision log
| Date | Question or conflict | Decision | By |
| --- | --- | --- | --- |
```

Rules for keeping it:

- Update the checklist at the end of every slice, not at the end of the task.
- *pass* needs evidence: a screenshot that was inspected, a measurement, an interaction trace or a tool result. Name it.
- *N/A* needs a reason (for example "no motion in scope").
- A changed answer or decision reopens the rows it affects.
