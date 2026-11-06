# Submission readiness

Status: **prepared but not submission-ready**. Package and public endpoint checked November 6, 2026. Portal observations below are historical.

## Complete

- The setup skill verifies the MCP connection and gives host-specific recovery instructions. With the revised skill loaded explicitly, Codex registered the anonymous endpoint in a fresh session. A second session reused the entry and successfully called list_states and show_status. Automatic setup launch and native ChatGPT card rendering remain unverified.
- MCP endpoint updated to `https://openai.cicada.guide/mcp`; live protocol checks passed against this address. Listing URLs remain separate from the connection endpoint.
- Listing website and privacy policy now use `https://cicada.guide` and `https://cicada.guide/privacy-policy`, as selected by the creator. Both destinations returned HTTP 200 and their content was inspected. This does not establish that the general site's policy covers every connector-specific data practice. The existing portal draft has not been updated with these URL changes.
- Portable package with five skills (setup and four research workflows), compact shared procedures, anonymous connection, licensing, and 512px icons using the creator-supplied blue and pink logo for both themes. Artwork proportions and transparency are preserved. See the small-size [preview](evidence/icons-48px.png).
- Listing, three default prompts, five positive and three negative review cases, release notes, U.S. distribution and no-commerce declaration are stored in `plugin.json`.
- Live initialization, annotations and all five resources passed. Real bill search/record/dossier/documents/text/rollcalls/breakdown and person/contact/vote/card payload calls passed, including a clarification payload from the newly advertised `show_status` tool. A nonexistent bill returned an empty result. These checks exercise the protocol.
- Public connector landing/privacy pages, Featurebase help center, and existing terms were inspected. The creator confirmed those terms apply. All four URLs are in the manifest. See [page evidence](evidence/pages.json) and [MCP evidence](evidence/live.json).
- Live schemas omit analytics arguments. Skills send them only when advertised. No credentials or private account information are packaged.

The installed skill uses live tool definitions. The [18-tool schema snapshot](tool-reference.md) supports contributor contract checks.

The compact guidance passed five directed Codex CLI cases covering exact lookup, a complete dossier brief, roll-call pagination, invalid-offset recovery, and person-vote cursor continuation. The lookup loaded no supporting references, and the brief loaded only its bill procedure. These checks used the public MCP server with explicit skill loading. Native ChatGPT rendering remains unverified.

The public MCP endpoint exposes show_status and its card resource. Live checks returned clarification, unsupported, information, and error payloads. The revised package still needs to pass the card-only behavior checks and native ChatGPT rendering.

## Remaining gates

The installed Codex package appended a written brief after calling the bill card for Alabama HB591. The source skills now require card-only output. Two fresh isolated Codex runs called the bill card and left the final reply empty, but both emitted a skill-use announcement before reading the skill. Moving the card-only rule into discovery metadata did not suppress that announcement. The grader now checks all assistant messages. Native rendering and a turn with no assistant text remain unverified.

The November 6 ChatGPT rehearsal using the visible `cicada.guide` connection failed with a generic internal error, including on retry. The app settings did not expose the endpoint or installed package version. Direct anonymous requests to the packaged endpoint succeeded with the same three diagnostic argument sets for `list_states`, `list_sessions`, and `search_bills`. A filtered Worker tail did not capture a corresponding retry or the direct control, so request arrival remains unverified.

The November 6 protocol check found that the live bill workspace still declares `http://localhost:8787` as its UI domain and a CSP resource origin. The portal scan needs a fresh check after the server-side configuration is addressed. The public listing pages responded without login. The homepage describes the broader Cicada service and a different MCP endpoint, and the general privacy page leaves connector-specific coverage unverified.

