import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';

import { hash } from 'bcryptjs';

import { z as zod } from 'zod';

import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';

import { PrismaService } from 'src/prisma/prima.service';

const createAccountBodySchema = zod.object({
  name: zod.string(),
  email: zod.string().email(),
  password: zod.string(),
});

type CreateAccountRequest = zod.infer<typeof createAccountBodySchema>;

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountRequest) {
    const { name, email, password } = body;

    const userSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    const hashPassword = await hash(password, 8);

    if (userSameEmail) {
      throw new ConflictException(
        'User with same e-mail address already exists.',
      );
    }

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });
  }
}
