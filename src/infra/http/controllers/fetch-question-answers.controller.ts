import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';

import { z as zod } from 'zod';

import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-questions-answers';
import { AnswerPresenter } from '../presenters/answer-presenter';

const pageQueryParamSchema = zod
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(zod.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type QueryPageParamSchema = zod.infer<typeof pageQueryParamSchema>;

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(
    private fetchQuestionAnswersUseCase: FetchQuestionAnswersUseCase,
  ) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: QueryPageParamSchema,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchQuestionAnswersUseCase.execute({
      questionId,
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { answers } = result.value;

    return { answers: answers.map(AnswerPresenter.toHTTP) };
  }
}
