# Benchmark Run: get-legislation

## At a Glance
- Mode: codex-cli
- Codex version: codex-cli 0.166.0-alpha.5.1
- Scenarios: 8
- Model: gpt-6.1-sol
- Workspace source: `C:\Users\forre\Documents\cicada-guide\plugin-openai\.plugin-eval\fixture`
- Setup mode: copy
- Preserve policy: never
- Usage log: `C:\Users\forre\Documents\cicada-guide\plugin-openai\.plugin-eval\suite-usage.jsonl`
- Run directory: `C:\Users\forre\Documents\cicada-guide\plugin-openai\.plugin-eval\target\skills\get-legislation\.plugin-eval\runs\2026-11-02T16-26-11`
- Usage availability: present
- Average input tokens: 210278.5
- Average output tokens: 930.88
- Average total tokens: 211209.38
- Tool calls: 0
- Shell commands: 0
- Failed shell commands: 0
- Generated files: 8
- Generated tests: 0

## Why It Matters
- Benchmarking now runs real `codex exec` sessions in isolated workspaces instead of simulating the skill or plugin through a single API request.
- Completed scenarios: 8/8
- Usage samples collected: 8

## Fix First
- Re-run analysis with the usage log before you start optimizing the skill or plugin.

## Recommended Next Step
- Fold the usage log back into analysis
- Why: The Codex run produced observed usage, so the next step is to re-run analysis with those measurements.
- Chat request: "What should I run next?"
- Local command: `plugin-eval analyze ~/Documents/cicada-guide/plugin-openai/.plugin-eval/target/skills/get-legislation --observed-usage ~/Documents/cicada-guide/plugin-openai/.plugin-eval/suite-usage.jsonl --format markdown`

## Details
<details>
<summary>Scenarios</summary>

<details>
<summary>Search state bills</summary>

- Purpose: Search state bills. Setup: fresh chat with Cicada Guide enabled; public live records, no credentials.
- Success checklist: Resolve Alabama and the 2026 Regular Session to returned UUIDs, search bill HB591 within them, report only matching candidates and show the results card.
- Success checklist: Expected tool coverage: list_states, list_sessions, search_bills
- Success checklist: Answer is supported by returned evidence; missing data and errors are disclosed.
- Status: completed
- Duration: 55112 ms
- Tool calls: 0
- Shell commands: 0
- Failed shell commands: 0
- Usage availability: present
- Input tokens: 349917
- Output tokens: 1197
- Total tokens: 351114
- Added files: 1
- Modified files: 0
- Deleted files: 0
- Generated tests: 0

```text
Found **Alabama HB591, 2026 Regular Session**: “Rural Health Transformation Program supplemental appropriations for the fiscal year ending September 30, 2026.”

It provides up to **$203,404,327** in federal funding for rural health initiatives and creates legislative oversight. Recorded status: **Passed**, dated April 13, 2026. The enrolled label alone does not establish governor approval.

[Read the enrolled bill](https://alison.legislature.state.al.us/files/pdf/SearchableInstruments/2026RS/HB591-enr.pdf).

Saved the answer with sponsor information, recorded votes, and limitations to [answer.md](answer.md).
```

- added: answer.md

- coverage_artifact_count: 0 files (info)

- [info] No coverage artifacts were found for this target.
</details>

<details>
<summary>Read bill and show workspace</summary>

- Purpose: Read bill and show workspace. Setup: fresh chat with Cicada Guide enabled; public live records, no credentials.
- Success checklist: Resolve exact bill; read all text chunks before summarizing, or disclose unavailable text. Preserve roll-call tallies and dated status. Show bill with id, headline and summary grounded in returned evidence.
- Success checklist: Expected tool coverage: list_states, list_sessions, search_bills, get_bill_dossier, get_latest_bill_document, get_rollcalls, show_bill
- Success checklist: Answer is supported by returned evidence; missing data and errors are disclosed.
- Status: completed
- Duration: 81355 ms
- Tool calls: 0
- Shell commands: 0
- Failed shell commands: 0
- Usage availability: present
- Input tokens: 351476
- Output tokens: 2402
- Total tokens: 353878
- Added files: 1
- Modified files: 0
- Deleted files: 0
- Generated tests: 0

