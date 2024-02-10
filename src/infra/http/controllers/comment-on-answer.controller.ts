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
import { CommentAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer';

const commentOnAnswerBodySchema = zod.object({
  content: zod.string(),
});

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema);

type CommentOnAnswerBodySchema = zod.infer<typeof commentOnAnswerBodySchema>;

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private commentOnAnswerUseCase: CommentAnswerUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CommentOnAnswerBodySchema,
    @Param('answerId') answerId: string,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const { content } = body;
    const userId = userPayload.sub;

    const result = await this.commentOnAnswerUseCase.execute({
      content,
      authorId: userId,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
