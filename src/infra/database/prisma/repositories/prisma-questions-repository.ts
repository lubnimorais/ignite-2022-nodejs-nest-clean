import { Injectable } from '@nestjs/common';

import { IPaginationParams } from '@/core/repositories/pagination-params';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { PrismaService } from '../prima.service';
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/values-objects/question-details';
import { PrismaQuestionDetailsMapper } from '../mappers/prisma-question-details-mapper';
import { DomainEvents } from '@/core/events/domain-events';
import { CacheRepository } from '@/infra/cache/cache-repository';

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prismaService: PrismaService,
    private cacheRepository: CacheRepository,
    private prismaQuestionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);

    await this.prismaService.question.create({
      data,
    });

    await this.prismaQuestionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prismaService.question.findUnique({
      where: {
        slug,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    // CONSULTA PARA VER SE TEM CACHE ARMAZENADO
    const cacheHit = await this.cacheRepository.get(`question:${slug}:details`);

    // SE TIVER RETORNA
    if (cacheHit) {
      const cashedData = JSON.parse(cacheHit);

      return PrismaQuestionDetailsMapper.toDomain(cashedData);
    }

    const question = await this.prismaService.question.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        attachments: true,
      },
    });

    if (!question) {
      return null;
    }

    const questionDetails = PrismaQuestionDetailsMapper.toDomain(question);

    await this.cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify(questionDetails),
    );

    return questionDetails;
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.prismaService.question.findUnique({
      where: {
        id,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findManyRecent({ page }: IPaginationParams): Promise<Question[]> {
    const questions = await this.prismaService.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      // quantos itens queremos
      take: 20,
      // quantos itens queremos pular
      skip: (page - 1) * 20,
    });

    return questions.map(PrismaQuestionMapper.toDomain);
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);

    await Promise.all([
      this.prismaService.question.update({
        where: {
          id: data.id,
        },
        data,
      }),

      this.prismaQuestionAttachmentsRepository.createMany(
        question.attachments.getNewItems(),
      ),

      this.prismaQuestionAttachmentsRepository.deleteMany(
        question.attachments.getRemovedItems(),
      ),

      // INVALIDANDO O CACHE
      this.cacheRepository.delete(`question:${data.slug}:details`),
    ]);

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question): Promise<void> {
    await this.prismaService.question.delete({
      where: {
        id: question.id.toString(),
      },
    });
  }
}