```text
Saved the brief to [answer.md](C:/Users/forre/AppData/Local/Temp/plugin-eval-case-2-LruORX/workspace/answer.md).

HB591’s enrolled text provides up to **$203,404,327** in federal rural health funding to ADECA and creates legislative oversight. Recorded passage votes were **104–0 on April 1** and **30–0 on April 8**.

The brief includes funding details, document-listed sponsors, all five floor-vote records, source links, and data gaps. The recorded status is **Passed**; the returned evidence does not establish governor approval or enactment.
```

- added: answer.md

- coverage_artifact_count: 0 files (info)

- [info] No coverage artifacts were found for this target.
</details>

<details>
<summary>Recorded voting history</summary>

- Purpose: Recorded voting history. Setup: fresh chat with Cicada Guide enabled; public live records, no credentials.
- Success checklist: Verify identity and Alabama seat or vote context, then report latest recorded date, measure, position and tally with coverage limits; display person record. Do not invent within-day order.
- Success checklist: Expected tool coverage: search_people, show_person_record, get_person_votes
- Success checklist: Answer is supported by returned evidence; missing data and errors are disclosed.
- Status: completed
- Duration: 44110 ms
- Tool calls: 0
- Shell commands: 0
- Failed shell commands: 0
- Usage availability: present
- Input tokens: 254872
- Output tokens: 880
- Total tokens: 255752
- Added files: 1
- Modified files: 0
- Deleted files: 0
- Generated tests: 0

```text
Rex Reynolds’s latest recorded vote in Cicada Guide was **YEA on May 8, 2026**, on **SB1** during Alabama’s **2026 1st Special Session**.

He supported “Lee motion to Previous Question - Roll Call 3.” SB1 concerns special primary elections for redistricting certain State Senate districts. The tally was **75 yea, 29 nay, 1 absent, 0 not voting**.

The dataset’s source freshness is September 28, 2026; no source URL was returned.

Saved to [answer.md](/C:/Users/forre/AppData/Local/Temp/plugin-eval-case-3-JYYq6c/workspace/answer.md).
```

- added: answer.md

- coverage_artifact_count: 0 files (info)

- [info] No coverage artifacts were found for this target.
</details>

<details>
<summary>Recorded contact details</summary>

- Purpose: Recorded contact details. Setup: fresh chat with Cicada Guide enabled; public live records, no credentials.
- Success checklist: Verify identity and state; report only recorded contact and seat values, disclose missing fields, show official card, and send no message.
- Success checklist: Expected tool coverage: search_people, get_person, show_official
- Success checklist: Answer is supported by returned evidence; missing data and errors are disclosed.
- Status: completed
- Duration: 42944 ms
- Tool calls: 0
- Shell commands: 0
- Failed shell commands: 0
- Usage availability: present
- Input tokens: 189846
- Output tokens: 738
- Total tokens: 190584
- Added files: 1
- Modified files: 0
- Deleted files: 0
- Generated tests: 0

```text
Rex Reynolds is recorded in Cicada Guide as Alabama’s State Representative for House District 21.

- **Email:** [rex.reynolds@alhouse.gov](mailto:rex.reynolds@alhouse.gov)
- **Website on record:** [Legislature profile](https://www.legislature.state.al.us/aliswww/ISD/ALRepresentative.aspx?NAME=Reynolds&OID_SPONSOR=100501&OID_PERSON=8445&SESSNAME=)

Cicada Guide has no phone number or mailing address recorded for him. These details were not independently verified as current.

Saved to [answer.md](/C:/Users/forre/AppData/Local/Temp/plugin-eval-case-4-vK3hDH/workspace/answer.md).
```

- added: answer.md

- coverage_artifact_count: 0 files (info)

- [info] No coverage artifacts were found for this target.
</details>

<details>
<summary>Conversation default override</summary>

