import { Injectable } from '@nestjs/common';

import { Either, right } from '@/core/either';

import { Question } from '../../enterprise/entities/question';

import { QuestionsRepository } from '../repositories/questions-repository';

interface IFetchRecentQuestionsUseCaseRequest {
  page: number;
}

type IFetchRecentQuestionsUseCaseResponse = Either<
  null,
  {
    questions: Question[];
  }
>;

@Injectable()
class FetchRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page,
  }: IFetchRecentQuestionsUseCaseRequest): Promise<IFetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({ page });

    return right({ questions });
  }
}

export { FetchRecentQuestionsUseCase };
