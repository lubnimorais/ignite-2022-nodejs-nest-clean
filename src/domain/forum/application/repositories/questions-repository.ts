import { Question } from '@/domain/forum/enterprise/entities/question';

import { IPaginationParams } from '@/core/repositories/pagination-params';

interface QuestionsRepository {
  create(question: Question): Promise<void>;
  findBySlug(slug: string): Promise<Question | null>;
  findById(questionId: string): Promise<Question | null>;
  findManyRecent({ page }: IPaginationParams): Promise<Question[]>;
  save(question: Question): Promise<void>;
  delete(question: Question): Promise<void>;
}

export { QuestionsRepository };
