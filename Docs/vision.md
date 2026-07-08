# Beast97 — Vision

The end state Beast97 is building toward — a full coding agent
experience (OpenCode-class, but built by one developer).

## Must-have features

- [x] Agent loop design — see [architecture](architecture.md) for the detailed spec
- [ ] File tools — read, write, edit, grep, glob
- [ ] Shell tool — run commands with permission gating
- [ ] Multi-provider — not just OpenAI SDK; any provider, any model
- [ ] Config file support — TOML/YAML/JSON for providers, models, settings
- [ ] Persistent sessions — JSONL save/resume across crashes
- [ ] Context compaction — smart summarization to stay under token limits
- [ ] Sub-agents — spawn isolated sessions for parallel/complex tasks
- [ ] MCP support — connect external tool servers
- [ ] Permissions & safety — ring-based approval model
- [ ] UI layer — TUI for configuration and session management
- [ ] Developer-empathetic everywhere — good errors, fast feedback,
      sensible defaults, progressive disclosure

None of this is set in stone. This is the north star, not the gantt chart.
