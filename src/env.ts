import { z as zod } from 'zod';

export const envSchema = zod.object({
  DATABASE_URL: zod.string().url(),
  PORT: zod.coerce.number().optional().default(3333),
});

export type Env = zod.infer<typeof envSchema>;
