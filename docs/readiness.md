# Submission readiness

Status: **prepared but not submission-ready**. Checked November 2, 2026.

## Complete

- Portable package with four skills, shared procedures, live 17-tool schema reference, anonymous connection, licensing, and distinct light/dark 512px icons. Small 48px renderings were visually inspected; see [preview](evidence/icons-48px.png).
- Listing, three default prompts, five positive and three negative review cases, release notes, U.S. distribution and no-commerce declaration are stored in `plugin.json`.
- Live initialization, annotations and all four resources passed. Real bill search/record/dossier/documents/text/rollcalls/breakdown and person/contact/vote/card payload calls passed. A nonexistent bill returned an empty result. These are protocol checks, not executions of packaged skills.
- Public connector landing/privacy pages, Featurebase help center, and existing terms were inspected. The creator confirmed those terms apply. All four URLs are in the manifest. See [page evidence](evidence/pages.json) and [MCP evidence](evidence/live.json).
- Live schemas omit analytics arguments. Skills send them only when advertised. No credentials or private account information are packaged.

## Remaining gates

1. **ChatGPT verification:** the browser is signed in, but this package has not been uploaded or installed. An existing cloud plugin named Cicada Guide was visible; it was not changed or assumed equivalent. A matching development installation is needed. No new private plugin was created. The remote MCP server can be connected directly for card/tool testing without uploading the ZIP; that does not install or verify the four packaged skills. Run [review cases](review-cases.md) and the host checklist against this version.
2. **Demo recording:** follow the [recording script](demo.md), record real behavior, host it at a reviewer-accessible URL, verify playback, add `review.demo_recording_url`, and rebuild. A script is not a recording.
3. **Publisher verification:** verify Forrest Satterfield in the intended submission organization. The current connector landing page does not identify that publisher; the [landing draft](pages/website.md) proposes clarification for owner review and hosting. Confirm the relationship to Cicada Bot, LLC attribution.
4. **Policy/support maintenance:** the connector privacy page's GitHub support link returns 404 anonymously. The manifest uses the working help center. Prepare its plugin-specific article and correct the privacy link outside this repository. Published retention claims (analytics up to seven years; logs a few days) require operator confirmation; code does not establish operational retention. Drafts are not published policies.
5. **Portal-only requirements:** complete required scans, legal attestations, and saved-version connection/review checks if upload is later authorized. Source checks and a valid archive cannot satisfy these steps.

## Host checklist — not run

For bill results, bill workspace, legislator record, and official card, verify loading, unavailable records, resizing, links and both themes. Exercise results/vote pagination, filters, follow-up messages, PDF viewing/navigation, error recovery and card-to-tool calls. Confirm complete written answers without UI. Test ambiguous names, unavailable text, unsupported jurisdictions, ranking requests and explicit overrides of defaults. Record Passed/Failed/Blocked/Not run with actual evidence.

## Packaging notes

The downloaded portable MCP base schema does not model server extensions, but the [official OpenAI packaging guide](https://developers.openai.com/plugins/build/plugins#configure-mcp-authentication) explicitly documents them. The package declares `extensions.com.openai.auth.type: "none"`. Validation checks that project-specific extension separately and validates the transport projection against the unchanged base schema. No credential headers are present. Anonymous live access passed. Vendored schemas are excluded from the ZIP; portal validation has not run.

`npm run package` writes inspected inventory and SHA-256 to `dist/archive-report.json`. Machine-detectable gaps and manual gates remain separate. No upload, submission, publication, server edit or deployment was performed.
