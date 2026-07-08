import { requireEnv } from "./env.js";
import { Config } from "../types.js";

export const config: Config = {
  PROVIDER_API_KEY: requireEnv("PROVIDER_API_KEY"),
  PROVIDER_BASE_URL: requireEnv("PROVIDER_BASE_URL"),
  MODEL: requireEnv("MODEL"),
};
