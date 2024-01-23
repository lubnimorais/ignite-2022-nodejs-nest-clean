import { IPaginationParams } from '@/core/repositories/pagination-params';
import { AnswerComment } from '../../enterprise/entities/answer-comment';

interface AnswerCommentsRepository {
  create(answerComment: AnswerComment): Promise<void>;
  findById(answerCommentId: string): Promise<AnswerComment | null>;
  findManyByAnswerId(
    answerId: string,
    { page }: IPaginationParams,
  ): Promise<AnswerComment[]>;
  delete(answerComment: AnswerComment): Promise<void>;
}

export { AnswerCommentsRepository };
