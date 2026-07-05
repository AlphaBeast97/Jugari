# Pre-Development Decisions

> Architecture Decision Records for [Jugari](name-choice.md) — a coding agent harness.
> Each entry documents the context, alternatives considered, chosen decision, rationale, and consequences.
> See also: [Name Choice](name-choice.md) — project naming decision.

---

## Decision 1: Tech Stack — JavaScript / Node.js

**Context:** A coding harness is orchestration and I/O — HTTP calls to an LLM API, managing conversation state, parsing tool-call JSON, executing file/shell operations, rendering a terminal UI. No ML training, tensor math, or inference work is involved.

**Alternatives Considered:**
- **Python** (used by Aider) — strong LLM ecosystem (LangChain, etc.), but the project doesn't need any of that
- **Go** — fast, single-binary output, but unfamiliar and overkill for this scope
- **Rust** — even more overkill

**Decision:** JavaScript / Node.js

**Rationale:**
- Existing familiarity (Express, Next.js, React) — no new language to learn alongside a new domain
- Non-blocking I/O ideal for streaming LLM responses
- `npm` ecosystem makes global CLI distribution trivial (`npm install -g` / `npx`)
- Mature terminal-UI packages (Ink, blessed, commander)

**Consequences:**
- Can't use Python-native LLM tooling, but OpenAI-compatible SDKs exist in JS
- Harness-specific patterns (event emitters, streams, child processes) map well to existing JS knowledge

**Risks:**
- JS ecosystem churn — dependencies may break or become unmaintained
- `child_process` security surface is large — must be carefully sandboxed
- Beginner may conflate "it runs" with "it's correct" — testing discipline is critical

---

## Decision 2: Model & API Strategy

**Context:** The harness needs a model that supports tool/function calling. Budget is zero — no paid API keys. The end goal is multi-provider support, but v0.1 needs one concrete endpoint to code against.

**Alternatives Considered:**
- **Claude API** — best agentic coding model, but expensive
- **GPT-4 / GPT-4o** — good tool calling, also expensive
- **Ollama / local models** — free, but unreliable tool calling and resource-heavy
- **OpenCode Zen** — already used via OpenCode, but less general-purpose as a provider
- **OpenRouter** — hub that proxies many models, has free tiers, single API format

**Decision:** DeepSeek V4 Flash Free via OpenRouter, using the OpenAI-compatible chat completions schema.

**Rationale:**
- Free tier is genuinely usable
- DeepSeek supports tool/function calling
- OpenAI-compatible schema means switching providers later is just a base URL and API key swap
- OpenRouter's single endpoint simplifies future multi-provider support

**Consequences:**
- Must verify DeepSeek V4 Flash Free reliably emits valid `tool_calls` JSON before building the loop around it
- Limited context window vs paid models — compaction will hit earlier
- If free tier degrades or disappears, need a fallback plan
- Provider abstraction layer should be designed from day one even if only one provider is wired

**Risks:**
- Free tier may be rate-limited, go down, or disappear entirely
- DeepSeek may not emit tool calls reliably — the loop won't work if the model doesn't cooperate
- OpenAI-compatible schema is a simplification — some providers deviate from the standard
- No fallback budget if free tier is insufficient — development halts until a paid option is added

---

## Decision 3: Development Approach — "Planner, Not Writer"

**Context:** The primary goal is to learn how a harness works by building one. AI tools are available and useful, but having them write the code would defeat the learning purpose.

**Alternatives Considered:**
- **Full AI-generated code** — fast but no understanding gained
- **AI pair-programming** — AI writes, human reviews — blurs the learning line
- **No AI at all** — pure self-reliance — possible but slow and wastes a useful tool

**Decision:** AI can write tests and discuss architecture/design, but may NOT write production code. Boilerplate (package.json, config files, simple utilities) is a grey area — use judgment, but core loop, tool implementations, and agent logic must be hand-written.

**Rationale:**
- Writing the core logic by hand builds genuine understanding of each component
- AI-written tests are safe and save time — they verify, not define, the architecture
- AI as a sounding board for design discussions is valuable without compromising learning

**Consequences:**
- Slower development velocity — expected and intentional
- Clean boundary needed between "test" and "production" code to avoid temptation
- Design discussions with AI should be documented in `DESIGN.md` or decision logs for FYP write-up

