# READY IP: Full Platform Specification

Version 0.1 — 16/03/2026
Status: Draft for review

---

## 0. Project Status and Location

This section tells you exactly where everything is and what state it's in. If you're starting a fresh conversation, read this first.

### Repository

- **GitHub**: https://github.com/dubber-icf/ready-ip
- **Local clone**: `/Users/dubber/Dropbox/Claude/ready-ip`
- **GitHub account**: `dubber-icf` (authenticated via SSH, CLI at `/opt/homebrew/bin/gh`)

### What Has Been Built

**Step 1 (Foundation) is complete.** The initial commit (`7d52ae8`) includes:

- Next.js 14 + TypeScript + Tailwind CSS scaffold (`apps/web/`)
- Industrial design system: colour palette, typography (Orbitron headers, JetBrains Mono data, Inter body), mechanical easing curves, custom animations (bolt screw-in, iris loading, panel settle, LED pulse)
- READY IP logo as SVG: hex bolt mark with network node vertices (amber/blue) and crosshair centre, plus standalone icon for favicon (`apps/web/public/logo.svg`, `apps/web/public/icon.svg`)
- UI components: `BoltedPanel`, `HexBolt`, `StatusLED`, `HazardAlert`, `IrisLoader`, `NavItem`, `Sidebar` (all in `apps/web/src/components/ui/`)
- Design tokens file (`apps/web/src/lib/design-tokens.ts`)
- Five placeholder pages: Dashboard, Explorer, Patents, Risk, Data (all showing industrial UI with sample static content)
- Edge Middleware with security headers: CSP, HSTS, X-Frame-Options DENY, Permissions-Policy (`apps/web/src/middleware.ts`)
- Security headers also set in `apps/web/next.config.js`
- `.gitignore` blocking env files, credentials, keys, node_modules, build outputs
- `.env.example` documenting all expected environment variables

**Steps 2-10 are not yet started.** The backend (FastAPI), database (Neo4j), patent integrations, scoring, and risk features are all planned but unbuilt.

### How to Run It

```bash
cd /Users/dubber/Dropbox/Claude/ready-ip/apps/web
export PATH="/opt/homebrew/bin:$PATH"
npx next dev --port 3333
```

Or via the Claude Preview launch config (server name: `ready-ip-web`, defined in `/Users/dubber/Dropbox/Claude/.claude/launch.json`).

The app runs at `http://localhost:3333`. Currently renders with static placeholder data only (no backend, no database).

### Technical Environment

- **Node.js**: v24.1.0 at `/opt/homebrew/bin/node`
- **npm/npx**: at `/opt/homebrew/bin/npm`, `/opt/homebrew/bin/npx`
- **Python**: `python3` and `pip3` (always use the `3`-suffixed commands)
- **Note**: `node`, `npm`, `npx` are NOT on the default shell PATH. Always prepend `/opt/homebrew/bin/` or `export PATH="/opt/homebrew/bin:$PATH"` before running Node commands.
- **Dev server wrapper**: `start-dev.sh` at repo root handles the PATH issue for the Claude Preview launch config.

### Design Decisions Already Made

- **Typeface**: Using Orbitron (free, Google Fonts) for now. Remind Andrew to switch to Eurostile Extended (commercial licence, ~$30-50) when approaching production.
- **Domain**: Not yet decided. Using Vercel's default domain until closer to launch.
- **Frontend hosting**: Vercel (not Render).
- **Backend hosting**: Railway.
- **Graph database**: Neo4j Aura (not KuzuDB).
- **Relational database**: Neon PostgreSQL.
- **Design aesthetic**: Industrial/mechanical. Dark carbon-fibre background, bolted panel corners, LED status indicators, robotic arm animation easing, hazard-stripe alerts. Not a consumer web app — a precision-engineered control room.

### Predecessor

