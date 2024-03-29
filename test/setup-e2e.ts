import { config } from 'dotenv';

import { URL } from 'url';

import { randomUUID } from 'node:crypto';

import { execSync } from 'child_process';

import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';

import { DomainEvents } from '@/core/events/domain-events';
import { envSchema } from '@/infra/env/env';

config({ path: '.env', override: true });
config({ path: '.env.test', override: true });

const env = envSchema.parse(process.env);

const prismaClient = new PrismaClient();
const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
});

/**
 * Função para gerar a nova URL do banco de dados
 * com o novo schema.
 */
function generateUniqueDatabaseURL(schemaId: string) {
  /**
   * Testamos se a variável ambiente da URL do banco de dados existe,
   * pois precisamos dela. Porque só queremos usar o valor da variável
   * que o usuário já tem, só queremos mudar o schema da conexão.
   */
  if (!env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable');
  }

  const url = new URL(env.DATABASE_URL);

  /**
   * Procuramos na URL o schema e mudamos seu valor
   */
  url.searchParams.set('schema', schemaId);

  return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
  /**
   * Pegando a nova URL do banco de dados
   */
  const database = generateUniqueDatabaseURL(schemaId);

  DomainEvents.shouldRun = false;

  /**
   * Sobrescrever a DATABASE_URL com a nova URL
   */
  process.env.DATABASE_URL = database;

  // LIMPANDO O CACHE
  await redis.flushdb();

  /**
   * Executar um comando no terminal para rodas as migrations
   * Usaremos o migrate deploy, porque o deploy só roda as
   * migrations no banco.
   */
  execSync('yarn prisma migrate deploy');
});

afterAll(async () => {
  /**
   * Deletando o schema criado
   * Tem que ser o 'executeRawUnsafe', porque estamos realizando
   * uma operação perigosa, que é deletar um schema
   */
  await prismaClient.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`,
  );
  await prismaClient.$disconnect();
});