**Risks:**
- Hard to self-enforce — temptation grows when stuck on a bug for hours
- Grey area (boilerplate, configs) may expand over time and blur the rule
- Slower pace may cause motivation loss on a long project

---

## Decision 4: Release Strategy — Incremental, Not Big-Bang

**Context:** This is a complex system being built by a single developer learning a new domain. Building everything before a V1 launch is unrealistic and risky.

**Alternatives Considered:**
- **Big-bang** — build everything, launch V1 — high risk, no feedback loop
- **Time-based** — fixed release cadence — arbitrary, features may be half-baked
- **Feature-based milestones** — each version ships when a specific capability is complete, with room for refactoring between

**Decision:** Each version must be a shippable, usable CLI. Scope per version is deliberately small — the tool loop alone takes a full version, and read-only tools are separate from write tools. Ten versions from V0.1 to V1.0.

> Full roadmap with version capabilities, limitations, and usage examples:
> [Plan/version-roadmap.md](../Plan/version-roadmap.md)

| Version | What it ships |
|---------|--------------|
| **V0.1** | Basic chat CLI — talk to the model, no tools |
| **V0.2** | Agent loop with mock tools — prove the mechanism |
| **V0.3** | File reader — read, grep, list directories |
| **V0.4** | File editor — write, edit, delete with confirmations |
| **V0.5** | Shell runner — run commands with permission gating |
| **V0.6** | Persistent sessions — JSONL save/resume |
| **V0.7** | Context compaction — summarize, stay under budget |
| **V0.8** | Project-aware prompting — AGENTS.md injection |
| **V0.9** | Multi-provider — swap models via config |
| **V1.0** | Safety, hooks, polish — production release |

**Rationale:**
- Each version is a genuine checkpoint — demonstrable, testable, dogfoodable
- Early versions reveal architectural needs that inform later ones
- Room to adapt between versions without scope creep

**Consequences:**
- Refactoring between versions is expected — not a failure
- Each version needs a clear "done" criterion to avoid endless polish
- Design docs should be updated per version to track architectural evolution

**Risks:**
- Scope creep within a version — "just one more feature" delays shipping
- Early architecture decisions may need significant rework in later versions
- Motivation may wane before reaching V1.0 — 10 versions is a long arc

---

## Decision 5: Cost Constraint — Free-Tier Models First

**Context:** Zero budget for API costs during development. The harness must be designed to work reliably on free-tier models.

**Alternatives Considered:**
- **Paid APIs** — better models, but not affordable
- **Self-hosted models** — free to run, but GPU cost and reliability overhead

**Decision:** The harness is built around and evaluated on DeepSeek V4 Flash Free. Free-tier reliability is a first-class design constraint, not an afterthought.

**Rationale:**
- No budget — this is the only viable option for development
- Framing it as "built for free-tier models" is a legitimate design constraint that differentiates the project

**Consequences:**
- Must handle smaller context windows gracefully
- Must validate tool-calling reliability of the free model before committing the architecture
- Compaction and context management must be robust — free models are less forgiving
- If the free model can't handle the task, the harness architecture must still work when a paid model is plugged in later

**Risks:**
- Free model may not support tool calling well enough — the entire project depends on this
- Context window of free models is small — compaction will be exercised heavily and may reveal bugs
- If the free tier is discontinued, there is no budget for a paid replacement
- The "built for free models" constraint may limit the harness's capability ceiling

---

## Decision 6: Research Organization — Separate Files Per Topic

**Context:** The harness has many interconnected components (tool loop, context management, permissions, session persistence, etc.). A single monolithic document becomes unwieldy.

**Alternatives Considered:**
- **Single file** — everything in one place — hard to navigate and update
- **Wiki / Notion** — external tool — breaks the repo-adjacent documentation pattern
- **Separate files with cross-links** — each component gets its own markdown file

**Decision:** Each major aspect gets its own file under `Docs/Research/`. Files are linked together via relative markdown links in relevant sections.

**Rationale:**
- Easy to navigate by topic
- Each file stays focused and manageable
- Links create a web of understanding rather than a linear document
- Version control tracks changes per-component

**Consequences:**
- Cross-referencing required — a linking convention should be established early
- Must avoid orphan files — every file should be reachable from an index or parent document
- Update the TOC in the main research doc when adding new files

**Risks:**
- Files may drift out of sync — a change in one file may leave links in another outdated
- No single source of truth if duplicate information appears across files
- Without a master index, a newcomer won't know where to start
