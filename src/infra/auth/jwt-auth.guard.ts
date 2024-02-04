import { ExecutionContext, Injectable } from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { AuthGuard } from '@nestjs/passport';

import { IS_PUBLIC_KEY } from './public';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * TÁ BUSCANDO DO METADATA O IS_PUBLIC_KEY
   * SE ELE FOR true RETORNA QUE O USUÁRIO
   * PODE ACESSAR A ROTA.
   * SENÃO, FAZ A VERIFICAÇÃO TRADICIONAL DO
   * JWT PARA VER SE EXISTE DENTRO DOS HEADERS
   */
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
