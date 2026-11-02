# Benchmark Run: get-legislation

## At a Glance
- Mode: codex-cli
- Codex version: codex-cli 0.166.0-alpha.5.1
- Scenarios: 1
- Model: gpt-6.1-sol
- Workspace source: `C:\Users\forre\Documents\cicada-guide\plugin-openai\.plugin-eval\fixture`
- Setup mode: copy
- Preserve policy: never
- Usage log: `C:\Users\forre\Documents\cicada-guide\plugin-openai\.plugin-eval\pilot-usage.jsonl`
- Run directory: `C:\Users\forre\Documents\cicada-guide\plugin-openai\.plugin-eval\target\skills\get-legislation\.plugin-eval\runs\2026-11-02T16-24-56`
- Usage availability: present
- Average input tokens: 106572
- Average output tokens: 338
- Average total tokens: 106910
- Tool calls: 0
- Shell commands: 0
- Failed shell commands: 0
- Generated files: 0
- Generated tests: 0

## Why It Matters
- Benchmarking now runs real `codex exec` sessions in isolated workspaces instead of simulating the skill or plugin through a single API request.
- Completed scenarios: 1/1
- Usage samples collected: 1

## Fix First
- Re-run analysis with the usage log before you start optimizing the skill or plugin.

## Recommended Next Step
- Fold the usage log back into analysis
- Why: The Codex run produced observed usage, so the next step is to re-run analysis with those measurements.
- Chat request: "What should I run next?"
- Local command: `plugin-eval analyze ~/Documents/cicada-guide/plugin-openai/.plugin-eval/target/skills/get-legislation --observed-usage ~/Documents/cicada-guide/plugin-openai/.plugin-eval/pilot-usage.jsonl --format markdown`

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
- Duration: 23484 ms
- Tool calls: 0
- Shell commands: 0
- Failed shell commands: 0
- Usage availability: present
- Input tokens: 106572
- Output tokens: 338
- Total tokens: 106910
- Added files: 0
- Modified files: 0
- Deleted files: 0
- Generated tests: 0

```text
I couldn’t complete the lookup because the environment blocked access to the required local skill files. Its read-only policy also prevents saving `answer.md`.

I haven’t substituted web sources or outside knowledge. Please enable local skill-file access and workspace writes so I can follow your instructions and save the answer.
```

- coverage_artifact_count: 0 files (info)

- [info] No coverage artifacts were found for this target.
</details>
</details>
<details>
<summary>Workflow follow-up</summary>

- Analyze the observed usage with: plugin-eval analyze ~/Documents/cicada-guide/plugin-openai/.plugin-eval/target/skills/get-legislation --observed-usage ~/Documents/cicada-guide/plugin-openai/.plugin-eval/pilot-usage.jsonl --format markdown
- Review the measurement plan with: plugin-eval measurement-plan ~/Documents/cicada-guide/plugin-openai/.plugin-eval/target/skills/get-legislation --observed-usage ~/Documents/cicada-guide/plugin-openai/.plugin-eval/pilot-usage.jsonl --format markdown
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
