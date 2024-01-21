import { INestApplication } from '@nestjs/common';

import { Test } from '@nestjs/testing';

import { hash } from 'bcryptjs';

import request from 'supertest';

import { AppModule } from '@/app.module';

import { PrismaService } from '@/prisma/prima.service';
import { JwtService } from '@nestjs/jwt';

describe('Create question (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  /**
   * Para testar, precisamos subir a aplicação.
   * Mas não queremos subir usando o script de start
   * O "createTestingModule" é uma forma de subir a
   * aplicação de uma maneira que funcione de forma
   * programátiva
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

    // PEGANDO O JWT
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /questions', async () => {
    const user = await prismaService.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: await hash('123456', 8),
      },
    });

    const accessToken = jwtService.sign({ sub: user.id });

    const response = await request(app.getHttpServer())
      .post('/questions')
      // enviando o token
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New question',
        content: 'Question content',
      });

    expect(response.statusCode).toBe(201);

    const questionOnDataBase = await prismaService.question.findFirst({
      where: {
        title: 'New question',
      },
    });

    expect(questionOnDataBase).toBeTruthy();
  });
});
