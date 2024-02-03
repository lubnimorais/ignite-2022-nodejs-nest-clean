import { Module } from '@nestjs/common';

import { Encrypter } from '@/domain/forum/application/cryptography/encrypter';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer';

import { JwtEncrypter } from './jwt-encrypter';
import { BcrypterHasher } from './bcrypter-hasher';

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashGenerator,
      useClass: BcrypterHasher,
    },
    {
      provide: HashComparer,
      useClass: BcrypterHasher,
    },
  ],
  // OS MÓDULOS QUE IMPORTAREM ESSE MÓDULO TERÃO ACESSO A ESSAS CLASSE
  exports: [Encrypter, HashGenerator, HashComparer],
})
export class CryptographyModule {}
