# AI-Blog — Architecture

## Overview

Personal AI blog portfolio project built with Next.js, TypeScript, and PostgreSQL on Azure.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14+, TypeScript, React 18+ |
| Backend | Next.js API Routes / Server Actions |
| Database | PostgreSQL (Azure Database for PostgreSQL) |
| Hosting | Azure Static Web Apps / Azure App Service |
| Auth | NextAuth.js (planned) |
| CMS | MDX for blog posts (planned) |

## Directory Structure

```
Blog_Proj/
├── .commandcode/          # Command Code / Raven skills & config
│   ├── skills/            # 61 specialist skills
│   ├── scripts/           # Raven engine scripts
│   ├── agents/            # Agent configurations
│   ├── commands/          # Command definitions
│   ├── taste/             # Learned preferences
│   └── .mcp.json          # MCP server config
├── .raven/                # Raven discipline engine
│   ├── manifest.json      # Project manifest
│   ├── architecture.md    # This file
│   ├── memory/            # Session memory
│   └── raven_version      # Engine version stamp
├── raven-main/            # Raven engine source (v4.0.0)
│   ├── raven-core/        # Core scripts, guards, registry
│   ├── skills/            # Skill definitions
│   ├── agents/            # Agent definitions
│   └── mcp/               # MCP server
└── src/                   # Application source (planned)
```

## Data Flow

```
User → Next.js Frontend → API Routes → PostgreSQL
                ↓
         Azure Static Web Apps
```

## Guards Active

- **architecture-guard**: Requires this file for new code files
- **style-enforcer**: TypeScript style, type hints, docstrings
- **stack-validator**: Library approval flow
- **manifest-checker**: Manifest integrity on every action

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-19 | Initial architecture — Next.js + TS + PostgreSQL on Azure |
