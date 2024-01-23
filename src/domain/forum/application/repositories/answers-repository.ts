import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { IPaginationParams } from '@/core/repositories/pagination-params';

interface AnswersRepository {
  create(answer: Answer): Promise<void>;
  findById(answerId: string): Promise<Answer | null>;
  findManyByQuestionId(
    questionId: string,
    { page }: IPaginationParams,
  ): Promise<Answer[]>;
  save(answer: Answer): Promise<void>;
  delete(answer: Answer): Promise<void>;
}

export { AnswersRepository };
