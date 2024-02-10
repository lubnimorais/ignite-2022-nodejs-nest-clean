import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { IPaginationParams } from '@/core/repositories/pagination-params';

export abstract class AnswersRepository {
  abstract create(answer: Answer): Promise<void>;
  abstract findById(answerId: string): Promise<Answer | null>;
  abstract findManyByQuestionId(
    questionId: string,
    { page }: IPaginationParams,
  ): Promise<Answer[]>;

  abstract save(answer: Answer): Promise<void>;
  abstract delete(answer: Answer): Promise<void>;
}
