import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';

import { z as zod } from 'zod';

import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

const editAnswerBodySchema = zod.object({
  content: zod.string(),
  attachments: zod.array(zod.string().uuid()).default([]),
});

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema);

type EditAnswerBodySchema = zod.infer<typeof editAnswerBodySchema>;

@Controller('/answers/:id')
export class EditAnswerController {
  constructor(private editAnswerUseCase: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditAnswerBodySchema,
    @Param('id') answerId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { content, attachments } = body;
    const userId = user.sub;

    const result = await this.editAnswerUseCase.execute({
      authorId: userId,
      answerId,
      content,
      attachmentsIds: attachments,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
