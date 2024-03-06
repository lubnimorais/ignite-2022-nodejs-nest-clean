import { Either, right } from '@/core/either';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { Injectable } from '@nestjs/common';
import { CommentWithAuthor } from '../../enterprise/entities/values-objects/comment-with-author';

interface IFetchQuestionCommentsUseCaseRequest {
  questionId: string;
  page: number;
}

type IFetchQuestionCommentsUseCaseResponse = Either<
  null,
  {
    comments: CommentWithAuthor[];
  }
>;

@Injectable()
class FetchQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
  }: IFetchQuestionCommentsUseCaseRequest): Promise<IFetchQuestionCommentsUseCaseResponse> {
    const comments =
      await this.questionCommentsRepository.findManyByQuestionIdWithAuthor(
        questionId,
        {
          page,
        },
      );

    return right({ comments });
  }
}

export { FetchQuestionCommentsUseCase };
