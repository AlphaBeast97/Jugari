export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.log(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

export const PROVIDER_API_KEY = requireEnv("PROVIDER_API_KEY");
export const PROVIDER_BASE_URL = requireEnv("PROVIDER_BASE_URL");
export const JUGARI_MODEL = requireEnv("JUGARI_MODEL");
