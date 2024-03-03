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
import { AttachmentFactory } from 'test/factories/make-attachment';
import { AnswerAttachmentFactory } from 'test/factories/make-answer-attachment';

describe('Edit answer (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let attachmentFactory: AttachmentFactory;
  let answerAttachmentFactory: AnswerAttachmentFactory;
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
        AttachmentFactory,
        AnswerAttachmentFactory,
      ],
    })
      // .overrideProvider(CatsService) -> para fazer mocking
      .compile();

    app = moduleRef.createNestApplication();

    // PEGANDO O SERVIÇO DO PRISMA
    prismaService = moduleRef.get(PrismaService);

    studentFactory = moduleRef.get(StudentFactory);

    questionFactory = moduleRef.get(QuestionFactory);

    answerFactory = moduleRef.get(AnswerFactory);

    attachmentFactory = moduleRef.get(AttachmentFactory);

    answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory);

    // PEGANDO O JWT
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[PUT] /answers/:id', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    });

    const attachment1 = await attachmentFactory.makePrismaAttachment();
    const attachment2 = await attachmentFactory.makePrismaAttachment();

    await answerAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment1.id,
      answerId: answer.id,
    });

    await answerAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment2.id,
      answerId: answer.id,
    });

    const attachment3 = await attachmentFactory.makePrismaAttachment();

    const answerId = answer.id.toString();

    const response = await request(app.getHttpServer())
      .put(`/answers/${answerId}`)
      // enviando o token
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'New answer content',
        attachments: [attachment1.id.toString(), attachment3.id.toString()],
      });

    expect(response.statusCode).toBe(204);

    const answerOnDataBase = await prismaService.answer.findFirst({
      where: {
        content: 'New answer content',
      },
    });

    expect(answerOnDataBase).toBeTruthy();

    const attachmentsOnDatabase = await prismaService.attachment.findMany({
      where: {
        answerId: answerOnDataBase?.id,
      },
    });

    expect(attachmentsOnDatabase).toHaveLength(2);
    expect(attachmentsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.id.toString(),
        }),
        expect.objectContaining({
          id: attachment3.id.toString(),
        }),
      ]),
    );
  });
});
