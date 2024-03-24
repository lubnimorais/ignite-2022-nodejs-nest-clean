import { z as zod } from 'zod';

export const envSchema = zod.object({
  DATABASE_URL: zod.string().url(),
  JWT_PRIVATE_KEY: zod.string(),
  JWT_PUBLIC_KEY: zod.string(),
  PORT: zod.coerce.number().optional().default(3333),
  CLOUDFLARE_ACCOUNT_ID: zod.string(),
  AWS_BUCKET_NAME: zod.string(),
  AWS_ACCESS_KEY_ID: zod.string(),
  AWS_SECRET_ACCESS_ID: zod.string(),
  REDIS_HOST: zod.string().optional().default('127.0.0.1'),
  REDIS_PORT: zod.coerce.number().default(6379),
  REDIS_DB: zod.coerce.number().default(0),
});

export type Env = zod.infer<typeof envSchema>;
