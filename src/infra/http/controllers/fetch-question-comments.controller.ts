import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';

import { z as zod } from 'zod';

import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fecth-question-comments';
import { CommentPresenter } from '../presenters/comment-presenter';

const pageQueryParamSchema = zod
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(zod.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type QueryPageParamSchema = zod.infer<typeof pageQueryParamSchema>;

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(
    private fetchQuestionCommentsUseCase: FetchQuestionCommentsUseCase,
  ) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: QueryPageParamSchema,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchQuestionCommentsUseCase.execute({
      questionId,
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { questionComments } = result.value;

    return { comments: questionComments.map(CommentPresenter.toHTTP) };
  }
}
