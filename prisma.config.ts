import { defineConfig } from '@prisma/config'
import fs from 'fs'
import path from 'path'

let dbUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

if (!dbUrl) {
  try {
    const envFile = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf-8');
    const dbUrlMatch = envFile.match(/^DATABASE_URL="?([^"\n]+)"?/m);
    if (dbUrlMatch) {
      dbUrl = dbUrlMatch[1];
    }
  } catch (e) {
    // ignore
  }
}

if (!dbUrl) {
  dbUrl = "postgresql://dummy:dummy@localhost:5432/dummy";
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: dbUrl,
  }
})
