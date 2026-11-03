---
name: setup
description: Use when a user runs Cicada Guide setup, asks how to get started, or wants help choosing their first legislative research task. For a concrete bill, vote, or contact request, proceed directly to that workflow.
---
# Get started with Cicada Guide

Follow the shared card and connection rules for all onboarding responses. Use show_status for introductions, setup questions, and recoverable errors. Help the user reach their first useful research result. Reuse any task, state, session, or legislator already supplied in the conversation; do not restart onboarding or make a clear request wait for setup questions.

For a new user without a task, briefly explain that Cicada Guide researches U.S. state legislation and recorded legislator information. It reads public records and does not send messages to officials. Offer these starting points in ordinary language:

- Find a bill by number or topic.
- Understand a bill's text, sponsors, status, and floor votes.
- Check a named legislator's recorded votes.
- Find a named legislator's recorded contact details.

Ask one concise question for the missing starting information, such as “Which state and what would you like to research?” Do not demand a bill number for a topic search or a session for a contact lookup. Ask for session/year only when needed to distinguish bill records. If the user wants a suggestion, offer an example prompt rather than choosing a jurisdiction or running unrelated research.

If the user supplies a default state or session, apply it in this conversation and let explicit requests override it. Do not write settings files, collect a home address, or promise that preferences persist into new chats.

## Start the selected task

Read the [shared research rules](../get-legislation/SKILL.md), then use only the relevant workflow: [bill brief](../research-legislation/SKILL.md), [voting records](../voting-record/SKILL.md), or [contacts](../contact-legislator/SKILL.md). A simple bill search uses the shared rules directly. Keep references selective and follow live tool definitions.

Use the discovered guide-public tools for the chosen task. For an introduction, use show_status without a separate connection probe. For a requested connection check, use the live list_states definition for a small read-only lookup; report what actually succeeded, not that all workflows or cards are verified.

If a call fails and show_status is available, explain the specific limitation in the status card and guide the user to enable or reconnect Cicada Guide in their host, then retry the affected read after the connection changes. No service credentials are needed for the anonymous endpoint; never ask for an API key or a personal account password. Do not install another plugin, modify a server, or change account settings as an automatic setup step. Do not loop on an unchanged failure or substitute legislative facts from general knowledge.

Finish onboarding when the user has a useful sourced result, knows the next input needed, or has a concrete connection-recovery step. Do not claim setup completed merely because the skill was opened. Card rendering remains unverified until actually observed in the host.
