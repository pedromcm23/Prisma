import { defineConfig, env } from '@prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('POSTGRES_URL_NON_POOLING') || env('POSTGRES_PRISMA_URL') || env('POSTGRES_URL') || env('DATABASE_URL'),
  }
})
