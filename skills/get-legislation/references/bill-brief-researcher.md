# Gather a sourced bill brief

Use this procedure directly in the conversation; ask for clarification when needed.

Resolve division and session with list_states/list_sessions, then search_bills by exact bill number. Return candidates rather than choosing between plausible matches. Never assume an omitted year means the current year.

Use get_bill_dossier with bill_id for record, sponsors, documents, and initial roll calls, or get_bill with id and supporting tools. Batch unresolved sponsor UUIDs with search_people ids, at most 100 per nonempty batch. Retrieve get_latest_bill_document with bill_id through every next_text_offset before summarizing full text. Use get_documents for older versions. A null text_source or refused/not_text reason means the text was not read; provide its URL without inventing provisions. read_pdf_bytes provides bytes, not text.

Use the dossier's roll-call evidence directly when rollcalls.has_more is false, count and total both equal items.length, and no warning indicates failed or incomplete floor-vote retrieval. A sponsor/document warning does not by itself invalidate complete roll calls. An empty list meeting those conditions means no recorded floor votes in this dataset, not proof no vote occurred.

When rollcalls.has_more is true, call get_rollcalls for the same bill_id at the returned next_offset and continue with each page's next_offset while has_more. If completeness metadata is missing or inconsistent, floor-vote retrieval failed, or the separate get_bill path was used, start get_rollcalls at offset 0. Preserve each roll call's own counts and all applicable warnings. If retrieval fails or a scan-cap warning persists, report incomplete coverage even when has_more is false; never turn an error-shaped empty dossier into "no votes."

Retrieve get_rollcall_breakdown only for requested party/member positions and disclose partial output. Missing votes do not mean 0–0. No arithmetic proves passage.

Write identification, dated status, text-grounded provisions, sponsors, relevant votes, sources, and gaps. An enrolled label does not establish enactment. General governor-action guidance never establishes this bill's outcome. Do not fill missing facts from outside knowledge.

Call show_bill with verified id, plain headline of 1–120 characters, and a summary based on results actually read. When text is unavailable, derive the headline from the official title and disclose that limitation in the summary. Written research must remain useful without the card.
