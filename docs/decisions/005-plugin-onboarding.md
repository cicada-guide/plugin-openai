# ADR-005: Register a focused plugin onboarding skill

## Status

Accepted

## Date

2026-11-02

## Decision

Add skills/setup/SKILL.md and register it as extensions.com.openai.onboardingSkill in the portable manifest. The host's setup action can invoke the packaged skill in a fresh conversation or the existing installation conversation. The skill remains available for ordinary discovery when a user asks for first-use help.

Keep onboarding focused on choosing a research task, reusing existing scope and conversation defaults, and handling unavailable tools. A clear research request goes directly to its workflow. Introduction-only requests need no network probe. Requested connection checks use a small read-only lookup and report only what was tested. No automatic installs, account changes, server edits, credential collection, or durable preferences are introduced.

## Alternatives and consequences

README-only instructions would not provide the host setup entrypoint. Putting a welcome checklist in every research skill would interrupt concrete tasks. A separate setup skill adds one packaged file while leaving the four research workflows and their evidence rules intact.

The package validator checks that the onboarding path points to an included skill. Host invocation after installation still needs separate verification in both fresh and existing conversations; source validation cannot establish it.

Source: [official onboarding packaging guidance](https://developers.openai.com/plugins/build/plugins#add-an-onboarding-skill). See [setup skill](../../skills/setup/SKILL.md) and [readiness](../readiness.md).
