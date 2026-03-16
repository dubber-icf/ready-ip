# Claude.md — READY IP Project

This file provides all context needed to work on the READY IP project. If starting a fresh conversation in this directory, this file plus `SPECIFICATION.md` in the same directory contain everything you need.

---

## Who You're Working With

**Andrew Dubber** — address him as Andrew.

- Director, MTF Labs AB
- Professor of Music Industries Innovation
- Senior Researcher, Industry Commons Foundation

Based in Umeå, Sweden.

**Email addresses by context:**
- `dubber@gmail.com` — personal / general
- `dubber@mtflabs.net` — MTF Labs work
- `andrew.dubber@industrycommons.net` — Industry Commons Foundation work

---

## Communication Style

- Write to PhD or professorial level intelligence, but do not assume specialist knowledge in any given domain.
- Default to full sentences and paragraphs. Bullet points are acceptable when genuinely useful, but should not be the default format.
- Communicate as a thoughtful collaborator, not a service tool.
- Always use **British English** spelling: organisation, recognised, colour, analyse, labour, programme, etc.
- Do **not** use em-dashes. Use a comma, colon, or rewrite the sentence instead.
- Do not use filler phrases like "Certainly!", "Great question!", or "Of course!".
- Avoid excessive hedging or over-qualification.
- Keep responses appropriately concise. Don't pad.
- Prefer doing the work over explaining what you could do.

---

## Technical Environment

- **Project directory**: `/Users/dubber/Dropbox/Claude/ready-ip`
- **Parent workspace**: `/Users/dubber/Dropbox/Claude` (the main Claude folder; NOT `~/Documents`)
- **Node.js**: v24.1.0 at `/opt/homebrew/bin/node`. `npm` and `npx` are also at `/opt/homebrew/bin/`.
- **IMPORTANT**: `node`, `npm`, `npx` are NOT on the default shell PATH. Always prepend `/opt/homebrew/bin/` or run `export PATH="/opt/homebrew/bin:$PATH"` before any Node commands.
- **Python**: Always use `python3` and `pip3` (not `pip` or `python`).
- **GitHub account**: `dubber-icf` (`https://github.com/dubber-icf`). The `gh` CLI is at `/opt/homebrew/bin/gh`, authenticated via SSH.
- **OpenRouter API key**: stored in `~/Dropbox/Claude/.env` as `OPENROUTER_API_KEY`. Use for bulk or cost-sensitive LLM tasks via cheaper models (e.g. `openai/gpt-4.1-mini`) at `https://openrouter.ai/api/v1`.

---

## The Project

**READY IP** is a supply chain intelligence platform that uses patent landscape analysis to assess supplier innovation capability, detect technology maturity risks, and discover alternative suppliers. It replaces the old RE4DY demo (`re4dydemo.industrycommons.net`).

### The full specification lives at `SPECIFICATION.md` in this directory.

That document is the single source of truth. It contains:
- Section 0: Current project status, what's built, how to run it
- Section 1: What READY IP is and the market gap
- Section 2: System architecture (Vercel, Railway, Neo4j Aura, Neon PostgreSQL)
- Section 3: Knowledge graph data model (entity types, relationships, example queries)
- Section 4: Data sources (Google Patents, IPScreener, WIPO, Lens.org, NewsCatcher, UN Comtrade)
- Section 5: API design (all endpoints, auth, request/response formats)
- Section 6: Frontend pages (every page, every component, every interaction)
- Section 7: Intelligence layer (Innovation Score, Technology Maturity, Composite Risk, Alternative Supplier Recommendations)
- Section 8: Security architecture (auth, encryption, headers, audit, RBAC)
- Section 9: Build sequence (10 steps, with completion status)
- Section 10: File and folder structure

**Always read `SPECIFICATION.md` Section 0 first** when starting a new session on this project. It tells you exactly what state the project is in and what's been done.

---

## Repository

- **GitHub**: https://github.com/dubber-icf/ready-ip
- **Local clone**: `/Users/dubber/Dropbox/Claude/ready-ip`
- **Branch strategy**: Work on `main` for now. Feature branches when we have CI/CD.

### How to Run

```bash
cd /Users/dubber/Dropbox/Claude/ready-ip/apps/web
export PATH="/opt/homebrew/bin:$PATH"
npx next dev --port 3333
```

App runs at `http://localhost:3333`.

---

## Key Design Decisions (Locked In)

These have been discussed and decided. Do not revisit unless Andrew raises them.

| Decision | Choice | Notes |
|---|---|---|
| Frontend hosting | Vercel | Not Render. Native Next.js platform. |
| Backend hosting | Railway | Persistent Python services, Celery workers |
| Graph database | Neo4j Aura | Not KuzuDB. Multi-tenant SaaS needs a server DB |
| Relational database | Neon PostgreSQL | Serverless, works with Vercel edge |
| Header typeface | Orbitron (free, for now) | **Remind Andrew to switch to Eurostile Extended (commercial licence) when approaching production** |
| Data typeface | JetBrains Mono | Free, Google Fonts |
| Body typeface | Inter | Free, Google Fonts |
| Design aesthetic | Industrial/mechanical | Dark carbon-fibre, bolted panels, LED indicators, robotic arm animations, hazard-stripe alerts |
| Domain | TBD | Using Vercel default until closer to launch |
| Brand name | READY IP | Logo: hex bolt mark with network vertices |

---

## Predecessor Reference

The old demo (`dubber-icf/re4dydemo`) provides reference material:
- `data/enhancedDummyData.js` — Automotive supply chain structure (tiers 1-6, ~100 components) to migrate into Neo4j
- `backend/src/services/ip_screener_live.py` — IPScreener API integration patterns (auth, session tokens, polling)
- IPScreener API keys are in the demo's `.env.local` as `IPS_DATA_KEY` and `IPS_UX_KEY`

READY IP is a ground-up replacement, not a fork. Do not inherit code from the demo; only reference it for data structures and API patterns.

---

## Working Principles (Project-Specific)

- **Read `SPECIFICATION.md` Section 0** at the start of every session.
- **Update `SPECIFICATION.md` Section 0** after completing any build step (mark steps complete, update "what has been built").
- When in doubt about architecture, data model, or design decisions, check the spec before asking Andrew.
- Commit frequently with clear messages. Push after each logical unit of work.
- Enterprise security standards from the start. No shortcuts on auth, input validation, or secrets management.

---

## Session Close

When Andrew sends a message that is **exactly** the word `Done` and nothing else, invoke the `session-close` skill. Do not trigger on "done" used within a sentence or as part of a longer message.
