# Beast97

> A coding agent CLI built by a solo developer. Works with any LLM.

---

## What It Is

Beast97 is a CLI that wires an LLM to your codebase. Under active development — version by version. Right now it's a streaming chat interface; the end goal is a full coding agent that can read, write, search, and run commands in your project.

This is the kind of tool that Claude Code and Cursor are — but built from scratch, in the open, by a solo developer. No VC. No cloud credits.

## Where It Is Now

**Current version:** v0.0.2-ts.1

Working features:
- Streaming chat with any OpenAI-compatible model (OpenRouter, OpenAI, Together, Ollama)
- Multi-turn conversation history (in-memory)
- Provider-agnostic config via env vars (`PROVIDER_API_KEY`, `PROVIDER_BASE_URL`, `JUGARI_MODEL`)
- Error handling — network failures, API errors, empty responses — all caught gracefully
- Ctrl+C clean exit
- TypeScript + strict mode, Vitest, `tsc` build

**13 passing tests** — history, LLM mock, config validation, error handling.

See the [vision](Docs/vision.md) for the end-state features being built toward.

## Why "Beast97"

Named after the creator's GitHub handle — **AlphaBeast97**. "Beast" says what it is: capable, direct, untamed. "97" grounds it in a real person.

## Quick Start

```bash
git clone https://github.com/alphaBeast97/beast97
cd beast97/Beast97CLI
cp .env.example .env
# Edit .env with your provider details
npm run dev
```

## Requirements

- Node.js >= 20
- An API key from any OpenAI-compatible provider

## License

GPL-3.0-only
