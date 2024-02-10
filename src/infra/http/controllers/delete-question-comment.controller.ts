import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';

import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment';

@Controller('/questions/comments/:id')
export class DeleteQuestionCommentController {
  constructor(
    private deleteQuestionCommentUseCase: DeleteQuestionCommentUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('id') questionCommentId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub;

    const result = await this.deleteQuestionCommentUseCase.execute({
      questionCommentId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
