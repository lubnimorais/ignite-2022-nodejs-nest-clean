import { Either, right } from '@/core/either';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { Injectable } from '@nestjs/common';

interface IFetchAnswerCommentsUseCaseRequest {
  answerId: string;
  page: number;
}

type IFetchAnswerCommentsUseCaseResponse = Either<
  null,
  {
    answerComments: AnswerComment[];
  }
>;

@Injectable()
class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: IFetchAnswerCommentsUseCaseRequest): Promise<IFetchAnswerCommentsUseCaseResponse> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
      });

    return right({ answerComments });
  }
}

export { FetchAnswerCommentsUseCase };
