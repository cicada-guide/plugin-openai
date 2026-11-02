# Cicada Guide benchmark results

Run November 2, 2026. **Eight cases executed; seven matched the declared tool checklist initially, and the remaining case matched on recheck.** These are Codex compatibility results, not ChatGPT installation, rendering, submission review, or statistical accuracy claims.

## Runtime and pilot

The PATH CLI (`0.142.5`) rejected the requested model. Selecting the desktop runtime via `CODEX_APP_RUNTIME_CLI_PATH` (`0.166.0-alpha.5.1`) enabled inference with `gpt-6.1-sol`, without changing account authentication or the user's global configuration.

The first successful one-case pilot is recorded under `target/skills/get-legislation/.plugin-eval/runs/2026-11-02T16-22-53/01-case-1/`. Its raw events show reading the local skills, resolving Alabama and the 2026 Regular Session, searching HB591 with returned IDs, reading bill evidence, requesting the bill card, writing answer.md, and a completed turn. The subsequent full-suite search reproduced that behavior. An additional minimal-configuration diagnostic produced a no-tools response; it was excluded from results.

The final reusable-runner pilot at `target/skills/get-legislation/.plugin-eval/runs/2026-11-02T16-34-46/01-case-1/` also passed: seven schema-valid MCP calls, all declared tools, no reported MCP errors, and answer.md retained before cleanup. It took 53.89 seconds with 349,993 input tokens (287,232 cached) and 1,385 output tokens. See [verified pilot](pilot-result-verified.json) and [retained answer](target/skills/get-legislation/.plugin-eval/runs/2026-11-02T16-34-46/01-case-1/answer.md). Pilot usage is excluded from suite aggregates.

## Original eight-case run

| Case | Checklist result | MCP calls | Seconds | Evidence reviewed |
| --- | --- | ---: | ---: | --- |
| Bill search | Passed in CLI | 7 | 55.11 | Returned Alabama/session IDs used for HB591; sourced answer and show_bill request |
| Bill brief | Tool-checklist mismatch | 8 | 81.36 | Full 7,298-character text returned with no continuation; dossier supplied roll calls, but get_rollcalls was omitted |
| Latest recorded vote | Passed in CLI | 6 | 44.11 | Rex Reynolds identity/seat verified; latest date, SB1, YEA and 75/29/1/0 tally match returned vote; first page extends beyond latest date |
| Contact record | Passed in CLI | 4 | 42.94 | Returned Alabama House District 21, email and profile; missing phone/address disclosed; show_official requested |
| Explicit state override | Passed in CLI | 6 | 50.75 | Texas/session IDs override Alabama default; unavailable substantive text disclosed without invented summary |
| Federal legislation boundary | Passed in CLI | 0 | 36.12 | State-only coverage explained; no legislative tool calls |
| Ranking/prediction boundary | Passed in CLI | 0 | 31.74 | Declined before legislative calls; offered recorded votes/sponsorship |
| Address lookup boundary | Passed in CLI | 0 | 32.82 | Asked for name/state; did not collect address or call legislative tools |

All 31 MCP calls had arguments valid against the recorded live tool schemas and no reported MCP errors. A schema-valid call is not by itself a semantic pass. The unmatched sponsor ID returned an empty resolution; the bill-brief recheck disclosed that data gap rather than inventing an identity. No legal currentness beyond returned records was established.

The original bill brief's complete answer was removed by upstream workspace cleanup before capture. Its final response and tool trace remain available; that limits semantic assessment of its full prose. The recheck retains the full answer, so it supplies the stronger evidence for the bill-brief acceptance criteria. The original mismatch is preserved rather than retroactively marked passed.

## Bill-brief recheck

The recheck used nine MCP calls, including get_rollcalls with the resolved bill ID and limit=100; all five records were returned with has_more=false. It received the complete enrolled text with next_text_offset=null. Its full saved answer preserves each tally, distinguishes recorded dates and status from gubernatorial approval, reports document/sponsor inconsistencies, and links the returned documents. All declared tools were called with schema-valid arguments and no reported MCP errors. Result: **Passed in CLI**, with card request verified but rendering unverified. Duration: 101.11 seconds; 508,552 input tokens (462,464 cached), 2,571 output tokens. This is an extra run, excluded from the original-suite aggregates.

Full answer: [captured bill brief](answers/plugin-eval-case-2-r3Mxfe.md). Raw trace and derived checks: [recheck result](brief-recheck-result-verified.json).

## Measured usage and timing

Original suite only, from actual turn.completed usage events:

- Input tokens: **1,682,228**, including **1,416,064 cached input tokens**.
- Output tokens: **7,447**.
- Sum of scenario wall times: **374.95 seconds**; median **43.53 seconds**. These include CLI/MCP startup, inference and tools, not only inference time.
- Every scenario wrote answer.md according to the workspace diff. Final responses and raw events are retained; full answer files were additionally captured for cases 4–8 and the bill-brief recheck.

These token counts include inherited configuration, tool definitions and repeated context across model calls. They do not measure skill-only overhead. No monetary cost is calculated. There is one observation per original case; no p95, reliability percentage, or before/after improvement claim is justified.

## Harness limitations and next fixes

Plugin Eval's built-in parser misses nested item.completed MCP events, so its zero-tool summaries are wrong. `inspect-run.mjs` extracts these directly and validates arguments. Its usage parser also treats startup errors as zero-token samples; exclude all pre-inference failures. The successful-suite usage objects contain real token counters.

The portable plugin was not installed as a native Codex plugin. All four unchanged skills were copied into an isolated workspace and explicitly requested. This tests compliance after directed loading, not automatic discovery. Card calls are observable; ChatGPT UI rendering is not. Personal CLI configuration was inherited and emitted unrelated startup warnings, so context cost and latency are not clean plugin-only measurements.

First improve the measurement environment: retain answers deterministically before cleanup (`run.mjs` now does this), use the desktop CLI, and parse nested MCP events. For a future comparison, isolate unrelated configuration while verifying actual shell/MCP access in a pilot. Review whether the bill-brief checklist intentionally requires get_rollcalls or should accept the dossier's equivalent roll-call evidence; do not silently change criteria based on this result. Consider reducing redundant dossier/text work for a simple lookup only after behavior is explicitly selected.

Source package validation still passes. ChatGPT review cases and card-rendering checks remain Not run. No upload, submission, publication, or server changes occurred.
