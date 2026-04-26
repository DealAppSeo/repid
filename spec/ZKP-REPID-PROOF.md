# ZKP RepID Proof — Specification v0.1

**Status:** v0.1 working spec, 2026-04-26.
**Spec authority:** This document is normative for the proof
*structure*. Circuit source lives in `hyperdag-core/services/zkp-postcard/`
and is the implementation ground truth for circuit semantics.

---

## Statement

The prover holds an SBT or DBT bound to a wallet whose RepID `R`
satisfies `R ≥ T` for a public threshold `T`, **without revealing
`R`, the wallet address, or the nonce used in the RepID commitment.**

## Why zero-knowledge

- **Prevents bracket gaming.** A non-private RepID system creates
  perverse incentives — agents would shape behaviour to barely clear
  specific thresholds because the threshold is observable. ZKP makes
  the threshold check binary (passed / not) and hides the underlying
  value.
- **Enables tier-gated services without value disclosure.** A counterparty
  needs to know "this agent is at AUTONOMOUS tier" to grant access; it
  does not need to know the agent has 8,742 RepID specifically.
- **Enables federated RepID aggregation.** v1 federated learning
  patterns aggregate RepID-correlated metrics across agents without
  disclosing individual scores. The threshold-proof primitive is the
  foundation of that aggregation.

## Proof system

- **Plonky3** (chosen for: post-quantum security, fast prover, recursive
  composition, no trusted setup).
- Implementation lives in the `hyperdag-core` Rust workspace —
  specifically `services/zkp-postcard/src/circuit.rs` for the v0.1
  postcard-tier prover.
- This document is the **circuit specification**; circuit *code* is in
  hyperdag-core. The two MUST agree; if they diverge, the code wins
  and a PR to update this spec is expected.

## Circuit: rep_id_threshold

### Public inputs

| Name | Type | Notes |
|---|---|---|
| `T` | `uint256` | Public threshold the prover claims to meet. |
| `C` | `bytes32` | Holder commitment, `H(holderAddress \|\| nonce)`. Bound at SBT-mint time and updated on RepID change. |

### Private inputs (witness)

| Name | Type | Notes |
|---|---|---|
| `R` | `uint256` | The actual RepID value, in `[0, 10000]`. |
| `nonce` | `bytes32` | Random salt chosen at commitment time. |
| `holderAddress` | `bytes20` | The wallet address whose SBT holds the RepID. |

### Constraints

The circuit MUST enforce all of the following:

1. **Range:** `0 ≤ R ≤ 10000`. The 10,000 ceiling matches the Trinity
   Symphony tier system (`AUTONOMOUS` cap, see
   `hyperdag-protocol/METHODOLOGY.md` §2).
2. **Threshold:** `R ≥ T`. Range enforcement on `T` is the verifier's
   responsibility (see verification flow).
3. **Commitment opening:** `C == H(holderAddress || nonce)`. The hash
   `H` is Poseidon2 to match the rest of the HyperDAG ZKP layer.

### Output

| Field | Description |
|---|---|
| `proof` | Variable-length bytes, Plonky3 STARK. |
| `public_signals` | `[T, C]` — the verifier MUST be supplied the same `T` and `C` values the prover used. |

## Verification flow

### On-chain verification

- Smart contract calls `Plonky3Verifier.verify(proof, [T, C])`.
- Returns `true` if the proof is valid AND the supplied public signals
  match what the prover committed to.
- Gas cost: ~250-500k gas for full verification (per Plonky3
  benchmarks). Recursive composition MAY reduce this in v0.2.
