import { Either, right } from '@/core/either';
import { Answer } from '../../enterprise/entities/answer';
import { AnswersRepository } from '../repositories/answers-repository';

interface IFetchQuestionsAnswerUseCaseRequest {
  questionId: string;
  page: number;
}

type IFetchQuestionsAnswerUseCaseResponse = Either<
  null,
  {
    answers: Answer[];
  }
>;

class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    page,
  }: IFetchQuestionsAnswerUseCaseRequest): Promise<IFetchQuestionsAnswerUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page },
    );

    return right({ answers });
  }
}

export { FetchQuestionAnswersUseCase };
