import { IPaginationParams } from '@/core/repositories/pagination-params';
import { QuestionComment } from '../../enterprise/entities/question-comment';

export abstract class QuestionCommentsRepository {
  abstract create(questionComment: QuestionComment): Promise<void>;
  abstract findById(questionCommentId: string): Promise<QuestionComment | null>;
  abstract findManyByQuestionId(
    questionId: string,
    { page }: IPaginationParams,
  ): Promise<QuestionComment[]>;

  abstract delete(questionComment: QuestionComment): Promise<void>;
}