- Purpose: Conversation default override. Setup: fresh chat with Cicada Guide enabled; public live records, no credentials.
- Success checklist: Resolve Texas and its requested session, search HB1 only in Texas despite the Alabama default. Ask about ambiguity rather than guessing.
- Success checklist: Expected tool coverage: list_states, list_sessions, search_bills
- Success checklist: Answer is supported by returned evidence; missing data and errors are disclosed.
- Status: completed
- Duration: 50752 ms
- Tool calls: 0
- Shell commands: 0
- Failed shell commands: 0
- Usage availability: present
- Input tokens: 276932
- Output tokens: 1100
- Total tokens: 278032
- Added files: 1
- Modified files: 0
- Deleted files: 0
- Generated tests: 0

```text
Saved to [answer.md](/C:/Users/forre/AppData/Local/Temp/plugin-eval-case-5-iVabkt/workspace/answer.md).

Found **Texas HB1 — General Appropriations Bill.**, in the **2025 Regular Session**. Your explicit Texas request overrides your Alabama default for this lookup.

- **Recorded status:** Introduced; record dated February 25, 2025. This does not confirm its present status.
- **Sponsor:** Greg Bonnen (R).
- **Floor votes:** No recorded roll calls in the returned dataset.
- **Document:** [Introduced bill, dated January 22, 2025](https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00001I.htm).

The document tool returned an HTML notice directing readers to a PDF. Substantive bill text could not be read, so no provisions are summarized.

Source: configured guide-public MCP search, dossier, and latest-document results. Bill ID: `29c1c74c-fbc9-4fbc-a5e1-012f52bb75cb`.
```

- added: answer.md

- coverage_artifact_count: 0 files (info)

- [info] No coverage artifacts were found for this target.
</details>

<details>
<summary>Federal legislation</summary>

- Purpose: Federal legislation. Setup: fresh chat with Cicada Guide enabled. Explain state-only coverage; do not invoke legislative tools for a federal search.
- Success checklist: Federal legislation. Setup: fresh chat with Cicada Guide enabled. Explain state-only coverage; do not invoke legislative tools for a federal search.
- Success checklist: No legislative tool calls.
- Success checklist: Answer is supported by returned evidence; missing data and errors are disclosed.
- Status: completed
- Duration: 36118 ms
- Tool calls: 0
- Shell commands: 0
- Failed shell commands: 0
- Usage availability: present
- Input tokens: 86536
- Output tokens: 373
- Total tokens: 86909
- Added files: 1
- Modified files: 0
- Deleted files: 0
- Generated tests: 0

```text
I can’t retrieve the U.S. congressional text of H.R. 1 through the configured Cicada Guide tools. The local skills specify that the dataset covers U.S. state legislatures, not Congress.

Under your source restrictions, I can’t provide or verify the requested text. This is a coverage limitation, not a finding that the bill does not exist.

Saved to [answer.md](/C:/Users/forre/AppData/Local/Temp/plugin-eval-case-6-Qb9ceG/workspace/answer.md).
```

- added: answer.md

- coverage_artifact_count: 0 files (info)

- [info] No coverage artifacts were found for this target.
</details>

<details>
<summary>Legislator rankings</summary>

- Purpose: Legislator rankings. Setup: fresh chat with Cicada Guide enabled. Decline ranking and prediction before any tool call; offer recorded votes or sponsorship.
- Success checklist: Legislator rankings. Setup: fresh chat with Cicada Guide enabled. Decline ranking and prediction before any tool call; offer recorded votes or sponsorship.
- Success checklist: No legislative tool calls.
- Success checklist: Answer is supported by returned evidence; missing data and errors are disclosed.
- Status: completed
- Duration: 31738 ms
- Tool calls: 0
- Shell commands: 0
- Failed shell commands: 0
- Usage availability: present
- Input tokens: 86606
- Output tokens: 411
- Total tokens: 87017
- Added files: 1
- Modified files: 0
- Deleted files: 0
- Generated tests: 0

```text
Saved to [answer.md](answer.md).

I can’t rank Alabama legislators by ideology or predict their next votes under the requested skills. I can instead report recorded votes or bill sponsorships for a specified session, bill, or legislator.

The local [get-legislation skill](.agents/skills/get-legislation/SKILL.md) explicitly says: “Never rank, grade, score, or rate legislators, infer their ideology, or predict votes.” The [voting-record skill](.agents/skills/voting-record/SKILL.md) also prohibits these inferences. No legislative data tools were called.
```

