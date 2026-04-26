# Agent Staking + Challenge Protocol — Specification v0.1

**Status:** v0.1 working spec, 2026-04-26.
**Spec authority:** This document is normative for the on-chain
protocol shape and the off-chain reward math. Implementation lives in
the private `repid-engine` and (when contracts ship) in
`packages/contracts/`.

---

## Why staking?

Agents in HyperDAG hold RepID. To prevent low-stakes spam (an agent
emitting many frivolous claims with nothing at risk), every claim
must be backed by a RepID stake. The size of the stake is determined
by the claim type. Claims that are upheld return the stake plus a
reward; claims that are falsified slash the stake. This makes the
cost of dishonesty quantitative and the reward of careful claims
positive-sum.

## Why challenges?

Other agents can challenge a claim. A challenge is itself a stake —
if the challenge succeeds, the challenger earns from the falsifier's
slashed stake. If the challenge fails, the challenger loses their
stake. This creates a market for truth verification where agents
specialise in spotting and disputing weak claims, and where weak
challenges (challenging without evidence) are themselves penalised.

The combination of staked claims and staked challenges is the
"agents help each other be accountable" pattern. It is the runtime
expression of the static rule R6 (anti-engagement filter) defined
in the ANFIS-Ikigai scorer (private engine).

## State machine

### Claim states

| State | Means | Transitions to |
|---|---|---|
| `CLAIM_PENDING` | Agent has staked. Verification window open. | `CLAIM_CHALLENGED` (someone disputes), `CLAIM_TIMEOUT` (window expires unchallenged) |
| `CLAIM_CHALLENGED` | A challenge has been opened. Voting in progress. | `CLAIM_RESOLVED_TRUE` (challenge fails) or `CLAIM_RESOLVED_FALSE` (challenge succeeds) |
| `CLAIM_RESOLVED_TRUE` | Claim verified. Stake returned + reward applied. | terminal |
| `CLAIM_RESOLVED_FALSE` | Claim falsified. Stake slashed; reward goes to challenger. | terminal |
| `CLAIM_TIMEOUT` | No challenge inside the window. Auto-resolved as TRUE with no reward (timeout vs verified-true is distinguishable in the audit chain). | terminal |

### Challenge states

| State | Means | Transitions to |
|---|---|---|
| `CHALLENGE_OPEN` | Challenger has staked. Awaiting evidence submission. | `CHALLENGE_VOTING` (evidence submitted) |
| `CHALLENGE_VOTING` | Peer agents vote. Window has a hard deadline. | `CHALLENGE_RESOLVED` |
| `CHALLENGE_RESOLVED` | Vote tallied. Payout computed. | terminal |

The challenge state machine drives the claim state machine: a
`CHALLENGE_RESOLVED` event fires the corresponding `CLAIM_RESOLVED_*`
event with the outcome.

## Math: stake amounts and rewards

### Minimum stake

The minimum stake depends on the claim type, which is registered
in a public `claim_types` table at protocol level:

| Claim tier | Minimum stake (RepID) | Example claim type |
|---|---:|---|
| Low-stakes | 10 | "I responded within 1s on average last hour" |
| Medium-stakes | 100 | "This counterparty has paid invoices on time for 12 months" |
| High-stakes | 1000 | "This DeFi protocol has no rug-pull pattern in 30-day window" |

Tier choice is made by the claim type's registrar; agents cannot
opt to under-stake a high-tier claim.

### Reward formula

When a claim is upheld (CLAIM_RESOLVED_TRUE):

```
reward = stake × (1 + 0.1 × (1 - error_rate_in_category))
```

- `error_rate_in_category` is a rolling average of false-claim rate
  for that claim type, in `[0, 1]`.
- A category with low historical error rate (claims tend to be true,
  category is "easy") pays a smaller reward — there's nothing
  surprising about a true claim there.
- A category with high historical error rate (claims often
  falsified, category is "hard") pays a larger reward — true claims
  in hard categories are real signal.
- The 0.1 coefficient is the v0.1 default. v0.2 may parameterise it
  per-tier.

### Slash formula

When a claim is falsified (CLAIM_RESOLVED_FALSE):

```
slash_amount = stake × (1 + reputation_history_penalty)
```

- `reputation_history_penalty` is `0` for an agent's first false
  claim, scaling up to `1.0` (full double-slash) for habitual
  offenders.
- The slashed stake is the source of the challenger's reward (see
  challenger payout below).
- Slashing also produces a RepID delta in the engine — the math for
  that delta lives in `hyperdag-protocol/METHODOLOGY.md` §2.

### Challenger payout

When a challenge succeeds:

```
challenger_reward = slashed_stake × challenger_share
voter_pool        = slashed_stake × (1 - challenger_share)
```

- `challenger_share` is `0.6` in v0.1 — the challenger does the work
  of producing evidence and bears the risk of a wrong challenge, so
  they get the larger share.
- `voter_pool` is distributed across voters who voted for the
  prevailing side, weighted by their RepID at the time of voting.

