<p align="center">
  <img src="brand/logos/solidus_icon.png" alt="Solidus Identity" height="80" />
</p>

<h3 align="center">Solidus Identity</h3>

<p align="center">
  Self-sovereign identity manager — create DIDs, manage credentials,<br/>
  <strong>share verifiable claims with zero-knowledge selective disclosure.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/backend-Fastify-black?style=flat-square" />
  <img src="https://img.shields.io/badge/frontend-Next.js_15-black?style=flat-square" />
  <img src="https://img.shields.io/badge/endpoints-12-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/pages-31-blue?style=flat-square" />
</p>

---

## Overview

Solidus Identity is the self-sovereign identity hub of the [Solidus Network](https://github.com/solidusnetwork). Users create W3C DIDs, receive verifiable credentials (from KYC, email, phone verification), and selectively share claims with third parties — all without a central authority.

## Features

- **DID creation** — Client-side Ed25519 key generation, `did:solidus` method
- **Credential inbox** — Receive and manage verifiable credentials
- **Selective sharing** — Share specific claims via QR code without revealing full credentials
- **OIDC bridge** — "Login with Solidus" for third-party applications
- **Trust score** — Reputation scoring based on credential history
- **Social recovery** — 3-of-5 guardian-based key recovery (planned)
- **31-page app** — Full identity management interface, dark/light mode

## Architecture

```
identity/
├── apps/
│   ├── backend/           Fastify API server
│   │   └── src/routes/    12 endpoints: auth, credentials, sharing, trust-score
│   └── frontend/          Next.js 15 application
│       └── src/app/       31 pages with real API integration
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /auth/challenge` | Create DID authentication challenge |
| `POST /auth/verify` | Verify signed challenge |
| `GET /credentials` | List user's credentials |
| `POST /credentials/share` | Generate shareable credential presentation |
| `GET /did/:did` | Resolve a DID document |
| `POST /did/create` | Register a new DID |
| `GET /trust-score` | Calculate identity trust score |

## Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | Node.js, Fastify, PostgreSQL |
| Frontend | Next.js 15, React, Tailwind CSS |
| Identity | W3C DIDs, Verifiable Credentials |
| Auth | EdDSA challenge-response, OIDC bridge |
| SDK | @solidus/sdk, @solidus/auth, @solidus/jwt |

## Standards

- **W3C DID Core** — `did:solidus:<network>:<identifier>`
- **W3C VC Data Model v2.0** — Credential issuance and verification
- **Ed25519Signature2020** — Credential proofs
- **OpenID Connect** — OAuth2/OIDC bridge for third-party login

## License

Proprietary. All rights reserved. See [Solidus Network](https://github.com/solidusnetwork) for more information.
