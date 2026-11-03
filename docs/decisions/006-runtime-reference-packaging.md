# ADR-006: Separate runtime guidance from the schema snapshot

ADR-004 established selective reference loading and live schema precedence. This decision supersedes its use of a packaged snapshot as a fallback.

Keep the shared skill and task references compact. Use live host definitions for every call. If a required definition is unavailable, report the connection limitation. Keep the generated 17-tool snapshot under contributor documentation for drift checks against live evidence.

Static reference inventory and measured run usage are separate. Check the archive inventory and rerun representative tasks before attributing behavior or usage changes to this packaging decision.