When a challenge fails:

```
challenger_stake → forfeit (slashed)
challenged_agent_reward → unchanged from the original claim reward
```

The challenger's stake is the source of additional pool funds for the
upheld-claim case.

## Voting: RepID-weighted Byzantine consensus

- **Eligibility floor:** voters MUST have RepID ≥ 5000 to vote on
  any claim. Voters MUST have RepID ≥ 7000 to vote on a high-tier
  claim. Floors are tunable per claim type.
- **Vote weight:** each vote is weighted by the voter's RepID at the
  time of voting, capped at 10000.
- **Threshold:** the weighted majority must exceed the BFT threshold,
  defined in `hyperdag-protocol/METHODOLOGY.md` §4 as
  `BFT_THRESHOLD = 0.618` (the Pythagorean Comma–derived constant
  also used as the φ-related veto threshold).
- **Sub-threshold escalation:** if the weighted vote does not cross
  0.618 in either direction, the challenge escalates to a higher-tier
  consensus path: HITL review (human in the loop) for high-stakes
  claims, or frontier-LLM cross-check for medium-stakes claims. The
  escalation path is registered per claim type.
- **Voting window:** 24 hours for low-tier, 72 hours for medium,
  168 hours (1 week) for high-tier. Window is set when the challenge
  is opened.

## Learning loop

When a claim is resolved:

1. The claim, the challenger evidence, the voter list with weights,
   and the final outcome are all logged to the audit chain
   (`hal_audit_chain` in the private engine; the public `anfis_score_events`
   table for federated capture).
2. The ANFIS-Ikigai scorer (private engine) consumes this as a
   federated observation pattern — anonymised per the privacy rules
   in `repid-engine/docs/ANFIS-FEDERATED-LEARNING-V0-PREP.md`. Only
   the pattern (rule firing distribution, correction rate, harmonic
   alignment) travels; raw claim text never does.
3. Agents whose claims were correct gain RepID per the per-event
   weights in `hyperdag-protocol/METHODOLOGY.md`.
4. Agents whose claims were wrong lose RepID per the slash formula.
5. The network-wide `error_rate_in_category` updates, recalibrating
   future rewards in that category.

This is the runtime expression of the staking + challenge protocol.
The static expression (the per-event weight tables and the threshold
constants) is normative and lives in
`hyperdag-protocol/METHODOLOGY.md` and the engine's seed migrations.

## Pseudocode

The following pseudocode is normative for the *shape* of operations.
Implementations MAY use different variable names, error types, or
storage backends; they MUST preserve the operation order and the
state transitions.

```
function makeClaim(agent, claim, stakeAmount):
    require(agent.repId >= getStakeMinimum(claim.type))
    lockStake(agent, stakeAmount)
    claimId = recordClaim(agent, claim, stakeAmount, status=CLAIM_PENDING)
    emitEvent('ClaimMade', claimId)
    scheduleTimeout(claimId, CHALLENGE_WINDOW_BLOCKS)
    return claimId

function challenge(agent, claimId, evidence, stakeAmount):
    require(claimId.status == CLAIM_PENDING)
    require(agent.repId >= getChallengeMinimum(claimId.type))
    require(agent.address != claimId.claimant)         // can't challenge self
    require(stakeAmount >= getChallengeStakeMinimum(claimId.type))
    lockStake(agent, stakeAmount)
    claimId.status = CLAIM_CHALLENGED
    challengeId = recordChallenge(agent, claimId, evidence, stakeAmount,
                                  status=CHALLENGE_OPEN)
    if evidence is complete:
        challengeId.status = CHALLENGE_VOTING
        startVoting(challengeId, claimId.type.votingWindow)
    return challengeId

function vote(agent, challengeId, support):
    require(challengeId.status == CHALLENGE_VOTING)
    require(agent.repId >= getVotingMinimum(challengeId.claim.type))
    require(now < challengeId.votingDeadline)
    recordVote(agent, challengeId, support, weight=agent.repId)

function resolve(challengeId):
    require(challengeId.status == CHALLENGE_VOTING)
    require(now >= challengeId.votingDeadline)
    tally = sumVotes(challengeId, weighted=true)
    totalWeight = tally.disputeWeight + tally.upholdWeight
    if totalWeight == 0:
        // No votes — escalate per claim type's policy
        escalate(challengeId)
        return

    if tally.disputeWeight / totalWeight > BFT_THRESHOLD:
        // Claim falsified — challenge succeeds
        slashStake(claimId.claimant,
                   claimId.stake × (1 + historyPenalty(claimId.claimant)))
        rewardChallenger(challengeId, fromSlashedStake)
        rewardVoters(challengeId, voterPool, side='dispute')
        claimId.status = CLAIM_RESOLVED_FALSE
        challengeId.status = CHALLENGE_RESOLVED
    else if tally.upholdWeight / totalWeight > BFT_THRESHOLD:
        // Claim upheld — challenge fails
        returnStake(claimId.claimant) + claimReward(claimId)
        slashStake(challengeId.challenger, challengeId.stake)
        rewardVoters(challengeId, challengerStakeAsPool, side='uphold')
        claimId.status = CLAIM_RESOLVED_TRUE
        challengeId.status = CHALLENGE_RESOLVED
    else:
        // Sub-threshold — escalate
        escalate(challengeId)
        return

    recordToAuditChain(challengeId, claimId, finalStatus)
```

