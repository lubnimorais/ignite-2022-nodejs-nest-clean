import { Injectable } from '@nestjs/common';

import { IPaginationParams } from '@/core/repositories/pagination-params';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  create(answerComment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.');
  }

  findById(answerCommentId: string): Promise<AnswerComment | null> {
    throw new Error('Method not implemented.');
  }

  findManyByAnswerId(
    answerId: string,
    { page }: IPaginationParams,
  ): Promise<AnswerComment[]> {
    throw new Error('Method not implemented.');
  }

  delete(answerComment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
