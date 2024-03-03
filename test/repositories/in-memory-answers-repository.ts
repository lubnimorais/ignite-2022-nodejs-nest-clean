import { Answer } from '@/domain/forum/enterprise/entities/answer';

import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { IPaginationParams } from '@/core/repositories/pagination-params';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { DomainEvents } from '@/core/events/domain-events';

class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];

  constructor(
    private answerAttachmentRepository: AnswerAttachmentsRepository,
  ) {}

  async create(answer: Answer): Promise<void> {
    this.items.push(answer);

    await this.answerAttachmentRepository.createMany(
      answer.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async findById(answerId: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === answerId);

    if (!answer) {
      return null;
    }

    return answer;
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: IPaginationParams,
  ): Promise<Answer[]> {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return answers;
  }

  async save(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id);

    this.items[itemIndex] = answer;

    await this.answerAttachmentRepository.createMany(
      answer.attachments.getNewItems(),
    );

    await this.answerAttachmentRepository.deleteMany(
      answer.attachments.getRemovedItems(),
    );

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answer: Answer): Promise<void> {
    const index = this.items.findIndex((item) => item.id === answer.id);

    this.items.splice(index, 1);

    this.answerAttachmentRepository.deleteManyByAnswerId(answer.id.toString());
  }
}

export { InMemoryAnswersRepository };