- Verifier MUST also independently check `T` against the gating
  policy of the calling contract (e.g. "T ≥ 5000 for AUTONOMOUS
  access"). The circuit only proves `R ≥ T`; it does not enforce
  what `T` should be for any particular access decision.

### Off-chain verification (audit chain)

- The `hal_audit_chain` table (in the private repid-engine, or its
  public analogue once published) stores `proof_hash + verifier_result`
  for every threshold proof generated.
- Anyone with read access to the audit chain can re-verify by
  re-running `Plonky3Verifier.verify(proof, [T, C])`. This is the
  out-of-band reproducibility path that makes the engine's verdicts
  auditable without requiring on-chain settlement of every proof.

## Earned vs Perceived RepID — three proof variants

RepID has two components that compose into a final score:
- **Earned RepID** — the agent's own verified actions, weighted by
  per-action category.
- **Perceived RepID** — peer attestations, weighted by attesters' own
  RepID.

The `rep_id_threshold` circuit can be specialised to prove a threshold
on either component or on the combined score.

### Variant 1 — Earned RepID proof

- **Statement:** "I have completed N verified actions with weights
  `w_1, …, w_N`, and `Σ w_i ≥ T_e`."
- **Witnesses:** action proofs (per-action commitments stored in the
  audit chain), weight assignments.
- **Public signals:** `T_e`, holder commitment.

### Variant 2 — Perceived RepID proof

- **Statement:** "I have received `M` peer attestations with attester
  RepID weights `r_1, …, r_M`, and `Σ r_i ≥ T_p`."
- **Witnesses:** attestation list, attester RepID commitments
  (chained — each attester's RepID has its own commitment that this
  proof recursively verifies).
- **Public signals:** `T_p`, holder commitment.

### Variant 3 — Combined RepID proof (70/30 weighted)

- **Statement:** `0.7 × earnedScore + 0.3 × perceivedScore ≥ T_combined`.
- **Witnesses:** the witnesses of variants 1 and 2.
- **Public signals:** `T_combined`, holder commitment.

The 70/30 split is the v0.1 default, derived from the per-event
weights in `repid-engine`. Future versions MAY parameterise the split;
when they do, the split coefficient becomes a public input.

## Test vectors

### Test case 1 — simple threshold (passing)

- **Inputs:** `R = 8500`, `T = 7000`,
  `holderAddress = 0x71be63f3384f5fb98995898a86b02fb289d76570`,
  `nonce = 0x0000…01`.
- **Expected:** the prover generates a valid proof; the verifier
  returns `true` for `[T=7000, C=Poseidon2(holder || nonce)]`.

### Test case 2 — failing threshold

- **Inputs:** `R = 6500`, `T = 7000`, same holder and nonce as case 1.
- **Expected:** the prover **fails** at witness validation. No proof
  is emitted. The verifier never sees the failed proof; the failure
  is detectable only at proving time.

### Test case 3 — forged commitment

- **Inputs:** `R = 8500`, `T = 7000`, but `C` does not match
  `H(holderAddress || nonce)` (the prover supplied an inconsistent C).
- **Expected:** witness validation fails. No proof is emitted. The
  prover SHOULD return a clear error at the SDK layer (e.g.
  `commitment_mismatch`).

### Test case 4 — tampered public signal

- **Inputs:** valid proof generated with `[T=7000, C=...]`, but
  verifier supplied `[T=5000, C=...]`.
- **Expected:** verifier returns `false`. This is the standard public-
  signals tampering check; it is part of Plonky3's verifier and not a
  HyperDAG-specific constraint.

## Privacy guarantees

The verifier learns:
- That the threshold `T` was met.
- That `C` is a valid commitment (i.e. opens to *some* holder/nonce
  pair), but not which one.

The verifier does NOT learn:
- The exact value of `R`.
- The holder's wallet address (unless it is also disclosed by another
  channel — out of scope for this proof).
- The nonce used in the commitment.
- The history of actions or attestations that produced `R`.

## Known limitations of v0.1

- **No freshness.** A proof generated yesterday is valid today, even if
  `R` has dropped below `T` in the meantime. v0.2 will add a
  `commitmentEpoch` public input so verifiers can require recent
  commitments.
- **No range proofs on individual contributions.** The earned-score
  variant aggregates without proving each `w_i` is bounded. A
  malicious witness could in principle inject an out-of-range weight.
  v0.2 closes this with per-weight range constraints.
- **No revocation.** If a holder loses their wallet, all valid proofs
  generated before the loss are still verifiable. The audit chain
  records the loss event, but the proof itself cannot be invalidated
  retroactively. v1 design candidate: revocation Merkle root in
  the verifier's public-signal set.
- **Circuit not yet audited.** Filing P-014 with this spec strengthens
  patent priority before audit. The circuit code is open for review
  in `hyperdag-core/services/zkp-postcard/src/circuit.rs`.

## Compatibility with the SBT mint flow

This proof structure assumes the SBT was minted per
`hyperdag-protocol/spec/SBT-MINTING-FLOW.md`. Specifically:
- The `repIdCommitment` field of the SBT metadata corresponds to
  this spec's `C`.
- The `RepIDCommitted` event marks the moment after which proofs can
  be generated against a holder's current RepID.
- A new commitment (Phase 6 of the mint flow, repeated whenever RepID
  changes) invalidates all prior commitments for proof purposes —
  proofs MUST cite the most recent `RepIDCommitted` event's hash.

## v0.2 candidates (forward-looking, NOT in v0.1)

- Freshness via `commitmentEpoch` public input.
- Per-action range proofs in the earned-score variant.
- ZKP-anonymous voting (currently votes on agent claims are linked
  to voter RepID; a future variant could prove "voter RepID ≥ V"
  without revealing the voter).
- Recursive composition for cross-chain RepID aggregation.

## References

- Plonky3: <https://github.com/Plonky3/Plonky3>
- Circuit source: `hyperdag-core/services/zkp-postcard/src/circuit.rs`
- SBT mint flow: `hyperdag-protocol/spec/SBT-MINTING-FLOW.md`
- Agent staking + challenge protocol (consumes this proof):
  `repid/spec/AGENT-STAKING-CHALLENGE-PROTOCOL.md`
- HyperDAG methodology: `hyperdag-protocol/METHODOLOGY.md`
