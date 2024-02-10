import { INestApplication } from '@nestjs/common';

import { Test } from '@nestjs/testing';

import request from 'supertest';

import { AppModule } from '@/infra/app.module';

import { PrismaService } from '@/infra/database/prisma/prima.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from '@/infra/database/database.module';
import { StudentFactory } from 'test/factories/make-student';
import { QuestionFactory } from 'test/factories/make-question';
import { AnswerFactory } from 'test/factories/make-answer';

describe('Choose question best answer (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
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
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    })
      // .overrideProvider(CatsService) -> para fazer mocking
      .compile();

    app = moduleRef.createNestApplication();

    // PEGANDO O SERVIÇO DO PRISMA
    prismaService = moduleRef.get(PrismaService);

    studentFactory = moduleRef.get(StudentFactory);

    questionFactory = moduleRef.get(QuestionFactory);

    answerFactory = moduleRef.get(AnswerFactory);

    // PEGANDO O JWT
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[PATCH] /answers/:answerId/choose-as-best', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    });

    const answerId = answer.id.toString();

    const response = await request(app.getHttpServer())
      .patch(`/answers/${answerId}/choose-as-best`)
      // enviando o token
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(204);

    const questionOnDataBase = await prismaService.question.findUnique({
      where: {
        id: question.id.toString(),
      },
    });

    expect(questionOnDataBase?.bestAnswerId).toEqual(answerId);
  });
});
