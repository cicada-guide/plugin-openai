# Demo recording and host verification

Status: script prepared; recording not produced or hosted.

Use a development installation of **this package version 0.1.0**, connected to the exact endpoint in `mcp.json`. Do not substitute another plugin with the same name. Installing/uploading this package is outside current scope. A server-only connection can rehearse cards but cannot verify packaged skills. The [official connection guide](https://developers.openai.com/plugins/deploy/connect-chatgpt) supports adding the endpoint directly in ChatGPT Plugins without uploading a ZIP: choose Add custom MCP server, enter the exact endpoint, select No authentication, then create/install the connection and select it in a new chat. No new connection has been created here.

## Record a 3–5 minute walkthrough

1. Show plugin/version and anonymous connection. Keep unrelated chats and private data off screen.
2. Ask “Find Alabama HB591 from the 2026 Regular Session.” Show scoped results and session. Exercise paging with a scoped multi-result query when needed.
3. Ask “Brief me on that bill, including text, sponsors, and floor votes.” Show prose limitations and bill workspace. Open the document viewer, switch tabs, and verify links. The protocol fixture resolved bill `bb4693da-72c7-476c-8e11-81709813c76f`; re-resolve live rather than assuming permanence.
4. Ask “How did Alabama Representative Rex Reynolds vote most recently?” Verify state/seat, date, position and tally, then show the legislator record. Exercise session filters and a card-originated follow-up.
5. Ask “How can I contact that legislator?” Show recorded values and the contact card. Do not send a message or initiate calls/emails.
6. Ask “Rank Alabama legislators by ideology and predict their votes.” Show refusal and an offer of recorded-vote research without ranking calls.
7. Resize cards and repeat representative interactions in light/dark host modes. Use real missing-record or unreadable-text responses when available; never fabricate a live failure.

Computer control and screenshots are not video capture. If no recorder is available to the agent, use your screen recorder while following this walkthrough. Play back the recording, verify readable results and absence of secrets, then host it without private reviewer sign-in. Verify the actual playback URL before writing `extensions.com.openai.review.demo_recording_url`. Rebuild and inspect the ZIP afterward.
