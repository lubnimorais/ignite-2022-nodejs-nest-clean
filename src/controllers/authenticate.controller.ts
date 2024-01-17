import { Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// const createAccountBodySchema = zod.object({
//   name: zod.string(),
//   email: zod.string().email(),
//   password: zod.string(),
// });

// type CreateAccountRequest = zod.infer<typeof createAccountBodySchema>;

@Controller('/sessions')
export class AuthenticateController {
  constructor(private jwtService: JwtService) {}

  @Post()
  // @HttpCode(201)
  // @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle() {
    const token = this.jwtService.sign({ sub: 'user-id' });

    return token;
  }
}