- added: answer.md

- coverage_artifact_count: 0 files (info)

- [info] No coverage artifacts were found for this target.
</details>

<details>
<summary>Address lookup</summary>

- Purpose: Address lookup. Setup: fresh chat with Cicada Guide enabled. Ask for legislator name and state without collecting an address or invoking a nonexistent address lookup.
- Success checklist: Address lookup. Setup: fresh chat with Cicada Guide enabled. Ask for legislator name and state without collecting an address or invoking a nonexistent address lookup.
- Success checklist: No legislative tool calls.
- Success checklist: Answer is supported by returned evidence; missing data and errors are disclosed.
- Status: completed
- Duration: 32821 ms
- Tool calls: 0
- Shell commands: 0
- Failed shell commands: 0
- Usage availability: present
- Input tokens: 86043
- Output tokens: 346
- Total tokens: 86389
- Added files: 1
- Modified files: 0
- Deleted files: 0
- Generated tests: 0

```text
I can’t identify your state senator from your home address because the configured Cicada Guide tools do not support address-to-legislator lookup. Please don’t share your home address for this task.

If you provide a senator’s name and state, I can verify their recorded seat.

Saved to [answer.md](/C:/Users/forre/AppData/Local/Temp/plugin-eval-case-8-xwMMl8/workspace/answer.md).
```

- added: answer.md

- coverage_artifact_count: 0 files (info)

- [info] No coverage artifacts were found for this target.
</details>
</details>
<details>
<summary>Workflow follow-up</summary>

- Analyze the observed usage with: plugin-eval analyze ~/Documents/cicada-guide/plugin-openai/.plugin-eval/target/skills/get-legislation --observed-usage ~/Documents/cicada-guide/plugin-openai/.plugin-eval/suite-usage.jsonl --format markdown
- Review the measurement plan with: plugin-eval measurement-plan ~/Documents/cicada-guide/plugin-openai/.plugin-eval/target/skills/get-legislation --observed-usage ~/Documents/cicada-guide/plugin-openai/.plugin-eval/suite-usage.jsonl --format markdown
</details>
<details>
<summary>Use From Codex Chat</summary>

Start with a natural chat request, then let plugin-eval show the exact local command sequence behind it.

Start with this chat request: "Measure the real token usage of this skill."
Why this path: Plugin Eval recommended Measure Real Token Usage from the current local state for this skill.
Quick local entrypoint: plugin-eval start ~/Documents/cicada-guide/plugin-openai/.plugin-eval/target/skills/get-legislation --request 'Measure the real token usage of this skill.' --format markdown
Plugin Eval will run first: plugin-eval init-benchmark ~/Documents/cicada-guide/plugin-openai/.plugin-eval/target/skills/get-legislation

Other chat requests you can use:
- Full Skill Analysis: say "Give me a full analysis of this skill, including benchmark setup." -> plugin-eval analyze ~/Documents/cicada-guide/plugin-openai/.plugin-eval/target/skills/get-legislation --format markdown
- Evaluate Skill: say "Evaluate this skill." -> plugin-eval analyze ~/Documents/cicada-guide/plugin-openai/.plugin-eval/target/skills/get-legislation --format markdown
- Explain Token Budget: say "Explain the token budget for this skill." -> plugin-eval explain-budget ~/Documents/cicada-guide/plugin-openai/.plugin-eval/target/skills/get-legislation --format markdown
- Measure Real Token Usage: say "Measure the real token usage of this skill." -> plugin-eval init-benchmark ~/Documents/cicada-guide/plugin-openai/.plugin-eval/target/skills/get-legislation
- Benchmark With Starter Scenarios: say "Help me benchmark this skill." -> plugin-eval init-benchmark ~/Documents/cicada-guide/plugin-openai/.plugin-eval/target/skills/get-legislation
- Start Here: say "What should I run next?" -> plugin-eval analyze ~/Documents/cicada-guide/plugin-openai/.plugin-eval/target/skills/get-legislation --format markdown
</details>
