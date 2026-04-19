# Security Checklist

Security review for DeCo — Decentralized Combinator on Stellar Soroban.

---

## Smart Contract Security

### Authorization
- [x] `require_auth()` called on every state-changing function (`apply`, `vote`, `stake_to_become_vc`, `vc_invest`, `vote_milestone`, `claim_funds`, `release_milestone`, `approve_application`)
- [x] Admin-only functions verify caller matches stored admin address
- [x] VCs verified against on-chain registry before investing
- [x] Milestone voters verified as actual investors before vote is accepted

### Data Integrity
- [x] No `Option<T>` returns — all reads use `exists: bool` pattern to prevent null panics
- [x] Integer arithmetic is safe by default in Rust (overflow panics in debug, wraps in release — Soroban uses checked math)
- [x] Duplicate prevention: `already applied` check on `apply()`, `already voted` check on `vote()`, `already voted for this milestone` check on `vote_milestone()`
- [x] Funding goal validated as positive in contract
- [x] Investment amount validated as positive (`amount <= 0` panics)

### Fund Safety
- [x] Milestone escrow: funds held in contract, not released until majority VC vote
- [x] Last milestone releases all remaining funds to prevent dust locks
- [x] Tranche calculation guards against releasing more than escrowed balance
- [x] `claim_funds` only releases `unlocked_balance - claimed_balance` (no double-claim)

### Reentrancy
- [x] Not applicable — Soroban's execution model is single-threaded and atomic per transaction. No reentrancy vectors exist.

### Upgrade Risk
- [x] Contract is immutable once deployed — no upgrade mechanism exists. New features require redeployment and migration.

---

## Frontend Security

### Wallet & Signing
- [x] All transactions signed exclusively via Freighter — private keys never touch the frontend
- [x] Transaction XDR displayed to user in Freighter before signing
- [x] Network passphrase validated on every transaction build

### Fee Bump API
- [x] Sponsor secret key stored in Vercel environment variables — never in frontend bundle
- [x] API validates `x-deco-secret` header before processing any request
- [x] Inner transaction parsed and validated before wrapping
- [x] CORS restricted to same-origin requests

### Input Validation
- [x] Funding goal parsed as float, converted to stroops with `Math.floor`
- [x] Investment amount parsed as float, converted to stroops with `Math.floor`
- [x] Wallet address validated via `StellarSdk.StrKey.decodeEd25519PublicKey` before use
- [x] IPFS CID stored as-is — metadata fetched from trusted Pinata gateway

### Environment Variables
- [x] `SPONSOR_SECRET_KEY` — Vercel env only, never in code
- [x] `VITE_SUPABASE_ANON_KEY` — publishable key, safe to expose (RLS enforced)
- [x] `VITE_PINATA_JWT` — scoped to pinning only, not admin operations
- [x] No private keys in `.env` files committed to git

### Supabase RLS
- [x] Row Level Security enabled on all tables (`messages`, `wallet_sessions`, `page_events`)
- [x] Insert policies: anyone can insert (wallet address is the identity)
- [x] Select policies: anyone can read (all data is public by design)
- [x] No delete or update policies — records are append-only

---

## Infrastructure Security

### Deployment
- [x] Production deployed on Vercel with HTTPS enforced
- [x] No sensitive data in git history
- [x] `tools/` folder (internal scripts) in `.gitignore` — never committed
- [x] Supabase project on dedicated instance, not shared

### Dependencies
- [x] `@stellar/stellar-sdk` v14 — latest stable
- [x] `@supabase/supabase-js` v2 — latest stable
- [x] `@stellar/freighter-api` v2 — latest stable
- [ ] Automated dependency scanning not yet configured (Dependabot recommended)

---

## Known Limitations (Testnet Only)

> ⚠️ This contract is deployed on **Stellar Testnet** only. The following items must be addressed before any mainnet deployment:

- [ ] Professional smart contract audit by a Soroban-specialized firm
- [ ] Formal verification of fund release logic
- [ ] Multi-sig admin key (currently single admin key)
- [ ] Rate limiting on voting (currently one vote per wallet, but no time-based limits)
- [ ] Dependabot or equivalent for automated dependency updates
- [ ] Penetration testing of the fee bump API endpoint

---

## Incident Response

If a security issue is discovered:
1. Contact: `neelpote96@gmail.com`
2. Do not disclose publicly until patched
3. Contract can be redeployed with a new admin key if compromised

---

*Last reviewed: April 2026*