The existing RE4DY demo lives at `re4dydemo.industrycommons.net` (GitHub repo: `dubber-icf/re4dydemo`). It's a React/Flask app with flat PostgreSQL data, dummy automotive supply chain data hardcoded in JavaScript, and basic IPScreener integration. READY IP is a ground-up replacement, not a fork. The only things carried forward are:
- The automotive sample data structure (tiers 1-6, ~100 components)
- The IPScreener API integration pattern (authentication, session tokens, polling)
- The IPScreener API keys (stored in the demo's `.env.local` as `IPS_DATA_KEY` and `IPS_UX_KEY`)

### Related Files Outside This Repo

- **Project memory**: `/Users/dubber/.claude/projects/-Users-dubber-Dropbox-Claude/memory/project_ready_ip.md`
- **Workspace CLAUDE.md**: `/Users/dubber/Dropbox/Claude/CLAUDE.md` (general working instructions)
- **Architecture plan**: `/Users/dubber/.claude/plans/binary-mixing-breeze.md` (initial plan, now superseded by this spec)

---

## 1. What READY IP Is

READY IP is a supply chain intelligence platform that uses patent landscape analysis to assess supplier innovation capability, detect technology maturity risks, and discover alternative suppliers. It sits at the intersection of two mature but separate markets: supply chain resilience platforms and patent intelligence tools. Neither category does what READY IP does.

The core insight: patents are a leading indicator of supplier capability. A supplier whose patent filing rate is declining in a critical technology area is a future risk, even if their current delivery is reliable. A company filing aggressively in a relevant patent class may be an alternative supplier that no traditional supply chain database has catalogued. Financial health tells you about the present; patent activity tells you about the future.

---

## 2. System Architecture

The platform is composed of four layers. Each layer is a distinct concern with clear boundaries.

### 2.1 Frontend (Next.js on Vercel)

The user-facing application. Renders all views, handles authentication, and proxies API requests to the backend via server-side API routes (the BFF pattern). No secrets or API keys ever reach the browser.

**Why Next.js on Vercel**: SSR for initial load of large graph views. API routes for secure backend proxying. Edge Middleware for auth and security headers at the CDN edge. Preview deployments per PR for review. ISR for pages that can be statically generated with periodic revalidation.

### 2.2 Backend API (FastAPI on Railway)

The intelligence engine. Handles all graph queries, patent source aggregation, risk scoring, and recommendation generation. Exposes a versioned REST API (`/api/v1/`) consumed exclusively by the Next.js BFF layer.

**Why FastAPI on Railway**: Async Python for concurrent patent API queries. Pydantic for strict request/response validation. Railway for persistent processes (Celery workers need long-running containers). Private networking between API and worker services.

### 2.3 Data Layer

Two databases serving different purposes:

**Neo4j Aura (Knowledge Graph)**: All supply chain entities and their relationships. This is the heart of the platform. Cypher queries enable multi-hop traversal (trace a final product back through six tiers to raw materials), graph algorithms (PageRank for supplier importance, community detection for supply chain clusters), and pattern matching (find all suppliers whose patent profile overlaps with an at-risk supplier).

**Neon PostgreSQL (Relational)**: User accounts, tenant configuration, API key management, audit logs, cached patent search results, session data. These are tabular concerns that don't benefit from graph modelling.

### 2.4 Background Processing (Celery + Upstash Redis)

Patent enrichment, risk score computation, and news monitoring run as background tasks. They must not block API responses. Celery workers on Railway consume tasks from an Upstash Redis queue.

---

## 3. Knowledge Graph Schema

The graph is the platform's foundation. Every feature depends on the relationships between entities being queryable in real time. The schema must support multi-tier supply chain traversal, patent landscape overlay, risk propagation, and alternative supplier discovery.

### 3.1 Node Types

#### Supplier
Represents any company that supplies components, materials, or services within a supply chain.

| Property | Type | Description |
|---|---|---|
| `id` | string (UUID) | Unique identifier |
| `name` | string | Company name |
| `country` | string | ISO 3166-1 alpha-2 country code |
| `region` | string | Geographic region (EU, APAC, Americas, MENA, Africa) |
| `legal_entity_type` | string | e.g. GmbH, AB, Inc., Ltd |
| `registration_number` | string | Company registration number (where available) |
| `founded_year` | integer | Year of incorporation |
| `employee_count_range` | string | e.g. "1000-5000", "10000+" |
| `website` | string | URL |
| `innovation_score` | float (0-100) | Computed from patent activity. See section 7.1 |
| `risk_score` | float (0-100) | Composite risk. See section 7.3 |
| `last_enriched_at` | datetime | When patent/risk data was last refreshed |
| `tenant_id` | string | Multi-tenant isolation key |

#### Component
A discrete part, sub-assembly, or finished product within the supply chain hierarchy.

| Property | Type | Description |
|---|---|---|
| `id` | string (UUID) | Unique identifier |
| `name` | string | Part name |
| `part_number` | string | Manufacturer's part number |
| `tier` | integer (1-6) | Position in supply chain. 1 = raw materials, 6 = final product |
| `criticality` | enum | `critical`, `important`, `standard` |
| `category` | string | e.g. "Powertrain", "Electronics", "Chassis" |
| `subcategory` | string | e.g. "Engine Block", "ECU", "Suspension Arm" |
| `description` | text | Technical description and specifications |
| `specifications` | JSON | Structured technical specs (dimensions, tolerances, materials) |
| `tenant_id` | string | Multi-tenant isolation key |

#### Material
Raw materials and commodities used in manufacturing.

| Property | Type | Description |
|---|---|---|
| `id` | string (UUID) | Unique identifier |
| `name` | string | Material name |
| `type` | string | e.g. "Steel", "Aluminium", "Semiconductor", "Composite" |
| `commodity_code` | string | Harmonised System (HS) code for trade data linkage |
| `grade` | string | Material grade/specification |
| `price_volatility_index` | float | 12-month price volatility (0 = stable, 1 = highly volatile) |
| `supply_concentration` | float | HHI score (0-1). High = concentrated supply |
| `tenant_id` | string | Multi-tenant isolation key |

#### Patent
An individual patent or patent application, normalised from multiple data sources.

| Property | Type | Description |
|---|---|---|
| `id` | string (UUID) | Internal identifier |
| `publication_number` | string | Official publication number (e.g. US11234567B2) |
| `title` | string | Patent title |
| `abstract` | text | Patent abstract |
| `filing_date` | date | Date the application was filed |
| `publication_date` | date | Date published |
| `expiry_date` | date | Estimated expiry date |
| `jurisdiction` | string | Patent office (USPTO, EPO, JPO, CNIPA, WIPO) |
| `status` | enum | `active`, `expired`, `pending`, `abandoned` |
| `cpc_codes` | string[] | Cooperative Patent Classification codes |
| `applicant_names` | string[] | As listed on the patent |
| `source` | enum | `google_patents`, `ipscreener`, `wipo`, `lens` |
| `source_id` | string | Identifier in the source system |
| `relevance_embedding` | float[] | Vector embedding for semantic similarity (optional) |

Note: Patents are shared across tenants (they're public records). Tenant isolation applies to the HOLDS_PATENT relationship, not the Patent node itself.

#### Technology
A technology domain, mapped from CPC classification codes.

| Property | Type | Description |
|---|---|---|
| `id` | string (UUID) | Unique identifier |
| `name` | string | Human-readable technology name |
| `cpc_prefix` | string | CPC code prefix (e.g. "B60K" = hybrid electric vehicles) |
| `description` | text | What this technology covers |
| `maturity_level` | enum | `emerging`, `growing`, `mature`, `declining` |
| `filing_rate_trend` | float | Year-over-year change in patent filings (positive = growing) |
| `total_patents` | integer | Total patents in this classification |

#### Geography
A country or region, carrying risk and trade metadata.

| Property | Type | Description |
|---|---|---|
| `id` | string | ISO 3166-1 alpha-2 country code |
| `name` | string | Country name |
| `region` | string | Geographic region |
| `geopolitical_risk_score` | float (0-100) | Political stability, sanctions exposure, conflict proximity |
| `trade_restriction_level` | enum | `open`, `restricted`, `sanctioned` |
| `natural_disaster_exposure` | float (0-100) | Earthquake, flood, typhoon, wildfire risk |

#### Standard
Industry standards and certifications relevant to supply chain compliance.

| Property | Type | Description |
|---|---|---|
| `id` | string (UUID) | Unique identifier |
| `name` | string | e.g. "ISO 9001", "IATF 16949", "IEC 62443" |
| `body` | string | Standards body (ISO, IEC, SAE, ASTM) |
| `version` | string | Current version |
| `status` | enum | `current`, `superseded`, `withdrawn` |

#### RiskEvent
A real-world event that may affect the supply chain.

| Property | Type | Description |
|---|---|---|
| `id` | string (UUID) | Unique identifier |
| `type` | enum | `geopolitical`, `natural_disaster`, `trade_policy`, `financial`, `regulatory`, `cyber` |
| `title` | string | Brief headline |
| `description` | text | Full description |
| `severity` | integer (1-5) | 1 = minor, 5 = catastrophic |
| `detected_at` | datetime | When the event was detected |
| `resolved_at` | datetime | When the event was resolved (null if ongoing) |
| `source_url` | string | Source article/report URL |
| `affected_countries` | string[] | ISO country codes |

### 3.2 Relationship Types

#### Supply Chain Structure

**SUPPLIES**: A supplier provides a component.
```
(:Supplier)-[:SUPPLIES {
  volume_annual: integer,       // Units per year
  value_annual: float,          // Currency value per year
  currency: string,             // ISO 4217
  contract_type: string,        // "exclusive", "preferred", "spot"
  lead_time_days: integer,      // Average lead time
  contract_expiry: date,        // When the supply agreement expires
  is_primary: boolean           // Whether this is the primary supplier for this component
}]->(:Component)
```

**COMPOSED_OF**: A component is made from other components (hierarchical BOM).
```
(:Component)-[:COMPOSED_OF {
  quantity: integer,            // How many of the child per parent
  is_critical: boolean,         // Whether the child is critical to the parent
  can_substitute: boolean       // Whether alternatives exist
}]->(:Component)
```
Constraint: COMPOSED_OF must flow from higher tier to lower tier (tier 6 → tier 1). This enforces a DAG (directed acyclic graph) and prevents the cycle problems that plagued the old demo's Sankey.

**USES_MATERIAL**: A component requires a specific material.
```
(:Component)-[:USES_MATERIAL {
  quantity_kg: float,           // Kilograms per unit
  grade: string,                // Required material grade
  is_primary: boolean           // Primary material vs secondary
}]->(:Material)
```

**MANUFACTURED_IN**: Where a component is physically manufactured.
```
(:Component)-[:MANUFACTURED_IN]->(:Geography)
```

#### Patent and Technology Landscape

**HOLDS_PATENT**: A supplier is an applicant/assignee on a patent.
```
(:Supplier)-[:HOLDS_PATENT {
  role: string,                 // "applicant", "assignee", "inventor_employer"
  filing_date: date,
  status: string                // mirrors Patent.status
}]->(:Patent)
```

**COVERS_TECHNOLOGY**: A patent falls within a technology domain.
```
(:Patent)-[:COVERS_TECHNOLOGY {
  cpc_code: string,             // Specific CPC code (more granular than Technology.cpc_prefix)
  relevance: float              // 0-1, how central this tech is to the patent
}]->(:Technology)
```

**RELEVANT_TO**: A technology is relevant to a component category.
```
(:Technology)-[:RELEVANT_TO {
  relevance: float,             // 0-1
  evidence: string              // Why this mapping exists
}]->(:Component)
```

**CITES**: Patent citation network.
```
(:Patent)-[:CITES]->(:Patent)
```

**FILED_IN**: Which jurisdictions a patent was filed in.
```
(:Patent)-[:FILED_IN]->(:Geography)
```

#### Risk and Compliance

**LOCATED_IN**: Where a supplier is headquartered or has operations.
```
(:Supplier)-[:LOCATED_IN {
  location_type: string         // "headquarters", "factory", "r_and_d", "office"
}]->(:Geography)
```

**COMPLIES_WITH**: A supplier holds a certification/standard.
```
(:Supplier)-[:COMPLIES_WITH {
  certified_date: date,
  expiry_date: date,
  certifier: string
}]->(:Standard)
```

**AFFECTS**: A risk event impacts a geography.
```
(:RiskEvent)-[:AFFECTS {
  impact_level: string          // "direct", "indirect", "potential"
}]->(:Geography)
```

**IMPACTS**: A risk event directly impacts a supplier (derived from AFFECTS + LOCATED_IN, or directly assigned).
```
(:RiskEvent)-[:IMPACTS {
  impact_type: string,          // "operational", "financial", "reputational"
  confirmed: boolean
}]->(:Supplier)
```

#### Competitive and Alternative Analysis

**COMPETES_WITH**: Two suppliers operate in overlapping technology/component spaces.
```
(:Supplier)-[:COMPETES_WITH {
  overlap_score: float,         // 0-1, based on patent CPC overlap
  shared_technologies: string[] // Technology names in common
}]->(:Supplier)
```

**ALTERNATIVE_TO**: Two components can substitute for each other.
```
(:Component)-[:ALTERNATIVE_TO {
  compatibility_score: float,   // 0-1
  notes: string                 // Compatibility caveats
}]->(:Component)
```

### 3.3 Key Graph Queries

These are the queries that drive the platform's core features. Each corresponds to a user-facing capability.

**1. Full supply chain lineage** (Explorer view, Sankey view)
```cypher
MATCH path = (final:Component {tier: 6, tenant_id: $tid})
  -[:COMPOSED_OF*1..6]->(raw:Component {tier: 1})
RETURN path
```

**2. Single-source vulnerability** (Risk dashboard)
```cypher
MATCH (c:Component {tenant_id: $tid})<-[:SUPPLIES]-(s:Supplier)
WITH c, count(s) AS supplier_count, collect(s) AS suppliers
WHERE supplier_count = 1
RETURN c.name, c.tier, c.criticality, suppliers[0].name AS sole_supplier
ORDER BY c.criticality DESC
```

**3. Patent landscape for a supplier** (Patent Intelligence, Supplier detail)
```cypher
MATCH (s:Supplier {id: $supplier_id})-[:HOLDS_PATENT]->(p:Patent)
  -[:COVERS_TECHNOLOGY]->(t:Technology)
RETURN t.name, t.maturity_level, count(p) AS patent_count,
       min(p.filing_date) AS earliest, max(p.filing_date) AS latest
ORDER BY patent_count DESC
```

**4. Alternative supplier discovery** (Risk response)
```cypher
MATCH (at_risk:Supplier {id: $supplier_id})
  -[:HOLDS_PATENT]->(p:Patent)-[:COVERS_TECHNOLOGY]->(t:Technology)
WITH at_risk, collect(DISTINCT t) AS risk_techs
UNWIND risk_techs AS tech
MATCH (alt:Supplier)-[:HOLDS_PATENT]->(ap:Patent)
  -[:COVERS_TECHNOLOGY]->(tech)
WHERE alt <> at_risk AND alt.tenant_id = $tid
WITH alt, count(DISTINCT ap) AS relevant_patents,
     collect(DISTINCT tech.name) AS shared_techs
RETURN alt.name, alt.country, alt.innovation_score,
       relevant_patents, shared_techs
ORDER BY relevant_patents DESC
LIMIT 10
```

**5. Risk propagation from geography** (Risk assessment)
```cypher
MATCH (re:RiskEvent {id: $event_id})-[:AFFECTS]->(g:Geography)
  <-[:LOCATED_IN]-(s:Supplier)-[:SUPPLIES]->(c:Component)
  -[:COMPOSED_OF*0..4]->(final:Component {tier: 6})
WHERE s.tenant_id = $tid
RETURN final.name AS product, collect(DISTINCT s.name) AS affected_suppliers,
       collect(DISTINCT c.name) AS affected_components, re.severity
```

**6. Technology maturity trend** (Patent Intelligence)
```cypher
MATCH (t:Technology {id: $tech_id})<-[:COVERS_TECHNOLOGY]-(p:Patent)
WITH t, p.filing_date.year AS year, count(p) AS filings
ORDER BY year
RETURN t.name, t.maturity_level, collect({year: year, filings: filings}) AS trend
```

---

## 4. Data Sources and Ingestion

### 4.1 Patent Data Sources

The platform aggregates patents from multiple sources, each with different strengths.

#### Google Patents via BigQuery
**What**: 90M+ patents from 100+ patent offices. SQL access via BigQuery.
**Best for**: Bulk landscape analysis. "Show me all patents filed by Bosch in CPC class F02M (fuel injection) in the last 5 years." Cost-effective for large queries (free first 1TB/month).
**Data available**: Publication number, title, abstract, filing/publication dates, CPC codes, applicant names, citation data, full text (for some jurisdictions).
**Integration**: BigQuery Python client. Scheduled Celery tasks query by supplier name or CPC code, normalise results, and upsert into Neo4j.
**Rate limits**: BigQuery has query quotas, not rate limits. Cost is per bytes scanned.

#### IPScreener
**What**: Semantic patent search. Describe a technology in natural language, get relevant patents ranked by relevance.
**Best for**: Targeted analysis. "Find patents related to solid-state battery thermal management for automotive applications." The existing demo already has this integration.
**Data available**: Patent number, title, applicant, publication date, relevance score.
**Integration**: Existing API keys (`IPS_DATA_KEY`). HTTP POST to `https://my.ipscreener.com/api/data/case`. Session-token polling pattern (submit query, poll for results).
**Rate limits**: API key-based. Throttle to 1 query per 5 minutes per key (configurable).

#### WIPO PatentScope
**What**: 112M+ technology disclosures including PCT (Patent Cooperation Treaty) international applications.
**Best for**: International filing strategy. Shows which companies file internationally (a signal of serious commercialisation intent) vs domestically only.
**Data available**: PCT application data, international search reports, designated states.
**Integration**: WIPO Search API (free registration required). REST API with JSON responses.
**Rate limits**: Fair use policy, no hard limits documented.

#### Lens.org
**What**: Patents cross-referenced with scholarly publications. Unique in linking academic research to commercial patents.
**Best for**: Research pipeline analysis. Shows which suppliers have active R&D feeding their patent portfolio. A supplier with both academic publications and patents in a technology is more deeply invested than one with patents alone.
**Data available**: Patent metadata, scholarly article metadata, patent-article citations.
**Integration**: Lens.org API (free for non-commercial academic use; commercial licence available).
**Rate limits**: 50 requests/minute on free tier.

### 4.2 Patent Normalisation

All four sources return data in different formats. The ingestion pipeline normalises them into the common Patent node schema before upserting into Neo4j.

**Normalisation steps:**
1. Parse source-specific fields into common schema
2. Resolve publication_number to a canonical format (e.g. "US11234567B2")
3. Deduplicate by publication_number (the same patent may appear in multiple sources; merge metadata, preferring the most complete record)
4. Extract CPC codes and map to Technology nodes (creating new Technology nodes if a CPC prefix hasn't been seen before)
5. Resolve applicant names to existing Supplier nodes via fuzzy string matching (company names vary across patent offices: "Robert Bosch GmbH" vs "Bosch" vs "ROBERT BOSCH GMBH")
6. Create HOLDS_PATENT relationships between matched Suppliers and Patents
7. Create COVERS_TECHNOLOGY relationships between Patents and Technologies
8. Optionally compute relevance embeddings via OpenRouter (gpt-4.1-mini) for semantic similarity search

**Deduplication logic**: publication_number is the primary key. When the same patent is found in multiple sources, the platform merges them: takes the most complete abstract, the union of CPC codes, and tracks which sources contributed the record.

### 4.3 Supply Chain Data Import

For MVP, supply chain data (suppliers, components, materials, and their relationships) is imported via structured JSON or CSV files. The format mirrors the graph schema.

**JSON import format:**
```json
{
  "suppliers": [
    {
      "name": "ArcelorMittal",
      "country": "LU",
      "region": "EU",
      "website": "https://corporate.arcelormittal.com"
    }
  ],
  "components": [
    {
      "name": "CryoSteel X50 High-Strength Steel",
      "part_number": "CS-X50-2024",
      "tier": 1,
      "criticality": "critical",
      "category": "Raw Materials",
      "subcategory": "Steel",
      "description": "Ultra-high-strength steel for structural components..."
    }
  ],
  "relationships": [
    {
      "type": "SUPPLIES",
      "from": {"type": "Supplier", "name": "ArcelorMittal"},
      "to": {"type": "Component", "name": "CryoSteel X50 High-Strength Steel"},
      "properties": {"volume_annual": 50000, "value_annual": 2500000, "currency": "EUR"}
    }
  ]
}
```

The existing demo's `enhancedDummyData.js` will be converted to this format and used as the initial seed dataset.

**Future**: API connectors for ERP systems (SAP S/4HANA, Oracle SCM Cloud) and supplier intelligence platforms (S&P Global Panjiva, Supplier.io) to ingest supply chain data directly.

### 4.4 Risk Event Sources

**NewsCatcher API**: Polled every 6 hours by a Celery periodic task. Searches for keywords related to supply chain disruptions: sanctions, trade restrictions, natural disasters, factory closures, strikes, cyber attacks. Matched events are geocoded and linked to affected Geographies and Suppliers.

**Manual entry**: Users can create RiskEvent nodes manually for events not captured by automated monitoring (e.g. internal intelligence about a supplier's financial difficulties).

### 4.5 Data Freshness Strategy

| Data type | Refresh frequency | Method |
|---|---|---|
| Patents (tracked suppliers) | Weekly | Celery periodic task queries BigQuery for each tracked supplier's recent filings |
| Patents (priority/at-risk suppliers) | Daily | Higher frequency for suppliers flagged with risk scores above threshold |
| Innovation scores | Weekly | Recomputed after patent refresh |
| Risk scores | Weekly | Recomputed after innovation scores update |
| Risk events | Every 6 hours | NewsCatcher API polling |
| Technology maturity levels | Monthly | Reanalysis of patent filing curves |
| Trade flow data | Quarterly | UN Comtrade bulk download (future) |

All ingestion tasks are idempotent. Re-running a patent ingestion task for a supplier that was already processed will upsert (update or create) rather than duplicate.

---

## 5. Backend API Design

### 5.1 Service Structure

The FastAPI backend is organised into three logical service domains. For MVP, these are routers within a single FastAPI application. As load grows, they can be split into independent services.

#### Core API (`/api/v1/`)
Handles supply chain CRUD, graph queries, and tenant management.

| Endpoint | Method | Description |
|---|---|---|
| `/suppliers` | GET | List suppliers with filtering (country, risk_score range, innovation_score range) |
| `/suppliers/{id}` | GET | Supplier detail including connected components, patents, risk events |
| `/suppliers/{id}/patents` | GET | Patents held by a supplier, grouped by technology |
| `/suppliers/{id}/alternatives` | GET | Alternative suppliers based on patent landscape overlap |
| `/components` | GET | List components with filtering (tier, category, criticality) |
| `/components/{id}` | GET | Component detail including BOM (bill of materials), suppliers, materials |
| `/components/{id}/lineage` | GET | Full supply chain path from this component to raw materials or final product |
| `/graph/explore` | POST | Flexible graph query: given a node ID, return its neighbourhood (configurable depth, relationship types, direction) |
| `/graph/path` | POST | Shortest path between two nodes |
| `/import` | POST | Bulk import supply chain data (JSON format per section 4.3) |

#### Patent API (`/api/v1/patents/`)
Handles patent search, source aggregation, and enrichment.

| Endpoint | Method | Description |
|---|---|---|
| `/search` | POST | Search patents across all configured sources. Body: `{ query: string, sources: string[], cpc_codes: string[], date_range: {from, to}, limit: int }` |
| `/supplier/{id}/landscape` | GET | Patent landscape analysis for a supplier: filing trends, technology coverage, citation impact |
| `/technology/{id}/trend` | GET | Filing trend for a technology over time |
| `/technology/{id}/players` | GET | Which suppliers hold patents in this technology |
| `/enrich/{supplier_id}` | POST | Trigger background enrichment (fetch latest patents for this supplier from all sources) |

#### Risk API (`/api/v1/risk/`)
Handles risk assessment, event monitoring, and alerting.

| Endpoint | Method | Description |
|---|---|---|
| `/overview` | GET | Summary: counts by severity, top risks, recent events |
| `/scores` | GET | Risk scores for all suppliers, sortable/filterable |
| `/scores/{supplier_id}` | GET | Detailed risk breakdown for a supplier (innovation, geographic, concentration, technology maturity components) |
| `/events` | GET | Recent risk events with affected suppliers/geographies |
| `/events` | POST | Create a manual risk event |
| `/alerts` | GET | Active alerts (risk scores crossing thresholds) |
| `/whatif` | POST | Scenario modelling: remove a supplier and compute cascading impacts |
| `/alternatives/{supplier_id}` | GET | Patent-based alternative supplier recommendations |

### 5.2 Authentication Flow

1. User logs in via NextAuth.js on the frontend (OAuth or email/password)
2. NextAuth creates a signed JWT containing: `user_id`, `tenant_id`, `role`
3. Frontend API routes (the BFF layer) extract the JWT from the session cookie
4. BFF routes call the FastAPI backend, passing the JWT in an `Authorization: Bearer` header plus an HMAC signature in `X-Request-Signature` (proving the request came from the Vercel app, not a direct call)
5. FastAPI middleware validates the JWT signature, extracts `tenant_id`, and injects it into the request context
6. Every graph query includes `WHERE node.tenant_id = $tid` to enforce tenant isolation

### 5.3 Audit Logging

Every write operation (POST, PUT, DELETE) is logged to PostgreSQL:

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Log entry ID |
| `timestamp` | datetime | When the action occurred |
| `user_id` | UUID | Who performed the action |
| `tenant_id` | UUID | Which tenant |
| `action` | string | e.g. "create_supplier", "update_risk_event", "import_data", "search_patents" |
| `resource_type` | string | e.g. "Supplier", "Component", "RiskEvent" |
| `resource_id` | string | ID of the affected resource |
| `details` | JSON | Request body or relevant metadata |
| `ip_address` | string | Client IP |

---

## 6. Frontend Architecture

### 6.1 Page Structure

The application has five primary pages, each serving a distinct analytical purpose. All pages share a common layout: the industrial sidebar (navigation + system status) on the left, content area on the right.

#### Dashboard (`/dashboard`)
**Purpose**: At-a-glance supply chain health overview. The first thing a user sees after login.

**Panels:**

| Panel | Content | Data source |
|---|---|---|
| **Supplier count** | Total tracked suppliers, with green LED | `GET /suppliers` (count) |
| **Component count** | Total components across all tiers | `GET /components` (count) |
| **Patents indexed** | Total patents in the graph, with blue pulsing LED while scanning | `GET /patents/count` |
| **Risk alerts** | Active alert count, with red pulsing LED if critical | `GET /risk/overview` |
| **Innovation Scores** | Bar chart or ranked list of suppliers by innovation score. Colour-coded: green (80+), amber (50-79), red (<50) | `GET /risk/scores` |
| **Recent Alerts** | List of recent risk events with severity LED, supplier name, and issue description | `GET /risk/events?limit=5` |
| **Supply Chain Coverage** | World map showing supplier locations as markers, coloured by risk score | `GET /suppliers` (with country data) |
| **Technology Maturity** | Heatmap: rows = technology domains, columns = maturity indicators. Cell colour shows filing trend | `GET /patents/technologies` |

#### Explorer (`/explorer`)
**Purpose**: Interactive knowledge graph for exploring the supply chain and its patent landscape.

**Layout**: Full-height Sigma.js graph canvas with a floating filter panel on the left and a detail drawer on the right (opens when a node is clicked).

**Graph behaviour:**
- **Initial load**: Shows tier 5-6 components and their direct suppliers (not the full graph). This prevents overwhelming the user with thousands of nodes on first render.
- **Expand on click**: Clicking a node loads its immediate neighbourhood (adjacent nodes + edges) via `POST /graph/explore`. This progressive disclosure keeps the graph navigable.
- **Node appearance**:
  - Suppliers: hexagon shape, sized by PageRank (importance in the graph), coloured by risk score (green → amber → red gradient)
  - Components: circle, sized proportional to tier (higher tier = larger), coloured by tier (consistent colour per tier)
  - Materials: diamond shape, sized by usage frequency
  - Patents: small square, coloured by status (blue = active, grey = expired, amber = pending)
  - Technologies: rounded rectangle, coloured by maturity level
- **Edge appearance**: Thickness proportional to relationship strength (volume/value for SUPPLIES, quantity for COMPOSED_OF). Dashed lines for HOLDS_PATENT (connecting supply chain to patent landscape). Colour follows source node.
- **Layout modes**:
  - **Organic** (default): Force-directed layout. Good for exploring clusters and connections.
  - **Hierarchical**: Top-to-bottom layout with tiers as horizontal bands. Best for understanding supply chain depth.
  - **Geographic**: Nodes positioned by supplier/component country coordinates. Shows geographic concentration.

**Filter panel:**
- Filter by: tier range, country, category, risk score range, innovation score range
- Toggle visibility of node types (show/hide patents, technologies, materials)
- Search: type a name to highlight and zoom to a specific node

**Detail drawer** (slides in from right when a node is clicked):
- Node properties displayed as data labels
- Related nodes listed as clickable links
- For Suppliers: innovation score gauge, risk score gauge, top 5 technologies, link to patent landscape
- For Components: BOM (bill of materials) tree, supplier list with risk indicators
- "Find Alternatives" button (for Suppliers) triggers the alternative supplier query

#### Patents (`/patents`)
**Purpose**: Search patent databases, analyse patent landscapes, and understand innovation trends.

**Layout**: Search bar at top, results grid below, filing trend chart on the right.

**Search bar:**
- Text input for natural language or keyword queries
- Source toggles: checkboxes for Google Patents, IPScreener, WIPO, Lens.org (each with a status LED showing connection state)
- Advanced filters: CPC code, date range, jurisdiction, applicant name
- "Search" button triggers `POST /patents/search`

**Results panel:**
- Table of matching patents: publication number, title, applicant(s), filing date, jurisdiction, CPC codes, relevance score
- Click a patent row to expand: shows abstract, link to full patent (external), and which Supplier node it's connected to (if any)
- Batch actions: "Link to Supplier" (creates HOLDS_PATENT relationship), "Flag for Review"

**Filing Trends panel:**
- Line chart showing patent filings over time for the current search query
- Breakdown by jurisdiction (stacked area) or by applicant (multiple lines)
- Technology maturity classification displayed as a badge

**Supplier Patent Landscape** (accessed via `/patents/supplier/{id}`):
- Overview: total patents, active vs expired, top CPC codes
- Filing rate chart: patents per year, with trend line and direction indicator
- Technology coverage radar: spider chart showing breadth across CPC classes
- Citation network: which of this supplier's patents are most cited (indicates influential innovations)
- Innovation Score breakdown: shows each component score and the composite

#### Risk (`/risk`)
**Purpose**: Assess supply chain risks, monitor threats, and get actionable recommendations.

**Layout**: Alert banner at top (if critical risks exist), severity summary cards, then two main panels.

**Critical Alert banner:**
- Full-width HazardAlert component with red hazard stripes
- Shows the highest-severity active risk with affected suppliers and components
- Dismissible, but reappears if new critical risks emerge

**Severity summary cards:**
- Three BoltedPanels showing count of Critical, Warning, and Monitored risks
- Each with appropriate LED (red pulsing, amber pulsing, blue steady)

**Risk Heat Map panel:**
- Two-dimensional matrix
- Rows: components or suppliers (switchable)
- Columns: risk dimensions (Innovation, Geographic, Concentration, Technology Maturity, Overall)
- Cell colour: green (low risk) → amber → red (high risk)
- Click a cell: opens detail showing why that score is what it is
- Sort by any column to find the most at-risk items

**Alternative Suppliers panel:**
- Triggered when a specific at-risk supplier is selected (from the heatmap or alerts)
- Shows patent-based alternative recommendations from `GET /risk/alternatives/{supplier_id}`
- For each alternative: name, country, relevant patent count, shared technologies, innovation score, geographic distance from current concentration
- Expandable rows showing the actual patents that qualify this alternative

**What-If Scenario** (modal, triggered by button):
- Select a supplier to hypothetically remove from the supply chain
- Shows cascading impacts: which components lose their supplier, which higher-tier components are affected, which final products are at risk
- Visualised as a highlighted subgraph in a mini Explorer view within the modal

#### Data (`/data`)
**Purpose**: Browse, filter, and export raw supply chain data in tabular form.

**Layout**: Full-width table with filter bar above.

**Table features:**
- Tabs: Suppliers, Components, Materials (switches the table content)
- Columns configurable per tab (show/hide columns)
- Sortable by any column (click header)
- Filterable: dropdown filters for country, tier, category, criticality
- Text search across all visible columns
- Pagination: 50 rows per page with page controls
- Row click: opens detail drawer (same as Explorer detail drawer)
- Export: CSV or JSON download of current filtered view

**Suppliers table columns:** Name, Country, Region, Innovation Score, Risk Score, Components Supplied (count), Patents Held (count), Last Enriched

**Components table columns:** Name, Part Number, Tier, Category, Criticality, Supplier(s), Material(s), Risk Score

**Materials table columns:** Name, Type, HS Code, Grade, Price Volatility, Supply Concentration, Components Using (count)

### 6.2 State Management

Zustand store with the following slices:

```typescript
interface ReadyIPStore {
  // Selected entity (shared across all views)
  selectedNode: {
    type: 'Supplier' | 'Component' | 'Material' | 'Patent' | 'Technology' | null;
    id: string | null;
  };
  setSelectedNode: (type: string, id: string) => void;
  clearSelection: () => void;

  // Explorer view state
  explorer: {
    layoutMode: 'organic' | 'hierarchical' | 'geographic';
    visibleNodeTypes: Set<string>;
    filters: {
      tierRange: [number, number];
      countries: string[];
      categories: string[];
      riskScoreRange: [number, number];
      innovationScoreRange: [number, number];
    };
  };

  // Patent search state
  patentSearch: {
    query: string;
    sources: string[];
    results: Patent[];
    isSearching: boolean;
  };

  // Risk view state
  risk: {
    selectedSupplierId: string | null;
    heatmapMode: 'suppliers' | 'components';
  };
}
```

**Cross-view coordination**: Selecting a supplier in the Explorer highlights it in the Risk heatmap, centres the Dashboard map on its location, and pre-fills the Patent search with its name. This is achieved through the shared `selectedNode` state.

### 6.3 Industrial UI Components (built, with planned enhancements)

| Component | Status | Description |
|---|---|---|
| `BoltedPanel` | ✅ Built | Card with hex bolt corners, metallic header, settle animation |
| `HexBolt` | ✅ Built | Animated decorative bolt SVG |
| `StatusLED` | ✅ Built | Green/amber/red/blue LED indicator with glow and pulse |
| `HazardAlert` | ✅ Built | Warning banner with hazard stripes, spring slide-in |
| `IrisLoader` | ✅ Built | Mechanical iris shutter loading animation |
| `NavItem` | ✅ Built | Sidebar navigation link with active state |
| `Sidebar` | ✅ Built | Navigation sidebar with logo and system status |
| `DataTable` | Planned | Sortable, filterable table with industrial styling |
| `ScoreGauge` | Planned | Circular gauge for innovation/risk scores (0-100) |
| `RiskBadge` | Planned | Compact risk indicator (critical/warning/ok) |
| `DetailDrawer` | Planned | Slide-out panel for entity details |
| `FilterBar` | Planned | Horizontal filter controls with industrial dropdowns/sliders |
| `MetricCard` | Planned | Compact stat display (number + label + trend arrow) |
| `TierBadge` | Planned | Coloured badge showing supply chain tier (1-6) |
| `SourceIndicator` | Planned | Shows which patent sources contributed to a result |
| `TimelineMarker` | Planned | Point on a timeline with expandable detail |

### 6.4 Animation Inventory

All animations use mechanical easing curves and respect `prefers-reduced-motion`.

| Animation | Trigger | Duration | Easing |
|---|---|---|---|
| Panel entrance | Page load / appear | 500ms | Robotic: `cubic-bezier(0.22, 0.68, 0.35, 1.0)` |
| Bolt screw-in | After panel lands | 300ms | Robotic (200ms delay after panel) |
| Page transition | Route change | 600ms | Framer Motion layout animation |
| Detail drawer slide | Node click | 400ms | Spring: `stiffness: 300, damping: 30` |
| Alert slide-in | Risk event | Spring | `stiffness: 300, damping: 30, mass: 1.5` |
| Iris loader | Data loading | 400ms open, loop while loading | Conveyor: `cubic-bezier(0.4, 0.0, 0.2, 1.0)` |
| LED pulse | Continuous (active LEDs) | 2s cycle | ease-in-out |
| Hover lift | Card hover | 200ms | Robotic |
| Graph camera zoom | Node click in Explorer | 500ms | Conveyor |
| Score gauge fill | Data load | 800ms | Conveyor |
| Hazard stripe shimmer | Alert visible | 3s cycle | linear |

---

## 7. Intelligence Layer

### 7.1 Innovation Score

Computed per Supplier, stored on the Supplier node, recomputed weekly.

**Input signals:**

| Signal | Weight | Computation |
|---|---|---|
| Filing velocity | 30% | Linear regression slope of patents-per-year over the last 5 years. Normalised to 0-100 where 100 = fastest accelerating filing rate in the dataset |
| Technology breadth | 20% | Count of distinct CPC subclasses (4-character level, e.g. B60K) across all patents. Normalised against the maximum in the dataset |
| Citation impact | 15% | Average forward citations per patent (how often other patents cite this supplier's patents). Normalised |
| Recency | 15% | Weighted average age of active patents, where more recent = higher score. Formula: `100 * (1 - avg_age_years / 20)`, clamped to 0-100 |
| Geographic reach | 10% | Count of distinct jurisdictions where patents are filed. Filing in US + EU + JP + CN = broad reach. Normalised |
| Research pipeline | 10% | Count of scholarly publications linked to patent applicants (via Lens.org data). Normalised |

**Output**: Float 0-100. Stored as `Supplier.innovation_score`. Historical values stored in PostgreSQL (`innovation_score_history` table) for trend analysis.

**Interpretation**:
- 80-100: Strong innovator. Active filing, broad technology coverage, recent patents, cited work.
- 50-79: Moderate. Some patent activity but may have gaps in breadth or recency.
- 20-49: Weak. Declining filing rate or narrow technology focus.
- 0-19: Negligible patent activity. May be a manufacturing-focused supplier with no R&D, or data is missing.

### 7.2 Technology Maturity Assessment

Computed per Technology node, recomputed monthly.

**Method**: Analyse the patent filing curve for all patents with the Technology's CPC prefix.

| Maturity level | Criteria |
|---|---|
| Emerging | < 50 total patents AND year-over-year filing rate increasing > 20% |
| Growing | 50-500 total patents AND filing rate stable or increasing |
| Mature | > 500 total patents AND filing rate stable (±10% year-over-year) |
| Declining | Filing rate decreasing > 20% year-over-year for 2+ consecutive years |

**Output**: Enum stored as `Technology.maturity_level` plus `Technology.filing_rate_trend` (float, positive = growing).

**Why this matters**: A supplier whose core technology is classified as "declining" presents a different risk profile than one in "growing". Even if both currently deliver reliably, the declining-tech supplier may be:
- Losing competitive advantage
- Under-investing in R&D
- Vulnerable to being surpassed by competitors in adjacent technologies

### 7.3 Composite Risk Score

Computed per Supplier-Component pair (the SUPPLIES relationship), recomputed weekly.

**Formula:**
```
risk = w1 * innovation_risk
     + w2 * geographic_risk
     + w3 * concentration_risk
     + w4 * technology_maturity_risk
     + w5 * supply_chain_depth_risk
```

**Components:**

| Component | Default weight | Computation |
|---|---|---|
| Innovation risk | 0.25 | `100 - supplier.innovation_score`. Low innovation = high risk |
| Geographic risk | 0.25 | `geography.geopolitical_risk_score`. Based on the supplier's headquarter country |
| Concentration risk | 0.25 | Herfindahl-Hirschman Index of the component's supplier base. If only 1 supplier: 100 (maximum concentration). If 2 equally split: 50. If 4 equally split: 25 |
| Technology maturity risk | 0.15 | Mapped from the maturity level of the supplier's core technology: emerging = 20 (some uncertainty), growing = 10 (low risk), mature = 30 (potential commoditisation), declining = 80 (high risk) |
| Supply chain depth risk | 0.10 | Based on the component's tier. Tier 1 (raw materials) = higher risk (longer lead time for substitution). Tier 6 = lower. Formula: `100 * (1 - (tier - 1) / 5)` |

**Weights are configurable per tenant** to reflect industry-specific priorities. An automotive OEM might weight concentration risk higher; a defence contractor might weight geographic risk higher.

**Output**: Float 0-100. Stored on the SUPPLIES relationship as `risk_score`, and the maximum across all SUPPLIES relationships is stored as `Supplier.risk_score` for quick lookup.

### 7.4 Alternative Supplier Recommendation

Triggered when a supplier's risk score crosses a configurable threshold, or on demand.

**Algorithm:**
1. Identify the at-risk supplier's technology profile: collect all CPC codes from their HOLDS_PATENT relationships
2. Query the graph for other Suppliers who HOLD_PATENT on Patents that COVER_TECHNOLOGY with overlapping CPC codes
3. Filter candidates:
   - Must not already supply the same component (avoid recommending an existing supplier)
   - Must be in a different geographic region than the at-risk supplier (geographic diversification)
   - Must comply with required Standards for the component (if standard data is available)
   - Must have innovation_score above a minimum threshold (default: 40)
4. Rank candidates by composite score:
   - Patent coverage overlap (40%): what fraction of the at-risk supplier's CPC codes does this candidate also cover?
   - Innovation score (30%): higher is better
   - Geographic diversification (20%): bonus for being in a different region from both the at-risk supplier and the majority of existing suppliers
   - Filing recency (10%): bonus for recent filings (active R&D, not legacy patents)
5. Return top 10 candidates with: name, country, relevant patent count, shared technology names, composite recommendation score, and an explanatory sentence

**Explanatory sentence template**: "[Candidate] holds [N] patents in [Technology1], [Technology2], is based in [Country] (diversifying from [at-risk region]), and has [trend] patent filing rate."

---

## 8. Security Specification

### 8.1 Authentication

| Concern | Implementation |
|---|---|
| Provider | NextAuth.js v5 (Auth.js) |
| Strategies | OAuth (Google, Microsoft Entra ID) + email/password (bcrypt, 12 rounds) |
| Session tokens | Signed JWTs (HS256 with NEXTAUTH_SECRET). 15-minute access token, 7-day refresh token |
| Cookie settings | HttpOnly, Secure, SameSite=Strict, Path=/ |
| Password policy | Minimum 12 characters, must include uppercase, lowercase, number |
| Brute force protection | Edge Middleware: 5 login attempts per IP per minute, then 15-minute lockout |

### 8.2 Authorisation (RBAC)

| Role | Permissions |
|---|---|
| `admin` | Full access. Manage users, configure tenant settings, import data, trigger enrichment, create/delete all entities |
| `analyst` | Read/write supply chain data. Search patents. View and create risk events. Cannot manage users or tenant settings |
| `viewer` | Read-only access to all dashboards and data. Cannot modify anything |

Roles are stored in PostgreSQL (`user_roles` table) and encoded in the JWT. FastAPI middleware checks the role before allowing write operations.

### 8.3 Data Protection

- All databases use managed encryption at rest (AES-256)
- All connections use TLS 1.3
- API keys for patent sources stored as Railway environment variables, never in code or frontend
- BFF pattern ensures no secrets reach the browser
- PII (user emails, names) stored only in PostgreSQL, not in Neo4j
- GDPR: user deletion removes all PII; supply chain data (business data, not personal data) is retained

### 8.4 Application Security

- Cypher queries: parameterised only (`$param` syntax), never string concatenation
- SQL queries: SQLAlchemy ORM, no raw SQL
- Input validation: Pydantic models on all FastAPI endpoints
- CSP headers: set via Edge Middleware (see `middleware.ts`)
- CORS: strict origin allowlist (Vercel production + preview domains only)
- Dependency scanning: Dependabot on GitHub, `npm audit` and `pip-audit` in CI

### 8.5 Infrastructure Security

- Railway private networking between API and worker services
- Neo4j Aura IP allowlist (only Railway egress IPs)
- GitHub Actions CI/CD with environment protection rules
- Production deployments require manual approval
- Error tracking via Sentry with PII scrubbing

---

## 9. Build Sequence

The build is ordered so that each step produces a working, demonstrable increment. No step depends on something that hasn't been built yet.

### Step 1: Foundation ✅ COMPLETE (16/03/2026, commit 7d52ae8)
**What was built**: Next.js scaffold, industrial design system, UI components, logo, sidebar, placeholder pages, security middleware.
**Result**: Running app at localhost:3333 with the industrial look and feel established.

### Step 2: Graph Database and Data Import
**What to build**:
- Neo4j Aura instance provisioned and configured
- Python script to convert the existing `enhancedDummyData.js` into the JSON import format
- FastAPI backend with a `/import` endpoint that creates nodes and relationships in Neo4j
- FastAPI endpoints: `GET /suppliers`, `GET /components`, `GET /components/{id}/lineage`
- Connect the frontend Data page to the real API (replace placeholders with live data)

**Result**: Real automotive supply chain data in Neo4j, browsable via the Data table.

### Step 3: Supply Chain Explorer
**What to build**:
- Sigma.js graph component (`@react-sigma/core`)
- `POST /graph/explore` endpoint (neighbourhood expansion)
- Graph rendering with node shapes, colours, sizing per the spec
- Filter panel component
- Detail drawer component (slide-out panel)
- Layout switching (organic, hierarchical)

**Result**: Interactive knowledge graph showing the automotive supply chain. Click to explore, filter by tier/category/country.

### Step 4: Patent Integration
**What to build**:
- Google Patents BigQuery adapter (Python)
- IPScreener adapter (port from existing demo, server-side only)
- Patent normalisation pipeline
- `POST /patents/search` endpoint
- `GET /suppliers/{id}/patents` endpoint
- Connect the Patents page: search bar → results table → filing trend chart
- Patent nodes visible in the Explorer graph

**Result**: Search real patents, see results normalised from multiple sources, view per-supplier patent landscapes.

### Step 5: Innovation Scoring
**What to build**:
- Innovation score computation service (Python)
- Celery task for weekly score computation
- `GET /risk/scores` endpoint
- ScoreGauge UI component
- Dashboard: innovation scores bar chart with live data
- Explorer: supplier nodes coloured by innovation score

**Result**: Every supplier has a computed innovation score. Visible in dashboard, explorer, and data table.

### Step 6: Risk Assessment
**What to build**:
- Composite risk score computation
- Concentration risk analysis (HHI calculation)
- Technology maturity classification
- Risk Heat Map component (Nivo heatmap)
- Risk page: heatmap with live data, severity summary cards
- HazardAlert integration with real risk data
- Alternative supplier recommendation engine + UI panel

**Result**: Full risk assessment with heatmap, alerts, and patent-based alternative supplier recommendations.

### Step 7: Sankey Diagram
**What to build**:
- D3-sankey component with custom rendering
- Value-encoded link thickness (annual procurement value)
- Risk-coloured links (green/amber/red based on supplier risk score)
- Tier-based filtering (select a product, see its supply chain)
- Integrated into the Explorer page as an alternative view mode

**Result**: Proper Sankey diagram showing material/component flows through tiers, coloured by risk.

### Step 8: Geographic View
**What to build**:
- Mapbox GL component
- Supplier locations as sized/coloured markers
- Patent filing jurisdiction choropleth overlay
- Supply chain flow arcs between countries
- Risk event overlay (pulsing indicators for active events)
- Integrated into Dashboard and Explorer

**Result**: Geographic perspective on supplier distribution, patent activity, and risk events.

### Step 9: Risk Event Monitoring
**What to build**:
- NewsCatcher API integration (Celery periodic task)
- Event-to-geography matching
- Event-to-supplier impact assessment
- Real-time alert push (WebSocket or polling)
- Risk event timeline in the Risk page

**Result**: Automated threat detection with alerts when events affect tracked suppliers.

### Step 10: What-If Scenarios and Reporting
**What to build**:
- What-if scenario modal with mini graph view
- Cascading impact computation (remove a supplier, trace affected components)
- Report generation (PDF/CSV export of risk assessments, patent landscapes)
- Multi-tenant data isolation (tenant_id enforcement)
- RBAC enforcement on all endpoints

**Result**: Enterprise-ready platform with scenario planning, reporting, and multi-tenant security.

---

## 10. File and Module Index

Complete list of files to be created, organised by function.

### Frontend (`apps/web/`)

```
src/
├── app/
│   ├── globals.css                    ✅ Industrial styles, textures, utility classes
│   ├── layout.tsx                     ✅ Root layout with Sidebar
│   ├── page.tsx                       ✅ Redirect to /dashboard
│   ├── dashboard/
│   │   └── page.tsx                   ✅ Dashboard (to be connected to live data)
│   ├── explorer/
│   │   └── page.tsx                   ✅ Placeholder (Step 3: Sigma.js graph)
│   ├── patents/
│   │   ├── page.tsx                   ✅ Patent search (Step 4: live search)
│   │   └── supplier/
│   │       └── [id]/
│   │           └── page.tsx           Planned: Per-supplier patent landscape
│   ├── risk/
│   │   └── page.tsx                   ✅ Risk assessment (Step 6: live data)
│   ├── data/
│   │   └── page.tsx                   ✅ Data table (Step 2: live data)
│   ├── settings/
│   │   └── page.tsx                   Planned: User/tenant settings
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx               Planned: Login page
│   └── api/
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.ts           Planned: NextAuth API route
│       ├── suppliers/
│       │   └── route.ts               Planned: BFF proxy to backend /suppliers
│       ├── components/
│       │   └── route.ts               Planned: BFF proxy to backend /components
│       ├── patents/
│       │   └── route.ts               Planned: BFF proxy to backend /patents
│       └── risk/
│           └── route.ts               Planned: BFF proxy to backend /risk
├── components/
│   ├── ui/
│   │   ├── BoltedPanel.tsx            ✅ Card with hex bolt corners
│   │   ├── HexBolt.tsx                ✅ Animated decorative bolt
│   │   ├── StatusLED.tsx              ✅ LED status indicator
│   │   ├── HazardAlert.tsx            ✅ Warning banner with hazard stripes
│   │   ├── IrisLoader.tsx             ✅ Mechanical iris loading animation
│   │   ├── NavItem.tsx                ✅ Sidebar navigation link
│   │   ├── Sidebar.tsx                ✅ Navigation sidebar
│   │   ├── index.ts                   ✅ Barrel export
│   │   ├── DataTable.tsx              Planned: Sortable, filterable table
│   │   ├── ScoreGauge.tsx             Planned: Circular 0-100 gauge
│   │   ├── RiskBadge.tsx              Planned: Compact risk indicator
│   │   ├── DetailDrawer.tsx           Planned: Slide-out entity detail panel
│   │   ├── FilterBar.tsx              Planned: Horizontal filter controls
│   │   ├── MetricCard.tsx             Planned: Compact stat with trend arrow
│   │   ├── TierBadge.tsx              Planned: Tier 1-6 coloured badge
│   │   └── SourceIndicator.tsx        Planned: Patent source indicator
│   ├── graph/
│   │   ├── SupplyChainGraph.tsx       Planned: Sigma.js graph wrapper
│   │   ├── GraphControls.tsx          Planned: Layout mode, zoom, reset
│   │   └── NodeTooltip.tsx            Planned: Hover tooltip for graph nodes
│   ├── sankey/
│   │   ├── SupplyChainSankey.tsx      Planned: D3-sankey diagram
│   │   └── SankeyControls.tsx         Planned: Filter and display options
│   ├── map/
│   │   ├── SupplyChainMap.tsx         Planned: Mapbox GL map
│   │   ├── SupplierMarker.tsx         Planned: Map marker component
│   │   └── FlowArc.tsx               Planned: Animated supply chain arc
│   └── charts/
│       ├── InnovationScoreChart.tsx   Planned: Bar/ranked list of scores
│       ├── FilingTrendChart.tsx        Planned: Patent filings over time
│       ├── RiskHeatMap.tsx            Planned: Nivo heatmap
│       ├── TechMaturityChart.tsx      Planned: Technology maturity display
│       └── TechRadar.tsx             Planned: Spider/radar chart for tech coverage
├── lib/
│   ├── design-tokens.ts               ✅ Colour, typography, animation tokens
│   ├── store.ts                       Planned: Zustand store
│   ├── api-client.ts                  Planned: Typed fetch wrapper
│   └── auth.ts                        Planned: NextAuth configuration
├── middleware.ts                       ✅ Edge security middleware
└── types/
    ├── graph.ts                        Planned: TypeScript types for graph entities
    ├── patent.ts                       Planned: Patent-related types
    └── risk.ts                         Planned: Risk-related types
```

### Backend (`apps/api/`)

```
apps/api/
├── main.py                            Planned: FastAPI app initialisation, CORS, middleware
├── config.py                          Planned: Settings from environment variables
├── routers/
│   ├── supply_chain.py                Planned: /suppliers, /components, /graph endpoints
│   ├── patents.py                     Planned: /patents endpoints
│   ├── risk.py                        Planned: /risk endpoints
│   ├── admin.py                       Planned: /import, /enrich, tenant management
│   └── health.py                      Planned: /health, /status
├── services/
│   ├── graph_service.py               Planned: Neo4j query execution, Cypher query builder
│   ├── patent_service.py              Planned: Patent search orchestration across sources
│   ├── risk_service.py                Planned: Risk score computation, alert generation
│   ├── scoring.py                     Planned: Innovation score, technology maturity algorithms
│   └── import_service.py              Planned: JSON/CSV import into Neo4j
├── adapters/
│   ├── base.py                        Planned: Abstract base class for patent source adapters
│   ├── google_patents.py              Planned: BigQuery adapter
│   ├── ipscreener.py                  Planned: IPScreener API adapter (ported from demo)
│   ├── wipo.py                        Planned: WIPO PatentScope adapter
│   └── lens.py                        Planned: Lens.org API adapter
├── models/
│   ├── graph_models.py                Planned: Pydantic models for graph entities
│   ├── db_models.py                   Planned: SQLAlchemy models for PostgreSQL
│   └── api_models.py                  Planned: Request/response Pydantic models
├── middleware/
│   ├── auth.py                        Planned: JWT validation middleware
│   ├── tenant.py                      Planned: Tenant isolation middleware
│   └── audit.py                       Planned: Audit logging middleware
├── tasks/
│   ├── patent_ingestion.py            Planned: Celery tasks for patent data refresh
│   ├── risk_monitoring.py             Planned: Celery tasks for news monitoring
│   └── scoring.py                     Planned: Celery tasks for score computation
├── requirements.txt                   Planned: Python dependencies
└── Dockerfile                         Planned: Railway deployment
```

### Infrastructure

```
ready-ip/
├── .github/
│   └── workflows/
│       ├── ci.yml                     Planned: Lint, type-check, test, security scan
│       └── deploy.yml                 Planned: Production deployment with approval gate
├── .gitignore                         ✅ Comprehensive exclusions
├── docker-compose.yml                 Planned: Local development (all services)
├── vercel.json                        Planned: Vercel deployment configuration
├── start-dev.sh                       ✅ Dev server launcher (PATH workaround)
└── SPECIFICATION.md                   This document
```

---

## 11. Cost Estimate

### MVP (Steps 1-6)

| Service | Monthly cost |
|---|---|
| Vercel (Hobby or Pro) | $0-20 |
| Railway (API + 1 worker) | ~$10 |
| Neo4j Aura Free (200K nodes) | $0 |
| Neon PostgreSQL (free tier) | $0 |
| Upstash Redis (free tier) | $0 |
| Google BigQuery (free first 1TB) | $0 |
| OpenRouter (gpt-4.1-mini for embeddings) | ~$5 |
| **Total** | **$15-35/month** |

### Production (Steps 7-10, real data volumes)

| Service | Monthly cost |
|---|---|
| Vercel Pro | $20 |
| Railway (API + 2 workers) | ~$25 |
| Neo4j Aura Pro | ~$65 |
| Neon PostgreSQL (Pro) | ~$19 |
| Upstash Redis (Pay-as-you-go) | ~$5 |
| Google BigQuery | ~$10 |
| NewsCatcher API | ~$50 |
| Sentry (error tracking) | $0-26 |
| **Total** | **~$220/month** |

---

## 12. Open Questions

Items requiring Andrew's input before or during build:

1. **Sample data scope**: The existing demo has ~100 components across 6 tiers. For the initial import, should we keep this dataset as-is, expand it with additional real supplier data, or source a more comprehensive automotive supply chain dataset?

2. **IPScreener API status**: The demo's API keys may have expired or changed. Need to verify access before building the IPScreener adapter.

3. **Google Cloud project**: BigQuery requires a GCP project for queries. Does Andrew have a GCP account, or should we create one under the ICF or MTF organisation?

4. **Tenant model for MVP**: Should the MVP be single-tenant (simpler, faster to build) with multi-tenancy added in Step 10, or should tenant isolation be built from Step 2?

5. **User management for MVP**: For early demonstration, is a single admin account sufficient, or do we need the full auth flow (registration, OAuth) from the start?

6. **Domain**: When ready to deploy, should we use `readyip.industrycommons.net` or register a standalone domain?

7. **NewsCatcher API**: This requires an API key and has a paid tier. Should we defer risk event monitoring to later, or is it worth setting up early for demos?
