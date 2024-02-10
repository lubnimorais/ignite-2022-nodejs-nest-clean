import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';

import { z as zod } from 'zod';

import { CurrentUser } from '@/infra/auth/current-user-decorator';

import { UserPayload } from '@/infra/auth/jwt.strategy';

import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question-use-case';

const answerQuestionBodySchema = zod.object({
  content: zod.string(),
});

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema);

type AnswerQuestionBodySchema = zod.infer<typeof answerQuestionBodySchema>;

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private answerQuestionUseCase: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
    @Param('questionId') questionId: string,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const { content } = body;
    const userId = userPayload.sub;

    const result = await this.answerQuestionUseCase.execute({
      content,
      authorId: userId,
      questionId,
      attachmentsIds: [],
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
