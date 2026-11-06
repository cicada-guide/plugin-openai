---
name: setup
description: Use when a user runs Cicada Guide setup, asks to connect or check its MCP server, or wants help getting started. For a concrete bill, vote, or contact request with a working connection, proceed directly to that workflow.
---
# Get started with Cicada Guide

## Connect and verify

Discover the Cicada Guide tools exposed in this conversation before onboarding. Use the host-assigned tool names and live schemas. For an explicit setup or connection check, call `list_states` with the smallest supported read-only request. A successful result verifies the connection in this conversation. For an introduction only, use `show_status` without a separate lookup. If the user already supplied a research task and its tools are available, proceed directly to that task.

If the required tools are missing or the lookup fails, give the recovery step for the current host. Use `show_status` for the setup result if it works. If no status card can be delivered, report the setup result and any next step in a short chat message. Keep this fallback limited to setup and connection recovery. If the lookup succeeded but the card failed, report those outcomes separately.

- In ChatGPT, enable or reconnect the Cicada Guide plugin and select it in a new chat. If the host supports adding a custom MCP server and the plugin connection is unavailable, use the endpoint below with authentication set to None.
- In Codex, use the existing plugin connection when it exposes the tools. If it does not, check for an existing Codex MCP entry for this endpoint. If none exists and the user asked you to set up the connection, run the command below when the CLI is available. Otherwise give the command to the user. If the name is already in use for another server, leave that entry in place and use an unused name. If the endpoint is already configured, check that the entry is enabled. Start a new Codex session after configuration and rerun the connection check there.
- In another MCP host, add or enable a Streamable HTTP server at the endpoint below, then open a session with that server enabled.

The public endpoint is `https://openai.cicada.guide/mcp`. It requires no API key, OAuth login, or password.

```sh
codex mcp add guide-public --url https://openai.cicada.guide/mcp
```

Saving configuration does not verify the connection. After the host loads the connection, rediscover the tools and retry the failed lookup or resume the supplied task. If the same failure persists, report the failing step and stop retrying until the connection changes. Card rendering is verified only when observed in the host.

## Choose a starting task

Use `show_status` for introductions and setup questions. Reuse any task, state, session, or legislator already supplied in the conversation.

For a new user without a task, briefly explain that Cicada Guide researches U.S. state legislation and recorded legislator information. It reads public records and does not send messages to officials. Offer these starting points in ordinary language:

- Find a bill by number or topic.
- Understand a bill's text, sponsors, status, and floor votes.
- Check a named legislator's recorded votes.
- Find a named legislator's recorded contact details.

Ask one concise question for the missing starting information, such as “Which state and what would you like to research?” Do not demand a bill number for a topic search or a session for a contact lookup. Ask for session/year only when needed to distinguish bill records. If the user wants a suggestion, offer an example prompt rather than choosing a jurisdiction or running unrelated research.

If the user supplies a default state or session, apply it in this conversation and let explicit requests override it. Do not write settings files, collect a home address, or promise that preferences persist into new chats.

## Start the selected task

Read the [shared research rules](../get-legislation/SKILL.md), then use only the relevant workflow: [bill brief](../research-legislation/SKILL.md), [voting records](../voting-record/SKILL.md), or [contacts](../contact-legislator/SKILL.md). A simple bill search uses the shared rules directly. Keep references selective and follow live tool definitions.

Use the discovered Cicada Guide tools for the chosen task. If the connection fails, use the recovery steps above. Use Cicada Guide results for legislative facts.
