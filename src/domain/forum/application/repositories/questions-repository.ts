import { Question } from '@/domain/forum/enterprise/entities/question';

import { IPaginationParams } from '@/core/repositories/pagination-params';

export abstract class QuestionsRepository {
  abstract create(question: Question): Promise<void>;
  abstract findBySlug(slug: string): Promise<Question | null>;
  abstract findById(id: string): Promise<Question | null>;
  abstract findManyRecent({ page }: IPaginationParams): Promise<Question[]>;
  abstract save(question: Question): Promise<void>;
  abstract delete(question: Question): Promise<void>;
}
