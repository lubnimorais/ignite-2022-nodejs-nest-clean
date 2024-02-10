import { Injectable } from '@nestjs/common';

import { IPaginationParams } from '@/core/repositories/pagination-params';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { PrismaService } from '../prima.service';
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper';

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private prismaService: PrismaService) {}

  async create(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment);

    await this.prismaService.comment.create({
      data,
    });
  }

  async findById(questionCommentId: string): Promise<QuestionComment | null> {
    const questionComment = await this.prismaService.comment.findUnique({
      where: {
        id: questionCommentId,
      },
    });

    if (!questionComment) {
      return null;
    }

    return PrismaQuestionCommentMapper.toDomain(questionComment);
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: IPaginationParams,
  ): Promise<QuestionComment[]> {
    const questionComments = await this.prismaService.comment.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      // quantos itens queremos
      take: 20,
      // quantos itens queremos pular
      skip: (page - 1) * 20,
    });

    return questionComments.map(PrismaQuestionCommentMapper.toDomain);
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    await this.prismaService.comment.delete({
      where: {
        id: questionComment.id.toString(),
      },
    });
  }
}
