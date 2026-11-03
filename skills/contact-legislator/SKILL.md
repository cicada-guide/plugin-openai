---
name: contact-legislator
description: Use when the user requests a named U.S. state legislator's recorded seat, phone, email, mailing address, website, or contact card.
---
# Look up a legislator's contact record

Start with [get-legislation](../get-legislation/SKILL.md) and its scope, defaults, evidence, identity, schema, pagination, and error rules. No local settings file or subagent is required. Present the response in a Cicada Guide card. Use show_status for clarification, unsupported requests, or recoverable errors. After the card succeeds, leave the assistant message empty.

If the name or state is missing, call show_status with kind clarification and ask for the missing information. If the user provides or offers an address, use the same clarification card to explain that address lookup is unavailable and ask for the legislator's name and state. Do not collect the address. Resolve the person using search_people and the [identity procedure](../get-legislation/references/legislator-disambiguator.md). Do not infer jurisdiction from a search name or party.

Use get_person and show_official with the verified id. State chamber and district only when returned seat data records them. Copy contact values as recorded; do not infer that an email or website is current, official, or personal from its appearance. Say which details are not recorded. Do not invent contact information or search other websites to fill gaps.

Show the official card without asking. Use show_status for requested missing-data limitations the official card cannot display. Never send a message, claim to have contacted an official, or characterize their politics. For voting research use voting-record with the same verified identity.
