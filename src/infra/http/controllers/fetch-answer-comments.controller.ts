import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';

import { z as zod } from 'zod';

import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fecth-answer-comments';
import { CommentPresenter } from '../presenters/comment-presenter';

const pageQueryParamSchema = zod
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(zod.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type QueryPageParamSchema = zod.infer<typeof pageQueryParamSchema>;

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerCommentsUseCase: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: QueryPageParamSchema,
    @Param('answerId') answerId: string,
  ) {
    const result = await this.fetchAnswerCommentsUseCase.execute({
      answerId,
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { answerComments } = result.value;

    return { comments: answerComments.map(CommentPresenter.toHTTP) };
  }
}
