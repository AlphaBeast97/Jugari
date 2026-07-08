#!/usr/bin/env node

import "dotenv/config";
import { readFileSync } from "node:fs";
import { llm } from "./llm.js";
import { config } from "./config/index.js";
import rl from "readline/promises";
import { stdin, stdout } from "node:process";
import type { HistoryEntry } from "./history.js";

const pkg: { name: string; version: string } = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf-8"),
);

const his: HistoryEntry[] = [];

const main = async (): Promise<void> => {
  const usrMsg = rl.createInterface({ input: stdin, output: stdout });

  usrMsg.on("SIGINT", () => {
    usrMsg.close();
    console.log("\nGoodbye.");
    process.exit(0);
  });

  console.log(
    `\n${pkg.name} v${pkg.version} — model: ${config.MODEL}, provider: ${config.PROVIDER_BASE_URL}`,
  );
  console.log("\u2500".repeat(60));

  while (true) {
    try {
      const userInput = await usrMsg.question("User: \n>");
      await llm({ input: userInput, history: his });
    } catch (error) {
      console.log(
        `Error: ${error instanceof Error ? error.message : String(error)}\n`,
      );
    }
  }
};

main();
