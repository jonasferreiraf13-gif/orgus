import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const requiredVariables = [
  "CLOUDFLARE_WORKER_NAME",
  "CLOUDFLARE_D1_DATABASE_NAME",
  "CLOUDFLARE_D1_DATABASE_ID",
  "CLOUDFLARE_R2_BUCKET_NAME",
];

const missing = requiredVariables.filter((name) => !process.env[name]?.trim());
if (missing.length) {
  console.error(
    `Variáveis obrigatórias ausentes: ${missing.join(", ")}. Consulte GUIA-HOSPEDAGEM-CLOUDFLARE.md.`,
  );
  process.exit(1);
}

const configPath = resolve("dist/server/wrangler.json");
const config = JSON.parse(await readFile(configPath, "utf8"));

config.name = process.env.CLOUDFLARE_WORKER_NAME.trim();
config.d1_databases = [
  {
    binding: "DB",
    database_name: process.env.CLOUDFLARE_D1_DATABASE_NAME.trim(),
    database_id: process.env.CLOUDFLARE_D1_DATABASE_ID.trim(),
    migrations_dir: "../../drizzle",
  },
];
config.r2_buckets = [
  {
    binding: "BUCKET",
    bucket_name: process.env.CLOUDFLARE_R2_BUCKET_NAME.trim(),
  },
];

await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
console.log(`Configuração Cloudflare pronta em ${configPath}.`);
