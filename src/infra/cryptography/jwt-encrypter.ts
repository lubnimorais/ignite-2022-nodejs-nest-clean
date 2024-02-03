import { Encrypter } from '@/domain/forum/application/cryptography/encrypter';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private jwtService: JwtService) {}

  // POR ESTAR USANDO O signAsync NÃO PRECISA COLOCAR ASYNC NA FUNÇÃO
  encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
