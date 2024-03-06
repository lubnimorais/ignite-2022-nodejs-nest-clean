import { IPaginationParams } from '@/core/repositories/pagination-params';
import { QuestionComment } from '../../enterprise/entities/question-comment';
import { CommentWithAuthor } from '../../enterprise/entities/values-objects/comment-with-author';

export abstract class QuestionCommentsRepository {
  abstract create(questionComment: QuestionComment): Promise<void>;

  abstract findById(questionCommentId: string): Promise<QuestionComment | null>;

  abstract findManyByQuestionId(
    questionId: string,
    { page }: IPaginationParams,
  ): Promise<QuestionComment[]>;

  abstract findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: IPaginationParams,
  ): Promise<CommentWithAuthor[]>;

  abstract delete(questionComment: QuestionComment): Promise<void>;
}
