import { INestApplication } from '@nestjs/common';

import { Test } from '@nestjs/testing';

import { AppModule } from '@/infra/app.module';

import request from 'supertest';
import { PrismaService } from '@/infra/database/prisma/prima.service';

describe('Create account (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  /**
   * Para testar, precisamos subir a aplicação.
   * Mas não queremos subir usando o script de start
   * O "createTestingModule" é uma forma de subir a
   * aplicação de uma maneira que funcione de forma
   * programática
   */
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      // .overrideProvider(CatsService) -> para fazer mocking
      .compile();

    app = moduleRef.createNestApplication();

    // PEGANDO O SERVIÇO DO PRISMA
    prismaService = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(201);

    const userOnDataBase = await prismaService.user.findUnique({
      where: {
        email: 'johndoe@example.com',
      },
    });

    expect(userOnDataBase).toBeTruthy();
  });
});
