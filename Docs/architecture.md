# Beast97 — Architecture

## Agent Loop

```
loop:
  1. send messages[] + tool definitions to the model
  2. model responds with either:
       a) plain text → show it, wait for next user input, done
       b) one or more tool_calls → go to step 3
  3. for each tool_call:
       - validate args against the tool's schema (zod)
       - check permissions (does this tool/path/command need user approval?)
       - execute it
       - capture result (stdout, file contents, error, whatever)
  4. append the tool results as a new message with role "tool"
  5. go back to step 1
```

## Message Types

```ts
type Message =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string; toolCalls?: ToolCall[] }
  | { role: "tool"; toolCallId: string; content: string; isError?: boolean }
```

## Tool Schema

Each tool is self-describing:

```ts
interface Tool {
  name: string;
  description: string;
  parameters: z.ZodSchema;       // zod schema → convert to JSON schema for the API
  requiresApproval: boolean;     // shell exec, file writes = true; file reads = maybe false
  execute: (args: unknown) => Promise<ToolResult>;
}
```

## Folder Structure

Everything should have its own folder. The `src/` directory is organized by domain, not by layer.

```
src/
├── config/         # config loading, env vars, types
├── memory/         # conversation history, persistence
├── provider/       # LLM provider abstraction + implementations
├── tools/          # tool definitions and registry
├── ui/             # input/output interface (CLI, TUI)
├── agent/          # the core loop
└── types.ts        # shared domain types (Message, Tool, etc.)
```
