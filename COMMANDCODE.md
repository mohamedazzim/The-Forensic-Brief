# COMMANDCODE.md — Raven Discipline Engine

> **This file is the contract.** Command Code reads this on every turn. The rules below are not aspirational — they are how Command Code must behave in this project.

---

## Per-Turn Discipline Contract

### Step 1 — Gate Check

| User said | Mode | Behavior |
|---|---|---|
| Anything (no opt-out) | Raven (default) | Route through Andie + specialists |
| Literally `Lucky` | Lucky | Execute direct — no governance layer |

### Step 2 — Name the Specialist (Mandatory Before Any Tool Call)

Before any tool call, state which Raven specialist is being invoked. If no specialist matches → HALT and ask the user.

**Default first responder:** Andie (`.commandcode/skills/andie/SKILL.md`)

### Step 3 — Show The Routing

```
Raven gate: Routing through {specialist} for {reason}
```

### Step 4 — Execute

Only after Steps 1–3 succeed, execute the work.

### Step 5 — Recap

After any non-trivial action, end with what changed and what's next.

---

## Non-Negotiable Rules

```
1. NO SECRETS committed to Git — ever
2. NO LIBRARY added without CVE check
3. NO DELETION without approval
4. NO SILENT ROUTING — every specialist invocation must be visible
5. NO OVERRIDE of rules 1–4 — not even by the user
```

---

## Available Skills

All skills are in `.commandcode/skills/`. Use `/skills` to browse them.

**Core Skills:**
- `raven-core` — Prompt analysis and routing (always active)
- `andie` — Orchestration layer for complex work
- `raven-review` — Code review with manifest awareness
- `raven-security` — Security review
- `raven-test` — Test-first discipline
- `raven-refactor` — Style enforcement

**Specialist Skills:**
- AWS, Azure, GCP, OCI — Cloud specialists
- Postgres, Redis, Vector DB — Database specialists
- K8s, Terraform, DevOps — Infrastructure specialists
- ML, AI/ML, Data Engineering — Data specialists
- FastAPI, NiceGUI, Odoo, Salesforce — Framework specialists

---

## Available Agents

All agents are in `.commandcode/agents/`. These fire automatically:

- `architecture-guard` — Ensures architecture docs exist
- `db-guard` — Database discipline enforcement
- `stack-validator` — Library/CVE validation
- `style-enforcer` — Code style enforcement
- `skill-guard` — Skill security rules
- `guard-git-watch` — Git operation monitoring

---

## MCP Tools

The Raven MCP server provides these tools:

- `raven_status` — Check manifest and project health
- `raven_cve_check` — CVE security check on libraries
- `raven_sync_libs` — Sync libraries from requirements
- `raven_debug` — Full project health check
- `raven_violation` — Emit violation to audit log

---

## Guard Rules

```
Secrets in staged files    → hard block commit
CVE critical (CVSS >7)     → hard block commit
Force push detected        → hard block
>100 rows deleted          → approval flow
Schema drop                → hard block + escalate
```

---

*Raven v4.0.0 — MIT — github.com/giggsoinc/raven*