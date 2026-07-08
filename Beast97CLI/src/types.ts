import z from "zod";

// Type definitions for the result of a tool execution
export interface ToolCall {
  id: string;
  name: string;
  args: unknown;
}

// Type definitions for the result of a tool execution
export interface ToolResult {
  output: string;
  isError?: boolean;
}

// Type definitions for messages exchanged with the LLM
export type Message =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string; toolCalls?: ToolCall[] }
  | { role: "tool"; toolCallId: string; content: string; isError?: boolean };

//   Type definitions for the result of a tool execution
export interface Tool {
  name: string;
  description: string;
  parameters: z.ZodSchema; // zod schema → convert to JSON schema for the API
  requiresApproval: boolean; // shell exec, file writes = true; file reads = maybe false
  execute: (args: unknown) => Promise<ToolResult>;
}

export interface Config {
  PROVIDER_API_KEY: string;
  PROVIDER_BASE_URL: string;
  MODEL: string;
}
