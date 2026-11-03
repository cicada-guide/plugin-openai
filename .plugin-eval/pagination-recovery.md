# Live pagination and recovery checks

Checked November 2, 2026 with gpt-6.1-sol through the desktop Codex runtime. Three explicitly directed CLI scenarios passed after raw tool traces and retained answers were reviewed. These are not native ChatGPT rendering tests.

| Scenario | Reviewed result |
| --- | --- |
| Roll-call pagination | Passed: same resolved bill ID, limit=1, offsets 0 → 1 → 2 → 3 → 4, each following next_offset; final has_more=false, all five records and individual tallies preserved. |
| Invalid-offset recovery | Passed: deliberately requested offset=999999 was rejected by the advertised maximum of 10000. The agent explained the validation error instead of interpreting it as no votes, restarted at 0, and followed offsets through 4 without repeating the failing request. |
| Person-vote cursor | Passed: people_id, limit=1, latest=false, followed returned next_cursor; next page's older date established the latest-date boundary, without offset substitution or invented intra-day order. |

The runs made 28 MCP calls, including the single deliberately invalid request. All other arguments passed recorded-schema validation. The invalid-offset case exercises argument-validation recovery, not a schema-valid offset past the dataset's last page. Full answers and raw events are retained. See [configuration](pagination-recovery.json), [harness result](pagination-recovery-result.json), and [raw-event verification](pagination-recovery-result-verified.json).

Still untested: starting pagination from a truncated dossier, failed/inconsistent dossier completeness metadata, persistent scan-cap warnings, unrelated dossier warnings, and schema-valid past-end recovery. These scenarios must not be marked passed based on standalone pagination or argument-error recovery.

## Portal and ChatGPT inspection

The creator manually uploaded a new draft after browser upload automation was blocked by Edge file-URL permissions. The new draft is distinct from the older draft inspected first. Its imported trigger descriptions and endpoint https://openai.cicada.guide/mcp match the updated package. The assistant connected the anonymous endpoint through the portal and verified discovery of all 17 tools and completion of its scan. It was not submitted or published.

Current draft: https://platform.openai.com/plugins/manage/plugin_asdk_app_6ae8c292a0208191b264599d182ccdc2?tab=mcp&version=appsub_6ae8c292a0448191b182efc4a233e0f2&mcp=server%3Aguide-public

Observed remaining requirements: domain not verified; incomplete review information; skill checks were still running at the last observation. Scan findings were listed for show_bill, search_people, show_person_record, and show_official. The inspected show_bill finding says its template CSP is missing or too broad; search_people requires further review before publication. The two remaining tool findings were not opened. A non-blocking listing finding requests removal of pricing/subscription/promotional language.

ChatGPT's installed-plugin search for Cicada returned no matches. The draft's plugin/version action menus showed deletion/download actions but no preview/install route. Consequently no exact-package cards were rendered, and native ChatGPT behavior remains unverified. No server code, hosting configuration, domain-verification files, or legal attestations were changed. See [CSP screenshot](../docs/evidence/portal-csp-finding.jpg).
