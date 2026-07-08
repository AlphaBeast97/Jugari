import OpenAI, { APIConnectionError, APIError, RateLimitError } from "openai";
import { config } from "./config/index.js";
import { history, type HistoryEntry } from "./history.js";

const openai = new OpenAI({
  baseURL: config.PROVIDER_BASE_URL,
  apiKey: config.PROVIDER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://github.com/alphaBeast97/beast97",
    "X-Title": "Beast97",
  },
});

interface LlmPayload {
  input: string;
  history: HistoryEntry[];
}

export const llm = async (payload: LlmPayload): Promise<void> => {
  const { input: userInput, history: his } = payload;

  const priorTurns = his.flatMap((turn) => {
    if (!turn || typeof turn !== "object") return [];

    const msgs: { role: "user" | "assistant"; content: string }[] = [];

    if (turn.userMsg) msgs.push({ role: "user", content: turn.userMsg });
    if (turn.aiResponse)
      msgs.push({ role: "assistant", content: turn.aiResponse });

    return msgs;
  });

  try {
    const completion = await openai.chat.completions.create({
      model: config.MODEL,
      messages: [
        {
          role: "system",
          content: "you are a helpful assistant.",
        },
        ...priorTurns,
        {
          role: "user",
          content: userInput,
        },
      ],
      stream: true,
      max_tokens: 4096,
    });

    const aiResponse: string[] = [];

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || "";
      aiResponse.push(content);
      process.stdout.write(content);
    }
    process.stdout.write("\n");

    const responseText = aiResponse.join("");
    if (!responseText.trim()) {
      process.stderr.write("Warning: Model returned an empty response.\n");
      return;
    }

    history(userInput, responseText, payload.history);
  } catch (error) {
    if (error instanceof APIConnectionError) {
      process.stderr.write(
        "Error: Could not connect to the provider. Check your internet connection and PROVIDER_BASE_URL.\n",
      );
    } else if (error instanceof RateLimitError) {
      process.stderr.write(
        "Error: Rate limit exceeded. Please try again later.\n",
      );
    } else if (error instanceof APIError) {
      process.stderr.write(
        `Error: API returned status ${error.status}: ${error.message}\n`,
      );
    } else {
      process.stderr.write(
        `Error: ${error instanceof Error ? error.message : String(error)}\n`,
      );
    }
  }
};
