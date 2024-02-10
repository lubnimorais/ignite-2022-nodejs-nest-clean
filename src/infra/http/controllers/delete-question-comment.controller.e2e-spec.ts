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
import { QuestionCommentFactory } from 'test/factories/make-question-comment';

describe('Delete question comment (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let questionCommentFactory: QuestionCommentFactory;
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
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        QuestionCommentFactory,
      ],
    })
      // .overrideProvider(CatsService) -> para fazer mocking
      .compile();

    app = moduleRef.createNestApplication();

    // PEGANDO O SERVIÇO DO PRISMA
    prismaService = moduleRef.get(PrismaService);

    studentFactory = moduleRef.get(StudentFactory);

    questionFactory = moduleRef.get(QuestionFactory);

    questionCommentFactory = moduleRef.get(QuestionCommentFactory);

    // PEGANDO O JWT
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[DELETE] /questions/comments/:id', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const questionComment =
      await questionCommentFactory.makePrismaQuestionComment({
        authorId: user.id,
        questionId: question.id,
      });

    const questionCommentId = questionComment.id.toString();

    const response = await request(app.getHttpServer())
      .delete(`/questions/comments/${questionCommentId}`)
      // enviando o token
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(204);

    const commentOnDataBase = await prismaService.comment.findUnique({
      where: {
        id: questionCommentId,
      },
    });

    expect(commentOnDataBase).toBeNull();
  });
});
