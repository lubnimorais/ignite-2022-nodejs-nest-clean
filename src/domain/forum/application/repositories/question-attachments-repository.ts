import { QuestionAttachment } from '../../enterprise/entities/question-attachment';

interface QuestionAttachmentsRepository {
  findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>;
  deleteManyByQuestionId(questionId: string): Promise<void>;
}

export { QuestionAttachmentsRepository };
