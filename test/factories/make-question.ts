import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question';

import { Slug } from '@/domain/forum/enterprise/entities/values-objects/slug';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prima.service';
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper';

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityId,
) {
  const question = Question.create(
    {
      authorId: new UniqueEntityId('1'),
      title: faker.lorem.sentence(),
      slug: Slug.create('example-question'),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return question;
}

@Injectable()
export class QuestionFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaQuestion(
    data: Partial<QuestionProps> = {},
  ): Promise<Question> {
    const question = makeQuestion(data);

    await this.prismaService.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    });

    return question;
  }
}
