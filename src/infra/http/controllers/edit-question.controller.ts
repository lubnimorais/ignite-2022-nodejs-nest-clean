import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';

import { z as zod } from 'zod';

import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

const editQuestionBodySchema = zod.object({
  title: zod.string(),
  content: zod.string(),
});

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema);

type EditQuestionBodySchema = zod.infer<typeof editQuestionBodySchema>;

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private editQuestionUseCase: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditQuestionBodySchema,
    @Param('id') questionId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body;
    const userId = user.sub;

    const result = await this.editQuestionUseCase.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
