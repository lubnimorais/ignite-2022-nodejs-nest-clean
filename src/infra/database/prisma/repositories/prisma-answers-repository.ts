import { Injectable } from '@nestjs/common';

import { IPaginationParams } from '@/core/repositories/pagination-params';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper';
import { PrismaService } from '../prima.service';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { DomainEvents } from '@/core/events/domain-events';

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(
    private prismaService: PrismaService,
    private prismaAnswerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);

    await this.prismaService.answer.create({
      data,
    });

    await this.prismaAnswerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async findById(answerId: string): Promise<Answer | null> {
    const answer = await this.prismaService.answer.findUnique({
      where: {
        id: answerId,
      },
    });

    if (!answer) {
      return null;
    }

    return PrismaAnswerMapper.toDomain(answer);
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: IPaginationParams,
  ): Promise<Answer[]> {
    const answers = await this.prismaService.answer.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return answers.map(PrismaAnswerMapper.toDomain);
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);

    await Promise.all([
      await this.prismaService.answer.update({
        where: {
          id: data.id,
        },
        data,
      }),

      this.prismaAnswerAttachmentsRepository.createMany(
        answer.attachments.getNewItems(),
      ),

      this.prismaAnswerAttachmentsRepository.deleteMany(
        answer.attachments.getRemovedItems(),
      ),
    ]);

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answer: Answer): Promise<void> {
    await this.prismaService.answer.delete({
      where: {
        id: answer.id.toString(),
      },
    });
  }
}
