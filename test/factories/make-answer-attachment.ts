import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import {
  AnswerAttachment,
  IAnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment';
import { PrismaService } from '@/infra/database/prisma/prima.service';
import { Injectable } from '@nestjs/common';

export function makeAnswerAttachment(
  override: Partial<IAnswerAttachmentProps> = {},
  id?: UniqueEntityId,
) {
  const answerAttachment = AnswerAttachment.create(
    {
      answerId: new UniqueEntityId(),
      attachmentId: new UniqueEntityId(),
      ...override,
    },
    id,
  );

  return answerAttachment;
}

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaQuestionAttachment(
    data: Partial<IAnswerAttachmentProps> = {},
  ): Promise<AnswerAttachment> {
    const answerAttachment = makeAnswerAttachment(data);

    await this.prismaService.attachment.update({
      where: {
        id: answerAttachment.attachmentId.toString(),
      },
      data: {
        answerId: answerAttachment.answerId.toString(),
      },
    });

    return answerAttachment;
  }
}
