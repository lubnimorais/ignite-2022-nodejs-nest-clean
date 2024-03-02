import { INestApplication } from '@nestjs/common';

import { Test } from '@nestjs/testing';

import request from 'supertest';

import { AppModule } from '@/infra/app.module';

import { PrismaService } from '@/infra/database/prisma/prima.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from '@/infra/database/database.module';
import { StudentFactory } from 'test/factories/make-student';
import { QuestionFactory } from 'test/factories/make-question';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment';

describe('Edit question (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;
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
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    })
      // .overrideProvider(CatsService) -> para fazer mocking
      .compile();

    app = moduleRef.createNestApplication();

    // PEGANDO O SERVIÇO DO PRISMA
    prismaService = moduleRef.get(PrismaService);

    studentFactory = moduleRef.get(StudentFactory);

    questionFactory = moduleRef.get(QuestionFactory);

    attachmentFactory = moduleRef.get(AttachmentFactory);

    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);

    // PEGANDO O JWT
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[PUT] /questions/:id', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const attachment1 = await attachmentFactory.makePrismaAttachment();
    const attachment2 = await attachmentFactory.makePrismaAttachment();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment1.id,
      questionId: question.id,
    });

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment2.id,
      questionId: question.id,
    });

    const attachment3 = await attachmentFactory.makePrismaAttachment();

    const questionId = question.id.toString();

    const response = await request(app.getHttpServer())
      .put(`/questions/${questionId}`)
      // enviando o token
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New title',
        content: 'New content',
        attachments: [attachment1.id.toString(), attachment3.id.toString()],
      });

    expect(response.statusCode).toBe(204);

    const questionOnDataBase = await prismaService.question.findFirst({
      where: {
        title: 'New title',
        content: 'New content',
      },
    });

    expect(questionOnDataBase).toBeTruthy();

    const attachmentsOnDatabase = await prismaService.attachment.findMany({
      where: {
        questionId: questionOnDataBase?.id,
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
