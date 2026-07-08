export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.log(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}
