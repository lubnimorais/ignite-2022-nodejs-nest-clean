import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question';

import { Slug } from '@/domain/forum/enterprise/entities/values-objects/slug';

function makeQuestion(
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

export { makeQuestion };
