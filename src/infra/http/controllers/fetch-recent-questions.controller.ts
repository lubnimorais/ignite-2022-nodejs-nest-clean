import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';

import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { z as zod } from 'zod';

const pageQueryParamSchema = zod
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(zod.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type QueryPageParamSchema = zod.infer<typeof pageQueryParamSchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionController {
  constructor(
    private fetchRecentQuestionsUseCase: FetchRecentQuestionsUseCase,
  ) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: QueryPageParamSchema) {
    const questions = await this.fetchRecentQuestionsUseCase.execute({ page });

    return { questions };
  }
}
