import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { z as zod } from 'zod';

import { CurrentUser } from '@/auth/current-user-decorator';

import { PrismaService } from '@/prisma/prima.service';

import { JwtAuthGuard } from '@/auth/jwt-auth.guard';

import { UserPayload } from '@/auth/jwt.strategy';

import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';

const createQuestionBodySchema = zod.object({
  title: zod.string(),
  content: zod.string(),
});

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

type CreateQuestionBodySchema = zod.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prismaService: PrismaService) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const { title, content } = body;
    const userId = userPayload.sub;

    const slug = this.convertToSlug(title);

    const question = await this.prismaService.question.create({
      data: {
        title,
        content,
        slug,
        authorId: userId,
      },
    });

    return { question };
  }

  private convertToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '') // remove non-alphanumeric characters except hyphen
      .replace(/\s+/g, '-'); // replace whitespace with hyphens
  }
}
