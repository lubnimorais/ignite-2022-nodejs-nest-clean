import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = [];

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items.push(...attachments);
  }

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() === questionId,
    );

    return questionAttachments;
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    const questionAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item));
    });

    this.items = questionAttachments;
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    );

    this.items = questionAttachments;
  }
}

export { InMemoryQuestionAttachmentsRepository };