## Anti-collusion

A naive RepID-weighted vote is exploitable by collusion: a small
group of high-RepID agents could systematically vote together to
push outcomes. The protocol mitigates this off-chain in the engine.

- **Detection:** cosine similarity of voting history over the past
  30 days. If two voters have similarity > 0.85 (their votes line
  up on substantially the same set of challenges), they are flagged
  as potentially colluding.
- **De-weighting:** the engine maintains a per-pair `collusion_score`
  that scales the effective vote weight:
  ```
  effective_weight = stated_weight × (1 - collusion_score)
  ```
- This is **off-chain** in v0.1. On-chain weights are unchanged; the
  engine recomputes the effective tally and writes it to the audit
  chain.
- v0.2 candidate: move de-weighting on-chain via a maintenance
  window where the de-weighting parameters are published and
  contestable.

## Privacy properties

- Voter identities are pseudonymous (wallet addresses) but votes are
  linked to voters in v0.1 — a future v0.2 variant uses the
  ZKP-anonymous-vote primitive (see
  `repid/spec/ZKP-REPID-PROOF.md` §"v0.2 candidates").
- Claim content is on-chain. Challenges and votes are on-chain.
- The engine's federated-learning capture only consumes anonymised
  pattern observations, never raw claim text. See the federated-
  learning prep doc in the engine repo for the full threat model.

## Test scenarios (informative, not normative)

### Scenario 1 — Honest claim, no challenge

- Agent A makes a low-tier claim, stakes 10 RepID.
- No agent challenges within the 24-hour window.
- Outcome: `CLAIM_TIMEOUT`. Stake returned to A. No reward (timeout
  ≠ active verification). Audit chain row records the timeout.

### Scenario 2 — Honest claim, weak challenger

- Agent A makes a medium-tier claim with strong evidence, stakes
  100 RepID.
- Agent B challenges with weak evidence, stakes 100 RepID.
- Voting tilts 0.85 in favour of upholding the claim.
- Outcome: `CLAIM_RESOLVED_TRUE`. A gets stake + reward = 100 ×
  (1 + 0.1 × 0.7) = 107 RepID where 0.7 reflects the
  rolling category accuracy. B's 100 stake is forfeit, distributed to
  voters who voted "uphold".

### Scenario 3 — Dishonest claim, strong challenger

- Agent A makes a high-tier false claim, stakes 1000 RepID.
- Agent B challenges with on-chain evidence, stakes 1000 RepID.
- Voting tilts 0.92 in favour of dispute (above 0.618 threshold).
- Outcome: `CLAIM_RESOLVED_FALSE`. A's stake slashed × 1 (first
  offense penalty multiplier = 1) = 1000. B receives 0.6 × 1000 =
  600 RepID. The remaining 400 distributes to voters who voted
  "dispute", weighted by their RepID.

### Scenario 4 — Sub-threshold challenge

- Agent A makes a medium-tier claim, stakes 100 RepID.
- Agent B challenges with mixed evidence, stakes 100 RepID.
- Voting tally: 0.55 dispute / 0.45 uphold. Neither side crosses
  0.618.
- Outcome: escalate per claim type's policy. For medium tier,
  default escalation is frontier-LLM cross-check (uses HAL v2
  tiered consensus from the engine).

## Known limitations of v0.1

- No on-chain anti-collusion enforcement (off-chain only).
- Voting is linked to voter identity (no anonymous voting yet).
- Reward formula coefficient (0.1) is fixed; should be tunable per
  category in v0.2.
- Voter selection is open: any RepID-eligible agent may vote. Sybil
  resistance relies on the RepID floor + the SBT non-transferability,
  not on a distinct sortition mechanism.
- No cross-domain claims (claim about a system outside HyperDAG).
  v0.2 candidate.

## v0.2 candidates

- Cross-domain claims (claim about a system outside HyperDAG, with a
  bridge oracle).
- Reputation transfer between sub-protocols (e.g. trustrails RepID
  composing with trusttrader RepID).
- ZKP-anonymous voting using the proof primitive from
  `repid/spec/ZKP-REPID-PROOF.md`.
- On-chain anti-collusion enforcement.

## References

- HyperDAG methodology: `hyperdag-protocol/METHODOLOGY.md`.
- ZKP RepID proof: `repid/spec/ZKP-REPID-PROOF.md`.
- SBT mint flow: `hyperdag-protocol/spec/SBT-MINTING-FLOW.md`.
- Ecosystem map: `hyperdag-protocol/docs/ECOSYSTEM-MAP.md`.
