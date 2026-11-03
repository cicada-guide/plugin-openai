# Public submission preparation

Prepared November 2, 2026. **Not submission-ready; no upload performed.**

## Listing draft

- Name: **Cicada Guide**
- Subtitle: **Research state legislation**
- Intended publisher: **Forrest Satterfield**
- Category: **Education & Research**
- Countries: **United States** (`US`)
- Commerce: **No payments or purchases**
- Version: **0.1.0**
- Website: https://cicada.guide
- Privacy policy: https://cicada.guide/privacy-policy

Research U.S. state legislation with sourced bill briefs, recorded voting histories, and legislator contact details. Explore bill results, bill workspaces, voting records, and contact cards. Read-only public records. Coverage and freshness depend on the available records. Does not cover Congress or identify representatives by address, rank legislators, predict votes, or contact officials.

Release notes: Initial ChatGPT package: guided onboarding, four state legislative research workflows, an anonymous MCP connection, and light/dark logo entries.

These values, three example prompts, five positive cases and three negative cases are included in the package manifest. No translations are declared. [Review cases](review-cases.md) remain **Not run** in ChatGPT; successful protocol checks do not change that status.

## Reviewer access

The MCP endpoint is public and anonymous. No service account, API key, payment, or reviewer credential is required. Host access and selecting/installing the exact plugin are still needed. Never add personal ChatGPT credentials to the ZIP. A different cloud plugin with the same name is not a substitute for verifying this version.

## Next preparation step: record the demo

Follow the [walkthrough](demo.md) using this exact package in ChatGPT. If an existing development installation is available, it can be used without creating a submission draft. Otherwise, installing the complete package requires a separate upload decision. Independently, the [official connection guide](https://developers.openai.com/plugins/deploy/connect-chatgpt) permits adding the remote MCP endpoint through ChatGPT Plugins → Add custom MCP server, selecting No authentication, and creating/installing that connection. This does not require uploading the ZIP and can verify tools/cards, but not the packaged skills. Creating an account connection changes account state and has not been performed in this preparation.

No screen-recording tool was identified in the available tool surface. Browser control and screenshots alone cannot produce the required video. The creator can start a screen recorder while the walkthrough is performed. Verify the saved video and its reviewer-accessible hosting URL before adding `extensions.com.openai.review.demo_recording_url` to `plugin.json`.

## Finalize after the recording

1. Verify playback, readable prompts/results, all four card workflows, and no exposed secrets.
2. Record actual results for the eight review cases and host interactions in [readiness](readiness.md). Do not mark failures or unrun checks as passed.
3. Add the verified recording URL, rebuild with `npm run package`, and inspect the new archive and checksum report.
4. Confirm publisher identity and policy/support follow-up items in the readiness report. A published landing page identifying the chosen publisher is still needed.
5. Only when separately authorized, proceed to portal draft upload, imported-metadata verification, connection checks, required scans and developer attestations. Submission for review and publication remain distinct actions.

The current ZIP is `dist/cicada-guide-0.1.0.zip`. Its allowlist excludes Git metadata, dependencies, credentials, app bindings, compatibility manifests and preparation documents. Keep this checklist and other review notes alongside the ZIP; they do not replace manifest metadata.
