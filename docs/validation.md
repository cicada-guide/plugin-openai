# Package validation

Checked November 2, 2026.

Pre-upload recheck: source validation and all nine tests passed again. Live MCP checks and public-page inspection were rerun; their evidence files were refreshed. All four listing URLs returned HTTP 200 and their content was inspected. The connector landing page still omits the intended publisher, and the linked GitHub support destination returns HTTP 404. The manifest already points to the working help center. No package validation failure was found; the missing recording URL and manual readiness gates remain unresolved.

| Check | Result |
| --- | --- |
| Source/schema/component checks | Passed: 17 packaged files, four skills, supplied PNG source and two generated PNG theme entries |
| Node test runner | Passed: nine tests |
| Package archive | Reopened, inventory checked, every entry compared with source bytes; see `dist/archive-report.json` |
| Dependency audit | Zero reported vulnerabilities after locked development dependencies were updated |
| Public URLs | Four listing destinations inspected; evidence in [pages.json](evidence/pages.json) |
| Live MCP/data checks | Passed; dated evidence in [live.json](evidence/live.json) |
| Small icon appearance | Both 48px variants visually inspected; see [preview](evidence/icons-48px.png) |
| Packaged skills in ChatGPT | Not run: exact package is not installed under current no-upload scope |
| Four cards rendered in ChatGPT | Not run for this package |
| Hosted demo recording | Missing |
| Portal import, scans and attestations | Not performed; no upload authorized |

The checks validate the documented OpenAI anonymous-auth extension separately from the portable base schema. This is local validation, not a claim that portal ingestion has passed.

The tests cover recorded-call schema conformance, reference/schema drift, invalid voting arguments, unsafe archive paths, hidden compatibility manifests, app bindings, wrong transport, stale host instructions, broken links, malformed skill metadata, listing limits and missing cases. They do not evaluate the model's execution of skill instructions.

For a schema update: run `npm run check:live`, inspect the new evidence, then `node scripts/sync-tool-reference.mjs`. Review semantic changes in the workflows, run `npm run check` and `npm test`, and rebuild the ZIP. Never refresh a reference from failed or partial discovery.
