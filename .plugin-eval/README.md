# Cicada Guide compatibility benchmark

Run November 2, 2026. **Model access resolved, pilot verified, all eight cases executed.** See [results](results.md) for measured usage, reviewed outcomes, and the bill-brief recheck.

After trigger/reference/checklist changes, two fresh targeted cases passed with selective reference reads and complete dossier evidence. See [refinement results](refinement.md). The original eight-case results are preserved under their original criteria. The runner accepts `--config <path> --name <run-name>` for separate experiments.

The Plugin Eval harness does not recognize this portable plugin manifest. It supports `.codex-plugin/plugin.json` bundles or individual skills. This setup targets an unchanged copy of `get-legislation` and exposes all four unchanged skills in an isolated workspace. It configures the anonymous endpoint from `mcp.json`. It does not install a ChatGPT plugin or validate card rendering.

## Scenarios and success criteria

`benchmark.json` contains the five positive and three negative review cases from the package, including exact expected tools and outcomes. The bill brief is the primary end-to-end task. The answer artifact is `answer.md`, also requested in the final response. Refusals cover Congress, legislator rankings/predictions, and address lookup. Each case starts a fresh CLI run; the default override is within one request, not a cross-turn test.

The harness does not automatically grade `successChecklist`. Review tool traces, arguments, source-backed answers, pagination and refusals manually. Process completion is not a semantic pass. CLI output cannot prove card rendering. The current wrapped prompts explicitly direct skill loading; this does not test implicit skill discovery.

## Initial diagnosis and resolution

The older PATH CLI (`0.142.5`) rejected both the harness default and configured model before inference. The desktop runtime at `CODEX_APP_RUNTIME_CLI_PATH` (`0.166.0-alpha.5.1`) successfully ran `gpt-6.1-sol`. No account or global configuration change was needed. A minimal-configuration diagnostic produced an unhelpful no-tools response and was excluded. The final `pilot-result.json` and `pilot-result-verified.json` record a successful run through the reusable runner, with the answer retained. See [results](results.md).

The harness incorrectly classifies startup error objects as usage with zero tokens. Do not report those zeroes as measured consumption or load failed startup attempts as observed-usage samples. The full-suite result contains actual usage counters; `inspect-run.mjs` reads only real turn.completed usage and nested MCP events. ChatGPT review cases remain Not run despite completed Codex compatibility tests.

## Repeatable workflow

### First-run Codex setup benchmark

Run the setup benchmark against one checkout at a time. Give each run a separate, disposable Codex home under the OS temporary directory. Authenticate that profile before running and start without a `config.toml`. The runner uses the desktop runtime when `CODEX_APP_RUNTIME_CLI_PATH` is set.

```powershell
node .plugin-eval/setup-run.mjs --source <checkout> --eval-home <disposable-profile> --model gpt-6.1-sol
```

The first session explicitly loads the selected checkout's setup skill and must persist one enabled anonymous MCP entry. The second session starts with the same saved configuration and must call `list_states` and `show_status` without changing registrations. Use the same model and CLI for both arms. Each run prints its artifact directory, which contains the copied skills, raw JSONL traces, last assistant messages, and usage on success. Keep the artifacts local. Runner failures such as missing model access or missing terminal usage do not count as behavior results.

This test covers Codex setup and reuse through explicit skill loading. Automatic plugin setup launch and ChatGPT card rendering require separate host tests.

From the repository root in PowerShell:

```powershell
.plugin-eval/run.ps1 -Pilot
.plugin-eval/run.ps1
```

The runner selects the verified desktop executable and captures answer.md before upstream deletes its isolated workspace. It then extracts raw-event checks. Use matching configuration and recording settings for before/after comparisons. A single run per case does not establish repeatability; repeat cases before drawing performance conclusions. Archive existing result files before rerunning if comparing versions.

No simulated dry run exists in this version. Windows shell verifiers are disabled because the upstream harness hardcodes `/bin/zsh`; semantic trace review is required. Full CLI token usage includes inherited configuration and tool definitions, so it is not incremental skill cost. Isolated workspaces and temporary auth/config copies are cleaned after each normal completed or failed harness run. No uploads or server changes are part of this workflow.

Outputs and fixture copies stay outside the package allowlist. Do not add benchmark logs beneath source `skills/`. Do not commit credentials or copy authentication into benchmark fixtures.

Cleanup exception: automatic approval review rejected deletion of the diagnostic seed's authentication copy at `C:\Users\forre\AppData\Local\Temp\cicada-benchmark-seed\auth.json`. It remains outside the repository and archive; remove it manually. Normal upstream per-scenario cleanup completed.
