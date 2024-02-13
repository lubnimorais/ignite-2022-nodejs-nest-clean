import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { Env } from './env';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<Env, true>) {}

  /**
   * VAI RECEBER QUAL CHAVE QUEREMOS BUSCAR DAS VARIÁVEIS AMBIENTE
   */
  get<T extends keyof Env>(key: T) {
    return this.configService.get(key, { infer: true });
  }
}