1. **ChatGPT verification:** the creator manually uploaded a new 0.1.0 draft in the cicada.bot organization, distinct from the older draft first inspected. Imported trigger descriptions and the openai.cicada.guide/mcp endpoint match the revised package. Anonymous connection and discovery of all 17 tools completed. The portal scan flags show_bill's template CSP as missing or too broad; domain verification and review information remain incomplete, and skill checks were still running at the last observation. The draft is not submitted or published. ChatGPT's installed-plugin search found no Cicada match, and the inspected draft menus offered no preview/install route. Exact-package rendering and the native [review cases](review-cases.md) remain unverified. See `.plugin-eval/pagination-recovery.md` and [scan screenshot](evidence/portal-csp-finding.jpg).
2. **Demo recording:** follow the [recording script](demo.md), record real behavior, host it at a reviewer-accessible URL, verify playback, add `review.demo_recording_url`, and rebuild. A script is not a recording.
3. **Publisher verification:** the creator reconfirmed Forrest Satterfield as the intended publisher. Verification in the intended submission organization remains unchecked. The current connector landing page does not identify that publisher; the [landing draft](pages/website.md) proposes clarification for owner review and hosting. The relationship to Cicada Bot, LLC attribution remains unanswered.
4. **Policy/support maintenance:** the connector privacy page's GitHub support link returns 404 anonymously. The manifest uses the working help center. Prepare its plugin-specific article and correct the privacy link outside this repository. Published retention claims (analytics up to seven years; logs a few days) require operator confirmation; code does not establish operational retention. Drafts are not published policies.
5. **Portal-only requirements:** complete required scans, legal attestations, and saved-version connection/review checks if upload is later authorized. Source checks and a valid archive cannot satisfy these steps.

## Host checklist — not run

Promptfoo now evaluates all eight cases through the installed local plugin plus an explicit MCP connection bridge. The native-package-only pilot failed to expose the bundled MCP tools and is retained. The connected run initially graded 7/8; correcting a refusal-contraction grader bug and replaying identical traces produced 8/8 automated checks without new model calls. See [Promptfoo results](../../promptfoo-evals/openai/results.md) for scope, artifacts, token counts and limitations. These results do not mark native ChatGPT rendering or the native-package connection as verified.

An independent Codex CLI compatibility benchmark executed all eight manifest cases using unchanged skill copies. Model access was resolved by selecting the desktop runtime instead of the older PATH executable. Seven cases matched the declared tool checklist initially; the bill brief used dossier roll calls instead of get_rollcalls, then matched the checklist on recheck. The original suite made 31 schema-valid MCP calls without reported tool errors; all three boundary cases made no MCP calls. Actual usage and timing are recorded in `.plugin-eval/results.md`. These results do not establish native plugin installation or ChatGPT rendering; the ChatGPT review-case status remains Not run.

After the trigger, selective-reference and conditional dossier-checklist changes in ADR-004, fresh lookup and bill-brief CLI cases passed. The lookup loaded no supporting references; the brief loaded only the bill procedure. The complete, warning-free five-roll-call dossier was used without a duplicate get_rollcalls call. All 12 calls were schema-valid with no reported MCP errors. See `.plugin-eval/refinement.md`. At that targeted run, pagination and warning/recovery paths had not been exercised; the additional checks below record subsequent coverage. Old benchmark outcomes are unchanged.

Additional CLI checks passed for standalone roll-call pagination, deliberately invalid argument recovery, and person-vote cursor continuation. They made 28 calls including one intentionally schema-invalid offset request. Truncated/failed dossier and persistent-warning scenarios remain unrun; see `.plugin-eval/pagination-recovery.md` for exact coverage. Native ChatGPT rendering is still unverified.

For bill results, bill workspace, legislator record, and official card, verify loading, unavailable records, resizing, links and both themes. Exercise results/vote pagination, filters, follow-up messages, PDF viewing/navigation, error recovery and card-to-tool calls. Confirm complete written answers without UI. Test ambiguous names, unavailable text, unsupported jurisdictions, ranking requests and explicit overrides of defaults. Record Passed/Failed/Blocked/Not run with actual evidence.

## Packaging notes

The downloaded portable MCP base schema does not model server extensions, but the [official OpenAI packaging guide](https://developers.openai.com/plugins/build/plugins#configure-mcp-authentication) explicitly documents them. The package declares `extensions.com.openai.auth.type: "none"`. Validation checks that project-specific extension separately and validates the transport projection against the unchanged base schema. No credential headers are present. Anonymous live access passed. Vendored schemas are excluded from the ZIP; portal validation has not run.

`npm run package` writes inspected inventory and SHA-256 to `dist/archive-report.json`. Machine-detectable gaps and manual gates remain separate. No upload, submission, publication, server edit or deployment was performed.
