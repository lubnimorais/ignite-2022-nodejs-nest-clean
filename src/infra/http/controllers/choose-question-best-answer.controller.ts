import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';

import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

@Controller('/answers/:answerId/choose-as-best')
export class ChooseQuestionBestAnswerController {
  constructor(
    private chooseQuestionBestAnswerUseCase: ChooseQuestionBestAnswerUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('answerId') answerId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub;

    const result = await this.chooseQuestionBestAnswerUseCase.execute({
      authorId: userId,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
