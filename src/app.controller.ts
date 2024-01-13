import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prima.service';

@Controller('/users')
export class AppController {
  constructor(
    private appService: AppService,
    private prisma: PrismaService,
  ) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/hello')
  async store() {
    return await this.prisma.user.findMany();
  }
}
