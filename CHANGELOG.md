# Changelog

## Unreleased

The prepared manifest version is `0.1.0`. It has not been uploaded, submitted, or published.

### Added

- Packaged setup skill for first-use guidance and connection recovery, registered as the plugin onboarding entrypoint.
- Promptfoo suite for the eight review cases, an isolated installed-plugin setup with an explicit MCP connection bridge, and deterministic grader tests.
- Portable ChatGPT package connected to the existing OpenAI MCP service.
- Four state legislative research skills with shared identity, scoping, defaults, pagination, and evidence procedures.
- Light/dark SVG and PNG assets retaining Cicada attribution.
- Listing metadata, U.S. availability, no-commerce declaration, and five positive/three negative review cases.
- Package checks, contract snapshots, archive inspection, CI, and submission preparation materials.
- Architecture overview, contributor guide, documentation index, and three decision records.

### Fixed

- Moved Promptfoo setup, grader tests, recordings and starter files to the sibling promptfoo-evals/openai suite; restored the plugin README.
- Set listing website and privacy policy to cicada.guide and cicada.guide/privacy-policy as selected by the creator.
- Removed account/payment promotional wording from the public listing description.
- Clarified legislation/vote skill triggers, routed reference loading by task, and accepted complete dossier roll calls while requiring pagination or recovery for incomplete evidence.
- Replaced the previous logo with the creator-supplied blue and pink Cicada Guide artwork; regenerated square PNGs and small-size previews for both themes.
- MCP endpoint and connection checks now use `https://openai.cicada.guide/mcp`.
- Voting-history examples use the live `people_id` parameter.
- Anonymous authentication is explicitly declared using the documented OpenAI extension, with separate local validation of that extension and the portable transport schema.

### Pending verification

- Ran eight-case Codex compatibility benchmark through the desktop CLI, recorded real usage and timing, and retained the initial bill-brief checklist mismatch and successful recheck. ChatGPT checks remain separate.
- Refreshed pre-upload MCP and public-page evidence; recorded the creator's publisher confirmation and lack of a development installation.
- Exact packaged skills and all four cards in ChatGPT, hosted demo recording, publisher identity, and remaining submission gates tracked in [readiness](docs/readiness.md).
