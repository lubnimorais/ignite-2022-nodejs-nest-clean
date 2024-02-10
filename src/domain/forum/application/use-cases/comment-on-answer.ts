import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswersRepository } from '../repositories/answers-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';

interface CommentAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
}

type CommentAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment;
  }
>;

@Injectable()
class CommentAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentAnswerUseCaseRequest): Promise<CommentAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityId(authorId),
      answerId: new UniqueEntityId(answerId),
      content,
    });

    await this.answerCommentsRepository.create(answerComment);

    return right({ answerComment });
  }
}

export { CommentAnswerUseCase };
