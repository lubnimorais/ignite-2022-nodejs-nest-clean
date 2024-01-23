import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';

interface AnswerAttachmentsRepository {
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>;
  deleteManyByAnswerId(answerId: string): Promise<void>;
}

export { AnswerAttachmentsRepository };
