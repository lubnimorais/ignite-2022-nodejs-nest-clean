import { IPaginationParams } from '@/core/repositories/pagination-params';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { CommentWithAuthor } from '../../enterprise/entities/values-objects/comment-with-author';

export abstract class AnswerCommentsRepository {
  abstract create(answerComment: AnswerComment): Promise<void>;

  abstract findById(answerCommentId: string): Promise<AnswerComment | null>;

  abstract findManyByAnswerId(
    answerId: string,
    { page }: IPaginationParams,
  ): Promise<AnswerComment[]>;

  abstract findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: IPaginationParams,
  ): Promise<CommentWithAuthor[]>;

  abstract delete(answerComment: AnswerComment): Promise<void>;
}
