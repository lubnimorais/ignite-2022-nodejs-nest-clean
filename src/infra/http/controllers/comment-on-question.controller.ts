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
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question';

const commentOnQuestionBodySchema = zod.object({
  content: zod.string(),
});

const bodyValidationPipe = new ZodValidationPipe(commentOnQuestionBodySchema);

type CommentOnQuestionBodySchema = zod.infer<
  typeof commentOnQuestionBodySchema
>;

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
  constructor(private commentOnQuestionUseCase: CommentOnQuestionUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CommentOnQuestionBodySchema,
    @Param('questionId') questionId: string,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const { content } = body;
    const userId = userPayload.sub;

    const result = await this.commentOnQuestionUseCase.execute({
      content,
      authorId: userId,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
