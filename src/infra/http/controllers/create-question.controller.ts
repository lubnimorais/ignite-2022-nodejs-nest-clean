import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { z as zod } from 'zod';

import { CurrentUser } from '@/infra/auth/current-user-decorator';

import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';

import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';

import { UserPayload } from '@/infra/auth/jwt.strategy';

import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const createQuestionBodySchema = zod.object({
  title: zod.string(),
  content: zod.string(),
});

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

type CreateQuestionBodySchema = zod.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private createQuestionUseCase: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const { title, content } = body;
    const userId = userPayload.sub;

    await this.createQuestionUseCase.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
    });
  }
}
