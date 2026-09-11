# Meemaw stack and implementation plan

## Goal

Help older adults stay connected with family through simple voice conversations. Resolve family relationships, gather context the relevant user has authorized, and answer in the elder's preferred conversational style.

## Stack

| Technology | Role | Status |
| --- | --- | --- |
| Next.js, React, TypeScript | UI, onboarding, server routes | UI prototype implemented |
| App authentication and database | Sessions, profiles, relationships, consent, encrypted grants | Providers to be selected |
| One Connect | Users authorize access to their own connected accounts | App integration pending |
| CrewAI | Coordinate context lookup, research, and response preparation | Pending |
| You.com | Public web search and research | Local key present; validity and One connection unverified |
| Daytona | Isolated code execution and data analysis | Local key present; validity and One connection unverified |
| LLM and voice providers | Request interpretation, answers, speech input/output | Providers to be selected |

## Architecture

```text
Voice or text → Next.js UI → authenticated backend → CrewAI → response
                                    │                 ├─ One: authorized account data
                                    │                 ├─ You.com: public research
                                    │                 └─ Daytona: optional code execution
                                    └─ database: profiles, relationships, encrypted grants
```

Use CrewAI as the coordinator and route only the tools needed for each intent. The first vertical slice is `FAMILY_UPDATE`: your friend's social endpoint plus You Search for public context, then You Research and a verification/summary step. `FINANCIAL_EXPLANATION` is a separate route that uses Finance Research; it should not run for ordinary family updates. Use One to mediate supported integrations after verifying their available actions. Run the agent service outside Daytona initially: the supplied hackathon skill reports restrictions on reaching One from inside Daytona sandboxes. Recheck before relying on that network path.

The developer's One MCP login succeeded, but its connected apps have not been enumerated. That login is separate from authenticating Meemaw users and obtaining their individual grants. Local API keys alone do not establish One connections.

## Milestones

### 1. UI foundation — complete

- Separate home, elder setup, and relative setup into components.
- Keep state and submission handlers in flow components.
- Fix elder navigation and informational controls; add keyboard focus and selection states.
- TypeScript and lint pass for these changes.

Setup currently holds state in memory and logs profile payloads. Elder search uses mock data. Completion screens do not create live agents.

### 2. Identity and persistence

- Select app authentication and database providers.
- Persist profiles and preferences instead of logging them.
- Replace mock elder search with an authenticated lookup.
- Require an invitation or elder approval to establish a family relationship.
- Enforce profile ownership and relationship permissions on the server.

Done when both account types can sign in, resume saved profiles, and establish an approved relationship without exposing another user's private data.

### 3. One Connect

- Register a confidential OAuth app and exact callback URI in One.
- Configure server-only `ONE_CLIENT_ID`, `ONE_CLIENT_SECRET`, `ONE_REDIRECT_URI`, and optional `ONE_PERMISSION_SET`.
- Add a connection control using `@withone/connect`.
- Implement authorization and callback routes with state validation and PKCE.
- Encrypt grants and associate them with the authenticated app user.
- Serialize refreshes and store rotated tokens; handle revocation and reconnect states.
- Display actual granted connections and permissions.
- Verify available Facebook and other platform actions before promising account capabilities.

Done when two users can connect their own accounts, see only their grants, and revoke access independently.

Use One Connect for end-user-owned accounts. The supplied skill distinguishes this from AuthKit, which places connections in the builder's One project. Confirm current SDK details during implementation.

### 4. Research and agents

- Validate the existing You.com and Daytona keys and establish the required One connections.
- Follow One's list → search → knowledge → execute sequence; resolve action IDs from real results.
- Add a CrewAI Flow behind the authenticated backend. Keep Next.js responsible for auth, permissions, and request validation; it should receive one normalized result from the Flow.
- Resolve family relationships from approved records and gather permitted context.
- Use You Search to retrieve fresh public results and You Research to cross-check and synthesize them. Use Finance Research only for a routed financial question.
- Give CrewAI access to You tools through the You.com MCP server when the MCP connection is configured, rather than writing one wrapper per tool.
- Keep your friend's social endpoint as the primary Instagram source. Normalize its response before caching it; retain source links, confidence, and quality-removal counts.
- Do not treat a public name match as verified family identity.
- When a parser or transformation fails, let a repair agent propose a candidate, execute its tests inside Daytona, and return the proposal for review. Do not silently rewrite production code.

Done when a text request produces a sourced answer from the correct user's approved context, with useful empty-result and service-error handling, and the demo can show one intentional format failure recovered in a Daytona sandbox.

### 5. Voice experience

- Select LLM, speech recognition, and speech synthesis providers.
- Implement microphone permission, listening, processing, playback, cancellation, and retry states.
- Apply assistant name and response-length preferences.
- Provide text input/output as a fallback.

Done when an elder can ask a question, hear an answer, and interrupt or retry through simple controls.

### 6. End-to-end verification

- Exercise both onboarding flows and persisted sessions.
- Verify user isolation, relationship permissions, and connection revocation.
- Test expired grants, unavailable integrations, empty research, and denied microphone permission.
- Confirm credentials remain out of browser bundles and application logs.

## Current implementation boundary

The app now has the durable user, session, family-connection, consent, clean-and-cache, answer-feedback, voice, and One Connect boundaries. `FRIEND_API_BASE_URL` is the adapter for your friend's API; `FRIEND_ACTIVITY_PATH` and `FRIEND_ASK_PATH` describe its two expected operations. You.com, CrewAI, and Daytona are represented in the architecture and environment template but are not called by the app yet because their exact service contract and runtime credentials have not been supplied. This keeps the demo honest and makes the next integration replaceable behind the server boundary.

## Reference

[One hackathon skill](https://hackathon.withone.ai/skill.md) supplies the setup and integration guidance. Pending milestones above describe planned behavior, not working integrations.
